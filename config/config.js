module.exports = {
  'port': process.env.PORT || 3000,
  'secret': process.env.JWT_SECRET || 'sadakjd238hISD9h#!)smndasdkh',
  'database': process.env.MONGODB_URL || 'mongodb://localhost:27017/twitch-roulette'
};
