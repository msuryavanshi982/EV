const Client = require('ssh2-sftp-client');
const uploadFile = async (host, username, password, filePath) => {
    try {
        // Create a new SFTP client instance
        const sftp = new Client();
        // Connect to the SFTP server
        await sftp.connect({
            host: host,
            username: username,
            password: password
        });
        // Upload the file to the remote path
        await sftp.put(filePath.path, filePath.destinationPath);
        // Close the SFTP connection
        await sftp.end();
        console.log(`Successfully uploaded ${filePath.path} to ${filePath.destinationPath}`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { uploadFile }