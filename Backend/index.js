const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const userRoutes= require("./routes/userRoute")
const User = require("./models/user");
const Place = require("./models/place");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("./db");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "BookingApp";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());

//ROUTES//
// app.use("api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello there!");
});

//User.model Registration/Auth FUNCTIONS 
//User.model Registration/Auth FUNCTIONS 

app.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const userInfo = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.status(201).json(userInfo);
  } catch (error) {
    res.status(422).json("user not created ", error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await User.findOne({
      email,
    });
    if (userInfo) {
      const passwordOk = bcrypt.compareSync(password, userInfo.password);
      if (passwordOk) {
        jwt.sign({ 
          email: userInfo.email, id: userInfo._id, name: userInfo.name 
        },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userInfo);
          }
        );
      } else {
        res.status(422).json("password is not ok");
      }
    } else {
      res.status(500).json("user not found");
    }
  } catch (error) {
    res.status(422).json("user not created ", error.message);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = User.findById(userData.id);
      res.json({ _id, name, email });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//PLACE.model Adding and display FUNCTIONS 
//PLACE.model Adding and display FUNCTIONS 


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
