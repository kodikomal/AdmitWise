require('dotenv').config();
const mongoose = require('mongoose');
const { User, College, Course, Cutoff, AdmissionGuidance } = require('../src/models');

const seedDatabase = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admitwise_db';
    console.log(`Connecting to MongoDB at ${connString}...`);
    await mongoose.connect(connString);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      College.deleteMany({}),
      Course.deleteMany({}),
      Cutoff.deleteMany({}),
      AdmissionGuidance.deleteMany({}),
    ]);
    console.log('Collections cleared.');

    // 1. Create Default Users (Demo Student and Demo Admin)
    console.log('Seeding users...');
    const adminUser = await User.create({
      name: 'AdmitWise Administrator',
      email: 'admin@admitwise.edu',
      password: 'Admin@123password',
      role: 'admin',
      isActive: true,
    });

    const demoStudent = await User.create({
      name: 'Rohan Sharma',
      email: 'student@admitwise.edu',
      password: 'Student@123password',
      role: 'student',
      isActive: true,
      academicProfile: {
        sscPercentage: 86.4,
        hscPercentage: 82.5,
        board: 'Maharashtra State Board',
        passingYear: 2024,
        hscStream: 'Science',
        mathsMarks: 78,
        entranceExam: 'MHT-CET',
        entranceScore: 91.2,
        category: 'Open/General',
        preferredCourse: 'B.Sc. Information Technology',
        preferredCity: 'Mumbai',
        annualFeeBudget: 60000,
        collegeTypePreference: 'Any',
      },
    });

    console.log('Users created: Admin (admin@admitwise.edu) & Student (student@admitwise.edu)');

    // 2. Create Courses
    console.log('Seeding courses...');
    const courses = await Course.create([
      {
        name: 'B.Sc. Information Technology',
        shortName: 'B.Sc. IT',
        degreeType: 'Undergraduate',
        stream: 'Information Technology',
        durationYears: 3,
        admissionBasis: 'HSC_MERIT',
        eligibilityCriteria: {
          minHscPercentage: 45,
          minHscReservedPercentage: 40,
          requiresMathsInHsc: true,
          minMathsMarks: 35,
          allowedStreams: ['Science', 'Diploma / Polytechnic'],
          entranceRequired: false,
          notes: 'Mandatory Mathematics subject in HSC as per Mumbai University Circular.',
        },
        description:
          'Three-year undergraduate degree focusing on software development, database architecture, network security, cloud computing, and web technologies.',
        careerScope: [
          'Full-Stack Web Developer',
          'Database Administrator',
          'DevOps Engineer',
          'Cybersecurity Analyst',
          'Cloud Solutions Specialist',
        ],
      },
      {
        name: 'B.Sc. Computer Science',
        shortName: 'B.Sc. CS',
        degreeType: 'Undergraduate',
        stream: 'Computer Science',
        durationYears: 3,
        admissionBasis: 'HSC_MERIT',
        eligibilityCriteria: {
          minHscPercentage: 45,
          minHscReservedPercentage: 40,
          requiresMathsInHsc: true,
          minMathsMarks: 35,
          allowedStreams: ['Science'],
          entranceRequired: false,
          notes: 'Mathematics is compulsory in HSC Science.',
        },
        description:
          'Comprehensive foundations in algorithms, theoretical computer science, operating systems, data structures, and machine learning.',
        careerScope: ['Software Engineer', 'Data Analyst', 'Systems Architect', 'AI Researcher'],
      },
      {
        name: 'B.Tech. Computer Engineering',
        shortName: 'B.Tech CE',
        degreeType: 'Undergraduate',
        stream: 'Engineering',
        durationYears: 4,
        admissionBasis: 'ENTRANCE_EXAM',
        eligibilityCriteria: {
          minHscPercentage: 45,
          minHscReservedPercentage: 40,
          requiresMathsInHsc: true,
          minMathsMarks: 45,
          allowedStreams: ['Science'],
          entranceRequired: true,
          acceptedExams: ['MHT-CET', 'JEE Main'],
          minEntrancePercentile: 50,
          notes: 'Admission administered through Maharashtra State CET Cell Centralised Admission Process (CAP).',
        },
        description:
          'Four-year accredited engineering degree covering computer hardware architectures, distributed systems, operating systems, compiler design, and software engineering.',
        careerScope: ['Core Software Developer', 'Hardware/Firmware Engineer', 'Systems Programmer', 'Cloud Architect'],
      },
      {
        name: 'B.Tech. Artificial Intelligence & Data Science',
        shortName: 'B.Tech AI&DS',
        degreeType: 'Undergraduate',
        stream: 'Engineering',
        durationYears: 4,
        admissionBasis: 'ENTRANCE_EXAM',
        eligibilityCriteria: {
          minHscPercentage: 45,
          minHscReservedPercentage: 40,
          requiresMathsInHsc: true,
          minMathsMarks: 45,
          allowedStreams: ['Science'],
          entranceRequired: true,
          acceptedExams: ['MHT-CET', 'JEE Main'],
          minEntrancePercentile: 50,
          notes: 'Administered through State CET Cell CAP Rounds.',
        },
        description:
          'Specialised engineering curriculum in applied artificial intelligence, neural networks, computer vision, natural language processing, and big data engineering.',
        careerScope: ['Machine Learning Engineer', 'Data Scientist', 'AI Product Developer', 'NLP Specialist'],
      },
      {
        name: 'Bachelor of Management Studies (BMS)',
        shortName: 'BMS',
        degreeType: 'Undergraduate',
        stream: 'Management',
        durationYears: 3,
        admissionBasis: 'HSC_MERIT',
        eligibilityCriteria: {
          minHscPercentage: 45,
          minHscReservedPercentage: 40,
          requiresMathsInHsc: false,
          allowedStreams: ['Commerce', 'Science', 'Arts'],
          entranceRequired: false,
          notes: 'Open to Commerce, Arts, and Science students as per university quota allocation.',
        },
        description:
          'Undergraduate management program providing intensive knowledge of marketing, finance, human resources, and business strategy.',
        careerScope: ['Business Development Executive', 'Financial Analyst', 'Marketing Specialist', 'HR Executive'],
      },
      {
        name: 'Bachelor of Commerce (B.Com)',
        shortName: 'B.Com',
        degreeType: 'Undergraduate',
        stream: 'Commerce',
        durationYears: 3,
        admissionBasis: 'HSC_MERIT',
        eligibilityCriteria: {
          minHscPercentage: 40,
          minHscReservedPercentage: 35,
          requiresMathsInHsc: false,
          allowedStreams: ['Commerce', 'Science', 'Arts'],
          entranceRequired: false,
        },
        description:
          'Classic commerce education in financial accounting, auditing, commercial law, taxation, and business economics.',
        careerScope: ['Accountant', 'Tax Consultant', 'Banking Associate', 'Financial Planner'],
      },
    ]);

    const courseMap = {};
    courses.forEach((c) => {
      courseMap[c.shortName] = c._id;
    });
    console.log(`Created ${courses.length} courses.`);

    // 3. Create Colleges in Mumbai, Navi Mumbai, Thane, Pune
    console.log('Seeding colleges...');
    const collegesData = [
      {
        name: "St. Xavier's College (Autonomous)",
        code: "XAV-01",
        address: "5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Maharaj Terminus",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai (Autonomous)",
        naacGrade: "A++",
        nbaAccredited: false,
        officialWebsite: "https://xaviers.ac",
        admissionPortalUrl: "https://xaviers.ac/admissions",
        contactEmail: "info@xaviers.edu",
        contactPhone: "022-22620661",
        establishedYear: 1869,
        campusArea: "3 Acres Heritage Campus",
        facilities: ["Historic Library", "Computer Laboratories", "Auditorium", "Audio-Visual Centre", "Hostel"],
        annualFeesApprox: 42000,
        summary:
          "Prestigious premier institution offering top-tier undergraduate education with autonomy, renowned faculty, and high academic standards.",
        isVerified: true,
        dataSource: "Mumbai University Merit List 2024 & Xavier's Official Prospectus",
        isFeatured: true,
        rating: 4.8,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "Jai Hind College (Autonomous)",
        code: "JHC-02",
        address: "23-24, Backbay Reclamation, 'A' Road, Churchgate",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400020",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai (Autonomous)",
        naacGrade: "A++",
        nbaAccredited: false,
        officialWebsite: "https://www.jaihindcollege.com",
        admissionPortalUrl: "https://www.jaihindcollege.com/admissions",
        contactEmail: "contactus@jaihindcollege.com",
        contactPhone: "022-22041095",
        establishedYear: 1948,
        campusArea: "South Mumbai Academic Hub",
        facilities: ["Advanced IT Labs", "Incubation Centre", "Digital Library", "Conference Halls"],
        annualFeesApprox: 48000,
        summary:
          "Renowned autonomous college in South Mumbai known for innovation in IT, management sciences, and corporate placements.",
        isVerified: true,
        dataSource: "Jai Hind Merit List & MU CAP Archive",
        isFeatured: true,
        rating: 4.7,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['BMS'], courseMap['B.Sc. CS'], courseMap['B.Com']],
      },
      {
        name: "Mithibai College of Arts, Chauhan Institute of Science (Autonomous)",
        code: "MC-03",
        address: "Bhaktivedanta Swami Marg, Gulmohar Road, Suvarna Nagar, Vile Parle (West)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400056",
        collegeType: "Autonomous",
        universityAffiliation: "SVKM / University of Mumbai",
        naacGrade: "A",
        nbaAccredited: false,
        officialWebsite: "https://www.mithibai.ac.in",
        admissionPortalUrl: "https://www.mithibai.ac.in/admissions",
        contactEmail: "principal@mithibai.ac.in",
        contactPhone: "022-42339000",
        establishedYear: 1961,
        campusArea: "Vile Parle Education Complex",
        facilities: ["Modern Computer Labs", "Air-conditioned Classrooms", "Extensive Library", "Auditorium"],
        annualFeesApprox: 45000,
        summary:
          "Flagship SVKM institution with strong industry integration, dynamic student culture, and consistently high academic cutoffs.",
        isVerified: true,
        dataSource: "Mithibai College Published Merit Lists 2024",
        isFeatured: true,
        rating: 4.6,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "K. J. Somaiya College of Science and Commerce (Autonomous)",
        code: "KJS-04",
        address: "Somaiya Vidyavihar University Campus, Vidyavihar (East)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400077",
        collegeType: "Autonomous",
        universityAffiliation: "Somaiya Vidyavihar / University of Mumbai",
        naacGrade: "A",
        nbaAccredited: true,
        officialWebsite: "https://kjssc.somaiya.edu",
        admissionPortalUrl: "https://admissions.somaiya.edu",
        contactEmail: "info.kjssc@somaiya.edu",
        contactPhone: "022-67283800",
        establishedYear: 1960,
        campusArea: "60-Acre Lush Green Campus",
        facilities: ["Athletics Complex", "Innovation Labs", "Hostel Facilities", "Multiple Cafeterias", "Central Library"],
        annualFeesApprox: 38000,
        summary:
          "Expansive 60-acre campus offering modern research facilities, comprehensive degree tracks, and active placement cell.",
        isVerified: true,
        dataSource: "Somaiya Admission Records 2024",
        isFeatured: true,
        rating: 4.5,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "Veermata Jijabai Technological Institute (VJTI Mumbai)",
        code: "VJTI-05",
        address: "H.R. Mahajani Marg, Matunga (East)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400019",
        collegeType: "Government-Aided",
        universityAffiliation: "Autonomous / University of Mumbai",
        naacGrade: "A+",
        nbaAccredited: true,
        officialWebsite: "https://vjti.ac.in",
        admissionPortalUrl: "https://cetcell.mahacet.org",
        contactEmail: "director@vjti.ac.in",
        contactPhone: "022-24198101",
        establishedYear: 1887,
        campusArea: "16-Acre Matunga Campus",
        facilities: ["High Performance Computing Lab", "Robotics Center", "Residential Hostels", "Gymkhana", "Placement Cell"],
        annualFeesApprox: 85000,
        summary:
          "One of Asia's oldest and most prestigious engineering institutions, recognized for exceptional research, elite placements, and top MHT-CET ranks.",
        isVerified: true,
        dataSource: "Maharashtra State CET Cell CAP Round 1 2024 Official Cutoff",
        isFeatured: true,
        rating: 4.9,
        coursesOffered: [courseMap['B.Tech CE'], courseMap['B.Tech AI&DS']],
      },
      {
        name: "Sardar Patel Institute of Technology (SPIT Autonomous)",
        code: "SPIT-06",
        address: "Bhavan's Campus, Munshi Nagar, Andheri (West)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        collegeType: "Autonomous",
        universityAffiliation: "Autonomous / University of Mumbai",
        naacGrade: "A+",
        nbaAccredited: true,
        officialWebsite: "https://www.spit.ac.in",
        admissionPortalUrl: "https://cetcell.mahacet.org",
        contactEmail: "principal@spit.ac.in",
        contactPhone: "022-26707440",
        establishedYear: 2005,
        campusArea: "Bhavan's Campus, Andheri",
        facilities: ["Advanced AI/ML Labs", "Incubation Hub", "Digital Library", "Seminar Halls"],
        annualFeesApprox: 175000,
        summary:
          "Elite autonomous engineering college renowned for excellence in Computer Engineering and Data Science with extraordinary tier-1 placements.",
        isVerified: true,
        dataSource: "State CET Cell CAP Allotment Data 2024",
        isFeatured: true,
        rating: 4.8,
        coursesOffered: [courseMap['B.Tech CE'], courseMap['B.Tech AI&DS']],
      },
      {
        name: "Bhavan's College (Autonomous)",
        code: "BHC-07",
        address: "Munshi Nagar, Andheri (West)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        collegeType: "Private-Aided",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A",
        nbaAccredited: false,
        officialWebsite: "https://bhavans.ac.in",
        admissionPortalUrl: "https://bhavans.ac.in/admission",
        contactEmail: "bhavans@bhavans.ac.in",
        contactPhone: "022-26256451",
        establishedYear: 1946,
        campusArea: "45-Acre Andheri Complex",
        facilities: ["Botanical Garden", "Lake & Sports Fields", "IT Computer Labs", "Auditorium"],
        annualFeesApprox: 32000,
        summary:
          "Established institution located in western suburbs offering quality science and IT programs with an expansive green campus.",
        isVerified: true,
        dataSource: "Mumbai University Degree College Merit Lists 2024",
        isFeatured: false,
        rating: 4.2,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "Thakur College of Science and Commerce (Autonomous)",
        code: "TCSC-08",
        address: "Shyamnarayan Thakur Marg, Thakur Village, Kandivali (East)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400101",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A+",
        nbaAccredited: false,
        officialWebsite: "https://www.tcsc.edu.in",
        admissionPortalUrl: "https://tcsc.edu.in/admission-portal",
        contactEmail: "tcsc@thakureducation.org",
        contactPhone: "022-28870627",
        establishedYear: 1997,
        campusArea: "Thakur Complex, Kandivali",
        facilities: ["High-Tech Media Labs", "Computer Centers", "Research Wings", "Indoor Sports Arena"],
        annualFeesApprox: 46000,
        summary:
          "High-ranking suburban autonomous college with state-of-the-art computer labs, coding clubs, and strong technical education.",
        isVerified: true,
        dataSource: "Thakur College Official Merit List 2024",
        isFeatured: false,
        rating: 4.3,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "Vivekanand Education Society's Institute of Technology (VESIT)",
        code: "VESIT-09",
        address: "Hashu Advani Memorial Complex, Collector's Colony, Chembur",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400074",
        collegeType: "Private-Unaided",
        universityAffiliation: "Autonomous / University of Mumbai",
        naacGrade: "A",
        nbaAccredited: true,
        officialWebsite: "https://vesit.ves.ac.in",
        admissionPortalUrl: "https://vesit.ves.ac.in/admission",
        contactEmail: "vesit@ves.ac.in",
        contactPhone: "022-61532532",
        establishedYear: 1984,
        campusArea: "Chembur Educational Hub",
        facilities: ["Instrumentation Labs", "Makerspace", "Hostel", "Placement Cell", "Language Lab"],
        annualFeesApprox: 135000,
        summary:
          "Prominent technical institute in eastern suburbs noted for disciplined academic culture, strong engineering foundation, and consistent campus recruitment.",
        isVerified: true,
        dataSource: "DTE Maharashtra CAP Allotment Rounds 2024",
        isFeatured: false,
        rating: 4.4,
        coursesOffered: [courseMap['B.Tech CE'], courseMap['B.Tech AI&DS']],
      },
      {
        name: "R. A. Podar College of Commerce and Economics (Autonomous)",
        code: "RAP-10",
        address: "L. N. Road, Matunga (Central)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400019",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A+",
        nbaAccredited: false,
        officialWebsite: "https://www.rapodar.ac.in",
        admissionPortalUrl: "https://www.rapodar.ac.in/admissions",
        contactEmail: "podarcol@vsnl.net",
        contactPhone: "022-24143178",
        establishedYear: 1941,
        campusArea: "Matunga Commercial Campus",
        facilities: ["Podar Heritage Hall", "Modern Computer Hub", "Business Incubation", "Rich Commerce Library"],
        annualFeesApprox: 24000,
        summary:
          "Benchmark commerce institution producing top-rankers, chartered accountants, financial leaders, and corporate strategists.",
        isVerified: true,
        dataSource: "Podar College Merit List 2024",
        isFeatured: true,
        rating: 4.7,
        coursesOffered: [courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "Fr. Conceicao Rodrigues College of Engineering (CRCE Bandra)",
        code: "CRCE-11",
        address: "Fr. Agnel Ashram, Bandstand, Bandra (West)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        collegeType: "Private-Unaided",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A",
        nbaAccredited: true,
        officialWebsite: "https://www.frcrce.ac.in",
        admissionPortalUrl: "https://cetcell.mahacet.org",
        contactEmail: "crce@fragnel.edu.in",
        contactPhone: "022-67114000",
        establishedYear: 1984,
        campusArea: "Scenic Bandstand Campus, Bandra",
        facilities: ["Ocean-Facing Campus", "Robotics & IoT Labs", "High Speed Fiber WiFi", "Seminar Auditorium"],
        annualFeesApprox: 155000,
        summary:
          "High-performing engineering college located at Bandra Bandstand with great industry reputation in Computer and AI engineering.",
        isVerified: true,
        dataSource: "CET Cell CAP Allotment 2024",
        isFeatured: false,
        rating: 4.5,
        coursesOffered: [courseMap['B.Tech CE'], courseMap['B.Tech AI&DS']],
      },
      {
        name: "SIES College of Arts, Science & Commerce (Autonomous)",
        code: "SIES-12",
        address: "Jain Society, Sion (West)",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400022",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A+",
        nbaAccredited: false,
        officialWebsite: "https://siesascs.edu.in",
        admissionPortalUrl: "https://siesascs.edu.in/admission",
        contactEmail: "siesascs@sies.edu.in",
        contactPhone: "022-24010051",
        establishedYear: 1960,
        campusArea: "Sion Campus",
        facilities: ["Data Analytics Lab", "Digital Library", "Auditorium", "Canteen"],
        annualFeesApprox: 34000,
        summary:
          "Prominent institution in central Mumbai with excellent track records in B.Sc. IT, B.Sc. CS, and management disciplines.",
        isVerified: true,
        dataSource: "SIES Published Merit Records 2024",
        isFeatured: false,
        rating: 4.3,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "D. G. Ruparel College of Arts, Science and Commerce",
        code: "DGR-13",
        address: "Senapati Bapat Marg, Mahim",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400016",
        collegeType: "Private-Aided",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A",
        nbaAccredited: false,
        officialWebsite: "https://www.ruparel.edu",
        admissionPortalUrl: "https://ruparel.edu/admissions",
        contactEmail: "principal@ruparel.edu",
        contactPhone: "022-24303733",
        establishedYear: 1952,
        campusArea: "10-Acre Campus in Central Mumbai",
        facilities: ["Botanical Garden", "Cricket Ground", "IT Labs", "Auditorium", "Library"],
        annualFeesApprox: 29000,
        summary:
          "Traditional powerhouse of academic excellence in central Mumbai with lush campus and competitive cutoff ranks for science and IT.",
        isVerified: true,
        dataSource: "Mumbai University First & Second Merit Lists 2024",
        isFeatured: false,
        rating: 4.4,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "B. K. Birla College of Arts, Science and Commerce (Autonomous)",
        code: "BKB-14",
        address: "Birla College Road, Kalyan (West)",
        city: "Thane",
        state: "Maharashtra",
        pincode: "421301",
        collegeType: "Autonomous",
        universityAffiliation: "University of Mumbai",
        naacGrade: "A++",
        nbaAccredited: false,
        officialWebsite: "https://www.bkbirlacollegekalyan.com",
        admissionPortalUrl: "https://www.bkbirlacollegekalyan.com/admissions",
        contactEmail: "principal@bkbirlacollegekalyan.com",
        contactPhone: "0251-2231294",
        establishedYear: 1972,
        campusArea: "20-Acre Kalyan Campus",
        facilities: ["Biotechnology Labs", "IT Computer Centers", "Huge Library", "Sports Complex"],
        annualFeesApprox: 31000,
        summary:
          "Premier multi-faculty autonomous institution in the Thane / Kalyan district with NAAC A++ accreditation and top-notch IT departments.",
        isVerified: true,
        dataSource: "Birla College Merit Lists 2024",
        isFeatured: false,
        rating: 4.4,
        coursesOffered: [courseMap['B.Sc. IT'], courseMap['B.Sc. CS'], courseMap['BMS'], courseMap['B.Com']],
      },
      {
        name: "DY Patil College of Engineering and Technology",
        code: "DYP-15",
        address: "Sector 7, Nerul",
        city: "Navi Mumbai",
        state: "Maharashtra",
        pincode: "400706",
        collegeType: "Private-Unaided",
        universityAffiliation: "University of Mumbai / DY Patil Deemed",
        naacGrade: "A",
        nbaAccredited: true,
        officialWebsite: "https://dypatil.edu/engineering",
        admissionPortalUrl: "https://dypatil.edu/admissions",
        contactEmail: "engg@dypatil.edu",
        contactPhone: "022-27709505",
        establishedYear: 1983,
        campusArea: "Sector 7 Educational City",
        facilities: ["Stadium Access", "Specialised AI Labs", "Modern Hostels", "Placement Cell"],
        annualFeesApprox: 140000,
        summary:
          "Major technical hub in Navi Mumbai offering advanced engineering infrastructure and career placement opportunities.",
        isVerified: true,
        dataSource: "State CET Cell CAP Allotments 2024",
        isFeatured: false,
        rating: 4.3,
        coursesOffered: [courseMap['B.Tech CE'], courseMap['B.Tech AI&DS'], courseMap['B.Sc. IT']],
      },
    ];

    const colleges = await College.create(collegesData);
    const collegeMap = {};
    colleges.forEach((col) => {
      collegeMap[col.name] = col._id;
    });
    console.log(`Created ${colleges.length} colleges.`);

    // 4. Create Historical Cutoffs
    console.log('Seeding historical cutoffs...');
    const cutoffsData = [
      // St. Xavier's College - B.Sc. IT
      {
        college: collegeMap["St. Xavier's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 88.5,
        annualFees: 42000,
        source: "St. Xavier's Official Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["St. Xavier's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 2',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 86.8,
        annualFees: 42000,
        source: "St. Xavier's Official Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["St. Xavier's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 84.0,
        annualFees: 42000,
        source: "St. Xavier's Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["St. Xavier's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'SC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 79.5,
        annualFees: 12000,
        source: "St. Xavier's Merit List 2024",
        isVerified: true,
      },

      // Jai Hind College - B.Sc. IT
      {
        college: collegeMap["Jai Hind College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 84.2,
        annualFees: 48000,
        source: "Jai Hind College Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Jai Hind College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 80.5,
        annualFees: 48000,
        source: "Jai Hind College Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Jai Hind College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'SC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 75.0,
        annualFees: 14000,
        source: "Jai Hind College Merit List 2024",
        isVerified: true,
      },

      // Mithibai College - B.Sc. IT
      {
        college: collegeMap["Mithibai College of Arts, Chauhan Institute of Science (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 83.5,
        annualFees: 45000,
        source: "Mithibai College First Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Mithibai College of Arts, Chauhan Institute of Science (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 2',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 81.2,
        annualFees: 45000,
        source: "Mithibai College Second Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Mithibai College of Arts, Chauhan Institute of Science (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 79.0,
        annualFees: 45000,
        source: "Mithibai College First Merit List 2024",
        isVerified: true,
      },

      // K.J. Somaiya College - B.Sc. IT
      {
        college: collegeMap["K. J. Somaiya College of Science and Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 81.0,
        annualFees: 38000,
        source: "K.J. Somaiya Admission Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["K. J. Somaiya College of Science and Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 76.5,
        annualFees: 38000,
        source: "K.J. Somaiya Admission Merit List 2024",
        isVerified: true,
      },

      // Bhavan's College - B.Sc. IT
      {
        college: collegeMap["Bhavan's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 76.8,
        annualFees: 32000,
        source: "Bhavan's College Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Bhavan's College (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 72.4,
        annualFees: 32000,
        source: "Bhavan's College Merit List 2024",
        isVerified: true,
      },

      // Thakur College - B.Sc. IT
      {
        college: collegeMap["Thakur College of Science and Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 78.5,
        annualFees: 46000,
        source: "Thakur College Merit List 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Thakur College of Science and Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 74.0,
        annualFees: 46000,
        source: "Thakur College Merit List 2024",
        isVerified: true,
      },

      // SIES College - B.Sc. IT
      {
        college: collegeMap["SIES College of Arts, Science & Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 77.2,
        annualFees: 34000,
        source: "SIES College Merit List 2024",
        isVerified: true,
      },

      // D.G. Ruparel College - B.Sc. IT
      {
        college: collegeMap["D. G. Ruparel College of Arts, Science and Commerce"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 80.4,
        annualFees: 29000,
        source: "Ruparel College Merit List 2024",
        isVerified: true,
      },

      // B.K. Birla College - B.Sc. IT (Thane)
      {
        college: collegeMap["B. K. Birla College of Arts, Science and Commerce (Autonomous)"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 75.0,
        annualFees: 31000,
        source: "Birla College Merit List 2024",
        isVerified: true,
      },

      // DY Patil - B.Sc. IT (Navi Mumbai)
      {
        college: collegeMap["DY Patil College of Engineering and Technology"],
        course: courseMap['B.Sc. IT'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 71.5,
        annualFees: 65000,
        source: "DY Patil Admission Merit List 2024",
        isVerified: true,
      },

      // --- ENGINEERING CUTOFFS (MHT-CET Percentile) ---
      // VJTI - B.Tech CE
      {
        college: collegeMap["Veermata Jijabai Technological Institute (VJTI Mumbai)"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 99.45,
        annualFees: 85000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Veermata Jijabai Technological Institute (VJTI Mumbai)"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'OBC',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 98.9,
        annualFees: 52000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Veermata Jijabai Technological Institute (VJTI Mumbai)"],
        course: courseMap['B.Tech AI&DS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 99.1,
        annualFees: 85000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },

      // SPIT - B.Tech CE
      {
        college: collegeMap["Sardar Patel Institute of Technology (SPIT Autonomous)"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 99.2,
        annualFees: 175000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Sardar Patel Institute of Technology (SPIT Autonomous)"],
        course: courseMap['B.Tech AI&DS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 98.8,
        annualFees: 175000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },

      // VESIT - B.Tech CE
      {
        college: collegeMap["Vivekanand Education Society's Institute of Technology (VESIT)"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 96.5,
        annualFees: 135000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },
      {
        college: collegeMap["Vivekanand Education Society's Institute of Technology (VESIT)"],
        course: courseMap['B.Tech AI&DS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 95.8,
        annualFees: 135000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },

      // CRCE Bandra - B.Tech CE
      {
        college: collegeMap["Fr. Conceicao Rodrigues College of Engineering (CRCE Bandra)"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 94.2,
        annualFees: 155000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },

      // DY Patil - B.Tech CE
      {
        college: collegeMap["DY Patil College of Engineering and Technology"],
        course: courseMap['B.Tech CE'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'MHT-CET Percentile',
        cutoffType: 'PERCENTILE',
        cutoffValue: 88.5,
        annualFees: 140000,
        source: "State CET Cell CAP Round 1 2024",
        isVerified: true,
      },

      // --- MANAGEMENT BMS CUTOFFS ---
      // St. Xavier's - BMS
      {
        college: collegeMap["St. Xavier's College (Autonomous)"],
        course: courseMap['BMS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 91.5,
        annualFees: 44000,
        source: "St. Xavier's Official Merit List 2024",
        isVerified: true,
      },

      // Podar College - BMS
      {
        college: collegeMap["R. A. Podar College of Commerce and Economics (Autonomous)"],
        course: courseMap['BMS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 89.2,
        annualFees: 28000,
        source: "Podar College Merit List 2024",
        isVerified: true,
      },

      // Jai Hind - BMS
      {
        college: collegeMap["Jai Hind College (Autonomous)"],
        course: courseMap['BMS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 88.6,
        annualFees: 52000,
        source: "Jai Hind College Merit List 2024",
        isVerified: true,
      },

      // Mithibai - BMS
      {
        college: collegeMap["Mithibai College of Arts, Chauhan Institute of Science (Autonomous)"],
        course: courseMap['BMS'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 87.4,
        annualFees: 48000,
        source: "Mithibai College Merit List 2024",
        isVerified: true,
      },

      // --- B.COM CUTOFFS ---
      // Podar College - B.Com
      {
        college: collegeMap["R. A. Podar College of Commerce and Economics (Autonomous)"],
        course: courseMap['B.Com'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 86.5,
        annualFees: 18000,
        source: "Podar College Merit List 2024",
        isVerified: true,
      },
      // K.J. Somaiya - B.Com
      {
        college: collegeMap["K. J. Somaiya College of Science and Commerce (Autonomous)"],
        course: courseMap['B.Com'],
        academicYear: '2024-2025',
        admissionRound: 'Round 1',
        category: 'Open/General',
        examination: 'HSC Aggregate %',
        cutoffType: 'PERCENTAGE',
        cutoffValue: 82.0,
        annualFees: 22000,
        source: "Somaiya Merit List 2024",
        isVerified: true,
      },
    ];

    const cutoffs = await Cutoff.create(cutoffsData);
    console.log(`Created ${cutoffs.length} historical cutoff records.`);

    // 5. Create Admission Guidance Articles
    console.log('Seeding admission guidance articles...');
    await AdmissionGuidance.create([
      {
        title: 'Mumbai University Degree College Admission Process & Merit Lists',
        slug: 'mumbai-university-merit-list-process',
        category: 'Merit Lists',
        summary:
          'Comprehensive breakdown of the pre-admission registration, merit lists (First, Second, Third), and document verification for degree colleges.',
        content: `### Understanding the Mumbai University Degree College Process

1. **Pre-Admission Online Registration (mum.digitaluniversity.ac):**
   Every student seeking admission to undergraduate programs affiliated with the University of Mumbai must first complete the mandatory online pre-enrolment form and obtain a unique Application Registration Number (PRN/ARN).

2. **College-Specific Online Forms:**
   After registering on the university portal, students must submit individual application forms on the respective websites of each autonomous or affiliated college where they wish to apply.

3. **Merit Lists Stages:**
   - **First Merit List:** Highest cutoff marks, catering to high-scoring candidates.
   - **Second Merit List:** Released 3–5 days later, cutoffs generally drop by 1% to 3%.
   - **Third Merit List:** Final open round, filling remaining vacant seats.

> **Academic Note:** Autonomous colleges conduct separate admission counselling but adhere to state reservation guidelines.`,
        documentChecklist: [
          { name: 'HSC (Class 12) Marksheet & Passing Certificate', isMandatory: true, description: 'Original + 3 attested photocopies' },
          { name: 'SSC (Class 10) Marksheet & Passing Certificate', isMandatory: true, description: 'Original + 3 attested photocopies' },
          { name: 'School / Junior College Leaving Certificate (LC)', isMandatory: true, description: 'Required for university transfer and enrolment' },
          { name: 'University Pre-Admission Enrolment Form', isMandatory: true, description: 'Printed confirmation from mum.digitaluniversity.ac' },
          { name: 'Caste Certificate & Caste Validity (if applicable)', isMandatory: false, description: 'Mandatory for SC/ST/OBC/VJNT claims' },
          { name: 'Non-Creamy Layer Certificate (NCL)', isMandatory: false, description: 'Valid for current financial year (for OBC/VJNT/SBC)' },
        ],
        officialLinks: [
          { title: 'Mumbai University Digital University Portal', url: 'https://mum.digitaluniversity.ac', description: 'Official Pre-Admission Enrolment' },
          { title: 'Maharashtra State CET Cell', url: 'https://cetcell.mahacet.org', description: 'Engineering, Pharmacy & Architecture CAP Portal' },
        ],
        order: 1,
      },
      {
        title: 'Centralised Admission Process (CAP) for Engineering & B.Tech Admissions',
        slug: 'dte-cap-engineering-guidelines',
        category: 'CAP Rounds',
        summary:
          'Step-by-step guide explaining MHT-CET, CAP Option Forms, Freeze, Float, and Slide mechanisms in Maharashtra engineering admissions.',
        content: `### Engineering (B.Tech / B.E.) CAP Workflow

Engineering admissions across Maharashtra are governed by the State Common Entrance Test Cell under the Maharashtra Unaided Private Professional Educational Institutions Act.

#### Key Stages:
1. **Document Verification at Facilitation Centre (FC):** Physical or e-verification of original credentials.
2. **Provisional and Final Merit Lists:** State-level general merit rank (SML) and category rank.
3. **Choice Code Filling (Option Form):** Students list up to 300 college-branch choices in order of preference.
4. **Seat Allotment Rules:**
   - **Auto-Freeze:** If Choice #1 is allotted, it automatically freezes, and the candidate must accept and pay the seat acceptance fee.
   - **Self-Freeze:** The candidate is satisfied with the allotted seat and confirms it.
   - **Float:** The candidate accepts the seat but participates in subsequent rounds for a higher preference.`,
        documentChecklist: [
          { name: 'MHT-CET / JEE Main Score Card', isMandatory: true, description: 'Official scorecard downloaded from cetcell portal' },
          { name: 'Domicile Certificate of Maharashtra', isMandatory: true, description: 'Or Birth Certificate indicating birth in Maharashtra' },
          { name: 'HSC Marksheet with PCM percentage', isMandatory: true, description: 'Minimum 45% aggregate in PCM (40% for reserved)' },
        ],
        officialLinks: [
          { title: 'Maharashtra CET Cell Portal', url: 'https://cetcell.mahacet.org', description: 'Centralized engineering admissions portal' },
        ],
        order: 2,
      },
      {
        title: 'Eligibility Criteria & Mathematics Requirement for B.Sc. IT & B.Sc. CS',
        slug: 'bsc-it-cs-eligibility-maths-rules',
        category: 'Eligibility',
        summary:
          'Crucial clarification regarding the mandatory Mathematics prerequisite for B.Sc. Information Technology and Computer Science under Mumbai University.',
        content: `### Mandatory Subject Prerequisites

Many students inadvertently assume that passing HSC Science is sufficient for B.Sc. Information Technology. Here is the verified university policy:

1. **B.Sc. Information Technology (B.Sc. IT):**
   - The candidate must have passed HSC (Class XII) of the Maharashtra State Board or equivalent with **Mathematics and Statistics as one of the subjects**.
   - Minimum aggregate marks: **45% for Open Category** and **40% for Reserved Categories** (SC/ST/OBC/VJNT).
   - Students holding a 3-year Post-SSC Polytechnic Diploma in Engineering or Technology recognized by MSBTE are also eligible for direct admission.

2. **B.Sc. Computer Science (B.Sc. CS):**
   - Must have passed HSC in **Science stream only**, with Mathematics as a compulsory subject.
   - Commerce students cannot apply for B.Sc. CS, whereas Commerce students with Mathematics in HSC may be eligible for B.Sc. IT in select colleges subject to university seat quotas.`,
        officialLinks: [
          { title: 'University of Mumbai Regulations', url: 'https://mu.ac.in', description: 'Official academic circulars and syllabus' },
        ],
        order: 3,
      },
    ]);
    console.log('Admission guidance articles seeded.');

    console.log('====================================================');
    console.log('Database Seeding Complete!');
    console.log(`Colleges:          ${colleges.length}`);
    console.log(`Courses:           ${courses.length}`);
    console.log(`Historical Cutoffs:${cutoffs.length}`);
    console.log(`Users:             2 (1 Admin, 1 Student)`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
