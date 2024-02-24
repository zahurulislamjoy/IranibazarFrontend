import React from "react";
import "./stock-operation.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import Excel from "../../image/excel.webp";
import invoiceimg from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import { ToastContainer, toast } from "react-toastify";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
const StockOperation = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [allProduct, setAllProduct] = useState([]);
  const [prodcutType, setProductType] = useState([]);
  const [rows, setRows] = useState([]);
  const [stockId, setStockId] = useState([]);
  const [productIdCode, setProductIdCode] = useState([]);
  const [productName, setProductName] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [warranty, setWarranty] = useState([]);
  const [SaleQuantity, setSaleQuantity] = useState([]);
  const [TotalQuantity, setTotalQuanityt] = useState([]);
  const [minQuantity, setMinQuantity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [FilteredData, setFilteredData] = useState([]);
  const [unit, setUnit] = useState("");
  const [avilableQunaitty, setAvailableQuantities] = useState([]);

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
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/transactionsRouter/getAllTransactions`
      );

      const filteredTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );

      const filterSaleTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Sale"
      );

      // Set the updated rows with available quantity
      setRows(filteredTransactions);
      setSaleQuantity(filterSaleTransactions);
      saveStateProductToSessionStorage(filteredTransactions);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);

      const prevState = getStateProductToSessionStorage();
      if (prevState) {
        setRows(prevState);
        sessionStorage.removeItem("prevState");
      }
    }

    setFilteredData([]);
  };

  useEffect(() => {
    const calculateAvailableQuantity = (
      purchaseTransactions,
      saleTransactions
    ) => {
      const availableQuantities = [];

      // Iterate through purchase transactions
      purchaseTransactions.forEach((purchaseTransaction) => {
        const { ProductTrace, quantity_no } = purchaseTransaction;
        const { product_code } = ProductTrace;
        let availableQuantity = quantity_no;

        // Find matching sale transactions
        const matchingSaleTransaction = saleTransactions.find(
          (saleTransaction) =>
            saleTransaction.ProductTrace.product_code === product_code
        );

        if (matchingSaleTransaction) {
          availableQuantity -= matchingSaleTransaction.quantity_no;
        }

        // Push the calculated available quantity to the array
        availableQuantities.push({ product_code, availableQuantity });
      });

      return availableQuantities;
    };

    // Call the function and set the available quantities state
    const availableQuantities = calculateAvailableQuantity(rows, SaleQuantity);
    setAvailableQuantities(availableQuantities);
  }, [SaleQuantity, rows]);
  console.log(avilableQunaitty);
  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/api/producttraces/getAll`);

      if (response.data) {
        setAllProduct(response.data);

        saveStateToSessionStorage(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      const prevState = getPreviousStateFromSessionStorage();
      if (prevState) {
        setAllProduct(prevState);
        sessionStorage.removeItem("prevState");
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchProductName = () => {
    if (selectedProduct === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ProductTrace.name
        .toLowerCase()
        .includes(selectedProduct.toLowerCase())
    );

    if (results.length === 0) {
      setFilteredData([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };

  const handleSearchproductcode = (e) => {
    if (selectedProductCode === "") {
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = rows.filter((item) =>
      item.ProductTrace.product_code.includes(selectedProductCode)
    );
    if (results.length === 0) {
      setFilteredData([]);
      setRows([]);
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };

  const handlerow = (item) => {
    setStockId(item.invoice_no);
    setQuantity(item.quantity_no);
    setProductIdCode(item.ProductTrace.product_code);
    setProductName(item.ProductTrace.name);
    setProductType(item.ProductTrace.type);
    setMinQuantity(item.ShopName.shop_name);
    setUnit(item.Unit.unit);
    setWarranty(item.warranty);
  };
  const handleReset = () => {
    setStockId("");
    setQuantity("");
    setProductIdCode("");
    setProductName("");
    setProductType("");
    setMinQuantity("");
    setUnit("");
    setWarranty("");
  };

  useEffect(() => {
    if (rows.length > 0) {
      const total = rows.reduce(
        (accumulator, item) => accumulator + parseInt(item.quantity_no),
        0
      );
      setTotalQuanityt(parseInt(total, 10));
    } else {
      setTotalQuanityt(0);
    }
  }, [rows]);
  const formattedTransactions = rows.map((item, index) => ({
    Serial: index + 1,
    product_code: item.ProductTrace?.product_code,
    name: item.ProductTrace?.name,
    type: item.ProductTrace?.type,
    warranty: item.warranty,
    quantity: item.quantity_no,
    sale_price: item.sale_price,
    unit: item.Unit.unit,
  }));
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
  return (
    <>
      <ToastContainer />
      <div className="full_div_stock_operation">
        <div className="first_row_div_stock_operation">
          <div className="search_div_stock_operation">
            <div className="input_field_stock_operation">
              <label>Product Name</label>
              <input
                onChange={(event) => {
                  setSelectedProduct(event.target.value);
                }}
                list="stockproductname"
              />
              <datalist id="stockproductname">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.name}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchProductName}>Search</button>
            </div>
            <div className="input_field_stock_operation">
              <label>Product Code</label>
              <input
                onChange={(event) => {
                  setSelectedProductCode(event.target.value);
                }}
                list="product_code_list"
              />
              <datalist id="product_code_list">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.product_code}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchproductcode}>Search</button>
            </div>
          </div>
          <div className="input_field_stock_operation">
            <button onClick={fetchData}> Show All</button>
          </div>
        </div>
        <div className="second_row_div_stock_operation loading_stock_operation">
          <div
            className={`${
              isLoading ? "loader_spriner" : ""
            } table_wrapper_stock_operation table_div_stock_operation`}
          >
            {isLoading ? (
              <div className="rotating_lines_stock_operation">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            ) : (
              <table border={3} cellSpacing={2} cellPadding={10}>
                <tr>
                  <th>Stock Id</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Type/No.</th>
                  <th>Warranty</th>
                  <th>Quantity</th>
                  <th>Min. Quantity</th>
                  <th>Unit</th>
                </tr>
                <tbody>
                  {FilteredData.length > 0
                    ? FilteredData.map((item, index) => (
                        <tr
                          className="row_sale_expense_report_page"
                          tabIndex="0"
                          key={item.index}
                        >
                          <td>{index + 1}</td>
                          <td>{item.ProductTrace?.product_code}</td>
                          <td>{item.ProductTrace?.name}</td>
                          <td>{item.ProductTrace?.type}</td>
                          <td>{item.warranty}</td>
                          <td>{item.quantity_no}</td>
                          <td>{item.sale_price}</td>
                          <td>{item.Unit.unit}</td>
                        </tr>
                      ))
                    : rows &&
                      rows.map((item, index) => (
                        <tr
                          className="row_sale_expense_report_page"
                          tabindex="0"
                          key={item.index}
                          onClick={() => handlerow(item, index)}
                        >
                          <td>{index + 1}</td>
                          <td>{item.ProductTrace?.product_code}</td>
                          <td>{item.ProductTrace?.name}</td>
                          <td>{item.ProductTrace?.type}</td>
                          <td>{item.warranty}</td>
                          <td>{item.quantity_no}</td>
                          <td>{item.sale_price}</td>
                          <td>{item.Unit.unit}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="third_row_div_stock_operation">
          <div className="container_update_stock">
            <div className="container_update_stock_operation">
              <div className="container_update_column1_stock">
                <div style={{ fontSize: "1.2vw", fontWeight: "bold" }}>
                  View Product Invoice
                </div>
                <div className="upadted_input_field">
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Stock Id</label>
                      <input
                        value={stockId}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product code</label>
                      <input
                        value={productIdCode}
                        onChange={(event) => {
                          setProductIdCode(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Name</label>
                      <input
                        value={productName}
                        onChange={(event) => {
                          setProductName(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Type</label>
                      <input
                        value={prodcutType}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Quantity</label>
                      <input
                        value={quantity}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Unit</label>
                      <input
                        value={unit}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Min. Quantity</label>
                      <input
                        value={minQuantity}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Warranty</label>
                      <input
                        value={warranty}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="custome_stock_operation">
                  <div className="reset_button_stock_operation">
                    <button>
                      <img src={invoiceimg} alt="" />
                    </button>
                    <div>View Invoice</div>
                  </div>

                  <div className="reset_button_stock_operation">
                    <button onClick={handleReset}>
                      <img src={reset} alt="" />
                    </button>
                    <div>Reset</div>
                  </div>
                </div>
              </div>
              <div className="container_update_column2_stock_button">
                <button className="container_update_column2_stock_button_view">
                  View & add Image
                </button>
                <div className="container_update_column2_stock_button_excel">
                  <button
                    onClick={() =>
                      exportToExcel(formattedTransactions, "Stock Report")
                    }
                  >
                    <img src={Excel} alt="" />
                  </button>
                  Excel
                </div>
              </div>

              <div className="container_update_column2_stock">
                <div className="input_field_stock_operation_total">
                  <label>Total Quantity</label>
                  <input value={TotalQuantity} disabled />
                </div>

                <div className="input_field_stock_operation_total">
                  <label> Total Avilable Quantity</label>
                  <input disabled />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* /========================/view report modal */}
      </div>
    </>
  );
};

export default StockOperation;
