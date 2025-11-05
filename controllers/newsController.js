const axios = require('axios');
const Users = require('../models/usersModel');

const getNewsForUser = async (userId) => {
  const user = await Users.findById(userId);
  if (!user) throw new Error("User not found");

  const preferences = user.preferences || ['technology'];
  const query = preferences.join(" OR ");

  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      apiKey: process.env.NEWS_API_KEY,
    },
  });

  return response.data.articles;
};

module.exports = { getNewsForUser };
