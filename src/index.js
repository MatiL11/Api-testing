const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const handlebars = require("express-handlebars");

const app = express();

const mongoConnect = require("../db");
const router = require("./routers");
const initializePassport = require("./config/passport.config");

const { dbAdmin, dbPassword, dbName, dbHost } = require("./config/db.config");
const { port } = require("./config/app.config");
const { secret } = require("./config/session.config");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoConnect();
router(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
