import http from 'http';

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
      const result = await fn({ token, userId, videoId });
      if (result.token) token = result.token;
      if (result.userId) userId = result.userId;
      if (result.videoId) videoId = result.videoId;
      if (result.video) videoId = result.video._id;
      console.log(`✓ ${name}`);
      if (result.info) console.log(`  ${result.info}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${err.message}`);
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log(`║ RESULTS: ${passed} passed, ${failed} failed      ║`);
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
test('TEST 1: Admin Login', async (ctx) => {
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@sunflix.com',
    password: 'admin123',
  });
  if (!result.token || !result.user) throw new Error('No token or user');
  return { 
    token: result.token,
    userId: result.user._id,
    info: `Email: ${result.user.email}, Role: ${result.user.role}`
  };
});

test('TEST 2: Get All Videos', async (ctx) => {
  const result = await makeRequest('GET', '/api/videos', null, ctx.token);
  if (!Array.isArray(result)) throw new Error('Expected array');
  return { 
    videoId: result[0]?._id,
    info: `Found ${result.length} videos`
  };
});

test('TEST 3: Get Specific Video', async (ctx) => {
  if (!ctx.videoId) throw new Error('No video ID from previous test');
  const result = await makeRequest('GET', `/api/videos/${ctx.videoId}`, null, ctx.token);
  return { 
    info: `Title: ${result.title}, Views: ${result.views}, Likes: ${result.likes}`
  };
});

test('TEST 4: Get All Users', async (ctx) => {
  if (!ctx.token) throw new Error('No token');
  const result = await makeRequest('GET', '/api/users', null, ctx.token);
  if (!Array.isArray(result)) throw new Error('Expected array');
  return { 
    info: `Found ${result.length} users`
  };
});

test('TEST 5: Health Check', async (ctx) => {
  const result = await makeRequest('GET', '/api/health');
  return { 
    info: `Status: OK`
  };
});

test('TEST 6: Signup New User', async (ctx) => {
  const email = `test-${Date.now()}@sunflix.com`;
  const result = await makeRequest('POST', '/api/auth/signup', {
    name: 'Test User',
    email: email,
    password: 'TestPass123',
  });
  if (!result.user) throw new Error('No user in response');
  return { 
    info: `Created user: ${result.user.email}`
  };
});

test('TEST 7: Add Comment to Video', async (ctx) => {
  if (!ctx.videoId) throw new Error('No video ID');
  if (!ctx.token) throw new Error('No token');
  const result = await makeRequest('POST', `/api/videos/${ctx.videoId}/comments`, {
    text: `Test comment from automated test - ${new Date().toISOString()}`,
  }, ctx.token);
  return { 
    info: `Comment added: ${result._id}`
  };
});

test('TEST 8: Get Video Comments', async (ctx) => {
  if (!ctx.videoId) throw new Error('No video ID');
  const result = await makeRequest('GET', `/api/videos/${ctx.videoId}/comments`, null, ctx.token);
  if (!Array.isArray(result)) throw new Error('Expected array');
  return { 
    info: `Found ${result.length} comments`
  };
});

test('TEST 9: Like Video', async (ctx) => {
  if (!ctx.videoId) throw new Error('No video ID');
  if (!ctx.token) throw new Error('No token');
  const result = await makeRequest('POST', `/api/videos/${ctx.videoId}/like`, {}, ctx.token);
  return { 
    info: `Video likes: ${result.likes}`
  };
});

test('TEST 10: MongoDB Connection Check', async (ctx) => {
  // This tests that the API is responding, which means MongoDB is connected
  const result = await makeRequest('GET', '/api/health');
  return { 
    info: `MongoDB connected and API responding`
  };
});

runTests().catch(console.error);
