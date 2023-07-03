import express from "express";
import UserRouter from "./src/routes/UserRoutes";
import * as dotenv from "dotenv";
dotenv.config();

//Setup Express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/user",UserRouter);

app.listen(port, () => {
  return console.log(`listening at http://localhost:${port}`);
});

//module.exports = con;