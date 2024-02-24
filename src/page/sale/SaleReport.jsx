import React, { useEffect, useState, useRef } from "react";
import "./salereport.css";
import ExcelExport from "../../components/ExportExcel";
import { MdPreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

const SaleReport = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [filteredRows, setFilteredRows] = useState([]);
  const [productName, setProductName] = useState([]);
  const [DateFrom, setDateFrom] = useState([]);
  const [DateTo, setDateTo] = useState([]);
  const [type, setType] = useState([]);
  const [warranty, setWarranty] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [total, setTotal] = useState("");
  const [product, setProduct] = useState("");
  const [ptype, setPtype] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [code, setCode] = useState("");
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState("");
  const [shopName, setShopName] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    document.title = "Sale Report";
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axios.get(
          `${BASE_URL}/api/transactionsRouter/getAllTransactions`
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        setTimeout(() => {
          setRows(datas_getAllTranscatioData);
          setFixData([...new Set(datas_getAllTranscatioData)]);
          console.log(datas_getAllTranscatioData);
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

        setTimeout(() => {
          setRows(datas_getAllTranscatioData);
          console.log(datas_getAllTranscatioData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  };

  //code search
  const handleFilterDataCode = () => {
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.product_code
            .toLowerCase()
            .includes(filteredRows.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // type search
  const handleFilterType = () => {
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.type.toLowerCase().includes(type.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // product search
  const handleFilterProduct = () => {
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.name
            .toLowerCase()
            .includes(productName.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // data search

  // product search
  const handleFilterDate = () => {
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return (
          itemDate.includes(DateFrom.toLowerCase()) &&
          itemDate.includes(DateTo.toLowerCase())
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const hendleDataInputField = (item) => {
    setCode(item.ProductTrace ? item.ProductTrace.product_code : "");
    setProduct(item.ProductTrace ? item.ProductTrace.name : "");
    setPtype(item.ProductTrace ? item.ProductTrace.type : "");
    setUnit(item.Unit ? item.Unit.unit : "");
    setQuantity(item.quantity_no);
    setTotal(parseFloat(item.amount) * parseFloat(item.quantity_no));
    setPaid(item.paid);
    setWarranty(item.warranty);
    setDate(item.date ? item.date.split("T")[0] : "");
    setSalePrice(item.amount);
    setDue(
      parseFloat(item.amount) * parseFloat(item.quantity_no) -
        parseFloat(item.paid)
    );
    setShopName(item.ShopName ? item.ShopName.shop_name : "");
  };

  const totalAmount =
    rows && rows.length > 0
      ? rows
          .reduce((total, item) => {
            const amount = parseFloat(item.amount) || 0;
            const discount = parseFloat(item.quantity_no) || 0;
            const itemTotal = amount * discount;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  return (
    <div className="full_div_supershop_sale_report">
      <ToastContainer />
      <div className="first_row_div_supershop_sale_report">
        <div className="container_supershop_sale_report">
          <div className="container_supershop_sale_report_column1">
            <div className="input_field_supershop_sale_report">
              <label>From Date</label>
              <input
                type="date"
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="input_field_supershop_sale_report">
              <label>Porduct</label>
              <input
                onChange={(e) => setProductName(e.target.value)}
                list="product"
              />
              <datalist id="product">
                {rows.length > 0 &&
                  rows.map((items, index) => {
                    return (
                      <option key={index}>
                        {items.ProductTrace && items.ProductTrace.name}
                      </option>
                    );
                  })}
              </datalist>
              <button onClick={handleFilterProduct}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column2">
            <div className="input_field_supershop_sale_report">
              <label>To Date</label>
              <input type="date" onChange={(e) => setDateTo(e.target.value)} />
              <button onClick={handleFilterDate}>Search</button>
            </div>
            <div className="input_field_supershop_sale_report">
              <label>Type</label>
              <input onChange={(e) => setType(e.target.value)} list="type" />
              <datalist id="type">
                {fixData.length > 0 &&
                  fixData.map((items, index) => {
                    return (
                      <option key={index}>
                        {items.ProductTrace && items.ProductTrace.type}
                      </option>
                    );
                  })}
              </datalist>
              <button onClick={handleFilterType}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column3">
            <div className="input_field_supershop_sale_report">
              <label>BarCode</label>
              <input
                value={filteredRows}
                onChange={(event) => setFilteredRows(event.target.value)}
                list="barcode"
              />
              <datalist id="barcode">
                {fixData.length > 0 &&
                  fixData.map((items, index) => {
                    return (
                      <option key={index}>
                        {items.ProductTrace && items.ProductTrace.product_code}
                      </option>
                    );
                  })}
              </datalist>

              <button onClick={handleFilterDataCode}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column4">
            <div className="container_sheet_button_sale_report">
              <button onClick={handleClickShowAll}>
                <MdPreview />
              </button>
              <span>Show All</span>
            </div>
            <div>
              <ExcelExport />
            </div>
          </div>
        </div>
      </div>
      <div className="second_row_div_supershop_sale_report">
        {isLoading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        ) : (
          <div className="container_table_supershop_sale_report">
            <table border={3} cellSpacing={2} cellPadding={10}>
              <tr>
                <th>BarCode</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Warranty</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Paid</th>
                <th>Total Amount</th>
                <th>Due</th>
                <th>Sale Date</th>
                <th>Unit</th>
                <th>Shop Name</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item) => (
                    <tr
                      key={item.transaction_id}
                      onClick={() => hendleDataInputField(item)}
                      className="bg-color"
                      tabindex="0"
                    >
                      <td className="hover-effect">
                        {item.ProductTrace
                          ? item.ProductTrace.product_code
                          : ""}
                      </td>
                      <td className="hover-effect">
                        {item.ProductTrace ? item.ProductTrace.name : ""}
                      </td>
                      <td className="hover-effect">
                        {item.ProductTrace ? item.ProductTrace.type : ""}
                      </td>
                      <td className="hover-effect">{item.warranty}</td>
                      <td className="hover-effect">{item.amount}</td>
                      <td className="hover-effect">{item.quantity_no}</td>

                      <td className="hover-effect">
                        {item.Tax ? item.Tax.rate : ""}
                      </td>

                      <td className="hover-effect">{item.discount}</td>
                      <td className="hover-effect">{item.paid}</td>
                      <td className="hover-effect">
                        {parseFloat(item.amount) * parseFloat(item.quantity_no)}
                      </td>
                      <td className="hover-effect">
                        {parseFloat(item.amount) *
                          parseFloat(item.quantity_no) -
                          parseFloat(item.paid)}
                      </td>
                      <td className="hover-effect">
                        {item.date ? item.date.split("T")[0] : ""}
                      </td>
                      <td className="hover-effect">
                        {item.Unit ? item.Unit.unit : ""}
                      </td>
                      <td className="hover-effect">
                        {item.ShopName ? item.ShopName.shop_name : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="third_row_div_supershop_sale_report">
        <div className="conatiner_update_supershop_sale_report_column1">
          <div className="input_field_supershop_sale_report">
            <label>BarCode</label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Name</label>
            <input
              value={product}
              onChange={(event) => setProduct(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Type</label>
            <input
              value={ptype}
              onChange={(event) => setPtype(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column2">
          <div className="input_field_supershop_sale_report">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Total</label>
            <input
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Paid</label>
            <input
              value={paid}
              onChange={(event) => setPaid(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Due</label>
            <input
              value={due}
              onChange={(event) => setDue(event.target.value)}
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column3">
          <div className="input_field_supershop_sale_report">
            <label>Unit</label>
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            ></select>
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Sale Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Warranty</label>
            <input
              value={warranty}
              onChange={(event) => setWarranty(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Shop Name</label>
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column4">
          <div className="container_sheet_button_sale_report">
            <button onClick={handlePrint}>
              <MdLocalPrintshop />
            </button>
            <span>Invoice</span>
          </div>
        </div>

        <div className="conatiner_update_supershop_sale_report_column5">
          <div className="input_field_supershop_sale_report">
            <label style={{ justifyContent: "center" }}>Total</label>
            <input
              style={{ width: "11vw", marginRight: "1vw" }}
              value={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReport;
