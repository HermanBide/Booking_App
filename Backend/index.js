const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const userRoutes= require("./routes/userRoute")
const User = require("./models/user");
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
        jwt.sign(
          { email: userInfo.email, id: userInfo._id, name: userInfo.name },
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
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      const { id, name, email } = User.findById(userData.id);
      res.json({ id, name, email });
    });
  } else {
    res.json(null);
  }
  // res.json(userInfo);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
