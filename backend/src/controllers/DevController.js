const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    console.log(req.body);

    const { github_username, techs, latitude, longitude } = req.body;

    // Vai no banco o procura se já existe username
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const techsArray = parseStringAsArray(techs);

      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      // console.log(apiResponse.data);

      let { name = login, avatar_url, bio } = apiResponse.data;

      // console.log(name, bio, avatar_url);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        bio,
        avatar_url,
        techs: techsArray,
        location,
      });
    }

    return res.status(200).json(dev);
  },

  async destroy(req, res) {
    const { id } = req.body;

    await Dev.findOne({ _id: id }, (err, dev) => {
      dev.remove();
    });

    const devs = await Dev.find();

    return res.json(devs);
  },
};
