let count = 0;

module.exports = {
  addCount(inc) {
    count += inc;
    return Promise.resolve({
      amount: count,
    });
  },

  getCount() {
    return Promise.resolve({
      amount: count,
    });
  },

};
