const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Self-signed certificate for local testing
const cert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTMwODI3MjM1NDA3WhcNMTQwODI3MjM1NDA3WjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAwQHoEzGYxCkuT5V9xtB5x2wf9uVAAR7ZV2xV7q1CzVJ2dMJaCtC3VsIy
8XuKl5YM5M3V4X2wM6bSMcJsXuKqsqG5V2X3gWV8y2f9hKl5YM5V3V4X2wM6bSM
-----END CERTIFICATE-----`;

const key = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBAdgTMZjEKS5P
lX3G0HnHbB/25UABH tlXbFXurULNUnZ0wlrK0LdWwjLxe4qXlgzkzdXhfbAzptIx
wmxe4qqyoblXZfeBZXzLZ/2EqXlgzlXdXhfbAzptIxwmxe4qqyoblXZfeBZXzLZ
-----END PRIVATE KEY-----`;

const options = { key, cert };

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.glb': 'model/gltf-binary',
    '.usdz': 'model/vnd.usdz+zip',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = https.createServer(options, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath = '.' + req.url;
    if (filePath === './') filePath = './marker-ar.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const port = 8443;
server.listen(port, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('🚀 HTTPS Server running:');
    console.log(`   📱 Mobile: https://${localIP}:${port}`);
    console.log(`   💻 Local:  https://localhost:${port}`);
    console.log('\n📝 Instructions:');
    console.log('1. Print the Hiro marker: https://github.com/AR-js-org/AR.js/raw/master/data/images/hiro.png');
    console.log('2. Open the mobile URL on your phone');
    console.log('3. Accept security warning (click Advanced → Proceed)');
    console.log('4. Point camera at printed marker');
});
