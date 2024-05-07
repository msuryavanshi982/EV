const axios = require('axios');
const dotenv = require('dotenv').config();
const fs = require('fs');

async function getToken(){
    var config = {
        method: 'get',
        url: process.env.auth_url,
        headers: {
            'Authorization' : 'Basic ' + process.env.auth_token
        }
    };

    try {
        //console.log("token generated...");
        const response = await axios(config);
        return response.data.clients[0].token;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

// var limit = 100;
// var offset = 0;
// // var count = 0;
// var finalData = [];

async function test(){
    var limit = 100;
    var offset = 0;

    var finalData = [];
    const token = await getToken();
    console.log('test fn started');
    //var data = '';

    var flag = true;
    while(flag){
        var config = {
            method: 'get',
            url: `${process.env.prop_locations}&limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            data: ''
        }
        //console.log(config.url);
        try {
            const response = await axios(config);
            //console.log(response.data.next)
            finalData.push(...response.data.results);
            offset += 100;

            console.log(`limit: ${limit} || offset: ${offset}`)
            if(response.data.next === null){
                flag = false;
                finalData.push(...response.data.results);
                //console.log(response.data.next)
            }
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }
    console.log(finalData.length);
    var jsonData = JSON.stringify(finalData)
    fs.writeFile('location.json', jsonData, (err) => {
        if(err) console.log(err);
        else console.log('Data saved');
    });
    return finalData;
}

//test();

// test()
// .then(result => {
//     console.log(result.length);
// })
// .catch(err => {
//     console.log(err);
// })
// async function prop_Locations(limit, offset){
//     const token = await getToken();
//     console.log('fn started');
//     var data = '';
//     var config = {
//         method: 'get',
//         url: `${process.env.prop_locations}&limit=${limit}&offset=${offset}`,
//         headers: {
//             'Authorization': `Bearer ${ token }`
//         },
//         data: data
//     }
//     console.log(config.url);
//     const response = await axios(config);
//     if(response.data.next === null){
//         finalData.push(...response.data.results);
//         console.log('Base condition satisfied...');
//         return finalData;
//     }
//     //console.log(response.data.results)
//     finalData.push(...response.data.results);
//     console.log(finalData.length);
//     console.log('entering to recursion...');
//     console.log(`limit: ${limit} || offset: ${offset}`);
    
//     //offset = offset+100;
//     const propData = await prop_Locations(limit, offset+100);
    
//     //console.log(response.data.results.length);
    
//     // results.push(response.data.results);
//     // return {
//     //     count: response.data.count,
//     //     results: response.data.results
//     // };
    
// }

// prop_Locations(limit, offset)
// .then((result) => {
//     console.log(result);
//     console.log(finalData);
// }).catch((err) => {
//     console.log(err);
// });

// async function residentialSchema(OBJECT) {
//     var prefix1 = '';
//     const obj1 = {
//         'real:property': {
//           '@': { 
//             'id': OBJECT.id, 
//             'displayId': OBJECT.web_ref,
//             'xmlns:real': 'http://engelvoelkers.com/web-innovation/RealEstateData'
//           },
//           'real:businessDivision': OBJECT.model,
//           'real:offerCategory': OBJECT.listing_type,
//           'real:propertyType': OBJECT.property_type,
//           'real:location': {
//             'real:address': {
//               'real:street': OBJECT.street_name+' '+OBJECT.street_number,
//               'real:zipcode': OBJECT.meta.location.postal_code,
//               'real:city': '', // * map area api's province
//               'real:country': '', // * map area api's country
//             },
//             'real:region': '',
//             'real:district': '',
//             'real:community': '', // * map area api's area
//             'real:subCommunity': '',
//             'real:geolocation': {
//               '@': {
//                 'longitude': OBJECT.map_x_position,
//                 'latitude': OBJECT.map_y_position
//               }
//             }
//           },
//           'real:agent': {
//             'real:userid': OBJECT.meta.agent.id,
//             'real:name': OBJECT.meta.agent.full_name,
//             'real:phone': OBJECT.meta.agent.cell_number,
//             'real:email': OBJECT.meta.agent.email,
//             'real:www': OBJECT.meta.agent.website_url,
//             'real:permitNumber': OBJECT.property_permit
//           },
//           'real:profile': {
//             '@': { 
//               'language': 'en',
//               'id': OBJECT.id, 
//               'displayId': OBJECT.web_ref,
//             },
//             'real:title': OBJECT.marketing_heading,
//             'real:description': OBJECT.description,
//             'real:location': {
//               'real:address': {
//                 'real:street': OBJECT.street_name+' '+OBJECT.street_number,
//                 'real:zipcode': OBJECT.meta.location.postal_code,
//                 'real:city': '', // * map area api's province
//                 'real:country': '', // * map area api's country
//               },
//               'real:region': '',
//               'real:district': '',
//               'real:community': '', // * map area api's area
//               'real:subCommunity': '',
//               'real:geolocation': {
//                 '@': {
//                   'longitude': OBJECT.map_x_position,
//                   'latitude': OBJECT.map_y_position
//                 }
//               }
//             },
//             'real:media': [],
//             'real:virtualTour': {
//               'real:uri': OBJECT.virtual_tour ,
//               'real:embed': ''
//             },
//             'real:pricing': {
//               'real:price': {
//                 'real:onRequest': false,
//                 'real:baseValue': {
//                   '@': { 'currency': 'AED', 'amount': OBJECT.price }
//                 }
//               }
//             },
//             'real:areas': {
//               // area , suburb
//             },
//             'real:yearOfConstruction': OBJECT.build_year,
//             'real:rooms': {
//               'real:bedrooms': OBJECT.bedrooms,
//               'real:bathrooms': OBJECT.bathrooms
//             },
//             'real:created': OBJECT.created
//             //'real:URL': OBJECT.meta.url
//           },
//           'real:pricing': {
//             'real:price': {
//               'real:onRequest': false,
//               'real:baseValue': {
//                 '@': { 'currency': 'AED', 'amount': OBJECT.price }
//               }
//             }
//           },
//           'real:areas': {
  
//           },
//           'real:availableFrom': OBJECT.available_from,
//           'real:yearOfConstruction': OBJECT.build_year,
//           'real:rooms': {
//             'real:bedrooms': OBJECT.bedrooms,
//             'real:bathrooms': OBJECT.bathrooms
//           },
//           'real:name': OBJECT.meta.heading
//         }
//     }
//     if(obj1['real:property']['real:offerCategory'].toLowerCase().search('sale') !== -1){
//     obj1['real:property']['real:offerCategory'] = 'buy'
//     };
//     if(obj1['real:property']['real:offerCategory'].toLowerCase().search('let') !== -1){
//     obj1['real:property']['real:offerCategory'] = 'rent'
//     };
    
//     // TODO: hit areas endpoint and search for the location id and map those properties with this object...
//     // var locationData = await getAllLocations();
//     //console.log('hii');
//     //console.log(locationData.length);
    
//     const foundLocation = await finalData.find(d => d.id === OBJECT.location);
//     if(foundLocation){
//       obj1['real:property']['real:location']['real:address']['real:city'] = foundLocation?.province;
//       obj1['real:property']['real:location']['real:address']['real:country'] = foundLocation?.country;
//       obj1['real:property']['real:location']['real:address']['real:zipcode'] = foundLocation?.postal_code;
//       obj1['real:property']['real:location']['real:community'] = foundLocation?.area;
//       obj1['real:property']['real:location']['real:subCommunity'] = foundLocation?.suburb;
    
//       obj1['real:property']['real:profile']['real:location']['real:address']['real:city'] = foundLocation?.province;
//       obj1['real:property']['real:profile']['real:location']['real:address']['real:city'] = foundLocation?.province;
//       obj1['real:property']['real:profile']['real:location']['real:address']['real:country'] = foundLocation?.country;
//       obj1['real:property']['real:profile']['real:location']['real:address']['real:zipcode'] = foundLocation?.postal_code;
//       obj1['real:property']['real:profile']['real:location']['real:community'] = foundLocation?.area;
//       obj1['real:property']['real:profile']['real:location']['real:subCommunity'] = foundLocation?.suburb;
//     }
  
//     for(var image of OBJECT.meta.listing_images){
//         obj1['real:property']['real:profile']['real:media'].push({
//             'real:location': image.file,
//             'real:category': 'view',
//             'real:mimeType': image.content_type
//         });
//     }
//     return obj1;
// }


// async function getAllLocations(){

//     const finalData = await prop_Locations(limit,offset);
//     return finalData;


//     // const temp = await prop_Locations();
//     // count = temp.count;

    
    
//     // for(let i = 0; i<count; i=i+100){
//     //     var data = await prop_Locations();
//     //     console.log('i:', i);
//     //     results.push(...data.results)
//     //     console.log('fn',count)
//     //     console.log('fn',offset);
//     //     if(offset >= temp.count){
//     //         break;
//     //     }
//     //     offset += 100;
//     //     if(count< 100){
//     //         break;
//     //     }
//     //     count = count - 100;
//     // }

//     // if(count < 100){
//     //     limit = count;
//     //     var data = await prop_Locations();
//     //     results.push(...data.results);
//     // }
//     // console.log(results.length);
    
//     // //console.log(results);
//     // return results;
// }


//getAllLocations()

module.exports = { test }