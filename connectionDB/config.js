const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://backendDev:XHIkpJdItmABREbS@cluster0.lqloyzj.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const db1 = client.db("EV_LocalStorage");
//   console.log("Connected to database: EV_LocalStorage");
// });


const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://backendDev:XHIkpJdItmABREbS@cluster0.lqloyzj.mongodb.net/EV_LocalStorage?retryWrites=true&w=majority')
        console.log(`Mongo connection established: ${conn.connection.host}`);
    } catch (error) {
        console.log('Error connecting to Mongo', error);
        process.exit(1);
    }
}

module.exports = connectDB;