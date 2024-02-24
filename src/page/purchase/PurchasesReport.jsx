import React, { useEffect, useState, useRef } from "react";
import "./purchases_report.css";
import update from "../../image/Update.png";
import invoiceimg from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import Excel from "../../image/excel.webp";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlinePreview } from "react-icons/md";
import * as FileSaver from "file-saver";
import { useReactToPrint } from "react-to-print";

import { ComponentToPrint } from "../../components/GenaratePdf";

import XLSX from "sheetjs-style";
const PurchasesReport = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(0);

  const [searcProductName, setSearchProductName] = useState("");
  const [searcProductCode, setSearchProductCode] = useState("");
  const [Searchcategory, setSearchcategory] = useState([]);
  // const [category, setcategory] = useState([]);
  const [product_code, setProductCode] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_type, setProductType] = useState("");
  const [purchase_price, setPurchasePrice] = useState("");
  const [purchase_date, setPurchasedate] = useState("");
  const [shop_name, setShopName] = useState("");
  const [sale_price, setSalePrice] = useState([]);
  const [qunatity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [invoice, setInvoice] = useState("");
  const [total, setTotal] = useState("");
  const [productdata, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [discount, setDiscount] = useState("");
  // const [prevTotal, SetPrevTotal] = useState("")
  // const [netotal, setNetTotal] = useState("")
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async (excelData, fileName) => {
    console.log(excelData);
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    document.title = "Product Purchase Report";
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveStateToSessionStorage = (state) => {
    sessionStorage.setItem("prevState", JSON.stringify(state));
  };

  const getPreviousStateFromSessionStorage = () => {
    const prevState = sessionStorage.getItem("productState");
    return prevState ? JSON.parse(prevState) : null;
  };
  const saveStateProductToSessionStorage = (state) => {
    sessionStorage.setItem("productState", JSON.stringify(state));
  };

  const getStateProductToSessionStorage = () => {
    const prevState = sessionStorage.getItem("prevState");
    return prevState ? JSON.parse(prevState) : null;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/transactionsRouter/getAllTransactions`
      );

      if (response.data) {
        setData(response.data);

        saveStateToSessionStorage(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      const prevState = getPreviousStateFromSessionStorage();
      if (prevState) {
        setData(prevState);
        sessionStorage.removeItem("prevState");
      }
    }
    setFilteredData([]);
    setRows(data);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/producttraces/getAll`
        );
        setProductData(response.data);

        saveStateProductToSessionStorage(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);

        const prevState = getStateProductToSessionStorage();
        if (prevState) {
          setProductData(prevState);
          sessionStorage.removeItem("productState");
        }
      }
    };
    const fetchDataUnit = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/units/getAll`);
        setUnitData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProductData();
    fetchDataUnit();
  }, []);

  useEffect(() => {
    const filteredTransactions = data.filter(
      (transaction) =>
        transaction.OperationType &&
        transaction.OperationType.operation_name === "Purchase"
    );
    setRows(filteredTransactions);
  }, [data]);

  const handleSearch = () => {
    if (searcProductName === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ProductTrace.name
        .toLowerCase()
        .includes(searcProductName.toLowerCase())
    );

    if (results.length === 0) {
      setFilteredData([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };

  const handleSearchproductcode = (e) => {
    if (searcProductCode === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ProductTrace.product_code
        .toLowerCase()
        .includes(searcProductCode.toLowerCase())
    );
    if (results.length === 0) {
      setFilteredData([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };
  const handleSearchcategory = (e) => {
    if (Searchcategory === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ProductTrace.Category.category_name
        .toLowerCase()
        .includes(Searchcategory.toLowerCase())
    );
    if (results.length === 0) {
      setFilteredData([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };
  const handlerow = (item, index) => {
    setActiveRowIndex(index);
    setQuantity(item.quantity_no);
    setPurchasedate(item.date);
    setSalePrice(item.sale_price);
    setPurchasePrice(item.purchase_price);
    setProductCode(item.ProductTrace.product_code);
    setProductName(item.ProductTrace.name);
    setProductType(item.ProductTrace.type);
    setShopName(item.ShopName.shop_name);

    setInvoice(item.invoice_no);
    setUnit(item.Unit.unit);
    setDiscount(item.discount);

    // setNetTotal(item.amount)
    // if (item.discount > 0) {
    //   const total = Math.floor(calculateTotalWithDiscount(item.purchase_price,item.quantity_no,item.discount))
    //   setTotal(total)
    //   SetPrevTotal(total)
    // }
    // else{
    //   setTotal(parseInt(item.purchase_price) * parseInt(item.quantity_no))
    // }
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearchDateStartend = () => {
    if (startDate === "" && endDate === "") {
      toast.warning("Please filup search input");
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
        return true;
      }
    });
    toast.warning(filtered.length === 0 ? "No matching data found" : "");
    setFilteredData(filtered);
  };
  const handledateSearch = () => {
    if (date === "") {
      toast.warning("Please filup search input");
      return;
    }
    const filtered = rows.filter((item) => {
      const itemDate = item.date.split("T")[0];
      console.log("data", itemDate);
      console.log("date", date);
      const rangeStartDate = date;

      if (rangeStartDate) {
        return itemDate === rangeStartDate;
      } else {
        return true;
      }
    });
    toast.warning(filtered.length === 0 ? "No matching data found" : "");

    // Update filtered data
    setFilteredData(filtered);
  };
  const handleReset = () => {
    setQuantity("");

    setPurchasedate("");
    setSalePrice("");
    setPurchasePrice("");
    setProductCode("");
    setProductName("");
    setProductType("");
    setShopName("");
    setTotal("");
    setInvoice("");
    setUnit("");
    setActiveRowIndex(null);
  };
  useEffect(() => {
    if (rows && rows.length > 0) {
      const total = rows.reduce((accumulator, item) => {
        return accumulator + parseInt(item.amount);
      }, 0);
      setTotalAmount(parseInt(total, 10));
      console.log(total);
    } else {
      setTotalAmount(0);
    }
  }, [rows]);

  const calculateTotalWithDiscount = (price, quantity, discountPercentage) => {
    // Convert price and quantity to integers
    const parsedPrice = parseInt(price);
    const parsedQuantity = parseInt(quantity);

    // Calculate the total without discount
    const totalWithoutDiscount = parsedPrice * parsedQuantity;

    // Calculate the discount amount
    const discountAmount = (totalWithoutDiscount * discountPercentage) / 100;

    // Calculate the total after applying the discount
    const totalWithDiscount = totalWithoutDiscount - discountAmount;

    return totalWithDiscount || "";
  };
  // const totalDifference = total - prevTotal;
  // console.log(totalDifference);
  // // Update the transaction amount based on the difference
  // let newTransactionAmount;
  // if (totalDifference > 0) {
  //     // If the item total increases, add the difference to the transaction amount
  //     newTransactionAmount = parseInt(netotal) + totalDifference;

  // } else if (totalDifference < 0) {
  //     // If the item total decreases, subtract the absolute difference from the transaction amount
  //     newTransactionAmount = parseInt(netotal) - Math.abs(totalDifference);
  // } else {
  //     // If there's no change in the item total, keep the transaction amount unchanged
  //     newTransactionAmount = parseInt(netotal);
  // }

  // const saveData = {

  //   invoice_no: invoice,
  //   product_trace_id: updateData.ProductTrace?.product_trace_id,
  //   quantity_no: qunatity,
  //   unit_id: updateData.Unit?.unit_id,
  //   brand_id: updateData.Brand?.brand_id,
  //   warranty: updateData.warranty,
  //   tax_id: updateData.Tax?.tax_id,
  //   amount: newTransactionAmount,
  //   authorized_by_id: 1,
  //   contributor_name_id:updateData.ContributorName?.contributor_name_id ,
  //   operation_type_id: 2,
  //   date: updateData.date,
  //   payment_type_id: updateData.PaymentType?.payment_type_id,
  //   paid: updateData.paid,
  //   employee_id: 1,
  //   purchase_price: purchase_price,
  //   sale_price: sale_price,
  //   discount: discount || 0,
  //   shop_name_id: 1,
  // };
  const handleUpdate = async () => {
    //
    toast("Upadte button is  Updated");
  };
  useEffect(() => {
    if (discount > 0) {
      setTotal(
        Math.floor(
          calculateTotalWithDiscount(purchase_price, qunatity, discount)
        )
      );
    } else {
      setTotal(parseInt(purchase_price) * parseInt(qunatity) || "");
    }
  }, [discount, purchase_price, qunatity]);

  const newDataArray =
    rows.length > 0 &&
    rows.map((row) => ({
      category_name: row.ProductTrace?.Category?.category_name || "",
      product_code: row.ProductTrace?.product_code || "",
      name: row.ProductTrace?.name || "",
      type: row.ProductTrace?.type || "",
      brand_name: row.Brand?.brand_name || "",
      quantity_no: row.quantity_no || "",
      unit: row.Unit?.unit || "",
      purchase_price: row.purchase_price || "",
      discount: row.discount || "",
      total:
        row.discount > 0
          ? Math.floor(
              calculateTotalWithDiscount(
                row.purchase_price,
                row.quantity_no,
                row.discount
              )
            )
          : parseInt(row.purchase_price) * parseInt(row.quantity_no),
      sale_price: row.sale_price || "",
      date: row.date ? row.date.split("T")[0] : "",
      shop_name: row.ShopName?.shop_name || "",
    }));
  return (
    <>
      <div className="full_div_purchases_report">
        <ToastContainer />
        <div className="first_row_div_purchase_report">
          <div className="invisible_div_purchase_report">
            <div className="input_field_purchase_report">
              <div className="purchases_report_input">
                <div className="date_input_field_short_long_purchase_report">
                  <label className="label_field_supershop_purchase">Date</label>
                  <input
                    type="date"
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <button onClick={handledateSearch}>Search</button>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Category
                  </label>
                  <input
                    type="text"
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setSearchcategory(e.target.value)}
                    list="category_list"
                  />
                  <datalist id="category_list">
                    {productdata.length > 0 &&
                      productdata.map((product, index) => {
                        return (
                          <option key={index}>
                            {product.Category.category_name}
                          </option>
                        );
                      })}
                  </datalist>
                  <button onClick={handleSearchcategory}>Search</button>
                </div>
              </div>
              <div className="purchases_report_input">
                <div
                  className="date_input_field_short_long_purchase_report"
                  style={{ marginRight: "6vw" }}
                >
                  <label className="label_field_supershop_purchase">
                    From Date
                  </label>
                  <input
                    className="input_field_supershop_purchase_long"
                    type="date"
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Name
                  </label>
                  <input
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setSearchProductName(e.target.value)}
                    list="product_list"
                  />
                  <datalist id="product_list">
                    {productdata.length > 0 &&
                      productdata.map((product, index) => {
                        return <option key={index}>{product.name}</option>;
                      })}
                  </datalist>
                  <button onClick={handleSearch}>Search</button>
                </div>
              </div>
              <div className="purchases_report_input">
                <div className="date_input_field_short_long_purchase_report">
                  <label className="label_field_supershop_purchase">
                    To Date
                  </label>
                  <input
                    className="input_field_supershop_purchase_long"
                    type="date"
                    onChange={handleEndDateChange}
                  />
                  <button onClick={handleSearchDateStartend}>Search</button>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Code
                  </label>
                  <input
                    type="number"
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setSearchProductCode(e.target.value)}
                    list="product_code_list"
                  />
                  <datalist id="product_code_list">
                    {productdata.length > 0 &&
                      productdata.map((product, index) => {
                        return (
                          <option key={index}>{product.product_code}</option>
                        );
                      })}
                  </datalist>
                  <button onClick={handleSearchproductcode}> Search</button>
                </div>
              </div>
              <div className="show_all_purchase_button">
                <button onClick={fetchData}>
                  <MdOutlinePreview style={{ fontSize: "2vw" }} />
                </button>
                <div className="button_title">Show All</div>
              </div>
            </div>
          </div>
        </div>
        <div className="second_row_div_purchase_report">
          <div className="table_supershop_purchase_report">
            <div
              className={`${
                loading ? "loader_spriner" : ""
              } table_div_supershop_purchase`}
            >
              {loading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="64"
                  visible={true}
                />
              ) : (
                <table className="" border={3} cellSpacing={2} cellPadding={5}>
                  <thead>
                    <tr>
                      <th style={Color}>Serial</th>
                      <th style={Color}>Category</th>
                      <th style={Color}>Product Code</th>
                      <th style={Color}>Product Name</th>
                      <th style={Color}>Product Type</th>
                      <th style={Color}>Brand</th>
                      <th style={Color}>Quantity</th>
                      <th style={Color}>Unit</th>
                      <th style={Color}>Purchase Price</th>
                      <th style={Color}>Discount</th>
                      <th style={Color}>Item Total</th>
                      <th style={Color}>Sale Price</th>
                      <th style={Color}>Date</th>
                      <th style={Color}>Shop</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length > 0
                      ? filteredData &&
                        filteredData.map((row, index) => (
                          <tr
                            key={index}
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            onClick={() => handlerow(row, index)}
                          >
                            <td>{index + 1}</td>
                            <td>{row.ProductTrace?.Category?.category_name}</td>
                            <td>{row.ProductTrace?.product_code}</td>
                            <td>{row.ProductTrace?.name}</td>
                            <td>{row.ProductTrace?.type}</td>
                            <td>{row.Brand.brand_name}</td>
                            <td>{row.quantity_no}</td>
                            <td>{row.Unit.unit}</td>
                            <td>{row.purchase_price}</td>
                            <td>{row.discount}%</td>
                            <td>
                              {row.discount > 0
                                ? Math.floor(
                                    calculateTotalWithDiscount(
                                      row.purchase_price,
                                      row.quantity_no,
                                      row.discount
                                    )
                                  )
                                : parseInt(row.purchase_price) *
                                  parseInt(row.quantity_no)}
                            </td>
                            <td>{row.amount}</td>
                            <td>{row.date.split("T")[0]}</td>
                            <td>{row.ShopName.shop_name}</td>
                          </tr>
                        ))
                      : rows &&
                        rows.map((row, index) => (
                          <tr
                            key={index}
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            onClick={() => handlerow(row, index)}
                          >
                            <td>{index + 1}</td>
                            <td>{row.ProductTrace?.Category?.category_name}</td>
                            <td>{row.ProductTrace?.product_code}</td>
                            <td>{row.ProductTrace?.name}</td>
                            <td>{row.ProductTrace?.type}</td>
                            <td>{row.Brand?.brand_name}</td>
                            <td>{row.quantity_no}</td>
                            <td>{row.Unit.unit}</td>
                            <td>{row.purchase_price}</td>
                            <td>{row.discount}%</td>
                            <td>
                              {row.discount > 0
                                ? Math.floor(
                                    calculateTotalWithDiscount(
                                      row.purchase_price,
                                      row.quantity_no,
                                      row.discount
                                    )
                                  )
                                : parseInt(row.purchase_price) *
                                  parseInt(row.quantity_no)}
                            </td>
                            <td>{row.sale_price}</td>
                            <td>{row.date.split("T")[0]}</td>
                            <td>{row.ShopName.shop_name}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="input_field_short_total">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1vw",
                }}
                className="label_field_supershop_purchase"
              >
                Total
              </label>
              <input
                value={TotalAmount}
                className="input_field_supershop_purchase"
              />
            </div>
          </div>
        </div>
        <div className="third_row_div_purchase">
          <div className="first_column_second_row_purchase_report">
            <div className="first_column_second_row_input_field_purchase_report">
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Invoice
                  </label>
                  <input
                    type="text"
                    value={invoice}
                    className="input_field_supershop_purchase_long"
                  />
                </div>

                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={product_code}
                    className="input_field_supershop_purchase_long"
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={product_name}
                    className="input_field_supershop_purchase_long"
                    style={{ boxShadow: "none" }}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Product Type
                  </label>
                  <input
                    type="text"
                    value={product_type}
                    className="input_field_supershop_purchase_long"
                  />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={qunatity}
                    className="input_field_supershop_purchase_long quantity_add_purchaes_report"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <input
                    type="text"
                    value={unit}
                    className="unit_add_purchaes_report"
                    list="select_unit"
                  />
                  <datalist id="select_unit">
                    {unitData.length > 0 &&
                      unitData.map((unit, index) => {
                        return <option key={index}>{unit.unit}</option>;
                      })}
                  </datalist>
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    value={purchase_price}
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={discount}
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Item Total
                  </label>
                  <input
                    type="text"
                    value={total}
                    className="input_field_supershop_purchase_long"
                  />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Sale Price
                  </label>
                  <input
                    type="text"
                    value={sale_price}
                    className="input_field_supershop_purchase_long"
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">
                    Purchase Date
                  </label>
                  <input
                    type="text"
                    value={purchase_date.split("T")[0]}
                    className="input_field_supershop_purchase_long"
                  />
                </div>
                <div className="input_field_short_long_purchse_report">
                  <label className="label_field_supershop_purchase">Shop</label>
                  <input
                    type="text"
                    value={shop_name}
                    className="input_field_supershop_purchase_long"
                  />
                </div>
              </div>
            </div>
            <div className="all_update_button_purchses_report">
              <div className="update_button_purchses_report">
                <button onClick={handleUpdate}>
                  <img src={update} alt="" />
                </button>
                Update
              </div>
              <div className="Second_update_button_purchses_report">
                <div style={{ display: "none" }}>
                  <ComponentToPrint ref={componentRef} />
                </div>
                <button onClick={handlePrint}>
                  <img src={invoiceimg} alt="" />
                </button>
                View Invoice
              </div>
            </div>
          </div>

          <div className="second_column_second_row_purchase_report">
            <div className="reset_button_purchses_report">
              <button onClick={handleReset}>
                <img src={reset} alt="" />
              </button>
              Reset
            </div>
            <div className="reset_button_purchses_report">
              <button
                onClick={() =>
                  exportToExcel(newDataArray, "Product Purchase Report")
                }
              >
                <img src={Excel} alt="" />
              </button>
              Excel
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesReport;
