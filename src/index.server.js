const express = require("express");
const env = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

//Environment Variable
env.config();

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const initialDataRoutes = require("./routes/admin/initialData");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

//using express application
const app = express();

//DB Connection
//Cloud DB connection string  ==> mongodb+srv://sukhendra523:<password>@cluster0.eaa66.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// Local Db connection string ==> mongoose.connect('mongodb://username:password@host:port/database?options...', {useNewUrlParser: true});
//Local DB connection string >> mongodb://localhost:27017/${process.env.MONGO_DB_DATABASE}
//Cloud DB connection string >> mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.eaa66.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.eaa66.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("ERROR :", error);
  });

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

//Routes
app.use("/api", authRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

app.get("/data", (req, res, next) => {
  const cart = [
    {
      _id: "60b0e86b16aac121d021c3df",
      user: "60b0e61d94cb1411e08cb3bd",
      cartItems: [{ h: 33, g: 55 }],
      __v: 0,
    },
  ];
  console.log(cart);
  console.log(cart[0].cartItems);
  res.status(200).json({
    message: cart.cartItems,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`SERVER is running at PORT = ${process.env.PORT}`);
});
