import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTests() {
  try {
    let token = null;
    let userId = null;
    let videoId = null;

    // Test 1: Login as admin
    log('\n=== TEST 1: Admin Login ===', 'cyan');
    try {
      const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
        email: 'admin@sunflix.com',
        password: 'admin123',
      });
      
      if (loginRes.data.token && loginRes.data.user) {
        token = loginRes.data.token;
        userId = loginRes.data.user._id;
        log('✓ Admin login successful', 'green');
        log(`  Token: ${token.substring(0, 20)}...`, 'blue');
        log(`  User ID: ${userId}`, 'blue');
      } else {
        log('✗ Login failed: no token or user', 'red');
      }
    } catch (error) {
      log(`✗ Login error: ${error.message}`, 'red');
    }

    // Test 2: Get user profile
    log('\n=== TEST 2: Get User Profile ===', 'cyan');
    try {
      const userRes = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (userRes.data) {
        log('✓ User profile retrieved', 'green');
        log(`  Name: ${userRes.data.name}`, 'blue');
        log(`  Email: ${userRes.data.email}`, 'blue');
        log(`  Role: ${userRes.data.role}`, 'blue');
      }
    } catch (error) {
      log(`✗ User profile error: ${error.message}`, 'red');
    }

    // Test 3: Get all videos
    log('\n=== TEST 3: Get All Videos ===', 'cyan');
    try {
      const videosRes = await axios.get(`${API_URL}/api/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(videosRes.data)) {
        log(`✓ Videos retrieved: ${videosRes.data.length} videos found`, 'green');
        if (videosRes.data.length > 0) {
          videoId = videosRes.data[0]._id;
          log(`  First video: ${videosRes.data[0].title}`, 'blue');
        }
      }
    } catch (error) {
      log(`✗ Videos fetch error: ${error.message}`, 'red');
    }

    // Test 4: Get specific video
    if (videoId) {
      log('\n=== TEST 4: Get Specific Video ===', 'cyan');
      try {
        const videoRes = await axios.get(`${API_URL}/api/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (videoRes.data) {
          log('✓ Video details retrieved', 'green');
          log(`  Title: ${videoRes.data.title}`, 'blue');
          log(`  Category: ${videoRes.data.category}`, 'blue');
          log(`  Views: ${videoRes.data.views}`, 'blue');
        }
      } catch (error) {
        log(`✗ Video details error: ${error.message}`, 'red');
      }

      // Test 5: Like/Unlike video
      log('\n=== TEST 5: Like Video ===', 'cyan');
      try {
        const likeRes = await axios.post(`${API_URL}/api/videos/${videoId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (likeRes.data) {
          log('✓ Like action successful', 'green');
          log(`  Likes: ${likeRes.data.likes}`, 'blue');
        }
      } catch (error) {
        log(`✗ Like action error: ${error.message}`, 'red');
      }

      // Test 6: Add comment
      log('\n=== TEST 6: Add Comment ===', 'cyan');
      try {
        const commentRes = await axios.post(
          `${API_URL}/api/videos/${videoId}/comments`,
          {
            text: `Test comment - ${new Date().toISOString()}`,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (commentRes.data) {
          log('✓ Comment added successfully', 'green');
          log(`  Comment ID: ${commentRes.data._id}`, 'blue');
          log(`  Text: ${commentRes.data.text}`, 'blue');
        }
      } catch (error) {
        log(`✗ Comment error: ${error.message}`, 'red');
      }

      // Test 7: Get comments
      log('\n=== TEST 7: Get Video Comments ===', 'cyan');
      try {
        const commentsRes = await axios.get(
          `${API_URL}/api/videos/${videoId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (Array.isArray(commentsRes.data)) {
          log(`✓ Comments retrieved: ${commentsRes.data.length} comments found`, 'green');
        }
      } catch (error) {
        log(`✗ Comments fetch error: ${error.message}`, 'red');
      }
    }

    // Test 8: Signup new user
    log('\n=== TEST 8: Sign Up New User ===', 'cyan');
    const testEmail = `test-${Date.now()}@sunflix.com`;
    try {
      const signupRes = await axios.post(`${API_URL}/api/auth/signup`, {
        name: 'Test User',
        email: testEmail,
        password: 'TestPassword123',
      });
      
      if (signupRes.data.user) {
        log('✓ User signup successful', 'green');
        log(`  Email: ${signupRes.data.user.email}`, 'blue');
      }
    } catch (error) {
      log(`✗ Signup error: ${error.message}`, 'red');
    }

    // Test 9: Get all users (admin only)
    log('\n=== TEST 9: Get All Users (Admin) ===', 'cyan');
    try {
      const usersRes = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(usersRes.data)) {
        log(`✓ Users retrieved: ${usersRes.data.length} users found`, 'green');
      }
    } catch (error) {
      log(`✗ Users fetch error: ${error.message}`, 'red');
    }

    // Test 10: Health check
    log('\n=== TEST 10: API Health Check ===', 'cyan');
    try {
      const healthRes = await axios.get(`${API_URL}/api/health`);
      if (healthRes.data) {
        log('✓ API is healthy', 'green');
      }
    } catch (error) {
      log(`✗ Health check error: ${error.message}`, 'red');
    }

    log('\n=== TESTING COMPLETE ===\n', 'yellow');
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'red');
  }
}

// Run tests
runTests();
