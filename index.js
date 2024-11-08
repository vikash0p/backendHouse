import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from "morgan"
import bodyParser from "body-parser"
import connectDB from "./utils/dbConnection.js"
import HouseRouter from "./mvc/routes/houseRouter.js"
import cookieParser from "cookie-parser"
import userRouter from "./mvc/routes/userRouter.js"
dotenv.config();
const app = express()
const port = 3000

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  };

connectDB();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/house', HouseRouter);
app.use('/auth', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})
/*   */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})