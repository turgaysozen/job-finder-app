
const express = require('express')
const app = express();
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
    });
}
else {
    require('dotenv').config({ path: '.env' });
}

const Job = require('../model/job');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

let totalJobsCount;

app.get('/jobs', async (req, res) => {
    
    let jsonData = await Job.find();
    totalJobsCount = JSON.parse(jsonData[0].allJobs).length;
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(jsonData[0].filteredJobs);
});

app.get('/jobs/page=:id', async (req, res) => {

    let jsonData = await Job.find();
    let page = req.params.id;
    let fiftieth = JSON.parse(jsonData[0].allJobs).slice((page - 1) * 50, page * 50);
    res.set("Content-Type", 'application/json');
    res.send(fiftieth);
});

app.get('/jobs/apicall', async (req, res) => {
    let onPage = "${onPage}";
    res.send(`
    <h1>Api Call Explanation</h1><p>Total Jobs: ${totalJobsCount}, page count: ${Math.ceil(totalJobsCount / 50)} You can fetch jobs by: <b>https://evening-river-70046.herokuapp.com/jobs/page=1<br/><br/>Example: </b></p>
    <xmp>   let allJobs = [], onPage = 0;
    //fetch all pages from github
    while (onPage <= ${Math.ceil(totalJobsCount / 50)}) {
        try {
            const res = await fetch('https://evening-river-70046.herokuapp.com/jobs/page=${onPage}');
            const jobs = await res.json();
            allJobs.push(...jobs);
            onPage++;
        } catch {
            onPage = 0;
            allJobs = [];
        }
    }
</xmp>
    `);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

