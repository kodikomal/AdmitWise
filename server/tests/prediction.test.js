const test = require('node:test');
const assert = require('node:assert/strict');
const PredictionEngine = require('../src/services/predictionEngine');

test('PredictionEngine - Eligibility Checks', async (t) => {
  await t.test('Fails eligibility when HSC percentage is below required minimum', () => {
    const courseMock = {
      name: 'B.Sc. Information Technology',
      shortName: 'B.Sc. IT',
      admissionBasis: 'HSC_MERIT',
      eligibilityCriteria: {
        minHscPercentage: 45,
        minHscReservedPercentage: 40,
        requiresMathsInHsc: true,
        minMathsMarks: 35,
        allowedStreams: ['Science'],
      },
    };

    const studentMock = {
      hscPercentage: 42.0,
      mathsMarks: 65,
      stream: 'Science',
      category: 'Open/General',
    };

    const result = PredictionEngine.checkEligibility(courseMock, studentMock);
    assert.equal(result.isEligible, false);
    assert.match(result.remarks[0], /Minimum 45% aggregate in HSC required/);
  });

  await t.test('Fails eligibility when Mathematics is missing for B.Sc. IT', () => {
    const courseMock = {
      name: 'B.Sc. Information Technology',
      shortName: 'B.Sc. IT',
      admissionBasis: 'HSC_MERIT',
      eligibilityCriteria: {
        minHscPercentage: 45,
        requiresMathsInHsc: true,
        minMathsMarks: 35,
        allowedStreams: ['Science'],
      },
    };

    const studentMock = {
      hscPercentage: 75.0,
      mathsMarks: null,
      stream: 'Science',
      category: 'Open/General',
    };

    const result = PredictionEngine.checkEligibility(courseMock, studentMock);
    assert.equal(result.isEligible, false);
    assert.match(result.remarks[0], /Mathematics in HSC is a mandatory prerequisite/);
  });

  await t.test('Passes eligibility when all academic criteria are satisfied', () => {
    const courseMock = {
      name: 'B.Sc. Information Technology',
      shortName: 'B.Sc. IT',
      admissionBasis: 'HSC_MERIT',
      eligibilityCriteria: {
        minHscPercentage: 45,
        minHscReservedPercentage: 40,
        requiresMathsInHsc: true,
        minMathsMarks: 35,
        allowedStreams: ['Science'],
      },
    };

    const studentMock = {
      hscPercentage: 82.5,
      mathsMarks: 76,
      stream: 'Science',
      category: 'Open/General',
    };

    const result = PredictionEngine.checkEligibility(courseMock, studentMock);
    assert.equal(result.isEligible, true);
    assert.equal(result.remarks.length, 0);
  });
});
