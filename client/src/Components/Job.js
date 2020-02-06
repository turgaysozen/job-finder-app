import React from 'react';
import { Paper, Typography } from "@material-ui/core";

export default function Job({ job, counter, handleClick }) {
    return (
        <div>
            <Typography className="counter" variant="h6">{counter + 1}</Typography>
            {
                job.url.includes('github') === true ?

                    <Typography style={{ fontSize: '11px', marginTop: '10px', color:'blue', fontWeight:'bold' }}>Source: Github</Typography> : (job.url.includes('stackoverflow') === true ? <Typography style={{ fontSize: '11px', marginTop: '10px', color:'blue', fontWeight:'bold' }}>Source: Stackoverflow</Typography> : '')}

            <Paper onClick={handleClick} style={{ backgroundColor: '#f1f1f1' }} className="job">
                <div>
                    <Typography variant="h5">{job.title}</Typography>
                    <Typography variant="h6">{job.company}</Typography>
                    <Typography>{job.location}</Typography>
                    <Typography style={{fontSize:'12px'}} className="tags">{job.categories}</Typography>

                </div>
                <div>
                    <img alt='' style={{ height: '60x', width: '60px' }} src={job.company_logo}></img>

                    <Typography style={{ fontSize: '12px' }} className="postedDay">
                        {job.diffDays < 1 ? 'Today Posted' : job.diffDays === 1 ? 'Yesterday Posted' : job.diffDays + ' Day Ago Posted'}
                    </Typography>
                </div>
            </Paper >
        </div>
    )
}
