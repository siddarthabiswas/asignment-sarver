require('dotenv').config()
const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT
const UID = process.env.UID
const PASS = process.env.PASS


// Start
const mongoose = require('mongoose');

// Db cunnect
const dbcunnect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${UID}:${PASS}@cluster0.orvq7xp.mongodb.net/asignment?retryWrites=true&w=majority`);
        console.log('Db is connect')
    } catch (error) {
        console.log(error.message)
    }
}
// user Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    date: { type: Date, default: Date.now },


});

// user model
const userModel = mongoose.model('users', userSchema);


// data set

app.post('/postData', async (req, res) => {
    const userDetles = req.body
    console.log(userDetles)
    try {
        const newUser = new userModel({
            name: userDetles.name,
            email: userDetles.email,
        })
        const save = await newUser.save();
        if (save) {
            res.status(200).send("User upded successfuly")
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
})







// Data gate
app.get('/', async (req, res) => {
    try {
        const allUser = await userModel.find({});
        if (allUser) {
            res.status(200).send(allUser)
        } else {
            res.status(404).send("Data not found")
        }
    } catch (error) {
        res.status(502).send(error.message)
    }
})

// delet

app.delete('/delet/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const delet = await userModel.findByIdAndDelete({ _id: id })
        console.log(delet)
        res.send(delet);
    } catch (error) {
        res.status(502).send(error.message)
    }
})

// find by id
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const findsingleuser = await userModel.findOne({ _id: id })
        if (findsingleuser) {
            res.status(200).send(findsingleuser)
        } else {
            res.status(404).send("Single product not found")
        }
    } catch (error) {
        res.status(502).send(error.message);
    }
})



// upded
app.patch('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updetDeta = req.body;
        const upded = await userModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: updetDeta.name,
                email: updetDeta.email,
            }
        })
        console.log(upded)
        res.send(upded)
    } catch (error) {
        res.status(502).send(error.message);
    }
})








app.listen(PORT, async () => {
    await dbcunnect();
    console.log(`https://localhost run ${PORT}`)
})