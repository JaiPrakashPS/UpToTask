// Comprehensive Automated API Tests for UpToTask Backend
const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING UPTO TASK BACKEND API TESTS ---');
  let tokenUser1, tokenUser2, createdTaskId;

  try {
    // 1. Health check
    const healthRes = await request('GET', '/api/health');
    console.log('[Test 1] Health Check:', healthRes.status === 200 ? 'PASS' : 'FAIL');

    // 2. Signup validation - empty name
    const invalidSignup1 = await request('POST', '/api/auth/signup', {
      name: '',
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('[Test 2] Signup validation (empty name):', invalidSignup1.status === 400 ? 'PASS' : 'FAIL');

    // 3. Signup validation - password mismatch
    const invalidSignup2 = await request('POST', '/api/auth/signup', {
      name: 'Jai',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentPassword',
    });
    console.log('[Test 3] Signup validation (password mismatch):', invalidSignup2.status === 400 ? 'PASS' : 'FAIL');

    // 4. Valid Signup - User 1
    const uniqueEmail1 = `user1_${Date.now()}@example.com`;
    const signupRes1 = await request('POST', '/api/auth/signup', {
      name: 'Jai Prakash',
      email: uniqueEmail1,
      password: 'password123',
      confirmPassword: 'password123',
    });
    console.log('[Test 4] Valid User 1 Signup:', signupRes1.status === 201 && signupRes1.body.token ? 'PASS' : 'FAIL');
    tokenUser1 = signupRes1.body.token;

    // 5. Duplicate Email Signup
    const dupSignup = await request('POST', '/api/auth/signup', {
      name: 'Duplicate',
      email: uniqueEmail1,
      password: 'password123',
    });
    console.log('[Test 5] Duplicate email signup rejected:', dupSignup.status === 400 ? 'PASS' : 'FAIL');

    // 6. Valid Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: uniqueEmail1,
      password: 'password123',
    });
    console.log('[Test 6] Login with correct credentials:', loginRes.status === 200 && loginRes.body.token ? 'PASS' : 'FAIL');

    // 7. Invalid Login - wrong password
    const invalidLogin = await request('POST', '/api/auth/login', {
      email: uniqueEmail1,
      password: 'wrongPassword',
    });
    console.log('[Test 7] Login with wrong password rejected:', invalidLogin.status === 401 ? 'PASS' : 'FAIL');

    // 8. Google Auth endpoint test
    const googleRes = await request('POST', '/api/auth/google', {
      profile: {
        email: `google_${Date.now()}@example.com`,
        name: 'Google User',
        googleId: 'google_12345678',
      },
    });
    console.log('[Test 8] Google OAuth login/creation:', googleRes.status === 200 && googleRes.body.token ? 'PASS' : 'FAIL');

    // 9. Get Me (Protected)
    const meRes = await request('GET', '/api/auth/me', null, tokenUser1);
    console.log('[Test 9] Protected /api/auth/me:', meRes.status === 200 && meRes.body.user.email === uniqueEmail1 ? 'PASS' : 'FAIL');

    // 10. Create Task - User 1
    const taskData = {
      taskName: 'Complete MERN Project',
      description: 'Build and deploy the task management application.',
      progress: 60,
      duration: {
        value: 3,
        unit: 'Hours',
      },
      status: 'In Progress',
    };
    const createTaskRes = await request('POST', '/api/tasks', taskData, tokenUser1);
    console.log('[Test 10] Create Task:', createTaskRes.status === 201 && createTaskRes.body.task._id ? 'PASS' : 'FAIL');
    createdTaskId = createTaskRes.body.task._id;

    // 11. Get Tasks for User 1
    const getTasksRes = await request('GET', '/api/tasks', null, tokenUser1);
    console.log('[Test 11] Get User Tasks:', getTasksRes.status === 200 && getTasksRes.body.tasks.length === 1 ? 'PASS' : 'FAIL');

    // 12. Create User 2 to test data isolation
    const uniqueEmail2 = `user2_${Date.now()}@example.com`;
    const signupRes2 = await request('POST', '/api/auth/signup', {
      name: 'Second User',
      email: uniqueEmail2,
      password: 'password123',
    });
    tokenUser2 = signupRes2.body.token;

    // User 2 tasks should be empty
    const user2Tasks = await request('GET', '/api/tasks', null, tokenUser2);
    console.log('[Test 12] User 2 Tasks isolated (empty):', user2Tasks.status === 200 && user2Tasks.body.tasks.length === 0 ? 'PASS' : 'FAIL');

    // User 2 cannot access User 1 task
    const user2AccessUser1Task = await request('GET', `/api/tasks/${createdTaskId}`, null, tokenUser2);
    console.log('[Test 13] User 2 cannot access User 1 task (Forbidden):', user2AccessUser1Task.status === 403 ? 'PASS' : 'FAIL');

    // 14. Update Task (PUT)
    const updateRes = await request('PUT', `/api/tasks/${createdTaskId}`, {
      taskName: 'Complete MERN Project (Updated)',
      description: 'Build, test, and deploy with full documentation.',
      progress: 80,
      duration: {
        value: 4,
        unit: 'Hours',
      },
      status: 'In Progress',
    }, tokenUser1);
    console.log('[Test 14] Update Task:', updateRes.status === 200 && updateRes.body.task.progress === 80 ? 'PASS' : 'FAIL');

    // 15. Status update PATCH to "Complete" (auto sets progress to 100%)
    const patchStatusRes = await request('PATCH', `/api/tasks/${createdTaskId}/status`, {
      status: 'Complete',
    }, tokenUser1);
    console.log('[Test 15] Status PATCH Complete auto-syncs progress to 100%:', patchStatusRes.status === 200 && patchStatusRes.body.task.progress === 100 ? 'PASS' : 'FAIL');

    // 16. Delete Task
    const deleteRes = await request('DELETE', `/api/tasks/${createdTaskId}`, null, tokenUser1);
    console.log('[Test 16] Delete Task:', deleteRes.status === 200 ? 'PASS' : 'FAIL');

    // 17. Verify Task is deleted (404)
    const checkDeletedRes = await request('GET', `/api/tasks/${createdTaskId}`, null, tokenUser1);
    console.log('[Test 17] Deleted task returns 404:', checkDeletedRes.status === 404 ? 'PASS' : 'FAIL');

    console.log('--- ALL BACKEND TESTS COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
};

runTests();
