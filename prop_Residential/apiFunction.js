const axios = require('axios');
const { sendAllData } = require('./sendAllData');
const { updateData } = require('./updateData.js');
const { deletedData } = require('./deletedData');

const fs = require('fs');
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

async function fetchResidentialProperties(){
    var limit = 100;
    var offset = 0;

    var finalData = [];

    var token = await getToken();
    console.log(`Prop residential data fetching started.`);
        
    var data = '';

    var flag = true;
    while(flag){

        var config = {
            method: 'get',
            url: `${process.env.prop_res}&limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
    
        const response = await axios(config);
        for(var d of response.data.results){
            finalData.push(d)
        }
        //finalData.push(...response.data.results);
        offset += 100;
        console.log(`prop Residential Data loading: limit: ${limit} || offset: ${offset}`);
    
        if(response.data.next === null){
            flag = false;
        }
    }
    
    console.log(`Total residential prop data received: ${finalData.length}`);
    
    return finalData
}

async function prop_Residential(){

    var limit = 100;
    var offset = 0;

    var finalData = [];
    var archivedData = [];

    var token = await getToken();
    console.log(`Prop residential data fetching started.`);
        
    var data = '';

    var flag = true;
    while(flag){

        var config = {
            method: 'get',
            url: `${process.env.prop_res}&limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
    
        const response = await axios(config);
        for(var d of response.data.results){
            if(d.status == "Active" && d.display_on_website === true) {
                finalData.push(d)
            }else{
                archivedData.push(d)
            }
        }
        //finalData.push(...response.data.results);
        offset += 100;
        console.log(`prop Residential Data loading: limit: ${limit} || offset: ${offset}`);
    
        if(response.data.next === null){
            flag = false;
            //finalData.push(...response.data.results)
        }
    }
    fs.writeFileSync('dataTemp.json', JSON.stringify(archivedData))
    fs.writeFileSync('dataTemp1.json', JSON.stringify(finalData))
    console.log(`Total residential prop data received: ${finalData.length}`);
    console.log(`Total residential archived prop data: ${archivedData.length}`);

    // send All data to sftp server...
    sendAllData(finalData);
    
    // send only the updated data to sftp server...
    //updateData(finalData);

    // send only deleted data to sftp server...
    deletedData(archivedData);
}

//prop_Residential();


module.exports = { prop_Residential, fetchResidentialProperties }