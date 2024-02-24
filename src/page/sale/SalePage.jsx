import React, { useCallback } from "react";
import "./sale_page.css";
import { Button, Modal } from "antd";
import { useState, useEffect, useRef } from "react";
import Invoice from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import Save from "../../image/Save.png";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { PosInvoice } from "../../components/Pos.js";
import { ToastContainer, toast } from "react-toastify";
const SalePage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });
  const today = new Date();
  const formattedDate = today.toISOString();

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const Employee = localStorage.setItem("username");
  const [contributor_name, setContributorName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [shopNameData, setShopNAmeData] = useState([]);
  // const [Employee, setEmployee] = useState("");
  const [payment_id, setPaymentId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [paid, setPaid] = useState("");
  const [discount, setDiscount] = useState(0);
  const [netTotal, setNetTotal] = useState([]);
  const [data, setData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [VAT, setVAT] = useState(null);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [customerData, setCustomer] = useState([]);
  const [VatData, setVatData] = useState([]);
  const [saveData, setSaveData] = useState([]);
  const [vatID, setVatID] = useState("");
  const [saleData, setsaleData] = useState([]);
  const [fixData, setFixData] = useState([]);

  useEffect(() => {
    if (paymentTypeData && paymentTypeData.length > 0) {
      const cashPayment = paymentTypeData.find(
        (data) => data.payment_type === "Cash"
      );
      if (cashPayment) {
        setPaymentId(cashPayment.payment_type_id);
      }
    }
  }, [paymentTypeData]);
  // handle data fatch
  const handleDataFetch = async () => {
    try {
      // Make an HTTP GET request using axios
      const response = await axios.get(
        `${BASE_URL}/api/transactionsRouter/getAllTransactions`
      );

      const filteredTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );

      setData(filteredTransactions);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/paymenttypes/getAll`);
      setPaymentTypeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/contributorname/getAll`
      );

      const filteredData = response.data.filter(
        (item) => item.contributor_type_id === 1
      );

      setCustomer(filteredData);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchShop = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shopname/getAll`);

      setShopNAmeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchVatData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tax/getAll`);

      setVatData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const generateInvoiceNumber = () => {
      const validInvoiceNumbers = data
        .map((item) => parseInt(item.invoice_no))
        .filter((number) => !isNaN(number));
      if (validInvoiceNumbers.length === 0) {
        setInvoice(1);
      } else {
        const maxInvoiceNumber = Math.max(...validInvoiceNumbers);
        setInvoice(maxInvoiceNumber + 1);
      }
    };
    generateInvoiceNumber();
  }, [data]);

  useEffect(() => {
    handleDataFetch();
    fetchData();
    fetchCustomerData();
    fetchShop();
    fetchVatData();
  }, []);

  useEffect(() => {
    const handleChangeProductCode = () => {
      const result = customerData.find(
        (item) => item.contributor_name === customerName
      );

      if (result) {
        setCustomerID(result.contributor_name_id);
        setCustomerAddress(result.address);
        setCustomerPhone(result.mobile);
      } else {
        setCustomerID("");
        setCustomerAddress("");
        setCustomerPhone("");
      }
    };
    handleChangeProductCode();
  }, [customerName, customerData]);

  // Pop Up Window
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const initialItems = Array.from({ length: 1 }, () => ({
    itemCode: "",
    product_name: "",
    product_type: "",
    sale_price: "",
    quantity: "",
    itemTotal: "",
    unit: "",
    product_trace_id: "",
    unit_id: "",
  }));

  const [items, setItems] = useState(initialItems);

  const inputRefs = useRef(
    Array.from({ length: 100 }, () =>
      Array.from({ length: items.length }, () => React.createRef())
    )
  );
  const handleKeyPress = (event, rowIndex, colIndex) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // Check if Enter is pressed in the last row and "itemTotal" is filled
      if (rowIndex === items.length - 1 && items[rowIndex].itemTotal !== "") {
        // Add a new row
        setItems([
          ...items,
          {
            itemCode: "",
            product_name: "",
            product_type: "",
            sale_price: "",
            quantity: "",
            itemTotal: "",
            unit: "",
            product_trace_id: "",
            unit_id: "",
          },
        ]);

        // Focus on the first input field of the newly added row
        setTimeout(() => {
          if (
            inputRefs.current[rowIndex + 1] &&
            inputRefs.current[rowIndex + 1][0]
          ) {
            inputRefs.current[rowIndex + 1][0].current.focus();
          }
        });
      } else if (colIndex < 6) {
        // Move focus to the next input field in the same row
        setTimeout(() => {
          if (
            inputRefs.current[rowIndex] &&
            inputRefs.current[rowIndex][colIndex + 1]?.current
          ) {
            inputRefs.current[rowIndex][colIndex + 1].current.focus();
          }
        });
      }
    }
  };

  const getFieldName = (index) => {
    switch (index) {
      case 0:
        return "itemCode";
      case 1:
        return "product_name";
      case 2:
        return "product_type";
      case 3:
        return "sale_price";
      case 4:
        return "quantity";
      case 5:
        return "itemTotal";
      case 6:
        return "unit";
      default:
        return "";
    }
  };

  // Calculate total amount
  const totalAmount = items.reduce(
    (acc, item) =>
      acc + parseInt(item.quantity) * parseFloat(item.sale_price) || 0,
    0
  );
  const discountAmount = totalAmount * (parseInt(discount) / 100);
  const totalWithDiscount =
    Math.round(totalAmount - discountAmount) || totalAmount;

  useEffect(() => {
    if (VAT && totalWithDiscount) {
      const vatAmount = totalWithDiscount * (VAT / 100);
      const totalWithVAT = Math.round(totalWithDiscount + vatAmount);
      setNetTotal(totalWithVAT);
    } else {
      setNetTotal(totalWithDiscount);
    }
  }, [VAT, totalWithDiscount]);

  const due = parseInt(netTotal) - parseInt(paid) || 0;

  const handleReset = () => {
    setItems([
      {
        itemCode: "",
        product_name: "",
        product_type: "",
        sale_price: "",
        quantity: "",
        itemTotal: "",
        unit: "",
        product_trace_id: "",
        unit_id: "",
      },
    ]);

    setCustomerName("");
    setDiscount("");
    setPaid("");
    setVAT(null);
  };
  // const isItemValid = (item) => {
  //   return (
  //     (item.itemCode && item.itemCode.trim() !== "") &&
  //     (item.product_name && item.product_name.trim() !== "") &&
  //     (item.product_type && item.product_type.trim() !== "") &&
  //     (item.sale_price && item.sale_price.trim() !== "") &&
  //     (item.quantity && item.quantity.trim() !== "") &&
  //     (item.itemTotal && item.itemTotal.trim() !== "") &&
  //     (item.unit && item.unit.trim() !== "") &&
  //     (item.product_trace_id && item.product_trace_id.trim() !== "") &&
  //     (item.unit_id && item.unit_id.trim() !== "")
  //   );
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = async () => {
    if (paid === "") {
      toast.warning("Please fill in all fields before Save the item.");
      return;
    }
    try {
      console.log("update", saveData);

      const response = await axios.post(
        `${BASE_URL}/api/transactionsRouter/postTransactionFromAnyPageBulk`,
        saveData,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSaveData([]);
        handleReset();
        setDiscount(0);
        setVAT(null);
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please try again later.");
    }
  };

  const handleCustomerSave = async () => {
    const contributor_type_id = 1;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/contributorname/postContributorNameFromAnyPage`,
        { contributor_name, address, mobile, contributor_type_id }
      );
      if (response.status === 200) {
        setContributorName("");
        setAddress("");
        setMobile("");
        fetchCustomerData();
        toast.success("Customer Add successfully!");
      } else {
        toast.error("Failed to save Supplier");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };
  const addTransaction = useCallback(async () => {
    const newTransactions = items.map((item) => ({
      invoice_no: invoice,
      product_trace_id: item.product_trace_id,
      quantity_no: item.quantity,
      unit_id: item.unit_id,
      warranty: "None",
      tax_id: vatID,
      amount: netTotal,
      authorized_by_id: 1,
      contributor_name_id: customerID || null,
      operation_type_id: 1,
      date: formattedDate,
      payment_type_id: payment_id,
      shop_name_id: shopNameData.map((data) => data.shop_name_id),
      paid: paid,
      employee_id: Employee,
      sale_price: item.sale_price,
      discount: "None",
      purchase_price: 0,
    }));
    setSaveData((prevSaveData) => [...prevSaveData, ...newTransactions]);
    setFixData(items);
  }, [
    items,
    invoice,
    vatID,
    netTotal,
    customerID,
    formattedDate,
    payment_id,
    shopNameData,
    paid,
    Employee,
  ]);

  useEffect(() => {
    const saveDataNotEmpty = saveData.length > 0;

    if (saveDataNotEmpty && paid) {
      handleSave();
      handlePrint();
    }
  }, [handleSave, handlePrint, saveData, paid]);

  const handleButtonClick = async () => {
    await addTransaction();
  };
  useEffect(() => {
    const handleVatChange = () => {
      const filteredData = VatData.find((item) => item.rate === VAT);
      setVatID(filteredData?.tax_id);
    };
    handleVatChange();
  }, [VatData, VAT]);

  const handlePaidChange = (e) => {
    const newPaid = parseFloat(e.target.value);

    // Return early if netTotal is empty or not defined
    if (netTotal === 0) {
      toast.warning("Paid amount cannot exceed Net Total.");

      return;
    }

    if (newPaid < 0) {
      toast.warning("Paid amount cannot be negative.");
    } else if (newPaid > netTotal) {
      toast.warning("Paid amount cannot exceed Net Total.");
    } else {
      setPaid(newPaid);
    }
  };
  return (
    <div className="full_div_super_shop_sale">
      <ToastContainer />
      <div className="second_row_div_supershop_sale">
        <div className="container_table_supershop_sale">
          <table border={1} cellSpacing={2} cellPadding={10}>
            <thead>
              <tr>
                <th>BarCode</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Item Total</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 7 }, (_, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        className="table_input_field"
                        ref={inputRefs.current[rowIndex][colIndex]}
                        list={
                          getFieldName(colIndex) === "sale_price"
                            ? `sale_prices_${rowIndex}`
                            : ""
                        }
                        value={item[getFieldName(colIndex)]}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updatedItems = [...items];
                          updatedItems[rowIndex][getFieldName(colIndex)] =
                            value; // Update the corresponding field based on column index

                          if (getFieldName(colIndex) === "itemCode") {
                            const matchedProduct = data.find(
                              (product) =>
                                product.ProductTrace &&
                                product.ProductTrace.product_code === value
                            );
                            if (matchedProduct) {
                              const saleData = data.filter(
                                (product) =>
                                  product.ProductTrace &&
                                  product.ProductTrace.product_code === value
                              );
                              setsaleData(saleData);

                              updatedItems[rowIndex]["product_name"] =
                                matchedProduct.ProductTrace.name;
                              updatedItems[rowIndex]["product_type"] =
                                matchedProduct.ProductTrace.type;
                              updatedItems[rowIndex]["sale_price"] =
                                matchedProduct.sale_price;
                              updatedItems[rowIndex]["unit"] =
                                matchedProduct.Unit.unit;
                              updatedItems[rowIndex]["unit_id"] =
                                matchedProduct.Unit.unit_id;
                              updatedItems[rowIndex]["product_trace_id"] =
                                matchedProduct.ProductTrace.product_trace_id;
                            } else {
                              updatedItems[rowIndex]["product_name"] = "";
                              updatedItems[rowIndex]["product_type"] = "";
                              updatedItems[rowIndex]["sale_price"] = "";
                              updatedItems[rowIndex]["unit"] = "";
                              updatedItems[rowIndex]["quantity"] = "";
                            }
                          }
                          const salePrice = parseInt(
                            updatedItems[rowIndex]["sale_price"]
                          );
                          const quantity = parseInt(
                            updatedItems[rowIndex]["quantity"]
                          );
                          updatedItems[rowIndex]["itemTotal"] =
                            isNaN(salePrice) || isNaN(quantity)
                              ? ""
                              : salePrice * quantity;
                          setItems(updatedItems);
                        }}
                        onKeyPress={(e) =>
                          handleKeyPress(e, rowIndex, colIndex)
                        }
                      />
                      {getFieldName(colIndex) === "sale_price" && (
                        <datalist id={`sale_prices_${rowIndex}`}>
                          {/* Populate options with sale prices for the scanned product */}
                          {saleData.map((product) => (
                            <option
                              key={product.product_trace_id}
                              value={product.sale_price}
                            />
                          ))}
                        </datalist>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="third_row_div_supershop_sale">
        <div className="container_buttom_full_div">
          <div className="container_div_view_customer_supershop_sale">
            <div className="customer_setup_supershop_sale">
              <div className="customer_setup_supershop_sale_box">
                <div className="membership_customer">
                  MemberShip Customer
                  <input type="checkbox" />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    list="list_customer"
                  />
                  <datalist id="list_customer">
                    {customerData.length > 0 &&
                      customerData.map((customer, index) => {
                        return (
                          <option key={index} value={customer.contributor_name}>
                            {customer.contributor_name}
                          </option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    style={{ width: "8vw" }}
                    value={customerID}
                  />
                  <Button style={{ width: "3.5vw" }} onClick={showModal}>
                    +
                  </Button>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Phone</label>
                  <input type="text" value={customerPhone} />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Address</label>
                  <input type="text" value={customerAddress} />
                </div>
              </div>
            </div>
          </div>
          <div className="container_shadow_extra">
            <div className="container_input_field_box_supershop_sale">
              <div className="">
                <div className="input_field_bottom_supershop_sale">
                  <label>Payment Type*</label>
                  {paymentTypeData && paymentTypeData.length > 0 && (
                    <select
                      value={payment_id}
                      onChange={(e) => setPaymentId(e.target.value)}
                    >
                      {paymentTypeData.map((data) => (
                        <option
                          key={data.payment_type_id}
                          value={data.payment_type_id}
                        >
                          {data.payment_type}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Current Date*</label>
                  <input
                    value={currentDate}
                    className="date_input_sale_page"
                    type="date"
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Shop Name</label>

                  <input
                    type="text"
                    value={shopNameData.map((data) => data.shop_name)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Employee </label>
                  <input type="text" value={Employee} />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Total</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setVAT(e.target.value)}
                  />
                </div>
              </div>
              <div className="container_div_saparator_supershop_sale_column2">
                <div className="input_field_bottom_supershop_sale">
                  <label>Discount</label>
                  <input
                    type="number"
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Vat</label>
                  <input
                    type="number"
                    onChange={(e) => setVAT(e.target.value)}
                    list="vat_list"
                  />
                  <datalist id="vat_list">
                    {VatData.length > 0 &&
                      VatData.map((vat) => {
                        return (
                          <option key={vat.tax_id} value={vat.rate}>
                            {vat.rate}
                          </option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Net Total</label>
                  <input type="number" value={netTotal} name="" id="" />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Paid</label>
                  <input
                    type="number"
                    value={paid}
                    onChange={handlePaidChange}
                    required
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Due</label>
                  <input type="number" value={due} />
                </div>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <div style={{ display: "none" }}>
                    <PosInvoice
                      ref={componentRef}
                      discount={discount}
                      VAT={VAT}
                      fixData={fixData}
                      netTotal={netTotal}
                    />
                  </div>
                  <button
                    className="billing_button_supershop_sale"
                    onClick={handleButtonClick}
                  >
                    <img src={Invoice} alt="billing" />
                  </button>
                </div>
                <span>Invoice</span>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <button
                    className="billing_button_supershop_sale"
                    style={{ cursor: "pointer" }}
                    onClick={handleReset}
                  >
                    <img src={reset} alt="billing" />
                  </button>
                </div>
                <span>Reset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-window_supershop">
        <Modal
          title="Add MemberShip Customer"
          open={isModalOpen}
          onCancel={handleCancel}
          width={500}
          height={800}
          footer={null}
          style={{
            top: 46,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="container_permanent_supplier_supershop">
            <div className="first_row_div_permanent_supplier_supershop">
              <div className="container_search_permanent_supplier_supershop">
                <div className="container_separate_permanent_supplier_supershop">
                  <div>
                    <div className="search_permanent_supplier_supershop">
                      <div className="search_permanent_supplier_supershop_column1">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Supplier Name</label>
                          <input
                            type="text"
                            value={contributor_name}
                            onChange={(e) => setContributorName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="search_permanent_supplier_supershop_column2">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>SupplierMobile</label>
                          <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                        <div className="input_field_permanent_supplier_supershop">
                          <label>SupplierAddress</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handleCustomerSave}
                      >
                        <img src={Save} alt="" />
                      </button>
                      Save
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="second_row_modal">
              <div className="table_div_modal">
                <table border={1} cellSpacing={1} cellPadding={2}>
                  <tr>
                    <th style={Color}>Customer Id</th>
                    <th style={Color}>Name</th>
                    <th style={Color}>Mobile</th>
                    <th style={Color}>Address</th>
                  </tr>
                  {customerData &&
                    customerData.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.contributor_name}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SalePage;
