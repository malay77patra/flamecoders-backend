require("dotenv").config();
require('module-alias/register');
const express = require("express");
const { urlencoded } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("@/db/connect");
const setupAdmin = require("@/scripts/setup");
const routes = require("@/routes");
const path = require("path");
const { globalErrorHandler } = require("@/middlewares/error.middleware");

// Definations
const isProduction = process.argv.includes('--env=production');
const app = express();
const PORT = process.env.PORT || 8000;

// Settings
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
global.__root = process.cwd();

// Using middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);


// Ping route
app.get('/', async (req, res) => {
    res.send("Server Online!");
});

// Global error handler
app.use(globalErrorHandler);

// Connect to MongoDB, then start the server
connectDB()
    .then(() => setupAdmin())
    .then(() => {
        app.listen(PORT, () => {
            if (isProduction) {
                console.log(`Server listening on port ${PORT}`);
            } else {
                console.log(`Server listening on port ${PORT}\n➜  Visit : http://localhost:${PORT}`);
            }
        });
    })
    .catch((error) => {
        console.log(error);
        console.log("❌ Error starting the server");
        process.exit(1);
    });