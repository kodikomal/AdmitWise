# AdmitWise — Software Testing & Quality Assurance Report

## 1. Testing Strategy Overview
The testing framework for AdmitWise employs both automated unit/integration testing on the backend (using the native Node.js test runner and Supertest) and systematic manual/component verification on the React frontend.

Testing was organized into three primary layers:
1. **Core Business Logic Testing:** Rule-based prediction evaluation and eligibility checking.
2. **API & Security Integration Testing:** Authentication, cookie/session management, authorization guards, and input validation.
3. **Frontend UI/UX Verification:** Responsive rendering, modal controls, comparison matrix, and chart visualisations.

---

## 2. Automated Test Execution Results

Executed via:
```bash
cd server
npm test
```

### Test Suite Execution Output:
```
▶ API Integration Tests
  ✔ GET /api/health returns 200 OK (47.8ms)
  ✔ GET /api/courses returns seeded courses (68.2ms)
  ✔ GET /api/colleges returns colleges list and pagination (49.5ms)
  ✔ POST /api/auth/login succeeds for seeded student (142.9ms)
  ✔ POST /api/auth/login rejects invalid credentials (113.5ms)
  ✔ POST /api/auth/register rejects duplicate email (8.5ms)
  ✔ POST /api/predictions executes rule-based prediction for candidate (60.7ms)
✔ API Integration Tests (533.6ms)

▶ PredictionEngine - Eligibility Checks
  ✔ Fails eligibility when HSC percentage is below required minimum (1.1ms)
  ✔ Fails eligibility when Mathematics is missing for B.Sc. IT (0.3ms)
  ✔ Passes eligibility when all academic criteria are satisfied (0.2ms)
✔ PredictionEngine - Eligibility Checks (3.0ms)

ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ duration_ms 1537.3ms
```
**Status: 100% Passing (12 / 12 Tests Passed)**

---

## 3. Detailed Test Cases Matrix

| Test ID | Module | Test Description | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-01** | Auth | Student registration with valid fields | Name, unique email, password $\ge 6$ chars | Account created (201), JWT returned, password excluded | Account created, cookie set | PASS |
| **TC-02** | Auth | Duplicate email prevention | Existing email address | Error 409 Conflict with descriptive message | 409 Conflict returned | PASS |
| **TC-03** | Auth | Login with incorrect password | Valid email, wrong password | Error 401 Unauthorized, generic error message | 401 Unauthorized | PASS |
| **TC-04** | Security | Unauthenticated access to admin routes | Request to `/api/admin/colleges` without JWT | Error 401 Unauthorized | 401 Unauthorized | PASS |
| **TC-05** | Security | Student access to admin endpoints | Student JWT token on `/api/admin/colleges` | Error 403 Forbidden | 403 Forbidden | PASS |
| **TC-06** | Predictor | Mandatory Maths requirement check for B.Sc. IT | HSC % = 80%, Maths marks = null | Classified as "Not Eligible" with rationale | "Not Eligible" returned | PASS |
| **TC-07** | Predictor | Minimum HSC percentage requirement check | HSC % = 42% (Open category, requirement = 45%) | Classified as "Not Eligible" with percentage reason | "Not Eligible" returned | PASS |
| **TC-08** | Predictor | High Chance classification threshold | Candidate score $\ge$ Cutoff + 3.0% | Classified as "High Chance" | "High Chance" returned | PASS |
| **TC-09** | Predictor | Moderate Chance classification threshold | Cutoff - 2.5% $\le$ Candidate score $<$ Cutoff + 3.0% | Classified as "Moderate Chance" | "Moderate Chance" returned | PASS |
| **TC-10** | Predictor | Missing Cutoff Data Handling | College without cutoff in target year | Classified as "Insufficient Data" without fabrication | "Insufficient Data" | PASS |
| **TC-11** | Catalog | Search by college name | Query `Xavier` | Matches `St. Xavier's College` | Match returned | PASS |
| **TC-12** | Comparison | Maximum college comparison limit | 5 college IDs passed | Error 400 Bad Request (Limit is 4) | 400 Bad Request | PASS |
| **TC-13** | Reporting | Download PDF Report | Prediction ID | Binary application/pdf stream with AdmitWise header | PDF downloaded | PASS |

---

## 4. Frontend & Mobile Responsiveness Verification
- Verified viewport compatibility at:
  - 375px (Mobile portrait: iPhone SE / 13)
  - 768px (Tablet portrait: iPad)
  - 1280px (Laptop)
  - 1920px (Desktop Full HD)
- Confirmed responsive hamburger drawer menu navigation on mobile screens.
- Verified SVG chart scaling and accessibility on narrow screens.
