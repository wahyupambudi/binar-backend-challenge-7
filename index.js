require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./routes/route");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.get("/", (req, res) => {
  res.send("This My Service REST API CHALLENGE 7!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
