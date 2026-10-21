const PDFDocument = require('pdfkit');

/**
 * Generate a PDF stream for an admission prediction report
 * @param {Object} prediction - Prediction Mongoose document populated with student info
 * @param {Object} res - Express response stream
 */
const generatePredictionPDF = (prediction, student, res) => {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true,
  });

  // Stream directly to response
  doc.pipe(res);

  // --- HEADER SECTION ---
  doc.rect(40, 40, 515, 60).fill('#1e3a8a');
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('AdmitWise', 55, 52);
  doc
    .fontSize(9)
    .font('Helvetica')
    .text('College Admission Prediction and Recommendation System', 55, 76)
    .text('Tagline: Predict. Explore. Achieve.', 55, 87);

  doc
    .fillColor('#e0e7ff')
    .fontSize(8)
    .font('Helvetica')
    .text(`Date: ${new Date(prediction.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 420, 56, { align: 'right' })
    .text(`Report ID: ${prediction._id.toString().slice(-8).toUpperCase()}`, 420, 68, { align: 'right' })
    .text(`Algorithm: ${prediction.algorithmVersion}`, 420, 80, { align: 'right' });

  doc.moveDown(2);
  let y = 115;

  // --- CANDIDATE PROFILE SUMMARY BOX ---
  doc.rect(40, y, 515, 75).fillAndStroke('#f8fafc', '#cbd5e1');
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Candidate Profile & Preferences', 50, y + 8);

  const p = prediction.academicSnapshot || {};
  doc.fontSize(8.5).font('Helvetica').fillColor('#334155');

  doc.text(`Student: ${student ? student.name : 'Registered Student'}`, 50, y + 26);
  doc.text(`Category: ${p.category || 'Open/General'}`, 50, y + 40);
  doc.text(`Preferred Course: ${prediction.courseName || 'N/A'}`, 50, y + 54);

  doc.text(`HSC %: ${p.hscPercentage || 0}%`, 220, y + 26);
  doc.text(`SSC %: ${p.sscPercentage || 'N/A'}%`, 220, y + 40);
  doc.text(`Stream: ${p.stream || 'Science'}`, 220, y + 54);

  doc.text(`Maths Marks: ${p.mathsMarks !== null && p.mathsMarks !== undefined ? p.mathsMarks : 'N/A'}`, 380, y + 26);
  doc.text(`Entrance Exam: ${p.entranceExam || 'None'} (${p.entranceScore || 0})`, 380, y + 40);
  doc.text(`Annual Budget: ${p.annualFeeBudget ? '₹' + p.annualFeeBudget.toLocaleString('en-IN') : 'Any'}`, 380, y + 54);

  y += 90;

  // --- PREDICTION OUTCOME SUMMARY BADGES ---
  const counts = prediction.summaryCounts || {};
  doc.rect(40, y, 515, 30).fill('#eff6ff');
  doc.fillColor('#1e40af').fontSize(9).font('Helvetica-Bold');
  doc.text(`Total Matched: ${counts.totalMatched || 0}`, 50, y + 10);
  doc.fillColor('#166534').text(`High Chance: ${counts.highChance || 0}`, 155, y + 10);
  doc.fillColor('#ca8a04').text(`Moderate Chance: ${counts.moderateChance || 0}`, 265, y + 10);
  doc.fillColor('#991b1b').text(`Low Chance: ${counts.lowChance || 0}`, 385, y + 10);
  doc.fillColor('#475569').text(`Other: ${(counts.notEligible || 0) + (counts.insufficientData || 0)}`, 480, y + 10);

  y += 42;

  // --- RESULTS TABLE TITLE ---
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('College Recommendations and Historical Cutoff Analysis', 40, y);
  y += 18;

  // Table header
  doc.rect(40, y, 515, 20).fill('#2563eb');
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
  doc.text('College Name & City', 46, y + 6);
  doc.text('Type', 215, y + 6);
  doc.text('Cutoff', 270, y + 6);
  doc.text('Fees (p.a.)', 320, y + 6);
  doc.text('Prediction', 380, y + 6);
  doc.text('Rationale', 445, y + 6);
  y += 24;

  const results = prediction.results || [];
  const maxDisplay = Math.min(results.length, 12); // Fit comfortably on page 1-2

  for (let i = 0; i < maxDisplay; i++) {
    const item = results[i];

    // Page break if near bottom
    if (y > 740) {
      doc.addPage();
      y = 40;
      doc.rect(40, y, 515, 20).fill('#2563eb');
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
      doc.text('College Name & City', 46, y + 6);
      doc.text('Type', 215, y + 6);
      doc.text('Cutoff', 270, y + 6);
      doc.text('Fees (p.a.)', 320, y + 6);
      doc.text('Prediction', 380, y + 6);
      doc.text('Rationale', 445, y + 6);
      y += 24;
    }

    const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.rect(40, y - 2, 515, 34).fill(rowBg);

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(7.5);
    const shortName = item.collegeName.length > 32 ? item.collegeName.slice(0, 30) + '...' : item.collegeName;
    doc.text(shortName, 46, y);
    doc.font('Helvetica').fontSize(6.5).fillColor('#64748b').text(item.collegeCity || 'Mumbai', 46, y + 10);

    doc.font('Helvetica').fontSize(7).fillColor('#334155');
    doc.text(item.collegeType ? item.collegeType.slice(0, 12) : 'Private', 215, y + 4);

    const cutoffStr = item.cutoffValue ? `${item.cutoffValue}%` : 'N/A';
    doc.text(cutoffStr, 270, y + 4);

    const feeStr = item.annualFees ? `₹${item.annualFees.toLocaleString('en-IN')}` : 'N/A';
    doc.text(feeStr, 320, y + 4);

    // Chance pill
    let chanceColor = '#166534';
    if (item.chanceCategory === 'Moderate Chance') chanceColor = '#854d0e';
    if (item.chanceCategory === 'Low Chance') chanceColor = '#991b1b';
    if (item.chanceCategory === 'Not Eligible') chanceColor = '#dc2626';
    if (item.chanceCategory === 'Insufficient Data') chanceColor = '#64748b';

    doc.font('Helvetica-Bold').fontSize(7).fillColor(chanceColor);
    doc.text(item.chanceCategory, 380, y + 4);

    doc.font('Helvetica').fontSize(6).fillColor('#475569');
    const firstReason = item.reasons && item.reasons[0] ? item.reasons[0].slice(0, 48) + '...' : 'Based on past merit data.';
    doc.text(firstReason, 445, y + 2, { width: 105 });

    y += 36;
  }

  // --- DISCLAIMER & FOOTER ---
  if (y > 720) {
    doc.addPage();
    y = 50;
  } else {
    y = Math.max(y + 10, 720);
  }

  doc.rect(40, y, 515, 45).fillAndStroke('#f1f5f9', '#cbd5e1');
  doc.fillColor('#334155').fontSize(6.5).font('Helvetica-Bold').text('ACADEMIC DISCLAIMER & NOTES:', 46, y + 6);
  doc
    .font('Helvetica')
    .fontSize(6)
    .fillColor('#64748b')
    .text(
      'AdmitWise predictions are mathematical estimates derived from historical university cutoffs, published round cutoffs, and rule-based academic prerequisites. Merit cutoffs vary each academic year based on student applications, seat matrix, and university guidelines. This report does NOT guarantee admission. Students must follow the official admission process through Maharashtra State CET Cell / University of Mumbai portals.',
      46,
      y + 16,
      { width: 500, align: 'justify' }
    );

  doc.end();
};

module.exports = {
  generatePredictionPDF,
};
