const { create, convert } = require('xmlbuilder2');
const Track_Comm_Data = require('../Model/trackCommDataSchema');
const { uploadXmlFileToSftp } = require('../sftpTransfer');
const fs = require('fs');
const { commercialSchema } = require('./XML_Schema/commercialSchema');
const { uploadFile } = require('../uploadTosftp');

const archiver = require('archiver');

async function COMMERCIAL_JSON2XML(data){
    console.log('Fetching commercial xmls...');
    var xml = [];
    const dataset = data;
    console.log('dataset one by one logic invoked')

    await Promise.all(
        dataset.map(async (d) => {
            
            const commercialObj = await commercialSchema(d);
            commercialObj["real:property"]["@"]["operation"] = "add";

            const xmlCreate = create().ele(commercialObj);
            const allData = xmlCreate.end({ prettyPrint: true });
    
            xml.push(allData);
        })
    )

    return xml;
}


async function sendAllData(RESPONSE_OBJ) {

    console.log('COMM: send all data function called')

    const date = Date.now();
    
    const host = 'sftp-search.engelvoelkers.com';
    const username = process.env.name;
    const password = process.env.password;
    
    const metadata = {
        'content-type': 'text/xml'
    };
    var xml = [];
    const dataset = RESPONSE_OBJ;
    console.log('dataset one by one logic invoked')

    await Promise.all(
        dataset.map(async (d) => {
            const idStorage = {
                property_id: d.id,
                modified: d.modified,
                deleted: d.deleted
            }
            const commercialObj = await commercialSchema(d);
            commercialObj["real:property"]["@"]["operation"] = "add";

            const xmlCreate = create().ele(commercialObj);
            const allData = xmlCreate.end({ prettyPrint: true });
    
            xml.push(allData);
    
            const checkDb = await Track_Comm_Data.findOne({ property_id: d.id });
            if (!checkDb) {
                await Track_Comm_Data.create(idStorage);
            }
        })
    )
    var filePath = [];
    for (let i = 0; i < xml.length; i++) {
        
        console.log(__dirname, 'writing comm. xmls')
        const timestamp = new Date().getTime()
        await fs.writeFileSync(__dirname + `/Data/All_Data/comm_All_XML-${i}-${timestamp}.xml`, xml[i]);

        const writeStream = fs.createWriteStream(__dirname + `/Data/zip_All_Data/comm_All_XML-${i}-${timestamp}.zip`)

        const archive = archiver('zip');

        archive.pipe(writeStream);

        archive.file(__dirname + `/Data/All_Data/comm_All_XML-${i}-${timestamp}.xml`, { name: `comm_All_XML-${i}-${timestamp}.xml` })

        archive.finalize()
        console.log(__dirname + `/Data/zip_All_Data/comm_All_XML-${i}-${timestamp}.zip`);
        filePath.push({
            path: __dirname + `/Data/zip_All_Data/comm_All_XML-${i}-${timestamp}.zip`,
            destinationPath: `./upload/comm_All_XML-${i}-${timestamp}.zip`
        });
        //sleep(6000)        
    }

    
    for (const file of filePath) {
        await uploadFile(host, username, password, file)
    }
}


module.exports = { sendAllData, COMMERCIAL_JSON2XML }