const express = require("express");
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./db/connect_db');
const notFound=require("./middlewares/not_found")
const errorHandler=require("./middlewares/error_handler")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);


app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();