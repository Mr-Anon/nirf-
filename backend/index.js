const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();//app
const app = express();// db
const router = require("./routes/api.js")



mongoose
  .connect(process.env.DATABASE, {
  })
  .then(() => console.log('DB Connected'))
  .catch((error) => console.log(error + 'Error in DB'));
//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
});