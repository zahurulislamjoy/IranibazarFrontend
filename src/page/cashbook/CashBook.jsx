import React, { useEffect, useState, useRef } from "react";
import style from "./CashBook.module.css";
import { Modal } from "antd";
import { FaSearch } from "react-icons/fa";
import { BsFillFileEarmarkExcelFill } from "react-icons/bs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import exportFromJSON from "export-from-json";
import { MdOutlineViewCozy } from "react-icons/md";

const CashBook = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [calculationItems, setCalculationItems] = useState([]);

  const [selectedTabID, setSelectedTabID] = useState(null);

  //date state:
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const singleDateRef = useRef();
  const fromDateRef = useRef();
  const toDateRef = useRef();
  //transection state :
  // const [transaction_id, setTransectionId] = useState("");

  //cash calsulation state
  const [inAmount, setInAmount] = useState("");
  const [outAmount, setOutAmount] = useState("");
  const [totalCash, setTotalCash] = useState("");

  //fetch all transections:
  const fetchData = async () => {
    try {
      const transectionsData = sessionStorage.getItem("transectionsData");
      if (transectionsData) {
        setItems(JSON.parse(transectionsData));
        setCalculationItems(JSON.parse(transectionsData));
      } else {
        const response = await axios.get(
          `${BASE_URL}/api/transactionsRouter/getAllTransactions`
        );
        setItems(response.data);
        setCalculationItems(response.data);
        sessionStorage.setItem(
          "transectionsData",
          JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error("Error fetching or storing transectionsData Data :", error);
    }
  };
  useEffect(() => {
    fetchData();
    return () => sessionStorage.removeItem("transectionsData");
  }, []);

  //handle table row:
  const handleClickTableDataShowInputField = (d) => {
    setSelectedTabID(d.transaction_id);
    const selectedTransection =
      items &&
      items.length > 0 &&
      items.find((i) => i.transaction_id === d.transaction_id);

    if (selectedTransection) {
    }
  };

  //date formating:
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("default", { month: "long" }); // Month in full name
    const year = dateObject.getFullYear();

    return `${day} ${month} ${year}`;
  };

  //handle Search By SingleDate:
  const handleSearchBySingleDate = () => {
    if (singleDate) {
      const formattedSingleDate = new Date(singleDate)
        .toISOString()
        .split("T")[0];
      const filteredItems = calculationItems.filter(
        (item) => item.date.split("T")[0] === formattedSingleDate
      );
      if (filteredItems.length > 0) {
        setItems(filteredItems);
        setSingleDate("");
        singleDateRef.current.value = "";
      } else {
        fetchData();
        toast.error("No date found at this search!");
      }
    } else {
      toast.error("Please pick a date to search");
    }
  };

  //handle FromToDateSearch============:
  // Handle search by date range
  const handleSearchByDateRange = () => {
    if (fromDate && toDate) {
      const formattedFromDate = new Date(fromDate).toISOString().split("T")[0];
      const formattedToDate = new Date(toDate).toISOString().split("T")[0];

      const filteredItems = calculationItems.filter((item) => {
        const itemDate = item.date.split("T")[0];
        return itemDate >= formattedFromDate && itemDate <= formattedToDate;
      });

      if (filteredItems.length > 0) {
        setItems(filteredItems);

        setFromDate("");
        fromDateRef.current.value = "";
        setToDate("");
        toDateRef.current.value = "";
      } else {
        fetchData();
        toast.error("No items found for this date range!");
      }
    } else {
      toast.error("Please select both from and to dates!");
    }
  };

  //handleShowAll:
  const handleShowAll = () => {
    fetchData();
    setSingleDate("");
    setToDate("");
    setFromDate("");
  };

  //========amountCalculation===:
  useEffect(() => {
    const handleCalculation = () => {
      if (calculationItems && calculationItems.length > 0) {
        // Calculate the total In amount
        const filteredInItems = calculationItems.filter(
          (item) => item.operation_type_id === 1
        );
        const InAmount = filteredInItems.reduce(
          (total, item) => total + parseFloat(item.amount),
          0
        );
        setInAmount(InAmount);
        // Calculate the total Out amount
        const filteredOutItems = calculationItems.filter(
          // eslint-disable-next-line eqeqeq
          (item) => item.operation_type_id != 1
        );
        const OutAmount = filteredOutItems.reduce(
          (total, item) => total + parseFloat(item.amount),
          0
        );
        setOutAmount(OutAmount);
        const totalCash = InAmount - OutAmount;
        setTotalCash(totalCash);
      }
    };
    handleCalculation();
  }, [calculationItems]);

  // =========handleXlDownload==========
  const handleXlDownload = () => {
    const data = items;
    const fileName = "cashbook_excel_data";
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data, fileName, exportType });
  };
  //modal functionality:
  // eslint-disable-next-line no-unused-vars
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={style.cash_Holder}>
      <Toaster />
      <div className={style.cash_container}>
        {/* /==========/header ============== */}
        <div className={`${style.cash_header} ${style.card}`}>
          {/* //dateDiv */}
          <div className={style.dateDiv}>
            <div className={style.date}>
              <div className={style.dateLabelDiv}>
                <label htmlFor="date" className={style.dateLabel}>
                  Date
                </label>
              </div>
              <div className={style.dateInputDiv}>
                <input
                  type="date"
                  className={style.dateInput}
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  ref={singleDateRef}
                />
              </div>
            </div>
            <div className={style.dateBtnsearch}>
              <button
                className={style.dateButton}
                onClick={handleSearchBySingleDate}
              >
                <FaSearch className={style.searchIcon} />
              </button>
            </div>
          </div>
          {/* fromToDateDiv */}
          <div className={style.fromToDateDiv}>
            <div className={style.dateDiv}>
              <div className={style.date}>
                <div className={style.dateLabelDiv}>
                  <label htmlFor="date" className={style.dateLabel}>
                    From
                  </label>
                </div>
                <div className={style.dateInputDiv}>
                  <input
                    type="date"
                    className={style.dateInput}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    ref={fromDateRef}
                  />
                </div>
              </div>
            </div>
            {/* todate */}
            <div className={style.dateDiv}>
              <div className={style.date}>
                <div className={style.dateLabelDiv}>
                  <label htmlFor="date" className={style.dateLabel}>
                    To
                  </label>
                </div>
                <div className={style.dateInputDiv}>
                  <input
                    type="date"
                    className={style.dateInput}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    ref={toDateRef}
                  />
                </div>
              </div>
            </div>

            {/* //btn */}
            <div className={style.dateBtnsearch}>
              <button
                className={style.dateButton}
                onClick={handleSearchByDateRange}
              >
                <FaSearch className={style.searchIcon} />
              </button>{" "}
            </div>
          </div>
          {/* showAllDiv */}
          <div className={style.showAllDiv}>
            <div className={style.divForALlbutton}>
              <button className={style.showAll_button} onClick={handleShowAll}>
                <MdOutlineViewCozy className="viewAllIcon" />
              </button>
              <p className="buttonText">Show All</p>
            </div>
          </div>
        </div>
        {/* /==========/main ============== */}

        <div className={`${style.cash_main} ${style.card}`}>
          <div className={style.cash_tableDiv}>
            <table className={style.cash_table}>
              <thead className={style.cash_table_thead}>
                <tr className={style.cash_table_head_tr}>
                  <th className={style.cash_table_head_th}>Serial</th>
                  <th className={style.cash_table_head_th}>Type</th>
                  <th className={style.cash_table_head_th}>Invoice No</th>
                  <th className={style.cash_table_head_th}>ID</th>
                  <th className={style.cash_table_head_th}>Comment</th>
                  <th className={style.cash_table_head_th}>Date</th>
                  <th className={style.cash_table_head_th}>In Amount</th>
                  <th className={style.cash_table_head_th}>Out Amount</th>
                </tr>
              </thead>
              <tbody className={style.cash_table_Body}>
                {items &&
                  items.length > 0 &&
                  items.map((d, index) => {
                    return (
                      <tr
                        key={d.transaction_id}
                        className={`
    ${
      selectedTabID === d.transaction_id
        ? `${style.cash_tr} ${style.tab_selected}`
        : style.cash_tr
    }
  `}
                        onClick={() => handleClickTableDataShowInputField(d)}
                        tabIndex="0"
                      >
                        <td className={style.cash_table_Body_td}>{index}</td>

                        <td className={style.cash_table_Body_td}>
                          {d.OperationType?.operation_name}
                        </td>
                        <td className={style.cash_table_Body_td}>
                          {d.invoice_no}
                        </td>
                        <td className={style.cash_table_Body_td}>
                          {d.transaction_id}
                        </td>
                        <td className={style.cash_table_Body_td}>
                          {d.comment ? d.comment : ""}
                        </td>
                        <td className={style.cash_table_Body_td}>
                          {formatDate(d.date)}
                        </td>
                        <td
                          className={style.cash_table_Body_td}
                          style={{ backgroundColor: "lightGreen" }}
                        >
                          {d.operation_type_id === 1 ? d.amount : 0}
                        </td>
                        <td
                          className={style.cash_table_Body_td}
                          style={{ backgroundColor: "#B7CDC2" }}
                        >
                          {d.operation_type_id !== 1 ? d.amount : 0}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        {/* /==========/Footer ============== */}

        <div className={`${style.cash_Footer} ${style.card}`}>
          <div className={style.totalDiv}>
            <div className={style.Amount}>
              <div className={style.amountebelDiv}>
                <label htmlFor="Amount" className={style.amountLabel}>
                  Total In Amount
                </label>
              </div>
              <div className={style.amountInputDiv}>
                <input
                  type="text"
                  className={style.amountInput}
                  value={inAmount}
                />
              </div>
            </div>
            <div className={style.Amount}>
              <div className={style.amountebelDiv}>
                <label htmlFor="Amount" className={style.amountLabel}>
                  Total Out Amount
                </label>
              </div>
              <div className={style.amountInputDiv}>
                <input
                  type="text"
                  className={style.amountInput}
                  value={outAmount}
                />
              </div>
            </div>
            <div className={style.Amount}>
              <div className={style.amountebelDiv}>
                <label htmlFor="Amount" className={style.amountLabel}>
                  Total Cash
                </label>
              </div>
              <div className={style.amountInputDiv}>
                <input
                  type="text"
                  className={style.amountInput}
                  value={totalCash}
                  style={{ color: totalCash > 0 ? "green" : "red" }}
                />
              </div>
            </div>
          </div>
          <div className={style.cashOperationDiv}>
            <div className={style.chasOperationBtnDiv}>
              {/* <button className={style.chasOperationBtn} onClick={showModal}>
                Cash Operation
              </button> */}
            </div>
          </div>
          <div className={style.excelExportDiv}>
            <div className={style.excelExportBtnDiv}>
              <div className={style.divForALlbutton}>
                <button
                  className={style.excelExportBtn}
                  onClick={handleXlDownload}
                >
                  <BsFillFileEarmarkExcelFill className={style.xlIcon} />{" "}
                </button>
                <p className={style.buttonText}>Excel Report</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /===================/cashoperation modal */}
      <div className={style.operationModalDiv}>
        <Modal
          title="Cash Operation"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={"60%"}
          style={{
            top: 150,
          }}
        >
          <div className={style.operationModalContent}>
            <div className={`${style.cash_Footer} ${style.card}`}>
              <div className={style.totalDiv}>
                <div className={style.Amount}>
                  <div className={style.amountebelDiv}>
                    <label htmlFor="Amount" className={style.amountLabel}>
                      *Type
                    </label>
                  </div>
                  <div className={style.amountInputDiv}>
                    <input type="text" className={style.amountInput} />
                  </div>
                </div>
                <div className={style.Amount}>
                  <div className={style.amountebelDiv}>
                    <label htmlFor="Amount" className={style.amountLabel}>
                      Take/Money
                    </label>
                  </div>
                  <div className={style.amountInputDiv}>
                    <input type="text" className={style.amountInput} />
                  </div>
                </div>
                <div className={style.Amount}>
                  <div className={style.amountebelDiv}>
                    <label htmlFor="Amount" className={style.amountLabel}>
                      Comment
                    </label>
                  </div>
                  <div className={style.amountInputDiv}>
                    <input type="text" className={style.amountInput} />
                  </div>
                </div>
              </div>
              <div className={style.excelExportDiv}>
                <div className={style.excelExportBtnDiv}>
                  <button className={style.excelExportBtn}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CashBook;
