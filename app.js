const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/traveldemo').then(()=>{
    console.log("connection is successfull");
}).catch((e)=>{
    console.log("no connection =====================>", e.toString());
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);

module.exports = app;