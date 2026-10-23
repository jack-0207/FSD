const TestsPage = ({ batches, tests, testForm, handleTestChange, submitTest }) => (
  <div>
    <header className="page-header">
      <div>
        <p className="eyebrow">Quality Control</p>
        <h2>Laboratory Tests</h2>
      </div>
    </header>

    <section className="forms-grid single-form">
      <form className="panel form-panel" onSubmit={submitTest}>
        <h3>Lab Test Record</h3>
        <div className="field-grid">
          <select name="batchId" value={testForm.batchId} onChange={handleTestChange} required>
            <option value="">Select batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>{batch.batchCode}</option>
            ))}
          </select>
          <input name="testName" value={testForm.testName} onChange={handleTestChange} placeholder="Test name" required />
          <select name="testType" value={testForm.testType} onChange={handleTestChange}>
            <option value="Chemical">Chemical</option>
            <option value="Microbial">Microbial</option>
            <option value="Physical">Physical</option>
            <option value="Sensory">Sensory</option>
          </select>
          <input name="result" value={testForm.result} onChange={handleTestChange} placeholder="Result" required />
          <input name="technician" value={testForm.technician} onChange={handleTestChange} placeholder="Technician" required />
          <textarea name="notes" value={testForm.notes} onChange={handleTestChange} placeholder="Notes" rows="3" />
          <label className="checkbox-row">
            <input type="checkbox" name="passed" checked={testForm.passed} onChange={handleTestChange} />
            Test Passed
          </label>
        </div>
        <button type="submit" className="primary-btn">Save Test</button>
      </form>
    </section>

    <section className="panel">
      <h3>Recent Tests</h3>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Type</th>
            <th>Result</th>
            <th>Technician</th>
            <th>Passed</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test._id || test.testName}>
              <td>{test.testName}</td>
              <td>{test.testType}</td>
              <td>{test.result}</td>
              <td>{test.technician}</td>
              <td>{test.passed ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

export default TestsPage;
