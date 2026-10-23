import TestRecord from '../models/TestRecord.js';

export const getTestRecords = async (req, res) => {
  try {
    const tests = await TestRecord.find().populate('batchId').sort({ testDate: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTestRecord = async (req, res) => {
  try {
    const testRecord = await TestRecord.create(req.body);
    res.status(201).json(testRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
