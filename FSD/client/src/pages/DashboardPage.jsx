const DashboardPage = ({ stats, batches, tests, reports }) => {
  const passedTests = tests.filter((test) => test.passed).length;
  const failedTests = tests.length - passedTests;
  const passRate = tests.length ? Math.round((passedTests / tests.length) * 100) : 0;
  const countBy = (items, key) => items.reduce((counts, item) => {
    const value = item[key] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
  const testTypes = countBy(tests, 'testType');
  const batchStatuses = countBy(batches, 'status');
  const reportStatuses = countBy(reports, 'status');
  const maxTestTypeCount = Math.max(...Object.values(testTypes), 1);
  const maxBatchStatusCount = Math.max(...Object.values(batchStatuses), 1);
  const maxReportStatusCount = Math.max(...Object.values(reportStatuses), 1);

  const renderBars = (items, maxCount, barClass) => Object.keys(items).length
    ? Object.entries(items).map(([label, count]) => (
      <div className="chart-bar-row" key={label}>
        <div className="chart-bar-label"><span>{label}</span><strong>{count}</strong></div>
        <div className="chart-bar-track"><span className={`chart-bar ${barClass}`} style={{ width: `${(count / maxCount) * 100}%` }} /></div>
      </div>
    ))
    : <p className="chart-empty">No records yet</p>;

  const features = [
    'Chemical analysis tracking',
    'Quality testing workflow',
    'Compliance reporting',
    'Batch traceability',
    'Supplier and inventory logs',
    'Audit-ready records',
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">Food Processing</p>
          <h2>Operations Dashboard</h2>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section className="analytics-grid">
        <div className="panel outcome-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Quality signal</p>
              <h3>Test outcomes</h3>
            </div>
            <strong className="chart-total">{passRate}%</strong>
          </div>
          <div className="outcome-chart">
            <div className="donut-chart" style={{ '--pass-rate': `${passRate}%` }} aria-label={`${passRate}% of tests passed`}>
              <span>{passRate}%<small>passed</small></span>
            </div>
            <div className="chart-legend">
              <span><i className="legend-dot pass-dot" />Passed <strong>{passedTests}</strong></span>
              <span><i className="legend-dot fail-dot" />Failed <strong>{failedTests}</strong></span>
            </div>
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Laboratory mix</p><h3>Tests by type</h3></div>
            <span className="chart-caption">{tests.length} total</span>
          </div>
          <div className="bar-chart">{renderBars(testTypes, maxTestTypeCount, 'test-bar')}</div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Traceability</p><h3>Batch status</h3></div>
            <span className="chart-caption">{batches.length} total</span>
          </div>
          <div className="bar-chart">{renderBars(batchStatuses, maxBatchStatusCount, 'batch-bar')}</div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Compliance</p><h3>Report status</h3></div>
            <span className="chart-caption">{reports.length} total</span>
          </div>
          <div className="bar-chart">{renderBars(reportStatuses, maxReportStatusCount, 'report-bar')}</div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <h3>System Overview</h3>
          <p>
            This platform supports quality assurance, regulatory compliance, and food safety monitoring
            for production and processing facilities.
          </p>
          <ul>
            {features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="panel highlight-panel">
          <h3>Operations Snapshot</h3>
          <div className="mini-row">
            <span>Raw Material QC</span>
            <strong>{passRate}%</strong>
          </div>
          <div className="mini-row">
            <span>Finished Product QA</span>
            <strong>{tests.length ? `${tests.filter((test) => test.passed && test.testType !== 'Microbial').length}/${tests.filter((test) => test.testType !== 'Microbial').length || 0}` : '0/0'}</strong>
          </div>
          <div className="mini-row">
            <span>Microbial Tests</span>
            <strong>{testTypes.Microbial || 0} total</strong>
          </div>
          <div className="mini-row">
            <span>Audit Readiness</span>
            <strong>{reports.length ? 'Ready' : 'Pending'}</strong>
          </div>
        </div>
      </section>

      <section className="tables-grid">
        <div className="panel">
          <h3>Recent Batches</h3>
          <table>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Product</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.slice(0, 5).map((batch) => (
                <tr key={batch._id || batch.batchCode}>
                  <td>{batch.batchCode}</td>
                  <td>{batch.productName}</td>
                  <td>{batch.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Recent Tests</h3>
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Type</th>
                <th>Passed</th>
              </tr>
            </thead>
            <tbody>
              {tests.slice(0, 5).map((test) => (
                <tr key={test._id || test.testName}>
                  <td>{test.testName}</td>
                  <td>{test.testType}</td>
                  <td>{test.passed ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Compliance Reports</h3>
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Regulation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map((report) => (
                <tr key={report._id || report.reportNumber}>
                  <td>{report.reportNumber}</td>
                  <td>{report.regulation}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
