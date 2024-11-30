import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './utils/dbConnection.js';
import HouseRouter from './mvc/routes/houseRouter.js';
import userRouter from './mvc/routes/userRouter.js';
import productRouter from "./mvc/routes/productRouter.js";
import reviewRouter from "./mvc/routes/reviewRouter.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
productRouter
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://luxe-furniture-ecommerce.vercel.app', 'https://luxe-furniture-ecommerce.vercel.app/*', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'], // Allow necessary headers


};
app.use(cors(corsOptions));


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/house', HouseRouter);
app.use('/auth', userRouter);
app.use('/furniture', productRouter)
app.use('/reviews', reviewRouter)

app.get('/', (req, res) => {
    res.render('index');
});
console.log(app.get('views'));


// Error handling for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
