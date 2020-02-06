import React from 'react';
import { Typography } from "@material-ui/core";
import Job from "./Job";
import JobModel from "./JobModel";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles({
    root: {
        maxWidth: 600,
        flexGrow: 1,
    },
});

export default function Jobs({ jobs }) {

    // job Model
    const [selectedJob, selectJob] = React.useState({});

    // material ui pagination
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [remote, setRemote] = React.useState(false);

    // lift top
    function scrollToTop(scrollDuration) {
        var scrollStep = -window.scrollY / (scrollDuration / 15),
            scrollInterval = setInterval(function () {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                }
                else clearInterval(scrollInterval);
            }, 15);
    }

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        scrollToTop(300);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        scrollToTop(300);
    };

    jobs.map(job => {
        const d = new Date();
        const Date1 = new Date(d.toString()).getTime();
        const Date2 = new Date(job.lastAdded).getTime();
        const diffDays = Math.floor((Date1 - Date2) / (1000 * 60 * 60 * 24));
        return job.diffDays = diffDays;
    });

    // sort jobs by diffdays
    jobs.sort((a, b) => a.diffDays - b.diffDays);

    // filter jobs which are older than 100 days
    let lastUpdated = '';
    jobs = jobs.filter((job, x) => {

        // calculate last update time
        if (x === 0) {
            const d = new Date();
            const dateNow = d.toISOString();
            const diffHours = Math.floor(Math.abs(new Date(dateNow).getTime() + 1000 * 60 * 60 * 3 - new Date(job.lastAdded).getTime()) / (1000 * 60 * 60));
            lastUpdated = diffHours === 0 ? 1 : diffHours > 24 ? diffHours - 24 : diffHours;
        }

        if (job.diffDays < 101) {
            return true;
        }
        else return false;
    });

    // get how to apply link
    let howToApplyStr = null;
    if (selectedJob.how_to_apply !== undefined) {
        if (selectedJob.how_to_apply === '') {
            howToApplyStr = selectedJob.url;
        }
        else howToApplyStr = selectedJob.how_to_apply.split('"')[1];
    }

    // filter option
    jobs = jobs.filter(job => {
        const desc = job.description.toLowerCase();
        const title = job.title.toLowerCase();
        if (desc.includes(search.toLocaleLowerCase()) || title.includes(search.toLocaleLowerCase())) {
            return true;
        }
        else return false;
    })

    if (remote) {
        jobs = jobs.filter(job => {

            const title = job.title.toLowerCase();
            const location = job.location !== undefined ? job.location.toLowerCase() : '';
            if (title.includes('remote') || location.includes('remote')) {
                return true;
            }
            else return false;
        })
    }
    console.log(jobs)
    // pagination structure
    let jobsPerPage = 25;
    let jobOnPage = jobs.slice(activeStep * jobsPerPage, (activeStep + 1) * jobsPerPage);

    return (
        <div className="jobs">

            {/* show job detail to user as popup */}
            <JobModel open={open} job={selectedJob} handleClose={handleClose} howToApplyStr={howToApplyStr} />
            <Typography className="JobsTitle" variant='h2'>
                <a className="JobsTitle" href='/'>Jobs</a>
            </Typography>
            <br></br>

            <Typography style={{ fontSize: '28px', marginTop: '20px', marginBottom: '10px' }}>
                Options
            </Typography>
            <Typography className="jobfilter">

                <label><input onClick={() => setRemote(!remote)} type="checkbox" /> Remote</label>
                <input onInput={e => setSearch(e.target.value)} placeholder="search job" />
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={e => setSearch(e)}>
                    Search
              </Button> */}
            </Typography>
            <div className="updateInfo">
                <b>
                    Last Updated: {lastUpdated === 1 ? lastUpdated + ' Hour Ago' : lastUpdated + ' Hours Ago'}

                </b>
            </div>
            <hr />

            <div className="jobCount">
                {jobs.length !== 0 ? 'Total ' + jobs.length + ' Jobs Listed' : null}
            </div>
            {
                jobOnPage.map((job, counter, diffDays) => <Job handleClick={() => { handleClickOpen(); selectJob(job) }} key={counter + (activeStep) * jobsPerPage} job={job} counter={counter + (activeStep) * jobsPerPage} diffDays={diffDays} />)
            }

            {/* pagination */}
            <div>
                Page {activeStep + 1} of {Math.ceil(jobs.length / jobsPerPage)}
            </div>
            <MobileStepper
                variant="progress"
                steps={Math.ceil(jobs.length / jobsPerPage)}
                position="static"
                activeStep={activeStep}
                className={classes.root}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === Math.ceil(jobs.length / jobsPerPage) - 1}>
                        Next
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
        </Button>
                }
            />
        </div>
    )
}
