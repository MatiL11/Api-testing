const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const handlebars = require("express-handlebars");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

const mongoConnect = require("../db");
const router = require("./routers");
const initializePassport = require("./config/passport.config");
const logger = require("./config/logs/logger.config");

const { dbAdmin, dbPassword, dbName, dbHost } = require("./config/db.config");
const { port } = require("./config/app.config");
const { secret } = require("./config/session.config");

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion to project Ecommerce",
      description: "Endpoints to Manager Products and carts.",
    },
  },
  apis: [`${__dirname.replace(/\\/g, "/")}/docs/**/*.yaml`],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs)
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

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
