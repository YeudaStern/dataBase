const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {

  mongoose.set('strictQuery', false);
 
  await mongoose.connect('mongodb://127.0.0.1:27017/design1');
  console.log("mongo connect design1 local");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}