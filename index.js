const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const helmet = require('helmet');
const morgan = require('morgan');

const session = require('express-session');

const app = express();

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true } 
    ,() => {
    console.log('Connected to database...')
});

app.use(session({
    secret: process.env.WORD,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 15 * 60 * 1000
    }
}));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/posts', postRoute);

app.listen(8800, () => {
    console.log('Server is running...')
});