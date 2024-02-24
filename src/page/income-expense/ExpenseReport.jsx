import React from "react";
import "./expance-reoprt.css";
import { useState, useEffect } from "react";
import InvestorExportExcel from "../../components/ExportExcel";
import "react-toastify/dist/ReactToastify.css";
import { RxUpdate } from "react-icons/rx";
import { MdPreview } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ExpanceReport = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [rows, setRows] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);
  // Update data state
  const [expanceName, setExpanceName] = useState([]);
  const [totalCost, setTotalCost] = useState([]);
  const [date, setDate] = useState("");
  const [paid, setPaid] = useState([]);
  const [due, setDue] = useState([]);
  const [duePaid, setDuePaid] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axios.get(
          `${BASE_URL}/api/transactionsRouter/getAllTransactions`
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id && item.operation_type_id === 3
        );
        setTimeout(() => {
          setRows(filteredData);
          setFixData([...new Set(filteredData)]);
          console.log(filteredData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  }, []);

  const handleClickShowAll = () => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axios.get(
          `${BASE_URL}/api/transactionsRouter/getAllTransactions`
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id && item.operation_type_id === 3
        );
        setTimeout(() => {
          setRows(filteredData);
          setFixData([...new Set(filteredData)]);
          console.log(filteredData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  };

  const handleFilterDate = () => {
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return (
          itemDate.includes(fromDate.split("T")[0].toLowerCase()) &&
          itemDate.includes(toDate.split("T")[0].toLowerCase())
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterOnlyDate = () => {
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(date.split("T")[0].toLowerCase());
      }
      return false;
    });

    setRows(filterData);
  };

  const totalPaid =
    rows && rows.length > 0
      ? rows
          .reduce((productpaid, item) => {
            if (
              item.paid !== undefined &&
              item.paid !== null &&
              item.paid !== ""
            ) {
              productpaid += Number(item.paid);
            }
            return productpaid;
          }, 0)
          .toFixed(2)
      : 0;

  const totalAmount =
    rows && rows.length > 0
      ? rows
          .reduce((productpaid, item) => {
            if (
              item.amount !== undefined &&
              item.amount !== null &&
              item.amount !== ""
            ) {
              productpaid += Number(item.amount);
            }
            return productpaid;
          }, 0)
          .toFixed(2)
      : 0;

  const TotalDue = totalAmount - totalPaid;

  const hendleDataInputField = (item) => {
    setExpanceName(item.comment);
    setTotalCost(item.amount);
    setPaid(item.paid);
    setDate(item.date ? item.date.split("T")[0] : "");
    setDue(parseFloat(item.amount) - parseFloat(item.paid));
    setDuePaid(parseFloat(item.amount) - parseFloat(item.paid));
  };

  const updatedData = () => {
    toast.success("This is For Updated Version");
  };

  return (
    <div className="full_div_supershop_expense_report">
      <div className="first_row_div_supershop_expense_report">
        <div className="container_search_column1_supershop_expense_report">
          <div className="two_way_date_supershop_expense_report_search">
            <div className="two_date_search">
              <div className="input-field_supershop_expense_report">
                <label>Date</label>
                <input
                  type="date"
                  onChange={(event) => setDate(event.target.value)}
                />

                <button type="submit" onClick={handleFilterOnlyDate}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container_search_column2_expense_report">
          <div className="two_date_search_supershop">
            <div className="input-field_supershop_expense_report">
              <label c>From Date</label>
              <input
                type="date"
                onChange={(event) => setFromDate(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="container_search_column3_supershop_expense_report">
          <div className="input-field_supershop_expense_report">
            <label>To</label>
            <input
              type="date"
              onChange={(event) => setToDate(event.target.value)}
            />
            <button type="submit" onClick={handleFilterDate}>
              Search
            </button>
          </div>
        </div>
        <div className="container_search_column4_supershop_expense_report">
          <div>
            <div>
              <InvestorExportExcel excelData={rows} fileName={"Excel Export"} />
            </div>
          </div>
          <div className="container_button_supershop_expense_report">
            <button onClick={handleClickShowAll}>
              <MdPreview />
            </button>
            <span>Show All</span>
          </div>
        </div>
      </div>
      <div className="second_row_div_supershop_expense_report">
        <div className="table_wrapper_supershop_expense_report">
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
              <tr>
                <th>Serial</th>
                <th>Expence Name</th>
                <th>Cost</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Date</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item, index) => (
                    <tr
                      key={index.transaction_id}
                      onClick={() => hendleDataInputField(item)}
                      className="bg-color"
                      tabindex="0"
                    >
                      <td className="hover-effect">{index + 1}</td>
                      <td className="hover-effect">{item.comment}</td>
                      <td className="hover-effect">{item.amount}</td>

                      <td className="hover-effect">{item.paid}</td>
                      <td className="hover-effect">
                        {parseFloat(item.amount) - parseFloat(item.paid)}
                      </td>
                      <td className="hover-effect">
                        {item.date ? item.date.split("T")[0] : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="third_row_div_supershop_expense_report">
        <div className="container_view_update_supershop_expense_report">
          <div className="container_view_supershop_expense_report">
            <div className="input-field_supershop_expense_report">
              <label>Total Price</label>
              <input
                style={{ fontSize: "1vw", textAlign: "center" }}
                disabled
                value={totalAmount}
              />
            </div>
            <div className="input-field_supershop_expense_report">
              <label>Paid</label>
              <input
                style={{ fontSize: "1vw", textAlign: "center" }}
                disabled
                value={totalPaid}
              />
            </div>
            <div className="input-field_supershop_expense_report">
              <label>Due</label>
              <input
                style={{ fontSize: "1vw", textAlign: "center" }}
                disabled
                value={TotalDue}
              />
            </div>
          </div>
          <h4 style={{ fontSize: "1.2vw" }}>Update Opration</h4>
          <div className="container_update_supershop_expense_report">
            <div className="container-update-column1_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Expense Name</label>
                <input
                  value={expanceName}
                  onChange={(event) => setExpanceName(event.target.value)}
                />
              </div>
              <div className="input-field_supershop_expense_report">
                <label>*Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>
            <div className="container-update-column2_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Total Cost</label>
                <input
                  value={totalCost}
                  onChange={(event) => setTotalCost(event.target.value)}
                />
              </div>
              <div className="input-field_supershop_expense_report">
                <label>Paid</label>
                <input
                  value={paid}
                  onChange={(event) => setPaid(event.target.value)}
                />
              </div>
            </div>
            <div className="container-update-column3_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Due</label>
                <input
                  value={due}
                  onChange={(event) => setDue(event.target.value)}
                />
              </div>
            </div>
            <div className="container-update-column4_supershop_expense_report">
              <div className="container_button_supershop_expense_report">
                <button onClick={updatedData}>
                  <RxUpdate />
                </button>
                <span>Update</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container-update-column5_supershop_expense_report">
          <h4 style={{ fontSize: "1.2vw" }}>Due Paid</h4>
          <div>
            <div
              style={{ marginTop: "3vw" }}
              className="input-field_supershop_expense_report"
            >
              <label style={{ width: "4vw" }}>TK</label>
              <input
                style={{ width: "10vw" }}
                value={duePaid}
                onChange={(event) => setDuePaid(event.target.value)}
              />
            </div>
            <div className="container_button_supershop_expense_report">
              <button onClick={updatedData}>
                <IoIosSave />
              </button>
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ExpanceReport;
