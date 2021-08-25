const axios = require(`axios`);

const instance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
});

module.exports = instance;