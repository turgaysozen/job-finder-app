import React from 'react';
import './App.css';
import Jobs from "../src/Components/Jobs";

// production
// let JOB_API_URL;
// if (process.env.NODE_ENV === 'production') {
//    JOB_API_URL = '/jobs';
// }
// else {
//   JOB_API_URL = 'http://localhost:3001/jobs';
// }

// let jsonData = [
//   {
//       id: 1,
//       type: "null",
//       url: "null",
//       created_at: "Sat Feb 01 12:53:36 UTC 2020",
//       company: "no title",
//       company_url: '',
//       location: "null",
//       title: "no hebele hubele",
//       description: "",
//       how_to_apply: '',
//       company_logo: '',
//       lastAdded: "Sat Feb 01 12:53:36 UTC 2020",
//       categories: "",
//       pubDate: "Sat Feb 01 12:53:36 UTC 2020",
//   }, {
//       id: 2,
//       type: "null",
//       url: "null",
//       created_at: "Sat Feb 01 12:53:36 UTC 2020",
//       company: "no title",
//       company_url: '',
//       location: "null",
//       title: "no title",
//       description: "",
//       how_to_apply: '',
//       company_logo: '',
//       lastAdded: "Sat Feb 01 12:53:36 UTC 2020",
//       categories: "",
//       pubDate: "Sat Feb 01 12:53:36 UTC 2020",
//   }
// ]

let JOB_API_URL = '/jobs';

// dev
// const JOB_API_URL = 'http://localhost:3001/jobs';
// fetch jobs by our api
async function JobFetch(updateCb) {
  const res = await fetch(JOB_API_URL)
  // .then(res => res.text())
  // .then(text => {console.log(text), updateCb(text)});
  const json = await res.json();
  console.log(json)
  updateCb(json);
}

function App() {
  const [jobList, updateJobs] = React.useState([]);

  // submit user email address and check email validation
  // const onSubmit = () => {

  //   if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {

  //     label = "Error";
  //     helperText = "Invalid Email Address";
  //     console.log(helperText)
  //   }
  //   else if (email === '') {

  //     label = "Error";
  //     helperText = "Invalid Email Address";
  //     setOpen(true)
  //   }
  //   else {
  //     setOpen(false)
  //     console.log(email)
  //     label = "";
  //     helperText = "";
  //   }
  // }

  React.useEffect(() => {
    JobFetch(updateJobs);
    //it shows subscribe form to user 1 minute later and clear itself
    // const inter = setInterval(() => {
    //   setOpen(true);
    //   clearInterval(inter);
    // }, 1000 );
  }, []);

  return (
    <div className='App'>
      <Jobs jobs={jobList} />
    </div>
  )
}

export default App;