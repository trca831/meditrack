const Med = require("../models/Medication");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);
factory.define("med", Med, {
  createdBy: () => new mongoose.Types.ObjectId(), // or use a real user ID if available
  name: () => faker.commerce.productName(), // or faker.word.noun() for a simpler name
  dosage: () => faker.number.int({ min: 1, max: 10000 }),
  frequency: () =>
    faker.helpers.arrayElement([
      "Once a day",
      "Twice a day",
      "Three times a day",
      "As needed",
    ]),
  taken: () => faker.datatype.boolean(),
  date: () => faker.date.recent(),
  notes: () =>
    faker.helpers.arrayElements(
      Array.from({ length: 5 }, () => faker.lorem.sentence()),
      faker.number.int({ min: 1, max: 3 })
    ),
});
factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    await Med.deleteMany({}); // deletes all medication records
    await User.deleteMany({}); // and all the users
    testUser = await factory.create("user", { password: testUserPassword });
    await factory.createMany("med", 20, { createdBy: testUser._id }); // put 30 job entries in the database.
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
