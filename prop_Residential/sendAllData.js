const { create, convert } = require("xmlbuilder2");
const Track_Res_Data = require("../Model/trackResDataSchema");
const { uploadXmlFileToSftp } = require("../sftpTransfer");
const fs = require("fs");
const { residentialSchema } = require("./XML_Schema/residentialSchema");
const { uploadFile } = require("../uploadTosftp");

const archiver = require('archiver');

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function RESIDENTIAL_JSON2XML(data){
  console.log('Residential xmls fetching...');

  var xml = [];
  const dataset = data;
  console.log("RES: dataset one by one logic invoked...");
  await Promise.all(
    dataset.map(async (d) => {
      const residentialObj = await residentialSchema(d);
      residentialObj["real:property"]["@"]["operation"] = "add";
      const xmlCreate = create().ele(residentialObj);
      const allData = xmlCreate.end({ prettyPrint: true });
      xml.push(allData);
    })
  );

  return xml
}

async function sendAllData(RESPONSE_OBJ) {
  console.log("RES: send all data function called...");
  const date = Date.now();

  //const path = `../EV/prop_Residential/Data/All_Data/res_All_XML-${count}.xml`
  const host = "sftp-search.engelvoelkers.com";
  const username = process.env.name;
  const password = process.env.password;
  //const filePath = path;
  //const destinationPath = `./upload/res_All_XML-${count}.xml`;
  const metadata = {
    "content-type": "text/xml",
  };
  var xml = [];
  const dataset = RESPONSE_OBJ;
  console.log("RES: dataset one by one logic invoked...");
  await Promise.all(
    dataset.map(async (d) => {
      const idStorage = {
        property_id: d.id,
        modified: d.modified,
        deleted: d.deleted,
      };

      const residentialObj = await residentialSchema(d);
      residentialObj["real:property"]["@"]["operation"] = "add";
      const xmlCreate = create().ele(residentialObj);
      const allData = xmlCreate.end({ prettyPrint: true });
      xml.push(allData);
      const checkDb = await Track_Res_Data.findOne({ property_id: d.id });
      //console.log(xml);
      if (!checkDb) {
        await Track_Res_Data.create(idStorage);
      }
    })
  );

  await fs.writeFileSync('xmlData.xml', xml.toString())
  var filePath = [];
  for (let i = 0; i < xml.length; i++) {
    console.log(__dirname, "Writing Res xmls");
    var timestamp = new Date().getTime()
    await fs.writeFileSync(
      __dirname + `/Data/All_Data/res_All_XML-${i}-${timestamp}.xml`,
      xml[i]
    );
    
    const writeStream = fs.createWriteStream(__dirname + `/Data/zip_All_Data/res_All_XML-${i}-${timestamp}.zip`)

    const archive = archiver('zip');

    archive.pipe(writeStream);

    archive.file(__dirname + `/Data/All_Data/res_All_XML-${i}-${timestamp}.xml`, { name: `res_All_XML-${i}-${timestamp}.xml` })

    archive.finalize()
    console.log(__dirname + `/Data/zip_All_Data/res_All_XML-${i}-${timestamp}.zip`);

    filePath.push({
      path: __dirname + `/Data/zip_All_Data/res_All_XML-${i}-${timestamp}.zip`,
      destinationPath: `./upload/res_All_XML-${i}-${timestamp}.zip`,
    });
  }
  for (const file of filePath) {
    await uploadFile(host, username, password, file);
  }
}

//sendAllData()

module.exports = { sendAllData, RESIDENTIAL_JSON2XML };
