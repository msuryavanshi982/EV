const axios = require('axios');
const { sendAllData } = require('./sendAllData');
const { updateData } = require('./updateData.js');
const { deletedData } = require('./deletedData')
const fs = require('fs')
//const dotenv = require('dotenv').config();
// const connectDB = require('../connectionDB/config');
// connectDB();
async function getToken(){
    var config = {
        method: 'get',
        url: process.env.auth_url,
        headers: {
            'Authorization' : 'Basic ' + process.env.auth_token
        }
    };
    const response = await axios(config);
    return response.data.clients[0].token;
}

async function fetchCommercialProperties(){
    var limit = 100;
    var offset = 0;

    var finalData = [];

    var token = await getToken();
    console.log(`Prop commercial data fetching started.`);
        
    var data = '';

    var flag = true;
    while(flag){

        var config = {
            method: 'get',
            url: `${process.env.prop_comm}&limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
    
        const response = await axios(config);
        //console.log(response.data);
        for(var d of response.data.results){
            finalData.push(d)
        }
        
        offset += 100;
        console.log(`prop Commercial Data loading: limit: ${limit} || offset: ${offset}`);

        if(response.data.next === null){
            flag = false; 
        }
    }    
    console.log(`Total commercial prop data received: ${finalData.length}`);
    return finalData
}

async function prop_Commercial(){
    var limit = 100;
    var offset = 0;

    var finalData = [];
    var archivedData = [];

    var token = await getToken();
    console.log(`Prop commercial data fetching started.`);
        
    var data = '';

    var flag = true;
    while(flag){

        var config = {
            method: 'get',
            url: `${process.env.prop_comm}&limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
    
        const response = await axios(config);
        //console.log(response.data);
        for(var d of response.data.results){
            if(d.status == "Active" && d.display_on_website === true) {
                finalData.push(d)
            } else{
                archivedData.push(d)
            }

        }
        
        offset += 100;
        console.log(`prop Commercial Data loading: limit: ${limit} || offset: ${offset}`);

        if(response.data.next === null){
            flag = false;
            
        }
    }    
    console.log(`Total commercial prop data received: ${finalData.length}`);
    console.log(`Total commercial archived prop data: ${archivedData.length}`);
    
    
    // send All data to sftp server...
    sendAllData(finalData);
    
    // // send only the updated data to sftp server...
    // updateData(finalData);

    // // send only deleted data to sftp server...
    deletedData(archivedData);
}




module.exports = { prop_Commercial, fetchCommercialProperties }