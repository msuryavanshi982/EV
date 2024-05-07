// npm install ssh2-sftp-client
/**
 * Function to upload an XML file to an SFTP server
 * @param {string} host - hostname of the SFTP server
 * @param {string} username - username for the SFTP server
 * @param {string} password - password for the SFTP server
 * @param {string} filePath - path of the file to be uploaded
 * @param {string} destinationPath - destination path on the SFTP server
 * @param {object} metadata - metadata for the file
 * @return {Promise} - Promise object represents the upload operation
 */

 const Client = require('ssh2-sftp-client');

 const uploadXmlFileToSftp = (host, username, password, filePath, metadata) => {
   try {
    for(path of filePath){

      const sftp = new Client();
      console.log('Conn...')
      return new Promise((resolve, reject) => {
        sftp.connect({
          host,
          username,
          password
        })
          .then(() => {
            console.log('Connected...')
            sftp.put(path.path, path.destinationPath, { metadata })
            
          })
          .then(() => {
            
            sftp.end();
            resolve();
          })
          .catch(err => {
            sftp.end();
            reject(err);
          });
      });
    }
     
   } catch (error) {
     return error
   }
 };
 // const host = 'sftp.example.com';
 // const username = 'username';
 // const password = 'password';
 // const filePath = 'path/to/file.xml';
 // const destinationPath = '/destination/path/file.xml';
 // const metadata = {
 //   'content-type': 'text/xml'
 // };
 // uploadXmlFileToSftp(host, username, password, filePath, destinationPath, metadata)
 //   .then(() => console.log('File uploaded successfully'))
 //   .catch(err => console.error(err));
 
 module.exports = { uploadXmlFileToSftp };