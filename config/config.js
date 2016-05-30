module.exports = {
  'port': process.env.PORT || 3000,
  'secret': process.env.JWT_SECRET || 'uygfhjhgcjyc765464$@tddrr5',
  'database': process.env.MONGODB_URL || 'mongodb://localhost:27017/twitch-roulette'
};
