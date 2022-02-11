const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const app = express();

//routes
const messageRouter = require("./routes/messageRoute");
const errorController = require("./controllers/errorControllers");
const AppError = require("./utils/AppError");

// //<-- serving static files
// app.use(express.static(`${__dirname}/public`));
//cors
const corsOptions ={
    origin:'*', 
    credentials:true,          
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) 
//<-- parsing data to the backend
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// data sanitization against noSql query injection
app.use(mongoSanitize());
//<-- data sanitisation against xss attacks
app.use(xss());

app.use(compression());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
//<-- limit request from the same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour"
});
app.use("/api", limiter);

//ping if api is working
app.get("/", (req, res) => {
    res.send("hello world");
});
//cors again
const allowedOrigins = ["http://localhost:3000", "https://zubypure.vercel.app"];
app.use(function (req, res, next) {
    let origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }

    res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use("/api/v1/me", messageRouter);
//ROUTE HANDLER NOT SPECIFIED 
app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController);
module.exports = app;