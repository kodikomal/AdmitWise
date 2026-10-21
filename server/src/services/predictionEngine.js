const { College, Course, Cutoff } = require('../models');

/**
 * AdmitWise Rule-Based Admission Prediction Engine
 * Version: 1.2
 *
 * Implements transparent, explainable, rule-based college admission prediction
 * without black-box ML or fabricated probabilities.
 */
class PredictionEngine {
  /**
   * Run prediction for a student against a specified course
   * @param {Object} studentProfile - Academic information submitted
   * @param {String} courseId - Selected Course ID
   * @param {Object} options - City, budget, college type filters
   */
  static async predict(studentProfile, courseId, options = {}) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Selected course does not exist.');
    }

    const {
      sscPercentage = 0,
      hscPercentage = 0,
      mathsMarks = null,
      stream = 'Science',
      category = 'Open/General',
      entranceExam = 'None / Merit Based',
      entranceScore = 0,
      preferredCity = 'All',
      annualFeeBudget = null,
      collegeTypePreference = 'Any',
    } = studentProfile;

    // 1. Mandatory Eligibility Evaluation
    const eligibilityCheck = this.checkEligibility(course, {
      hscPercentage: Number(hscPercentage),
      mathsMarks: mathsMarks !== null ? Number(mathsMarks) : null,
      stream,
      category,
      entranceExam,
      entranceScore: Number(entranceScore),
    });

    // 2. Query matching colleges offering this course
    const collegeQuery = {
      coursesOffered: course._id,
    };

    if (preferredCity && preferredCity !== 'All' && preferredCity.trim() !== '') {
      collegeQuery.city = new RegExp(`^${preferredCity.trim()}$`, 'i');
    }

    if (collegeTypePreference && collegeTypePreference !== 'Any') {
      collegeQuery.collegeType = collegeTypePreference;
    }

    const colleges = await College.find(collegeQuery).populate('coursesOffered');

    const results = [];
    let highCount = 0;
    let moderateCount = 0;
    let lowCount = 0;
    let notEligibleCount = 0;
    let insufficientCount = 0;

    // 3. Evaluate each college
    for (const college of colleges) {
      // If student fails mandatory course eligibility globally:
      if (!eligibilityCheck.isEligible) {
        notEligibleCount++;
        results.push({
          collegeId: college._id,
          collegeName: college.name,
          collegeCity: college.city,
          collegeType: college.collegeType,
          universityAffiliation: college.universityAffiliation,
          annualFees: college.annualFeesApprox || 0,
          isEligible: false,
          eligibilityRemarks: eligibilityCheck.remarks.join(' '),
          chanceCategory: 'Not Eligible',
          studentScore: course.admissionBasis === 'ENTRANCE_EXAM' ? entranceScore : hscPercentage,
          cutoffValue: null,
          scoreDifference: null,
          cutoffType: course.admissionBasis === 'ENTRANCE_EXAM' ? 'PERCENTILE' : 'PERCENTAGE',
          academicYearUsed: 'N/A',
          admissionRoundUsed: 'N/A',
          categoryUsed: category,
          reasons: [
            ...eligibilityCheck.remarks,
            'Mandatory eligibility criteria for this course are not fulfilled.',
          ],
          dataSource: college.dataSource || 'Mumbai University Admission Guidelines',
          isVerifiedData: college.isVerified,
        });
        continue;
      }

      // 4. Retrieve historical cutoffs for this college and course
      // Look for candidate's category first, fallback to Open/General
      let cutoffRecord = await Cutoff.findOne({
        college: college._id,
        course: course._id,
        category: category,
      }).sort({ academicYear: -1, admissionRound: 1 });

      let isFallbackCategory = false;
      if (!cutoffRecord && category !== 'Open/General') {
        cutoffRecord = await Cutoff.findOne({
          college: college._id,
          course: course._id,
          category: 'Open/General',
        }).sort({ academicYear: -1, admissionRound: 1 });
        if (cutoffRecord) isFallbackCategory = true;
      }

      // 5. Handle missing cutoff data honestly
      if (!cutoffRecord || cutoffRecord.cutoffValue === undefined || cutoffRecord.cutoffValue === null) {
        insufficientCount++;
        results.push({
          collegeId: college._id,
          collegeName: college.name,
          collegeCity: college.city,
          collegeType: college.collegeType,
          universityAffiliation: college.universityAffiliation,
          annualFees: college.annualFeesApprox || 0,
          isEligible: true,
          eligibilityRemarks: 'Academic prerequisites are met.',
          chanceCategory: 'Insufficient Data',
          studentScore: course.admissionBasis === 'ENTRANCE_EXAM' ? entranceScore : hscPercentage,
          cutoffValue: null,
          scoreDifference: null,
          cutoffType: course.admissionBasis === 'ENTRANCE_EXAM' ? 'PERCENTILE' : 'PERCENTAGE',
          academicYearUsed: 'Unavailable',
          admissionRoundUsed: 'Unavailable',
          categoryUsed: category,
          reasons: [
            `Verified historical cutoff records for ${course.shortName} in ${college.name} are currently unavailable in the database.`,
            'Admission competitiveness cannot be reliably estimated without authentic historical cutoff records.',
          ],
          dataSource: college.dataSource,
          isVerifiedData: false,
        });
        continue;
      }

      // 6. Compare Student Score against Historical Cutoff
      const cutoffVal = cutoffRecord.cutoffValue;
      const cutoffType = cutoffRecord.cutoffType;
      let studentScore = Number(hscPercentage);

      if (course.admissionBasis === 'ENTRANCE_EXAM') {
        studentScore = Number(entranceScore);
      }

      const scoreDiff = Number((studentScore - cutoffVal).toFixed(2));
      const reasons = [];

      // Budget check note
      const annualFees = cutoffRecord.annualFees || college.annualFeesApprox || 0;
      if (annualFeeBudget && annualFeeBudget > 0 && annualFees > annualFeeBudget) {
        reasons.push(
          `Annual fee (₹${annualFees.toLocaleString('en-IN')}) is higher than your preferred budget of ₹${Number(annualFeeBudget).toLocaleString('en-IN')}.`
        );
      }

      if (isFallbackCategory) {
        reasons.push(
          `Cutoff data for category '${category}' was not found; evaluated using Open/General benchmark (${cutoffVal}%).`
        );
      }

      // Classification based on documented thresholds
      // High Chance: Score is >= Cutoff + 3.0
      // Moderate Chance: Score is between Cutoff - 2.5 and Cutoff + 3.0
      // Low Chance: Score is < Cutoff - 2.5
      let chanceCategory = 'Low Chance';

      if (scoreDiff >= 3.0) {
        chanceCategory = 'High Chance';
        highCount++;
        reasons.unshift(
          `Your ${course.admissionBasis === 'ENTRANCE_EXAM' ? 'percentile' : 'aggregate'} (${studentScore}%) is ${scoreDiff.toFixed(1)}% above the ${cutoffRecord.academicYear} ${cutoffRecord.admissionRound} cutoff (${cutoffVal}%).`
        );
      } else if (scoreDiff >= -2.5) {
        chanceCategory = 'Moderate Chance';
        moderateCount++;
        if (scoreDiff >= 0) {
          reasons.unshift(
            `Your score (${studentScore}%) meets the ${cutoffRecord.academicYear} cutoff (${cutoffVal}%) with a close margin of +${scoreDiff.toFixed(1)}%. Cutoffs fluctuate by round.`
          );
        } else {
          reasons.unshift(
            `Your score (${studentScore}%) is slightly below the ${cutoffRecord.academicYear} Round 1 cutoff (${cutoffVal}%) by ${Math.abs(scoreDiff).toFixed(1)}%. Subsequent merit rounds historically drop by 1-3%.`
          );
        }
      } else {
        chanceCategory = 'Low Chance';
        lowCount++;
        reasons.unshift(
          `Your score (${studentScore}%) is ${Math.abs(scoreDiff).toFixed(1)}% below the ${cutoffRecord.academicYear} ${cutoffRecord.admissionRound} cutoff (${cutoffVal}%). High historical competition.`
        );
      }

      results.push({
        collegeId: college._id,
        collegeName: college.name,
        collegeCity: college.city,
        collegeType: college.collegeType,
        universityAffiliation: college.universityAffiliation,
        annualFees,
        isEligible: true,
        eligibilityRemarks: 'Academic prerequisites are met.',
        chanceCategory,
        studentScore,
        cutoffValue: cutoffVal,
        scoreDifference: scoreDiff,
        cutoffType,
        academicYearUsed: cutoffRecord.academicYear,
        admissionRoundUsed: cutoffRecord.admissionRound,
        categoryUsed: isFallbackCategory ? 'Open/General (Fallback)' : cutoffRecord.category,
        reasons,
        dataSource: cutoffRecord.source || college.dataSource,
        isVerifiedData: cutoffRecord.isVerified,
      });
    }

    // 7. Sort results: High Chance -> Moderate Chance -> Low Chance -> Insufficient Data -> Not Eligible
    const priority = {
      'High Chance': 1,
      'Moderate Chance': 2,
      'Low Chance': 3,
      'Insufficient Data': 4,
      'Not Eligible': 5,
    };

    results.sort((a, b) => {
      const pDiff = priority[a.chanceCategory] - priority[b.chanceCategory];
      if (pDiff !== 0) return pDiff;
      // Secondary sort: highest score difference first
      if (a.scoreDifference !== null && b.scoreDifference !== null) {
        return b.scoreDifference - a.scoreDifference;
      }
      return a.collegeName.localeCompare(b.collegeName);
    });

    return {
      courseId: course._id,
      courseName: course.name,
      academicSnapshot: {
        sscPercentage: Number(sscPercentage) || 0,
        hscPercentage: Number(hscPercentage) || 0,
        mathsMarks: mathsMarks !== null ? Number(mathsMarks) : null,
        stream,
        category,
        entranceExam,
        entranceScore: Number(entranceScore) || 0,
        preferredCity,
        annualFeeBudget: annualFeeBudget ? Number(annualFeeBudget) : null,
        collegeTypePreference,
      },
      algorithmVersion: 'AdmitWise Rule-Based Predictor v1.2',
      summaryCounts: {
        highChance: highCount,
        moderateChance: moderateCount,
        lowChance: lowCount,
        notEligible: notEligibleCount,
        insufficientData: insufficientCount,
        totalMatched: results.length,
      },
      results,
    };
  }

  /**
   * Evaluate mandatory eligibility rules for a course
   */
  static checkEligibility(course, student) {
    const criteria = course.eligibilityCriteria || {};
    const remarks = [];
    let isEligible = true;

    const isReserved = ['OBC', 'SC', 'ST', 'VJ/NT', 'SBC'].includes(student.category);
    const requiredMinHsc = isReserved
      ? criteria.minHscReservedPercentage || 40
      : criteria.minHscPercentage || 45;

    // Check minimum HSC percentage
    if (student.hscPercentage < requiredMinHsc) {
      isEligible = false;
      remarks.push(
        `Minimum ${requiredMinHsc}% aggregate in HSC required for ${student.category} category (Submitted: ${student.hscPercentage}%).`
      );
    }

    // Check allowed streams
    if (criteria.allowedStreams && criteria.allowedStreams.length > 0) {
      if (!criteria.allowedStreams.includes(student.stream)) {
        isEligible = false;
        remarks.push(
          `Course requires HSC from ${criteria.allowedStreams.join(' or ')} stream (Submitted: ${student.stream}).`
        );
      }
    }

    // Check mandatory Mathematics subject
    if (criteria.requiresMathsInHsc) {
      if (student.mathsMarks === null || student.mathsMarks === undefined || isNaN(student.mathsMarks)) {
        isEligible = false;
        remarks.push(
          'Mathematics in HSC is a mandatory prerequisite for this course under university regulations.'
        );
      } else if (student.mathsMarks < (criteria.minMathsMarks || 35)) {
        isEligible = false;
        remarks.push(
          `Passing mark in Mathematics (min ${criteria.minMathsMarks || 35}) is required (Submitted: ${student.mathsMarks}).`
        );
      }
    }

    // Check entrance examination requirement
    if (criteria.entranceRequired) {
      if (!student.entranceExam || student.entranceExam === 'None / Merit Based') {
        isEligible = false;
        remarks.push(
          `An entrance exam (${criteria.acceptedExams?.join(' or ') || 'MHT-CET / JEE Main'}) is mandatory for this program.`
        );
      } else if (criteria.minEntrancePercentile && student.entranceScore < criteria.minEntrancePercentile) {
        isEligible = false;
        remarks.push(
          `Minimum entrance percentile required is ${criteria.minEntrancePercentile} (Submitted: ${student.entranceScore}).`
        );
      }
    }

    return {
      isEligible,
      remarks,
    };
  }
}

module.exports = PredictionEngine;
