require("dotenv").config();
require('module-alias/register');
const express = require("express");
const { urlencoded } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("@db/connect");
const setupSuperAdmin = require("@admin/setup");
const routes = require("@routes");

// Definations
const isProduction = process.argv.includes('--env=production');
const app = express();
const PORT = process.env.PORT || 8000;


// Using middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
    console.error("[error-handler]:", {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
    });
    res.status(500).json({ 
        message: 'Something went wrong.',
        details: "Internal server error has been occured."
     });
});


// Test route
app.get('/', (req, res) => {
    res.send("Server Online!");
});



// Connecting to MongoDB, then start the server
connectDB()
    .then(() => setupSuperAdmin())
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