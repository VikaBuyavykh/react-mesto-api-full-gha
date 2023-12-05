require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  PORT, MONGO_URL, NODE_ENV, JWT_SECRET,
};
