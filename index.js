const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
dbConnection();

const employeeRoute = require("./routes/employeeRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

const cors = require("cors");
app.use(cors());
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
