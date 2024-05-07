const cron = require("node-cron");
const express = require('express');
const port = 8080;
const fs = require('fs');
const dotenv = require("dotenv").config();
const connectDB = require("./connectionDB/config");
connectDB();
const { prop_Residential, fetchResidentialProperties } = require("./prop_Residential/apiFunction");
const { prop_Commercial, fetchCommercialProperties } = require("./prop_Commercial/apiFunction");
const { RESIDENTIAL_JSON2XML } = require('./prop_Residential/sendAllData');
const { COMMERCIAL_JSON2XML } = require('./prop_Commercial/sendAllData');
const { create, convert } = require("xmlbuilder2");
const xml2js = require('xml2js');

function deleteFiles(folderPath, type){
    fs.readdir(folderPath, (err, files) => {
        if(err){
            console.error('Error reading folder', err);
            return
        }
        const zipFiles = files.filter(file => file.endsWith(`.${type}`));
        zipFiles.forEach(file => {
            fs.unlink(`${folderPath}/${file}`, err => {
                if(err){
                    console.error('Error deleting file: ', file, err);
                }else{
                    console.log('Deleted file:', file);
                }
            })
        });
    });

}

//*for every midnight: 0 0 * * *
cron.schedule('0 */12 * * *', () => {
    deleteFiles(`./prop_Residential/Data/All_Data`, 'xml')
    deleteFiles(`./prop_Residential/Data/Deleted_Data`, 'xml')
    deleteFiles('./prop_Commercial/Data/All_Data', 'xml')
    deleteFiles('./prop_Commercial/Data/Deleted_Data', 'xml')
    deleteFiles('./prop_Residential/Data/zip_All_Data', 'zip')
    deleteFiles(`./prop_Residential/Data/zip_Deleted_Data`, 'zip')
    deleteFiles('./prop_Commercial/Data/zip_All_Data', 'zip');
    deleteFiles('./prop_Commercial/Data/zip_Deleted_Data', 'zip')
    
    prop_Residential();
    prop_Commercial();
});

deleteFiles(`./prop_Residential/Data/All_Data`, 'xml')
deleteFiles(`./prop_Residential/Data/Deleted_Data`, 'xml')
deleteFiles('./prop_Commercial/Data/All_Data', 'xml')
deleteFiles('./prop_Commercial/Data/Deleted_Data', 'xml')
deleteFiles('./prop_Residential/Data/zip_All_Data', 'zip')
deleteFiles(`./prop_Residential/Data/zip_Deleted_Data`, 'zip')
deleteFiles('./prop_Commercial/Data/zip_All_Data', 'zip');
deleteFiles('./prop_Commercial/Data/zip_Deleted_Data', 'zip')

prop_Commercial();
prop_Residential();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', async (req,res) => {
    return res.status(200).json({
        message: "Hello, this EV script running every 12 hours."
    })
})

app.get('/xmls', async (req,res) => {
    const [residentialData, commercialData] = await Promise.all([fetchResidentialProperties(), fetchCommercialProperties()]);
    

    const residentialXML = await RESIDENTIAL_JSON2XML(residentialData);
    const commercialXML = await COMMERCIAL_JSON2XML(commercialData);

    for(let i = 0; i < residentialXML.length; i++){
        residentialXML[i] = residentialXML[i].replace(`<?xml version="1.0"?>`, '');
    }
    
    for(let i = 0; i < commercialXML.length; i++){
        commercialXML[i] = commercialXML[i].replace(`<?xml version="1.0"?>`, '');
    }
    
    console.log(residentialXML.length);
    console.log(commercialXML.length);
    

    const overAllData = residentialXML.concat(commercialXML)
    console.log(overAllData.length);

    const root = create()
    const combinedXML = root.ele('CombinedXML');

    for(var xml of overAllData){
        const xmlObj = create(xml);
        const rootElement = xmlObj.root()
        combinedXML.import(rootElement)
    }

    const combinedXMLData = combinedXML.end({prettyPrint: true});
    //fs.writeFileSync('testing.xml', combinedXMLData.toString())
    //fs.writeFileSync('data.json', JSON.stringify(overAllData))

    res.set('Content-Type', 'application/xml');
    //res.set('Content-Disposition', 'attachment; filename="data.xml"');
    res.send(combinedXMLData)
});

app.listen(port, () => {
    console.log(`Server started on port: 8080`);
});