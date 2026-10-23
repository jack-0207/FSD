import ComplianceReport from '../models/ComplianceReport.js';
import Batch from '../models/Batch.js';
import TestRecord from '../models/TestRecord.js';

const createReportNumber = () => `AI-${Date.now().toString().slice(-8)}`;

const createLocalAssessment = (tests, batch) => {
  const failedTests = tests.filter((test) => !test.passed);
  const status = tests.length === 0 || failedTests.length > 0 ? 'Action Required' : 'Compliant';
  const regulation = `${batch.productName} food safety and quality standard (AI suggested)`;
  const resultSummary = tests.length === 0
    ? 'No laboratory test records were found for this batch.'
    : `${tests.length} test record(s) reviewed; ${tests.length - failedTests.length} passed and ${failedTests.length} failed.`;
  const failedSummary = failedTests.length > 0
    ? ` Failed tests: ${failedTests.map((test) => test.testName).join(', ')}.`
    : ' All recorded tests passed.';

  return {
    regulation,
    generatedBy: 'Local AI Assessment',
    status,
    summary: `AI assessment for batch ${batch.batchCode} against ${regulation}. ${resultSummary}${failedSummary}`,
  };
};

const createAiAssessment = async (tests, batch) => {
  const localAssessment = createLocalAssessment(tests, batch);

  if (!process.env.OPENAI_API_KEY) return localAssessment;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a food laboratory compliance analyst. Return JSON with only regulation (the most appropriate food safety or quality standard suggested from the product and test types), generatedBy (always exactly "AI Compliance Analyst"), status (Compliant, Action Required, or Non-Compliant), and summary (a concise, evidence-based paragraph). Treat missing tests or any failed test as at least Action Required; use Non-Compliant only when the evidence clearly indicates a serious regulatory failure. Do not claim a regulation is legally binding without sufficient evidence; label it as a suggested standard when needed.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            batch: { batchCode: batch.batchCode, productName: batch.productName },
            tests: tests.map(({ testName, testType, result, passed, notes, testDate }) => ({
              testName, testType, result, passed, notes, testDate,
            })),
          }),
        },
      ],
    }),
  });

  if (!response.ok) throw new Error('AI provider request failed. Check OPENAI_API_KEY and try again.');

  const data = await response.json();
  const assessment = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  if (!assessment.regulation || assessment.generatedBy !== 'AI Compliance Analyst' || !['Compliant', 'Action Required', 'Non-Compliant'].includes(assessment.status) || !assessment.summary) {
    throw new Error('AI provider returned an invalid compliance assessment.');
  }

  return assessment;
};

export const getComplianceReports = async (req, res) => {
  try {
    const reports = await ComplianceReport.find().populate('batchId').sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createComplianceReport = async (req, res) => {
  try {
    const report = await ComplianceReport.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const generateAiComplianceReport = async (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ message: 'Batch is required.' });
    }

    const [batch, tests] = await Promise.all([
      Batch.findById(batchId),
      TestRecord.find({ batchId }).sort({ testDate: -1 }),
    ]);

    if (!batch) return res.status(404).json({ message: 'Batch not found.' });

    const assessment = await createAiAssessment(tests, batch);
    const report = await ComplianceReport.create({
      reportNumber: createReportNumber(),
      batchId,
      ...assessment,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(502).json({ message: error.message || 'Failed to generate an AI compliance report.' });
  }
};
