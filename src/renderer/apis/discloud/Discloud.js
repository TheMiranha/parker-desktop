import { triggerAsyncId } from 'async_hooks';
import axios from 'axios';

const ENDPOINT = 'https://discloud.app/api/v2';
const APP_ID = '847484939762008074';

const appInfo = async() => {
    try {
        var response = await axios.get(ENDPOINT + '/app/' + APP_ID, {'headers': {'api-token': '5Gvw6noAZgEC2oHEehxxrzyLq8Zh0NSSu1RkuIiNkpOtwUIindpCNi6ntqUcJwi7U'}});
    return response.data
    } catch (error) {
        return {container: 'offline'}
    }
}

module.exports = { appInfo }