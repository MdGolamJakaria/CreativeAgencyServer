const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors())

const USER_NAME = process.env.DB_USER;
const USER_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.sfno3.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const adminsCollection = client.db("CreativeAgency").collection("admins");
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })

    const serviceCollection = client.db("CreativeAgency").collection("services");
    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })
    const orderCollection = client.db("CreativeAgency").collection("orders");
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })

    const reviewCollection = client.db("CreativeAgency").collection("review");
    app.post('/addReview', (req, res) => {
        const order = req.body;
        reviewCollection.insertOne(order)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })







    console.log('Connected')
    // perform actions on the collection object
    // client.close();
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})