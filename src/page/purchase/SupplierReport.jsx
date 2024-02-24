import React, { useEffect, useState, useRef } from "react";
import "./supplier_report.css";
import update from "../../image/Update.png";
import save from "../../image/Save.png";
import reset from "../../image/reset.png";
import Excel from "../../image/excel.webp";
import Invoice from "../../image/Invoice.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlinePreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/GenaratePdf";

const PurchasesReport = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [PaymentTypeData, setPaymentTypeData] = useState([]);

  const [searcSupplierName, setSearcSupplierName] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoice, setInvoice] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [entry_by, setEntryBy] = useState("");
  const [shop_name, setShopName] = useState("");
  const [purchase_date, setPurchasedate] = useState("");
  const [total, setTotal] = useState([]);
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [FiltersupplierData, setFiltersupplierData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/transactionsRouter/getAllTransactions`
      );
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setFilteredData([]);
    setRows(data);
  };

  const fetchDataPaymentType = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/paymenttypes/getAll`);
      setPaymentTypeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSupplierData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/contributorname/getAll`
      );
      setSupplierData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Supplier Report";
    fetchData();
    fetchDataPaymentType();
    fetchSupplierData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredTransactions = data.filter(
      (transaction) =>
        transaction.OperationType &&
        transaction.OperationType.operation_name === "Purchase",
      false
    );
    const filteredContributor = supplierData.filter(
      (contributor) =>
        contributor.ContributorType.contributor_type &&
        contributor.ContributorType.contributor_type === "Supplier"
    );
    setRows(filteredTransactions);
    setFiltersupplierData(filteredContributor);
  }, [data, supplierData]);

  useEffect(() => {
    if (rows.length > 0) {
      const total = rows.reduce(
        (accumulator, item) => accumulator + parseInt(item.amount),
        0
      );
      setTotalAmount(parseInt(total, 10));
      const paid = rows.reduce(
        (accumulator, item) => accumulator + parseInt(item.paid),
        0
      );
      setTotalPaid(parseInt(paid, 10));
      let totalDue = 0;
      rows.forEach((item) => {
        totalDue += parseInt(item.amount) - parseInt(item.paid);
      });
      setTotalDue(totalDue);
    } else {
      setTotalAmount(0);
    }
  }, [rows]);

  const handlerow = (item, index) => {
    setActiveRowIndex(index);
    setInvoice(item.invoice_no);
    setSupplierName(item.ContributorName?.contributor_name);
    setAddress(item.ContributorName?.address);
    setPurchasedate(item.date);
    setMobile(item.ContributorName?.mobile);
    setEntryBy(item.employee_id);
    setShopName(item.ShopName?.shop_name);
    setTotal(item.amount);
    setPaid(item.paid);
    setDue(parseInt(item.amount) - parseInt(item.paid));
  };
  const handleReset = () => {
    setActiveRowIndex(null);
    setInvoice("");
    setSupplierName("");
    setAddress("");
    setPurchasedate("");
    setMobile("");
    setEntryBy("");
    setShopName("");
    setTotal("");
    setPaid("");
    setDue("");
  };

  const handleSearchSupplier = () => {
    if (searcSupplierName === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ContributorName.contributor_name
        .toLowerCase()
        .includes(searcSupplierName.toLowerCase())
    );

    if (results.length === 0) {
      setFilteredData([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };
  const handledateSearch = () => {
    if (date === "") {
      toast.warning("Please fill up the search input");
      return;
    }

    const filtered = rows.filter((item) => {
      const itemDate = item.date.split("T")[0];
      const rangeStartDate = date;

      if (rangeStartDate && itemDate === rangeStartDate) {
        return true;
      }
      return false;
    });

    if (filtered.length === 0) {
      toast.warning("No matching data found");
    }

    // Update filtered data
    setFilteredData(filtered);
  };
  const handleSearchDateStartend = () => {
    if (startDate === "" && endDate === "") {
      toast.warning("Please fill up the search input");
      return;
    }

    const filtered = rows.filter((item) => {
      const itemDate = item.date.split("T")[0];
      const rangeStartDate = startDate;
      const rangeEndDate = endDate;

      if (rangeStartDate && rangeEndDate) {
        return itemDate >= rangeStartDate && itemDate <= rangeEndDate;
      } else if (rangeStartDate) {
        return itemDate >= rangeStartDate;
      } else if (rangeEndDate) {
        return itemDate <= rangeEndDate;
      } else {
        return false;
      }
    });

    setFilteredData(filtered);
    const warningMessage =
      filtered.length === 0 ? "No matching data found" : "";
    if (warningMessage) {
      toast.warning(warningMessage);
    }
  };
  const formattedTransactions = rows.map((item) => ({
    invoice_no: item.invoice_no,
    contributor_name: item.ContributorName?.contributor_name,
    mobile: item.ContributorName?.mobile,
    address: item.ContributorName?.address,
    amount: item.amount,
    paid: item.paid,
    remaining_amount: parseInt(item.amount) - parseInt(item.paid),
    date: item.date.split("T")[0],
    employee_name: item.Employee?.name,
    shop_name: item.ShopName?.shop_name,
  }));
  //Excell
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async (excelData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const UpdateButton = () => {
    toast("Update button is updated");
  };

  const filteredRows = rows.filter((item) => item.invoice_no === invoice);
  console.log("invoice", filteredRows);
  return (
    <>
      <div className="full_div">
        <ToastContainer />
        <div className="first_row_div_supplier_report">
          <div className="invisible_div_supplier_report">
            <div className="input_field_supplier_report">
              <div className="suppllier_report_input">
                <div className="date_input_field_short_long_purchase_supplier_report">
                  <label className="label_field_supershop_purchase">Date</label>
                  <input
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <button onClick={handledateSearch}>Search</button>
                </div>

                <div className="suppllier_report_input ">
                  <div className="input_field_short_long_purchase_supplier_report">
                    <label className="label_field_supershop_purchase">
                      Supplier
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setSearcSupplierName(e.target.value)}
                      list="list_supplier"
                    />

                    <datalist id="list_supplier">
                      {FiltersupplierData.length > 0 &&
                        FiltersupplierData.map((supplier, index) => {
                          return (
                            <option key={index}>
                              {supplier.contributor_name}
                            </option>
                          );
                        })}
                    </datalist>
                    <button onClick={handleSearchSupplier}>Search</button>
                  </div>
                </div>
              </div>
              <div className="suppllier_report_input">
                <div
                  className="date_input_field_short_long_purchase_supplier_report"
                  style={{ marginRight: "6vw" }}
                >
                  <label className="label_field_supershop_purchase">
                    From Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="suppllier_report_input">
                  <div className="date_input_field_short_long_purchase_supplier_report">
                    <label className="label_field_supershop_purchase">
                      To Date
                    </label>
                    <input
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={handleSearchDateStartend}>Search</button>
                  </div>
                </div>
              </div>

              <div className="show_all_suppiler_button">
                <div className="show_all_button">
                  <button onClick={fetchData}>
                    <MdOutlinePreview style={{ fontSize: "2vw" }} />
                  </button>
                  <span>Show All</span>
                </div>
                <div className="excel_button">
                  <button
                    onClick={() =>
                      exportToExcel(formattedTransactions, "Supplier Report")
                    }
                  >
                    <img src={Excel} alt="" />
                  </button>
                  Excel
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="second_row_div_supplier_report">
          <div className="table_supershop_supplier_report">
            <div
              className={`${
                isLoading ? "loader_spriner" : ""
              } table_div_supershop_supplier_report`}
            >
              {isLoading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="64"
                  visible={true}
                />
              ) : (
                <table border={3} cellSpacing={2} cellPadding={10}>
                  <thead>
                    <tr>
                      <th style={Color}>Invoice</th>
                      <th style={Color}>Supplier Name</th>
                      <th style={Color}>Mobile</th>
                      <th style={Color}>Address</th>
                      <th style={Color}>Total</th>
                      <th style={Color}>Paid</th>
                      <th style={Color}>Due</th>
                      <th style={Color}>Purchase Date</th>
                      <th style={Color}>Entry by</th>
                      <th style={Color}>Shop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0
                      ? filteredData &&
                        filteredData.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            onClick={() => handlerow(item, index)}
                          >
                            <td>{item.invoice_no}</td>
                            <td>{item.ContributorName?.contributor_name}</td>
                            <td>{item.ContributorName?.mobile}</td>
                            <td>{item.ContributorName?.address}</td>
                            <td>{item.amount}</td>
                            <td>{item.paid}</td>
                            <td>
                              {parseInt(item.amount) - parseInt(item.paid)}
                            </td>
                            <td>{item.date.split("T")[0]}</td>
                            <td>{item.Employee?.name}</td>
                            <td>{item.ShopName?.shop_name}</td>
                          </tr>
                        ))
                      : rows &&
                        rows.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            onClick={() => handlerow(item, index)}
                          >
                            <td>{item.invoice_no}</td>
                            <td>{item.ContributorName?.contributor_name}</td>
                            <td>{item.ContributorName?.mobile}</td>
                            <td>{item.ContributorName?.address}</td>
                            <td>{item.amount}</td>
                            <td>{item.paid}</td>
                            <td>
                              {parseInt(item.amount) - parseInt(item.paid)}
                            </td>
                            <td>{item.date.split("T")[0]}</td>
                            <td>{item.Employee?.name}</td>
                            <td>{item.ShopName?.shop_name}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="total_supplier_report">
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Total</label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalAmount}
                  disabled
                />
              </div>
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Paid</label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalPaid}
                  disabled
                />
              </div>
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Due </label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalDue}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div className="third_row_div_purchase">
          <div className="first_column_second_row_purchase_report">
            <div className="first_column_second_row_input_field_purchase_report">
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Invoice</label>
                  <input type="text" value={invoice} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Supplier Name</label>
                  <input type="text" value={supplierName} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Address</label>
                  <input type="text" value={address} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Mobile</label>
                  <input type="number" value={mobile} />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Entry by</label>
                  <input type="text" value={entry_by} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Shop</label>
                  <input type="text" className=" " value={shop_name} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Purchase Date</label>
                  <input type="text" value={purchase_date} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Total</label>
                  <input type="text" value={total} />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Paid</label>
                  <input type="text" value={paid} />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Due</label>
                  <input type="number" value={due} />
                </div>
              </div>
            </div>
            <div className="all_update_button_supplier_report ">
              <div className="update_button_purchses_report">
                <button onClick={UpdateButton}>
                  <img src={update} alt="" />
                </button>
                Update
              </div>
              <div className="Second_update_button_supplier_report">
                <div style={{ display: "none" }}>
                  <ComponentToPrint
                    ref={componentRef}
                    supplier={supplierName}
                    address={address}
                    mobile={mobile}
                    employee_name={entry_by}
                    date={purchase_date}
                    total={total}
                    due={due}
                    paid={paid}
                    invoice={invoice}
                    ShopName={shop_name}
                    rows={filteredRows}
                  />
                </div>
                <button onClick={handlePrint}>
                  <img src={Invoice} alt="" />
                </button>
                View Invoice
              </div>
              <div className="reset_button_purchses_report">
                <button onClick={handleReset}>
                  <img src={reset} alt="" />
                </button>
                Reset
              </div>
            </div>
          </div>

          <div className="second_column_second_row_supplier_report">
            <div className="due_payment">Due Payment</div>

            <div className="input_field_short_long_purchase_supplier_report">
              <label>Payment</label>
              <select name="" id="">
                {PaymentTypeData.map((data) => (
                  <option value="">{data.payment_type}</option>
                ))}
              </select>
            </div>
            <div className="input_field_short_long_purchase_supplier_report">
              <label>TK.</label>
              <input type="text" />
            </div>
            <div className="input_field_short_long_supplier_report">
              <button>
                <img src={save} alt="" />
              </button>
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesReport;
