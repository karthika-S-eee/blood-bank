const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
// const connectDB = require("../config/db");
const connectDB = require("../backend/config/db");
//dot config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use(cors());


//routes
// 1 test route
app.use("/api/v1/test", require("../backend/routes/testRoutes"));
app.use("/api/v1/auth", require("../backend/routes/authRoutes"));
app.use("/api/v1/inventory", require("../backend/routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("../backend/routes/analyticsRoutes"));
app.use("/api/v1/admin", require("../backend/routes/adminRoutes"));

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} ModeOn Port ${process.env.PORT}`
      .bgBlue.white
  );
});
