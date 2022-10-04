// Dependencies
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Application middleware
app.use([express.json(), cors()]);

// All routes
app.use("/user", userRouter);

// Create server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
