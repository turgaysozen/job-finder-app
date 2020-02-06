if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' });
}
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

const Job = require('../../model/job');

const Parser = require('rss-parser');
let parser = new Parser();

const FEED_LIST = [
    'https://stackoverflow.com/jobs/feed',
    'https://stackoverflow.com/jobs/feed?location=remote',
];

let allJobs = [];
let fullList = [];
async function fetchStackoverflow() {

    const result = FEED_LIST.map(async f => {
        while (allJobs.length === 0) {
            let feed = await parser.parseURL(f);
            fullList.push(...feed.items);
            // Array.prototype.push.apply(allJobs, jrJobs);

            // console.log(fullList.length)
            feed.items.forEach(item => {
                let newItem = {};
                let location = '';
                if (!item.title.includes('remote')) {
                    location = item.title.split(' at ')[1].split('(')[1];
                    if (location !== undefined) {
                        location = location.slice(0, -1);
                    }
                }
                else {
                    location = 'Remote';
                }

                // filter jobs by these keywords: japan, india and not english words
                const title = item.title.toLowerCase();
                const jobDesc = item.contentSnippet.toLowerCase();

                if (
                    title.includes('japan') || title.includes('india')
                    || jobDesc.includes('jaar') || jobDesc.includes('ontwikkelingen')
                    || jobDesc.includes('ervaring') || jobDesc.includes('alle') || jobDesc.includes('systemen')
                    || jobDesc.includes(' du ') || jobDesc.includes('automatisierte') || jobDesc.includes(' die ')
                    || jobDesc.includes(' von ') || jobDesc.includes('testgetriebener') || jobDesc.includes(' der ')
                    || jobDesc.includes('analista') || jobDesc.includes('programador') || jobDesc.includes(' uno ')
                    || jobDesc.includes('importante') || jobDesc.includes('experiencia') || jobDesc.includes('programación')
                    || jobDesc.includes('técnico') || jobDesc.includes('contratar') || jobDesc.includes('salarial')
                    || jobDesc.includes('para') || jobDesc.includes('plataforma') || jobDesc.includes('nuevas')
                    || jobDesc.includes('estable') || jobDesc.includes('larga') || jobDesc.includes('cliente')
                    || jobDesc.includes('desarrollador') || jobDesc.includes('incorporar') || jobDesc.includes('posteriores') || jobDesc.includes('profesionales')
                ) {
                    return false;
                }
                else {

                    const cat = item.categories;
                    let tags = '';
                    const newDesc = item.content;

                    // remove br tags from the description
                    const replacedDesc = newDesc.replace(/^(<br\s*\/?>)*|(<br\s*\/?>)*$/i, "");

                    if (item.categories !== undefined) {
                        cat.forEach(tag => {
                            tags += tag + ', ';
                        });
                    }

                    newItem = {
                        id: item.guid,
                        type: location === 'Remote' ? 'Remote' : "Full Time",
                        url: item.link,
                        created_at: item.pubDate,
                        company: item.title.split(' at ')[1].split('(')[0].replace(')', ''),
                        company_url: '',
                        location: location,
                        title: item.title.split(' at ')[0],
                        description: replacedDesc,
                        how_to_apply: '',
                        company_logo: '',
                        lastAdded: item.isoDate,
                        categories: tags.slice(0, -2),
                        pubDate: item.pubDate
                    }
                    allJobs.push(newItem)
                }
            });
        }

        var jrJobsImported = require("./fetch-github.js").githubJobs;

        jrJobsImported(async (filteredGithubJobs, allGithubJobs) => {

            // add tag
            filteredGithubJobs.map(job => {
                let tags = '';
                const desc = job.description.toLowerCase();
                if (desc.includes('react')) {
                    tags += 'react';
                }
                if (desc.includes('node')) {
                    tags += ', ' + 'node';
                }
                if (desc.includes('javascript')) {
                    tags += ', ' + 'javascript';
                }
                if (desc.includes(' java ') || desc.includes('java ')) {
                    tags += ', ' + 'java';
                }
                if (desc.includes('python')) {
                    tags += ', ' + 'python';
                }
                if (desc.includes('postgresql')) {
                    tags += ', ' + 'postgresql';
                }
                if (desc.includes('mysql')) {
                    tags += ', ' + 'mysql';
                }
                if (desc.includes('nosql')) {
                    tags += ', ' + 'nosql';
                }
                if (desc.includes('redis')) {
                    tags += ', ' + 'redis';
                }
                if (desc.includes('mongodb')) {
                    tags += ', ' + 'mongodb';
                }
                if (desc.includes('c#')) {
                    tags += ', ' + 'c#';
                }
                if (desc.includes('c++')) {
                    tags += ', ' + 'c++';
                }
                if (desc.includes('android')) {
                    tags += ', ' + 'android';
                }
                if (desc.includes('ios')) {
                    tags += ', ' + 'ios';
                }
                if (desc.includes('ruby')) {
                    tags += ', ' + 'ruby';
                }
                if (desc.includes('aws')) {
                    tags += ', ' + 'aws';
                }
                if (desc.includes('ui')) {
                    tags += ', ' + 'ui';
                }
                if (desc.includes('ux')) {
                    tags += ', ' + 'ux';
                }
                if (desc.includes('api')) {
                    tags += ', ' + 'api';
                }
                if (desc.includes('php')) {
                    tags += ', ' + 'php';
                }
                if (desc.includes('devops')) {
                    tags += ', ' + 'devops';
                }
                if (desc.includes('machine learning')) {
                    tags += ', ' + 'machine learning';
                }

                // remove comma from beginning of the tag
                if (tags.charAt(0) === ',') {
                    tags = tags.substr(1);
                }

                job.categories = tags;
            });

            console.log('Imported Jobs Count :' + filteredGithubJobs.length)
            console.log('Scraped Jobs Count : ' + allJobs.length);

            // combine stackoverflow jobs and github jobs
            Array.prototype.push.apply(allJobs, filteredGithubJobs);
            console.log('Merged Jobs Count: ' + allJobs.length);

            // remove dublicated items
           let unique = [...new Map(allJobs.map(item =>
                [item["id"], item])).values()];
            console.log('*** Merged All Filtered Unique: ' + unique.length)

            Array.prototype.push.apply(fullList, allGithubJobs);
            console.log('*** Merged All Jobs: ' + fullList.length);

            // remove old data
            await Job.remove();
            // insert new data
            const job = new Job({
                filteredJobs: JSON.stringify(unique),
                allJobs: JSON.stringify(fullList),
            });
            await job.save();
        });
    });
}

fetchStackoverflow();
module.exports = {
    fetchStackoverflow: fetchStackoverflow,
};