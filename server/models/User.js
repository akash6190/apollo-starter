const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
  username: String,
  password: String,
});

schema.methods.generateHash = (password) => bcrypt.hashSync(password, 10);

schema.methods.validPassword = (password) => bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('User', schema);
