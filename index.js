const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload')
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('images'));
app.use(fileUpload());

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
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImage = file.data;
        const encImg = newImage.toString('base64')
        var icon = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        serviceCollection.insertOne({ title, description, icon })
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })

    app.get("/services", (req, res) => {
        serviceCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })




    const orderCollection = client.db("CreativeAgency").collection("orders");
    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const user = req.body.user;
        const email = req.body.email;
        const details = req.body.details;
        const price = req.body.price;
        const service = req.body.service;
        const newImage = file.data;
        const encImg = newImage.toString('base64')
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        orderCollection.insertOne({ user, email, details, price, service, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/userMail', (req, res) => {
        const email = req.body.email;
        console.log(email)
        orderCollection.find({ email : email })
            .toArray((err, orders) => {
                res.send(orders.length> 0);
            })
    })
    // app.get("/orderListByEmail", (req, res) => {
    //     orderCollection.find({})
    //         .toArray((error, documents) => {
    //             res.send(documents)
    //         })
    // })

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

app.listen(process.env.PORT || port)