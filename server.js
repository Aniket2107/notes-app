const app = require("./app");

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
