import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BatchesPage from './pages/BatchesPage';
import TestsPage from './pages/TestsPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';

const emptyBatch = {
  batchCode: '',
  productName: '',
  supplier: '',
  productionDate: '',
  expiryDate: '',
  status: 'Received',
  quantity: '',
  location: '',
};

const emptyTest = {
  batchId: '',
  testName: '',
  testType: 'Chemical',
  result: '',
  passed: true,
  technician: '',
  notes: '',
};

const emptyReport = {
  reportNumber: '',
  batchId: '',
  regulation: '',
  status: 'Compliant',
  generatedBy: '',
  summary: '',
};

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodlab-user'));
    } catch {
      return null;
    }
  });
  const [batches, setBatches] = useState([]);
  const [tests, setTests] = useState([]);
  const [reports, setReports] = useState([]);
  const [batchForm, setBatchForm] = useState(emptyBatch);
  const [testForm, setTestForm] = useState(emptyTest);
  const [reportForm, setReportForm] = useState(emptyReport);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [batchRes, testRes, reportRes] = await Promise.all([
          fetch('/api/batches'),
          fetch('/api/tests'),
          fetch('/api/reports'),
        ]);

        if (batchRes.ok) setBatches(await batchRes.json());
        if (testRes.ok) setTests(await testRes.json());
        if (reportRes.ok) setReports(await reportRes.json());
      } catch (error) {
        console.error('Failed to load lab data:', error);
      }
    };

    loadData();
  }, [user]);

  const handleLogin = (authenticatedUser) => {
    localStorage.setItem('foodlab-user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('foodlab-user');
    setUser(null);
  };

  const handleBatchChange = (event) => {
    const { name, value } = event.target;
    setBatchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTestForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReportChange = (event) => {
    const { name, value } = event.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitBatch = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...batchForm,
        quantity: Number(batchForm.quantity),
      }),
    });

    if (response.ok) {
      const batch = await response.json();
      setBatches((prev) => [batch, ...prev]);
      setBatchForm(emptyBatch);
    }
  };

  const submitTest = async (event) => {
    event.preventDefault();

    if (!testForm.batchId) {
      alert('Please select a batch before saving a test record.');
      return;
    }

    const response = await fetch('/api/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testForm,
        passed: Boolean(testForm.passed),
      }),
    });

    if (response.ok) {
      const test = await response.json();
      setTests((prev) => [test, ...prev]);
      setTestForm(emptyTest);
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.message || 'Failed to save test record.');
    }
  };

  const submitReport = async (event) => {
    event.preventDefault();

    if (!reportForm.batchId) {
      alert('Please select a batch before generating a compliance report.');
      return;
    }

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportForm),
    });

    if (response.ok) {
      const report = await response.json();
      setReports((prev) => [report, ...prev]);
      setReportForm(emptyReport);
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.message || 'Failed to save compliance report.');
    }
  };

  const generateAiReport = async (event) => {
    event.preventDefault();

    if (!reportForm.batchId) {
      alert('Please select a batch before generating a compliance report.');
      return;
    }

    const response = await fetch('/api/reports/generate-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batchId: reportForm.batchId,
      }),
    });

    if (response.ok) {
      const report = await response.json();
      setReports((prev) => [report, ...prev]);
      setReportForm(emptyReport);
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.message || 'Failed to generate AI compliance report.');
    }
  };

  const stats = [
    { label: 'Active Batches', value: String(batches.length || 0) },
    { label: 'Lab Tests', value: String(tests.length || 0) },
    { label: 'Compliance Reports', value: String(reports.length || 0) },
    { label: 'Passed Rate', value: `${tests.length ? Math.round((tests.filter((item) => item.passed).length / tests.length) * 100) : 0}%` },
  ];

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <Router>
      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Food Processing</p>
            <h1>Laboratory Management System</h1>
          </div>
          <nav className="nav-bar">
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/batches">Batches</NavLink>
            <NavLink to="/tests">Tests</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <button type="button" className="logout-btn" onClick={handleLogout}>Sign out</button>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage stats={stats} batches={batches} tests={tests} reports={reports} />} />
          <Route path="/batches" element={<BatchesPage batches={batches} batchForm={batchForm} handleBatchChange={handleBatchChange} submitBatch={submitBatch} />} />
          <Route path="/tests" element={<TestsPage batches={batches} tests={tests} testForm={testForm} handleTestChange={handleTestChange} submitTest={submitTest} />} />
          <Route path="/reports" element={<ReportsPage batches={batches} reports={reports} reportForm={reportForm} handleReportChange={handleReportChange} submitReport={submitReport} generateAiReport={generateAiReport} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
