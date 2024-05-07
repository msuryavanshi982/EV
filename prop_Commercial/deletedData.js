const { create, convert } = require('xmlbuilder2');
const Track_Comm_Data = require('../Model/trackCommDataSchema');
const { uploadXmlFileToSftp } = require('../sftpTransfer');
const fs = require('fs');
const { commercialSchema } = require('./XML_Schema/commercialSchema');
const { uploadFile } = require('../uploadTosftp');

const archiver = require('archiver')

async function deletedData(RESPONSE_OBJ){
    console.log('COMM: Deleted data function called...')
    const date = Date.now();
    
    const host = 'sftp-search.engelvoelkers.com';
    const username = process.env.name;
    const password = process.env.password;
    //const filePath = path;
    //const destinationPath = `./upload/comm_Delete_XML-${date}.xml`;
    const metadata = {
        'content-type': 'text/xml'
    };
    var xml = [];

    const dataset = RESPONSE_OBJ;
    await Promise.all(
        dataset.map(async (d) => {
            
            const deleteObj = {
                'real:property': {
                    '@': {
                    'xmlns:loc': 'http://engelvoelkers.com/web-innovation/Localization',
                    'xmlns:real': 'http://engelvoelkers.com/web-innovation/RealEstateData',
                    'displayId': d.web_ref,
                    'operation': 'delete'
                    }
                }
            }

            const xmlCreate = create().ele(deleteObj);
            const deleteData = xmlCreate.end({ prettyPrint: true });

            xml.push(deleteData);
            
        })
    )
    var filePath = [];
    for (let i = 0; i < xml.length; i++) {

        console.log(__dirname, 'COMM: writing deleted xmls')
        const timestamp = new Date().getTime()
        await fs.writeFileSync(__dirname+`/Data/Deleted_Data/comm_Deleted_XML-${i}-${timestamp}.xml`, xml[i]);

        const writeStream = fs.createWriteStream(__dirname+ `/Data/zip_Deleted_Data/comm_Deleted_XML-${i}-${timestamp}.zip`);

        const archive = archiver('zip');

        archive.pipe(writeStream);

        archive.file(__dirname + `/Data/Deleted_Data/comm_Deleted_XML-${i}-${timestamp}.xml`, { name: `comm_Deleted_XML-${i}-${timestamp}.xml`})

        archive.finalize()
        console.log(__dirname+`/Data/zip_Deleted_Data/comm_Deleted_XML-${i}-${timestamp}.zip`);

        filePath.push({
            path: __dirname + `/Data/zip_Deleted_Data/comm_Deleted_XML-${i}-${timestamp}.zip`,
            destinationPath: `./upload/comm_Deleted_XML-${i}-${timestamp}.zip`,
        });
    }

    for (const file of filePath) {
        await uploadFile(host, username, password, file)
    }
}

module.exports = { deletedData }