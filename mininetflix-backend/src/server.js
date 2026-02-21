require("dotenv").config();
const app = require("./app");

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});