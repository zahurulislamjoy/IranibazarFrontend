import React from "react";
import "./expance-input.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
const ExpanceInput = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [expenseName, setExpenseName] = useState([]);
  const [total, setTotal] = useState([]);
  const [paid, setPaid] = useState([]);
  const [due, setDue] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });

  useEffect(() => {
    setDue(parseFloat(total) - parseFloat(paid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/transactionsRouter/postComPaidAmountTransactionFromAnyPage?amount=${total}&paid=${paid}&comment=${expenseName}&date${currentDate}`
      );

      if (res.status === 200) {
        toast.success("Save Successfully.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="full_div_supershop_expense_input">
      <ToastContainer />
      <div className="first_row_div_supershop_expense_input">
        <div className="container_search_column1_supershop_expense_input">
          <div className="input_field_supershop_expense_input">
            <label>Expense Name</label>
            <input
              value={expenseName}
              onChange={(event) => setExpenseName(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_expense_input">
            <label>Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(event) => setCurrentDate(event.target.value)}
            />
          </div>
        </div>
        <div className="container_search_column2_supershop_expense_input">
          <div className="custom_search_column2_supershop_expense_input">
            <div className="input_field_supershop_expense_input">
              <label>Total Cost</label>
              <input
                value={total}
                onChange={(event) => setTotal(event.target.value)}
              />
            </div>
            <div className="input_field_supershop_expense_input">
              <label>Paid</label>
              <input
                value={paid}
                onChange={(event) => setPaid(event.target.value)}
              />
            </div>
            <div className="input_field_supershop_expense_input">
              <label>Due</label>
              <input
                value={due}
                onChange={(event) => setDue(event.target.value)}
              />
            </div>
          </div>
          <div className="container_button_supershop_expance_input">
            <div>
              <button onClick={handleSave}>
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

export default ExpanceInput;
