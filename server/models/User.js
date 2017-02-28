const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailSchema = mongoose.Schema({
  email: {
    type: String,
    validator(v) {
      return (/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).test(v); // eslint-disable-line no-useless-escape
    },
    message: '{VALUE} is not a valid email',
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const schema = mongoose.Schema({
  username: String,
  password: String,
  emails: [emailSchema],
  services: Array,
});

schema.methods.generateHash = (password) => bcrypt.hashSync(password, 10);

schema.methods.validPassword = (password) => bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('User', schema);
