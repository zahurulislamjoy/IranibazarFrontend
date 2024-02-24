import React from "react";
import "./pdf.css";
import merinasoft from "../image/merinasoft.png";
import { convertNumberToWords } from "./ConvertNumberToWord";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const {
    supplier,
    address,
    mobile,
    employee_name,
    date,
    total,
    due,
    paid,
    invoice,
    ShopName,
    rows,
  } = props;
  const words = convertNumberToWords(total);

  return (
    <div ref={ref}>
      <div className="invoice">
        {/* Header Section */}
        <div className="headers">
          <img src={merinasoft} alt="Company Logo" className="logo" />
          <div className="company-info">
            <div className="company-name">{ShopName}</div>
            <div className="company-address">
            Khilpara Bazar, Chatkhil, Noakhali
            </div>
            <div className="company-address">
              Email: info@merinasoft.com Phone: 01830112972
            </div>
            <div className="company-address">Web: www.merinasoft.com</div>
          </div>
        </div>
        <div className="horizontal-line1" />

        {/* Billing Information Section */}
        <div className="billing-info">
          <div className="invoice-bill">Invoice/Bill</div>
          <div className="customer-invoice">
            <div className="customer-info">
              <h5>Supplier: {supplier}</h5>
              <h5>Address: {address}</h5>
              <h5>Mobile: {mobile}</h5>
            </div>
            <div className="invoice-details">
              <h5>Invoice Number: {invoice}</h5>
              <h5>Date: {date}</h5>
              <h5>Sale By: {employee_name}</h5>
            </div>
          </div>
        </div>

        {/* Body Section - Product Details */}
        <div className="body">
          <div className="table">
            <div className="product-table">
              <div className="div">Product Code</div>
              <div className="div">Product Name</div>
              <div className="div">Product Type</div>
              <div className="div">Quantity</div>
              <div className="div">Sale Price</div>
              <div className="div">Total</div>
              {rows &&
                rows.map((row, index) => (
                  <>
                    <div className="div">{row.ProductTrace?.product_code}</div>
                    <div className="div">{row.ProductTrace?.name}</div>
                    <div className="div">{row.ProductTrace?.type}</div>
                    <div className="div">{row.quantity_no}</div>
                    <div className="div">{row.purchase_price}</div>
                    <div className="div">
                      {parseInt(row.quantity_no) * parseInt(row.purchase_price)}
                    </div>
                  </>
                ))}
            </div>
            <div className="table2">
              <div className="div">Vat</div>
              <div className="div1">{rows && rows.map((row) => row.Tax?.rate|| 0)}</div>

              <div className="div">Net Total</div>
              <div className="div1">{total}</div>
            </div>
          </div>

          {/* Total */}
          <div className="total">
            <div>Comment/Service :</div>
            <div className="word">Net Total(In Words) : {words} Taka</div>

            <div className="total_row">
              <div className="div">Paid</div>
              <div className="div">{paid}</div>
              <div className="div">Due</div>
              <div className="div">{due}</div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="footer">
          <div className="ceo-signature">
            <div>
              <div className="horizontal-line" />
              Authorize Signature
            </div>

            <div>
              <div className="horizontal-line" />
              Received With Good Condition By
            </div>
          </div>

          <div className="last_part">
           
            <div>1. VAT & Tax  included</div>
          </div>
        </div>
      </div>
    </div>
  );
});
