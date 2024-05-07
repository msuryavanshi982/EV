const axios = require('axios');
const dotenv = require('dotenv').config();

async function prop_Areas(){

    // api with login credentials for token...
    var config = {
        method: 'get',
        url: process.env.auth_url,
        headers: { 
          'Authorization': 'Basic ' + process.env.auth_token
        }
    };

    axios(config)
    .then( function (response) {
        var data = '';
        var config = {
            method: 'get',
            url: process.env.prop_areas,
            headers: {
                'Authorization': `Bearer ${ response.data.clients[0].token }`
            },
            data: data
        }

        axios(config)
        .then(async function (response){
            return response.data;
            
        })
        .catch( function (error){
            return error;
        });
    })
    .catch(function (error){
        return error;
    });
}


module.exports = { prop_Areas }