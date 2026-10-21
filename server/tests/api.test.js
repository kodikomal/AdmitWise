const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

test('API Integration Tests', async (t) => {
  // Connect before running tests
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admitwise_db');

  await t.test('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(res.body.service, 'AdmitWise API');
  });

  await t.test('GET /api/courses returns seeded courses', async () => {
    const res = await request(app).get('/api/courses');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.courses));
    assert.ok(res.body.courses.length >= 6);
  });

  await t.test('GET /api/colleges returns colleges list and pagination', async () => {
    const res = await request(app).get('/api/colleges?limit=5');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.colleges));
    assert.equal(res.body.pagination.limit, 5);
    assert.ok(res.body.pagination.total >= 15);
  });

  await t.test('POST /api/auth/login succeeds for seeded student', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@admitwise.edu',
      password: 'Student@123password',
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'student');
  });

  await t.test('POST /api/auth/login rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@admitwise.edu',
      password: 'WrongPassword',
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await t.test('POST /api/auth/register rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate Test',
      email: 'student@admitwise.edu',
      password: 'Password123!',
    });
    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
  });

  await t.test('POST /api/predictions executes rule-based prediction for candidate', async () => {
    // Get course ID for B.Sc. IT
    const courseRes = await request(app).get('/api/courses');
    const bscIt = courseRes.body.courses.find((c) => c.shortName === 'B.Sc. IT');
    assert.ok(bscIt);

    const res = await request(app).post('/api/predictions').send({
      courseId: bscIt._id,
      hscPercentage: 85.0,
      sscPercentage: 88.0,
      mathsMarks: 80,
      stream: 'Science',
      category: 'Open/General',
      preferredCity: 'Mumbai',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.prediction);
    assert.ok(res.body.prediction.results.length > 0);
    assert.ok(res.body.prediction.summaryCounts.totalMatched > 0);
  });

  // Disconnect after tests
  t.after(async () => {
    await mongoose.disconnect();
  });
});
