const mongoose = require("mongoose");
const { config } = require("../config/secret");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${config.USER_DB}:${config.PASS_DB}@yehielsh.74bzrg5.mongodb.net/projecttoys`
  );
  console.log("mongo connect projecttoys");
}
