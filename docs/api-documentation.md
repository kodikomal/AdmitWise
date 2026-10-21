# AdmitWise — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### 1.1 Student Registration
- **Route:** `POST /api/auth/register`
- **Access:** Public (Rate limited to 30 req / 15 min)
- **Request Body:**
  ```json
  {
    "name": "Rohan Sharma",
    "email": "rohan@example.com",
    "password": "Password@123"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Student account created successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6724fa10b...",
      "name": "Rohan Sharma",
      "email": "rohan@example.com",
      "role": "student",
      "profileCompletion": 0
    }
  }
  ```

### 1.2 User Login
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "rohan@example.com",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):** Sets HTTP-only cookie `admitwise_token` and returns JWT token in payload.

### 1.3 User Logout
- **Route:** `POST /api/auth/logout`
- **Access:** Public
- **Response (200 OK):** Clears authentication cookie.

### 1.4 Get Current User Profile
- **Route:** `GET /api/auth/me`
- **Access:** Protected (Student or Admin)
- **Response (200 OK):** Returns authenticated user entity without password.

---

## 2. Student Endpoints

### 2.1 Get Student Academic Profile
- **Route:** `GET /api/students/profile`
- **Access:** Protected (Student)

### 2.2 Update Student Academic Profile
- **Route:** `PUT /api/students/profile`
- **Access:** Protected (Student)
- **Request Body:**
  ```json
  {
    "hscPercentage": 84.5,
    "sscPercentage": 88.0,
    "mathsMarks": 78,
    "hscStream": "Science",
    "board": "Maharashtra State Board",
    "category": "Open/General",
    "preferredCity": "Mumbai",
    "annualFeeBudget": 60000
  }
  ```

### 2.3 Student Dashboard Aggregates
- **Route:** `GET /api/students/dashboard`
- **Access:** Protected (Student)
- **Response:** Returns statistics (prediction count, favourites count, profile completion), recent prediction runs, saved colleges, and recommended colleges.

---

## 3. College & Course Catalog Endpoints

### 3.1 Search & Filter Colleges
- **Route:** `GET /api/colleges`
- **Query Parameters:**
  - `search`: Keyword for college name or city
  - `city`: City filter (e.g. "Mumbai", "Thane")
  - `courseId`: Filter by course offered
  - `collegeType`: e.g. "Autonomous", "Government-Aided"
  - `naacGrade`: e.g. "A++", "A"
  - `minFee`, `maxFee`: Fee ranges
  - `page`: Page index (Default: 1)
  - `limit`: Items per page (Default: 9)
  - `sortBy`: `name`, `fees`, `rating`
  - `sortOrder`: `asc`, `desc`

### 3.2 Get College Details
- **Route:** `GET /api/colleges/:id`
- **Response (200 OK):** Returns college metadata, offered courses, and historical cutoffs.

### 3.3 Compare Colleges
- **Route:** `POST /api/colleges/compare`
- **Request Body:**
  ```json
  {
    "collegeIds": ["672...", "673..."],
    "courseId": "674..."
  }
  ```
- **Validation:** 2 to 4 colleges allowed; deduplicates input IDs.

---

## 4. Admission Prediction Endpoints

### 4.1 Run Admission Predictor
- **Route:** `POST /api/predictions`
- **Access:** Public or Authenticated (saves snapshot if logged in)
- **Request Body:**
  ```json
  {
    "courseId": "6724...",
    "hscPercentage": 82.5,
    "sscPercentage": 86.0,
    "mathsMarks": 76,
    "stream": "Science",
    "category": "Open/General",
    "entranceExam": "None / Merit Based",
    "entranceScore": 0,
    "preferredCity": "Mumbai",
    "annualFeeBudget": 60000
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "predictionId": "672a...",
    "prediction": {
      "courseName": "B.Sc. Information Technology",
      "summaryCounts": {
        "highChance": 3,
        "moderateChance": 4,
        "lowChance": 2,
        "insufficientData": 0,
        "notEligible": 0,
        "totalMatched": 9
      },
      "results": [
        {
          "collegeName": "Jai Hind College (Autonomous)",
          "chanceCategory": "Moderate Chance",
          "studentScore": 82.5,
          "cutoffValue": 84.2,
          "scoreDifference": -1.7,
          "reasons": [
            "Your score (82.5%) is slightly below the 2024-2025 Round 1 cutoff (84.2%) by 1.7%. Subsequent merit rounds historically drop by 1-3%."
          ]
        }
      ]
    }
  }
  ```

### 4.2 Download PDF Report
- **Route:** `GET /api/predictions/:id/pdf`
- **Response:** Binary PDF stream (`Content-Type: application/pdf`).

---

## 5. Administration Endpoints (Admin Guarded)

All administrative endpoints require JWT authentication and `role: "admin"`.

- `GET /api/admin/dashboard` — Platform overview, counts, completeness indicators.
- `GET /api/admin/colleges` — Paginated college management catalog.
- `POST /api/admin/colleges` — Create new college.
- `PUT /api/admin/colleges/:id` — Update college.
- `DELETE /api/admin/colleges/:id` — Delete college and associated cutoffs.
- `POST /api/admin/courses` — Create new course.
- `PUT /api/admin/courses/:id` — Update course.
- `DELETE /api/admin/courses/:id` — Delete course (with safety checks).
- `GET /api/admin/cutoffs` — Filter and view cutoffs.
- `POST /api/admin/cutoffs` — Add cutoff with duplicate check.
- `PUT /api/admin/cutoffs/:id` — Edit cutoff.
- `DELETE /api/admin/cutoffs/:id` — Delete cutoff.
- `GET /api/admin/users` — List registered students.
- `PATCH /api/admin/users/:id/toggle-status` — Enable/disable student account.
