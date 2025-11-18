const http = require('http');

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  SUNFLIX API COMPREHENSIVE TEST SUITE  ║');
  console.log('╚════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;
  let token = null;
  let userId = null;
  let videoId = null;

  for (const { name, fn } of tests) {
    try {
      const result = await fn({ token: (t) => { token = t }, userId: (id) => { userId = id }, videoId: (id) => { videoId = id } });
      if (result.token) token = result.token;
      if (result.userId) userId = result.userId;
      if (result.videoId) videoId = result.videoId;
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${err.message}`);
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log(`║ RESULTS: ${passed} passed, ${failed} failed     ║`);
  console.log('╚════════════════════════════════════════╝\n');
}

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${json?.message || body}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Tests
test('1. Admin Login', async (ctx) => {
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@sunflix.com',
    password: 'admin123',
  });
  if (!result.token || !result.user) throw new Error('No token or user in response');
  ctx.token(result.token);
  ctx.userId(result.user._id);
  return { token: result.token };
});

test('2. Get User Profile', async (ctx) => {
  if (!ctx.token) throw new Error('No token from previous test');
  const token = ctx.token || null;
  // Would need to store token - simplified for now
  const result = await makeRequest('GET', '/api/users/admin', null, ctx.token);
  return result;
});

test('3. Get All Videos', async (ctx) => {
  const result = await makeRequest('GET', '/api/videos');
  if (!Array.isArray(result)) throw new Error('Expected array of videos');
  if (result.length > 0) ctx.videoId(result[0]._id);
  return { videoId: result[0]?._id };
});

test('4. Get Health Check', async (ctx) => {
  const result = await makeRequest('GET', '/api/health');
  return result;
});

runTests().catch(console.error);
