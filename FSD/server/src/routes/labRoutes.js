import express from 'express';
import { getBatches, createBatch } from '../controllers/batchController.js';
import { getTestRecords, createTestRecord } from '../controllers/testController.js';
import { getComplianceReports, createComplianceReport, generateAiComplianceReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/batches', getBatches);
router.post('/batches', createBatch);

router.get('/tests', getTestRecords);
router.post('/tests', createTestRecord);

router.get('/reports', getComplianceReports);
router.post('/reports', createComplianceReport);
router.post('/reports/generate-ai', generateAiComplianceReport);

export default router;
