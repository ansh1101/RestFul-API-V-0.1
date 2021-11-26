const express = require('express');
const { default: axios } = require('axios');
const mongoose = require('mongoose');
const app = express();
const url = require('url');
const { response, request } = require('express');
const { number, func, string } = require('joi');
const res = require('express/lib/response');
const { add } = require('nodemon/lib/rules');
const fs = require('fs');
require("dotenv").config();
app.use(express.json());
const port = process.env.PORT || 3000;
const validation = require('./validation');
const database = require('./dataBase.json')
const mongoDB = true;
const cors = require('cors');
app.use(cors());



// Database CRUD Operations Endpoint  //


// Database Setup with Mongoose //

mongoose.connect("mongodb://localhost:27017/studentdetailsDB");

const studentSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    age: Number,
    phone: Number,
    address: String
})

const Student = mongoose.model("Student", studentSchema);

// CRUD Operations with HTTP Calls and Local Database Depending upon whether Mongo is connected or Not //

//    Create     //

app.post('/DB/Create', (request, response) => {
    if (mongoDB) {
        Student.insertMany([request.body], function (err) {
            if (err) {
                response.status(400).send(err)
            } else {
                response.status(201).send({ Response: "Data was successfully created" });
            }
        });
    }
    else {
        const body = request.body
        database.push(body);
        const successMessage = { Response: 'Data was successfully created' }
        response.status(200).send(successMessage);
    }

});

// To Read Particular Data//

app.get('/DB/Read/:id', function (request, response) {
    if (mongoDB) {
        const recievedID = request.params.id
        Student.find({ _id: recievedID }, function (err, student) {
            if (err) {
                console.log(err);
            }
            else {
                response.status(200).send(student);

                console.log(student)
            }
        });
    } else {
        response.status(200).send(database);

    }

});

//      Update      //


app.put('/DB/Update/:id', (request, response) => {
    const body = request.body

    if (mongoDB) {
        Student.findByIdAndUpdate({ _id: request.params.id },
            { $set: { name: body.name, age: body.age, phone: body.phone, address: body.phone } })
            .then(result => {
                response.status(200).send({ Data: "Data Updated Successfuly" })
            }).catch(error => {
                response.status(400).send(error);
            });
    } else {
        let id = request.params.id;
        let dbObtained = database.filter((DB) => {
            return DB._id == id;
        });
        dbObtained[0].name = body.name;
        dbObtained[0].age = body.age;
        dbObtained[0].phone = body.phone;
        dbObtained[0].address = body.address;
        response.status(200).send({ Data: 'Data Updated Successfully' });
    }
});

//      Delete      //

app.delete('/DB/Delete', (request, response) => {
    if (mongoDB) {
        const id = request.query.id;

        Student.findOneAndDelete({ _id: id }, (error) => {
            const successMessage = { message: "Data Sucessfully Deleted" };
            if (!error) {
                response.status(200).send(successMessage)
            }
            else {
                response.status(400).send(error)
            }
        });
    } else {
        const id = request.query.id;
        let deleteDB = database.filter((deleteOne) => {
            return deleteOne._id == id;
        });
        database.pop(deleteDB);
        response.status(200).send({ data: 'data deleted successfully' })
    }
});


//                                                     //Currency Converter Endpoint//

// //ok Tested//

app.post('/currencyConverter', (request, res) => {
    let baseCurrency = request.body.baseCurrency
    let goingToChangeCurrency = request.body.currency;
    let amountRecieved = request.body.amount;

    axios.get(`https://api.fastforex.io/fetch-multi?from=${goingToChangeCurrency}&to=${baseCurrency}&api_key=${process.env.API_KEY}`)
        .then((response) => {

            let convertedCurrency = response.data.results;
            convertedCurrency[baseCurrency] = response.data.results[baseCurrency] * amountRecieved
            let badRequest = 'Converting currency can not be same as Base currency'

            if (goingToChangeCurrency === baseCurrency) {
                res.status(400).send({ badRequest })
            } else
                res.status(200).send(convertedCurrency);
        })

        .catch((err) => {
            console.error(err)
        })
});


//Calculator Endpoint//

// Additon and Subtraction with POST method

app.post('/calculator/add', (request, response) => {
    let number1 = request.body.number1;
    let number2 = request.body.number2;
    if (validation(number1, number2)) {
        let addition = { addition: number1 + number2 };
        response.status(200).send(addition);
        return addition
    } else {
        response.status(400).send({
            Error: "Invalid Number"
        })
    }
})

app.post('/calculator/subtract', cors(), (request, response) => {
    let number1 = request.body.number1;
    let number2 = request.body.number2;
    if (validation(number1, number2)) {
        let subtraction = { subtraction: number1 - number2 }
        response.status(200).send(subtraction);
        return subtraction;
    } else {
        response.status(400).send({
            Error: "Invalid Number"
        })
    }

});

//  Multiplication and Divison with GET method

app.get('/calculator/multiply', (request, response) => {
    const queryObject = url.parse(request.url, true).query;
    let number1 = request.query.number1;
    let number2 = request.query.number2;
    console.log(typeof number1);
    if (validation(number1, number2) === true) {
        let multplication = { multiplication: number1 * number2 };
        response.status(200).send(multplication);
        return multplication
    } else {
        response.status(400).send({
            Error: "Invalid Number"
        })
    }

});

app.get('/calculator/division', (request, response) => {
    const queryObject = url.parse(request.url, true).query;
    let number1 = queryObject.number1;
    let number2 = queryObject.number2;
    if (validation(number1, number2)) {
        let division = { Divison: number1 / number2 };
        response.status(200).send(division);
        return division;
    } else {
        response.status(400).send({
            Error: "Invalid Number"
        })
    }
});


// Listening PORT //

app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});


