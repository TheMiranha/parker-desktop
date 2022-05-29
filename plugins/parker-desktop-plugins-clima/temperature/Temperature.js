const axios = require('axios');
const ENDPOINT = 'https://parker-servers-temperature.herokuapp.com';

const getServerStatus = async() => {
    var response = await axios.get(ENDPOINT);
    return response.data.status != undefined;
}

const getTemperature = async(city) => {
    try {
        var response = await axios.get(ENDPOINT + '/temperature/' + city);
    response = response.data;
    response.imgs = {weather: 'http://openweathermap.org/img/wn/'+response.weather[0].icon+'@2x.png', country: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/'+response.sys.country+'.svg'}
    return response;
    } catch (error) {
        return false;
    }
}

module.exports = { getServerStatus, getTemperature }