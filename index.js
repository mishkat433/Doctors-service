require("dotenv").config();
const express= require("express");
const app = express()
const PORT = process.env.PORT || 3300;
const { MongoClient } = require('mongodb');
const bodyparser = require("body-parser");
const cors = require("cors")


app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.twfgu.mongodb.net/doctors-portal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointment");

    app.get('/', (req,res)=>{
        res.send("hello, i am running")
    })

    app.post('/appointment',(req,res)=>{
        const appoint =req.body
        appointmentCollection.insertOne(appoint)
        .then(result=>{
            res.send(result.insertedId)
        })
    })

    app.get("/appointmentInfo",(req,res)=>{
        appointmentCollection.find({email: req.query.email})
        .toArray((err,document)=>{
            res.send(document)
        })
    })


    console.log("load complite")
});


app.listen(PORT,(req,res)=>{
    console.log(`server is running at http://localhost:${PORT}`)
})