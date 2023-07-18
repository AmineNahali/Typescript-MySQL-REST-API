import express from "express";
import UserRouter from "./src/routes/UserRoutes";
import * as dotenv from "dotenv";
import captchaRouter from "./src/routes/captcha";
dotenv.config();
var cors = require('cors');

//Setup Express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Routers
app.use("/api/user", UserRouter);
app.use("/captcha", captchaRouter);

//Run server
app.listen(port, () => {
  return console.log(`listening at http://localhost:${port}`);
});