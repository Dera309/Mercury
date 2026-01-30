const mongoose = require('mongoose');

// URI from apps/api/.env
const uri = 'mongodb+srv://chideraobia7_db_user:gjjyBoiVWb5Nrdgh@cluster0.crdsaxw.mongodb.net/mercury-investment?appName=Cluster0';

console.log('Testing MongoDB connection...');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    });
