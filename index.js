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
    seller_name: {
        type: String,
        require: true
    },
    seller_img: {
        type: String,
        require: true
    },
    seller_email: {
        type: String,
        require: true
    },
    seller_rating: {
        type: Number,
        require: true
    },
    toy_name: {
        type: String,
        require: true
    },
    toy_img: {
        type: String,
        require: true
    },
    toy_price: {
        type: Number,
        require: true
    },
    available_quantity: {
        type: Number,
        require: true
    },
    toy_rating: {
        type: Number,
        require: true
    },
    toy_description: {
        type: String,
        require: true
    },
    date: { type: Date, default: Date.now },


});

// user model
const userModel = mongoose.model('users', userSchema);


// data set

app.post('/postData', async (req, res) => {
    const userDetles = req.body;
    try {
        const newUser = new userModel({
            seller_name: userDetles.seller_name,
            seller_img: userDetles.seller_img,
            seller_email: userDetles.seller_email,
            seller_rating: userDetles.seller_rating,
            toy_name: userDetles.toy_name,
            toy_img: userDetles.toy_img,
            toy_price: userDetles.toy_price,
            available_quantity: userDetles.available_quantity,
            toy_rating: userDetles.toy_rating,
            toy_description: userDetles.toy_description,
        })
        const save = await newUser.save();
        if (save) {
            res.status(200).send("User upded successfuly")
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
});

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
        await userModel.findByIdAndDelete({ _id: id })
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
        await userModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                seller_name: updetDeta.seller_name,
                seller_img: updetDeta.seller_img,
                seller_email: updetDeta.seller_email,
                seller_rating: updetDeta.seller_rating,
                toy_name: updetDeta.toy_name,
                toy_img: updetDeta.toy_img,
                toy_price: updetDeta.toy_price,
                available_quantity: updetDeta.available_quantity,
                toy_rating: updetDeta.toy_rating,
                toy_description: updetDeta.toy_description,
            }
        });
    } catch (error) {
        res.status(502).send(error.message);
    }
})








app.listen(PORT, async () => {
    await dbcunnect();
    console.log(`https://localhost run ${PORT}`)
})