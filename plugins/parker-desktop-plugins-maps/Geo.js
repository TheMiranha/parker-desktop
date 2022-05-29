import axios from 'axios';

const searchAdress = async(adress) => {
    var response = await axios.get('https://nominatim.openstreetmap.org/search?format=json&limit=3&q=' + adress);
    return response.data[0];
}

export default { searchAdress }