const mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
    filteredJobs: {
        type: String,
        required: true
    },
    allJobs: {
        type: String,
        required: true
    }
    // title: {
    //     type:String
    // }
});

module.exports = mongoose.model('Job', jobSchema);