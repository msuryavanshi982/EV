const { create, convert } = require("xmlbuilder2");
const Track_Res_Data = require("../Model/trackResDataSchema");
const { uploadXmlFileToSftp } = require("../sftpTransfer");
const fs = require("fs");
const { residentialSchema } = require("./XML_Schema/residentialSchema");
const { uploadFile } = require("../uploadTosftp");

async function updateData(RESPONSE_OBJ) {
  console.log("RES: update data function called...");
  const date = Date.now();
  //const path = `../EV/prop_Residential/Data/Updated_Data/res_Updated_XML-${date}.xml`
  // const host = "sftp-search.envstage.com";
  const host = "sftp-search.engelvoelkers.com";
  const username = process.env.name;
  const password = process.env.password;

  //const destinationPath = `./upload/res_Updated_XML-${date}.xml`;
  const metadata = {
    "content-type": "text/xml",
  };
  var xml = [];

  const dataset = RESPONSE_OBJ;
  await Promise.all(
    dataset.map(async (d) => {
      const track = await Track_Res_Data.findOne({ property_id: d.id });
      if (track) {
        if (d.deleted === null) {
          if (!(track.modified === d.modified)) {
            const residentialObj = await residentialSchema(d);
            const xmlCreate = create().ele(residentialObj);
            const updatedData = xmlCreate.end({ prettyPrint: true });

            xml.push(updatedData);

            await Track_Res_Data.findOneAndUpdate(
              { property_id: d.id },
              {
                modified: d.modified,
                deleted: d.deleted,
              }
            );
          }
        }
      }
    })
  );
  var filePath = [];
  for (let i = 0; i < xml.length; i++) {
    count = i;
    console.log(__dirname, "RES: writing updated xmls");
    await fs.writeFileSync(
      __dirname + `/Data/Updated_Data/res_Updated_XML-${i}.xml`,
      xml[i]
    );
    filePath.push({
      path: __dirname + `/Data/Updated_Data/res_Updated_XML-${i}.xml`,
      destinationPath: `./upload/res_All_XML-${i}.xml`,
    });
    //sleep(6000)
  }
  //console.log(filePath)

  for (const file of filePath) {
    await uploadFile(host, username, password, file);
  }
  // Sending XML File
  // uploadXmlFileToSftp(host, username, password, filePath, destinationPath)
  // .then(() => console.log('File uploaded succesfully '))
  // .catch(err => console.log(err));
}

module.exports = { updateData };
