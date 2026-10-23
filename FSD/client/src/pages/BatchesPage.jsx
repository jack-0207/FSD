const BatchesPage = ({ batches, batchForm, handleBatchChange, submitBatch }) => (
  <div>
    <header className="page-header">
      <div>
        <p className="eyebrow">Traceability</p>
        <h2>Batch Management</h2>
      </div>
    </header>

    <section className="forms-grid single-form">
      <form className="panel form-panel" onSubmit={submitBatch}>
        <h3>Add Batch</h3>
        <div className="field-grid">
          <input name="batchCode" value={batchForm.batchCode} onChange={handleBatchChange} placeholder="Batch code" required />
          <input name="productName" value={batchForm.productName} onChange={handleBatchChange} placeholder="Product name" required />
          <input name="supplier" value={batchForm.supplier} onChange={handleBatchChange} placeholder="Supplier" required />
          <input name="productionDate" type="date" value={batchForm.productionDate} onChange={handleBatchChange} required />
          <input name="expiryDate" type="date" value={batchForm.expiryDate} onChange={handleBatchChange} required />
          <select name="status" value={batchForm.status} onChange={handleBatchChange}>
            <option value="Received">Received</option>
            <option value="In Lab">In Lab</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Hold">Hold</option>
          </select>
          <input name="quantity" type="number" value={batchForm.quantity} onChange={handleBatchChange} placeholder="Quantity" required />
          <input name="location" value={batchForm.location} onChange={handleBatchChange} placeholder="Storage location" />
        </div>
        <button type="submit" className="primary-btn">Save Batch</button>
      </form>
    </section>

    <section className="panel">
      <h3>Recent Batches</h3>
      <table>
        <thead>
          <tr>
            <th>Batch</th>
            <th>Product</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch._id || batch.batchCode}>
              <td>{batch.batchCode}</td>
              <td>{batch.productName}</td>
              <td>{batch.supplier}</td>
              <td>{batch.status}</td>
              <td>{batch.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

export default BatchesPage;
