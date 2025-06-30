import "./Template1.css";

const Template1 = ({ data }) => {
  // console.log(data);
  
  return (
    <div className="template1 border rounded mx-auto my-4 px-sm-4 py-3 w-100">
      {/* Header section  */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          {data.companyLogo && (
            <div className="mb-2">
              <img src={data.companyLogo} alt="company logo" width={98} />
            </div>
          )}
          <h2 className="mb-1 company-title">{data.companyName}</h2>
          <p className="mb-1">{data.companyAddress}</p>
          <p className="mb-0">Phone:{data.companyPhone}</p>
        </div>
        <div className="col-md-6 text-start text-md-end">
          <h1 className="mb-2 invoice-title">Invoice</h1>
          <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2 gap-md-4">
            <div className="w-100 w-md-50 mb-3 mb-md-0">
              <p className="mb-1">
                <strong>Invoice#:</strong> {data.invoiceNumber}
              </p>
              <p className="mb-1">
                <strong>Invoice Date:</strong> {data.invoiceDate}
              </p>
              <p className="mb-1">
                <strong>DueDate:</strong> {data.paymentDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-3 orange-border" />

      {/* Billing section  */}
      <div className="row g-3 mb-4">
        {data.shippingName && data.shippingPhone && data.shippingAddress && (
          <div className="col-md-6">
            <div className="p-3 rounded h-100 billing-box">
              <h3 className="mb-2 billing-title">Shipping To</h3>
              <p className="mb-1">
                <strong>{data.shippingName}</strong>
              </p>
              <p className="mb-1">{data.shippingAddress}</p>
              <p className="mb-1">{data.shippingPhone}</p>
            </div>
          </div>
        )}
        <div className="col-md-6">
          <div className="p-3 rounded h-100 billing-box">
            <h3 className="mb-2 billing-title">Billed To</h3>
            <p className="mb-1">
              <strong>{data.billingName}</strong>
            </p>
            <p className="mb-1">{data.billingAddress}</p>
            <p className="mb-0">Phone: {data.billingPhone}</p>
          </div>
        </div>
      </div>

      {/* Items section  */}
      <div className="mb-4">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="p-2 table-header">Item #/Item description</th>
                <th className="p-2 text-center table-header">Qty.</th>
                <th className="p-2 text-end table-header">Rate</th>
                <th className="p-2 text-end table-header">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">{item.qty}</td>
                  <td className="p-2 text-end">{Number(item.amount)?.toFixed(2)}</td>
                  <td className="p-2 text-end">
                    ₹{(Number(item.qty) * Number(item.amount)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Total section  */}
      <div className="mb-4">
        <div className="d-flex justify-content-end">
          <div className="p-3 w-100 totals-box" style={{ maxWidth: "300px" }}>
            <div className="d-flex justify-content-between mb-2">
              <span>Sub Total:</span>
              <span>₹{data.subtotal.toFixed(2)}</span>
            </div>
            {data.tax > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({data.tax})</span>
                <span>₹{data.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-bold total-highlight">
              <span>Total:</span>
              <span>₹{data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Bank section  */}
      {(data.accountName || data.accountName || data.accountIfscCode) && (
        <div className="mt-4">
          <h3 className="mb-2 billing-title">Bank Account Details</h3>
          {data.accountName && (
            <p className="mb-1">
              <strong>Account Holder: </strong>
              {data.accountName}
            </p>
          )}
          {data.accountNumber && (
            <p className="mb-1">
              <strong>Account Number:</strong>
              {data.accountNumber}
            </p>
          )}
          {data.accountIfscCode && (
            <p className="mb-0">
              <strong>Ifsc/Branch Code:</strong>
              {data.accountIfscCode}
            </p>
          )}
        </div>
      )}
      {/* Notes section  */}
      {data.notes && (
        <div className="mt-4">
            <h3 className="mb-2 billing-title">
                Remarks
            </h3>
            <p className="mb-0">
                {data.notes}
            </p>
        </div>
      )}
    </div>
  );
};

export default Template1;
