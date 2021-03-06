import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ExpressError from './utils/ExpressError.js'

const app = express();

import pollRoutes from './routes/polls.js';
import userRoutes from './routes/users.js';

// Connecting to Database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/polls-app';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database Connected!!");
})

// Middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));

// Required to parse form recieved from axios
app.use(express.json());

// Defining Routes
app.use('/polls', pollRoutes);
app.use('/user', userRoutes);

app.get('/', (req,res) => {
    res.send('Home route');
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page not Found!!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).send(err.stack);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
