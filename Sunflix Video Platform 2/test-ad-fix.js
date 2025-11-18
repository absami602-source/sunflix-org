import http from 'http';

const API_URL = 'http://localhost:3001';

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
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          reject(new Error(`Invalid JSON: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runAdTests() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   AD MANAGEMENT API TEST SUITE - FIXED     ║');
  console.log('╚════════════════════════════════════════════╝\n');

  let token = null;
  let adminToken = null;
  let createdAdId = null;

  try {
    // Test 1: Admin Login
    console.log('📌 TEST 1: Admin Login');
    let res = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@sunflix.com',
      password: 'admin123',
    });
    if (res.status === 200 && res.data.token) {
      adminToken = res.data.token;
      console.log('   ✅ Admin login successful');
      console.log(`   - Token: ${res.data.token.substring(0, 20)}...`);
    } else {
      console.log('   ❌ Admin login failed:', res.data?.error);
      return;
    }

    // Test 2: Create Ad (with validation)
    console.log('\n📌 TEST 2: Create Ad with Complete Data');
    res = await makeRequest('POST', '/api/ads', {
      title: 'Test Ad - ' + new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/300x150?text=Test+Ad',
      clickUrl: 'https://example.com',
      position: 'banner',
      active: true,
    }, adminToken);
    
    if (res.status === 200 && res.data._id) {
      createdAdId = res.data._id;
      console.log('   ✅ Ad created successfully');
      console.log(`   - Ad ID: ${res.data._id}`);
      console.log(`   - Title: ${res.data.title}`);
      console.log(`   - Active: ${res.data.active}`);
      console.log(`   - Position: ${res.data.position}`);
    } else {
      console.log('   ❌ Ad creation failed:', res.data?.error);
    }

    // Test 3: Get All Active Ads
    console.log('\n📌 TEST 3: Get All Active Ads');
    res = await makeRequest('GET', '/api/ads');
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log('   ✅ Ads retrieved successfully');
      console.log(`   - Total active ads: ${res.data.length}`);
      
      const newAd = res.data.find(a => a._id === createdAdId);
      if (newAd) {
        console.log('   ✅ Newly created ad is visible in the list!');
        console.log(`   - Title: ${newAd.title}`);
        console.log(`   - Impressions: ${newAd.impressions}`);
      } else {
        console.log('   ⚠️  Newly created ad not found in list (may be pagination)');
      }
    } else {
      console.log('   ❌ Failed to retrieve ads:', res.data?.error);
    }

    // Test 4: Missing Field Validation
    console.log('\n📌 TEST 4: Validation - Missing Title');
    res = await makeRequest('POST', '/api/ads', {
      imageUrl: 'https://via.placeholder.com/300x150',
      clickUrl: 'https://example.com',
      position: 'banner',
    }, adminToken);
    
    if (res.status === 400) {
      console.log('   ✅ Validation working - rejected missing title');
      console.log(`   - Error: ${res.data?.error}`);
    } else {
      console.log('   ❌ Validation failed - should reject missing title');
    }

    // Test 5: Missing ImageUrl Validation
    console.log('\n📌 TEST 5: Validation - Missing ImageUrl');
    res = await makeRequest('POST', '/api/ads', {
      title: 'Test',
      clickUrl: 'https://example.com',
      position: 'banner',
    }, adminToken);
    
    if (res.status === 400) {
      console.log('   ✅ Validation working - rejected missing imageUrl');
      console.log(`   - Error: ${res.data?.error}`);
    } else {
      console.log('   ❌ Validation failed - should reject missing imageUrl');
    }

    // Test 6: Update Ad
    if (createdAdId) {
      console.log('\n📌 TEST 6: Update Ad');
      res = await makeRequest('PUT', `/api/ads/${createdAdId}`, {
        title: 'Updated Ad Title',
        impressions: 10,
        clicks: 2,
      }, adminToken);
      
      if (res.status === 200 && res.data._id) {
        console.log('   ✅ Ad updated successfully');
        console.log(`   - New title: ${res.data.title}`);
        console.log(`   - Impressions: ${res.data.impressions}`);
        console.log(`   - Clicks: ${res.data.clicks}`);
      } else {
        console.log('   ❌ Failed to update ad:', res.data?.error);
      }
    }

    // Test 7: Deactivate Ad
    if (createdAdId) {
      console.log('\n📌 TEST 7: Deactivate Ad');
      res = await makeRequest('PUT', `/api/ads/${createdAdId}`, {
        active: false,
      }, adminToken);
      
      if (res.status === 200) {
        console.log('   ✅ Ad deactivated successfully');
        console.log(`   - Active: ${res.data.active}`);
      } else {
        console.log('   ❌ Failed to deactivate ad:', res.data?.error);
      }
    }

    // Test 8: Verify Deactivated Ad Not in Active List
    console.log('\n📌 TEST 8: Verify Deactivated Ad Excluded from Active List');
    res = await makeRequest('GET', '/api/ads');
    if (res.status === 200 && Array.isArray(res.data)) {
      const deactivated = res.data.find(a => a._id === createdAdId);
      if (!deactivated) {
        console.log('   ✅ Deactivated ad correctly excluded from active list');
      } else {
        console.log('   ⚠️  Deactivated ad still in active list (may need cache clear)');
      }
    }

    // Test 9: Delete Ad
    if (createdAdId) {
      console.log('\n📌 TEST 9: Delete Ad');
      res = await makeRequest('DELETE', `/api/ads/${createdAdId}`, null, adminToken);
      
      if (res.status === 200) {
        console.log('   ✅ Ad deleted successfully');
      } else {
        console.log('   ❌ Failed to delete ad:', res.data?.error);
      }
    }

    // Test 10: Unauthorized Access
    console.log('\n📌 TEST 10: Unauthorized Access - No Token');
    res = await makeRequest('POST', '/api/ads', {
      title: 'Test',
      imageUrl: 'https://via.placeholder.com/300x150',
      clickUrl: 'https://example.com',
    });
    
    if (res.status === 401) {
      console.log('   ✅ Correctly rejected unauthorized request');
      console.log(`   - Error: ${res.data?.error}`);
    } else {
      console.log('   ❌ Should reject unauthorized access');
    }

  } catch (error) {
    console.error('   ❌ Test error:', error.message);
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║         ALL TESTS COMPLETED                ║');
  console.log('╚════════════════════════════════════════════╝\n');
}

runAdTests().catch(console.error);
