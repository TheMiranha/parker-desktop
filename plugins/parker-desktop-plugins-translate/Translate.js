import axios from 'axios';

const ENDPOINT = 'https://parker-translate.herokuapp.com/';

const getLangs = async() => {
    var response = await axios.get(ENDPOINT + 'langs');
    return response.data.langs;
}

const translate = async(text, lang) => {
    var response = await axios.get(ENDPOINT + 'translate/' + lang + '/' + text);
    return response.data.text;
}

export default { getLangs, translate }