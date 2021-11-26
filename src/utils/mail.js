var axios = require('axios');

function enviarMail(data2) {
    try {
        var data = JSON.stringify(
            data2
        );

        var config = {
            method: 'post',
            url: 'http://www.bioonix.com/api-mail-laravel/backend/public/api/v1/enviarMail1',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)

    } catch (error) {
        console.error(error)
    }
}
module.exports = { enviarMail }
