const http = require('http');

// Helper wrapper for requests
const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3002,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            options.headers['Content-Length'] = JSON.stringify(body).length;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTest = async () => {
    try {
        const timestamp = Date.now();
        const email = `user_${timestamp}@test.com`;
        const password = 'Password123!';

        console.log(`1. Registering user: ${email}...`);
        const regRes = await request('POST', '/auth/register', {
            email, password, firstName: 'Test', lastName: 'User'
        });

        if (regRes.status !== 201) {
            throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
        }
        const token = regRes.data.data.token;
        console.log('   ✅ Registration successful. Token obtained.');

        console.log('\n2. Buying Stock (AAPL)...');
        const buyRes = await request('POST', '/trading/buy', {
            symbol: 'AAPL', shares: 10
        }, token);

        if (buyRes.status !== 201) {
            throw new Error(`Buy failed: ${JSON.stringify(buyRes.data)}`);
        }
        console.log('   ✅ Stock purchased successfully.');

        console.log('\n3. Checking Portfolio...');
        const portRes = await request('GET', '/portfolio', null, token);

        if (portRes.status !== 200) {
            throw new Error(`Portfolio fetch failed: ${JSON.stringify(portRes.data)}`);
        }

        // Validate we have the stock
        const holding = portRes.data.data.holdings.find(h => h.symbol === 'AAPL');
        if (!holding || holding.shares !== 10) {
            throw new Error(`Portfolio persistence check failed: ${JSON.stringify(portRes.data)}`);
        }
        console.log('   ✅ Portfolio Verified: Found 10 shares of AAPL.');

        console.log('\n4. Checking Transaction History...');
        const histRes = await request('GET', '/trading/history', null, token);

        if (histRes.status !== 200) {
            throw new Error(`History fetch failed: ${JSON.stringify(histRes.data)}`);
        }

        if (histRes.data.data.length === 0) {
            throw new Error(`History persistence check failed: No transactions found.`);
        }
        console.log('   ✅ History Verified: Transaction log found.');

        console.log('\n5. Checking Market Data (Public)...');
        const mktRes = await request('GET', '/market/indices');
        if (mktRes.status !== 200) {
            throw new Error(`Market data failed: ${JSON.stringify(mktRes.data)}`);
        }
        console.log(`   ✅ Market Data Verified: Received ${mktRes.data.data.length} indices.`);

        console.log('\n✅ ALL BACKEND SECTIONS RUNNING IN FULL MODE (PERSISTENCE ACTIVE)');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    }
};

runTest();
