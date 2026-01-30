const http = require('http');

const data = JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing registration...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (error) => {
    console.error('ERROR:', error);
});

req.write(data);
req.end();
