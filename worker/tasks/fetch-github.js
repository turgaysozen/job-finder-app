var fetch = require('node-fetch');
// var redis = require("redis"),
//     client = redis.createClient();

// const { promisify } = require('util');
// const setAsync = promisify(client.set).bind(client);
const Job = require('../../model/job');

const baseUrl = 'https://jobs.github.com/positions.json';

let jrJobs, callback;

async function fetchGithub() {
    let allJobs = [], onPage = 0;

    //fetch all pages from github
    while (onPage < 3) {
        try {
            const res = await fetch(`${baseUrl}?page=${onPage}`);
            const jobs = await res.json();
            allJobs.push(...jobs);
            onPage++;            
            } catch {
                onPage = 0;
                allJobs = [];
            }
        }

    let addedTime = new Date();
        addedTime.setHours(addedTime.getHours() + 3);
        // filter only english mid level and junior jobs
        jrJobs = allJobs.filter(async job => {
            let jobTitle = job.title.toLowerCase();
            let jobDesc = job.description.toLowerCase();
            // filter by german and dutch
            if (
                jobDesc.includes('jaar') || jobDesc.includes('ontwikkelingen')
                || jobDesc.includes('ervaring') || jobDesc.includes('alle') || jobDesc.includes('systemen')
                || jobDesc.includes(' du ') || jobDesc.includes('automatisierte') || jobDesc.includes(' die ')
                || jobDesc.includes(' von ') || jobDesc.includes('testgetriebener') || jobDesc.includes(' der ')
            ) {
                return false;
            }

            else {
                job.lastAdded = addedTime;
                return true;
            }

        });

        callback(jrJobs, allJobs);
    }
    fetchGithub();
    module.exports = {
        fetchGithub: fetchGithub,
        githubJobs: function (cb) {
            if (typeof jrJobs !== 'undefined') {
                cb(jrJobs, allJobs);
            } else {
                callback = cb;
            }
        },
    }