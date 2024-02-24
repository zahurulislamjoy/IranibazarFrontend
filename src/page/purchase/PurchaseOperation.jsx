import React, { useState, useEffect, useCallback } from "react";
import "./purchases_operation.css";
import { FcPrint } from "react-icons/fc";
import { FaCartPlus } from "react-icons/fa";
import Save from "../../image/Save.png";
import { Modal } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const PurchaseOperation = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [category, setcategory] = useState("");
  const [product_code, setProductCode] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_type, setProductType] = useState("");
  const [brand, setBrand] = useState("");
  const [brandID, setBrandID] = useState("");
  const [brand_name, setBrand_name] = useState("");
  const [purchase_price, setPurchasePrice] = useState("");
  const [sale_price, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitID, setUnitId] = useState("");
  const [unit, setUnit] = useState("");
  const [warranty, setWarranty] = useState("");
  const [discount, setDiscount] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [saveData, setSaveData] = useState([]);
  const [shopNameData, setShopNAmeData] = useState([]);

  const [supplierName, setSupplierName] = useState("");
  const [supplierNameID, setSupplierNameID] = useState("");
  const [Supplieraddress, setSupplierAddress] = useState("");
  const [Suppliermobile, setSupplierMobile] = useState("");

  const [contributor_name, setContributorName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [visible, setVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [unitvisible, setUnitVisible] = useState(false);
  const [vatVisible, setVatVisible] = useState(false);

  const [transactionData, setTransactionData] = useState([]);
  const [VatData, setVatData] = useState([]);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [data, setData] = useState([]);
  const [produtData, setProductData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [tableData, setTabledata] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [NettotalAmount, setNetTotalAmount] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [vat, setVat] = useState("");
  const [vatID, setVatID] = useState("");
  const [rate, setRate] = useState("");
  const [paid, setPaid] = useState("");
  const [ischecked, setIschecked] = useState(false);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState("");
  const [product_trace_id, setProductTraceId] = useState("");
  const [payment_id, setPaymentId] = useState("");

  const Employee = localStorage.getItem("username");

  const newWidth = {
    width: "7.vw",
  };

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };
  useEffect(() => {
    document.title = "Purchase Operation";
  });
  const showModal = () => {
    setVisible(true);
  };
  const showBrandModal = () => {
    setBrandVisible(true);
  };
  const ShowUnitModal = () => {
    setUnitVisible(true);
  };
  const showVatModal = () => {
    setVatVisible(true);
  };
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

  const today = new Date();
  const formattedDate = today.toISOString();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    setTodayDate(formattedDate);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/paymenttypes/getAll`);
        setPaymentTypeData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDataUnit = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/unit/getAll`);
        setUnitData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/contributorname/getAll`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchProductdata = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/producttraces/getAll`
        );

        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/brand/getAll`);

        setBrandData(response.data);
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
    const handleDataFetchTransaction = async () => {
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

        setTransactionData(filteredTransactions);
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

    fetchSupplierData();
    fetchData();
    fetchDataUnit();
    fetchProductdata();
    fetchBrandData();
    fetchShop();
    handleDataFetchTransaction();
    fetchVatData();
  }, []);

  useEffect(() => {
    const handleVatChange = () => {
      const filteredData = VatData.find((item) => item.rate === vat);
      setVatID(filteredData?.tax_id);
    };
    handleVatChange();
  }, [vat, VatData]);

  useEffect(() => {
    if (brand) {
      const filteredData = brandData.find((item) => item.brand_name === brand);
      setBrandID(filteredData?.brand_id);
      console.log(filteredData?.brand_id);
    }
    const fiterBrand = unitData.find((item) => item.unit === unitName);
    setUnitId(fiterBrand?.unit_id);
  }, [brand, brandData, shopNameData, unitData, unitName]);

  useEffect(() => {
    const filteredData = data.filter((item) => item.contributor_type_id === 2);

    setSupplierData(filteredData);
  }, [data]);

  const handleCancel = () => {
    setVisible(false);
  };
  const handleBrandCancel = () => {
    setBrandVisible(false);
  };
  const handleVatCancel = () => {
    setVatVisible(false);
  };
  const handleUnitCancel = () => {
    setUnitVisible(false);
  };

  useEffect(() => {
    const handleChangeSupplier = () => {
      const result = data.find(
        (item) => item.contributor_name === supplierName
      );

      if (result) {
        setSupplierNameID(result.contributor_name_id);
        setSupplierAddress(result.address);
        setSupplierMobile(result.mobile);
      } else {
        setSupplierAddress("");
        setSupplierMobile("");
      }
    };
    handleChangeSupplier();
  }, [supplierName, data]);

  useEffect(() => {
    const handleChangeProductCode = () => {
      const result = produtData.find(
        (item) => item.product_code === product_code
      );
      console.log(result);
      if (!ischecked) {
        if (result) {
          setProductTraceId(result.product_trace_id);
          setcategory(result.Category?.category_name);
          setProductName(result.name);
          setProductType(result.type);
        } else {
          setcategory("");
          setProductName("");
          setProductType("");
        }
      }
    };
    handleChangeProductCode();
  }, [product_code, produtData, ischecked]);

  useEffect(() => {
    const generateInvoiceNumber = () => {
      const validInvoiceNumbers = transactionData
        .map((item) => parseInt(item.invoice_no))
        .filter((number) => !isNaN(number)); // Filter out NaN values

      if (validInvoiceNumbers.length === 0) {
        // If there are no valid invoice numbers, start from 1
        setInvoice(1);
      } else {
        // Find the maximum invoice number from valid invoice numbers
        const maxInvoiceNumber = Math.max(...validInvoiceNumbers);
        // Increment the maximum invoice number by 1 for the new entry
        setInvoice(maxInvoiceNumber + 1);
      }
    };
    generateInvoiceNumber();
  }, [transactionData]);

  const itemTotal = parseInt(purchase_price) * parseInt(quantity) || 0;
  const discountAmount = itemTotal * (parseInt(discount) / 100);
  const totalWithDiscount = Math.round(itemTotal - discountAmount) || itemTotal;

  useEffect(() => {
    if (vat && totalAmount) {
      const vatAmount = totalAmount * (vat / 100);
      const totalWithVAT = Math.round(totalAmount + vatAmount);
      setNetTotalAmount(totalWithVAT);
    } else {
      setNetTotalAmount(totalAmount);
    }
  }, [vat, totalAmount]);

  // const handleReset = () => {
  //   setProductCode("");
  //   setBrand("");
  //   setPurchasePrice("");
  //   setQuantity("");
  //   setUnitName("");
  //   setDiscount("");
  //   setSalePrice("");
  //   setWarranty("");
  //   setSupplierName("")
  //   setVat("")
  //   setPaid("")
  //   setTabledata([])
  //   setSaveData([])

  // };

  const AddToCart = () => {
    if (
      product_code === "" &&
      purchase_price === "" &&
      quantity === "" &&
      sale_price === ""
    ) {
      toast.warning("Don't leave empty field");
      setError("Don't leave empty field");
      return;
    }

    if (product_code === "") {
      setError("Don't leave empty field");
      return;
    }
    if (purchase_price === "") {
      setError("Don't leave empty field");
      return;
    }
    if (quantity === "") {
      setError("Don't leave empty field");
      return;
    }
    if (sale_price === "") {
      setError("Don't leave empty field");
      return;
    }

    const newItem = {
      category: category,
      product_code: product_code,
      product_name: product_name,
      product_type: product_type,
      brand_name: brand,
      quantity: quantity,
      unit: unitName,
      purchase_price: purchase_price,
      item_total: itemTotal,
      discount: discount || 0,
      warranty: warranty || "none",
      total: totalWithDiscount,
      salePrice: sale_price,
      unitID: unitID,
      brandId: brandID,
    };

    setTabledata((prevTableData) => [...prevTableData, newItem]);
    setProductCode("");
    setBrand("");
    setPurchasePrice("");
    setQuantity("");
    setUnitName("");
    setDiscount("");
    setSalePrice("");
    setWarranty("");
  };

  useEffect(() => {
    if (tableData.length > 0) {
      const total = tableData.reduce(
        (accumulator, item) => accumulator + item.total,
        0
      );
      setTotalAmount(parseInt(total, 10));
      const totalDiscount = tableData.reduce(
        (accumulator, item) => accumulator + parseInt(item.discount, 10),
        0
      );
      setTotalDiscount(totalDiscount);
    } else {
      setTotalAmount(0);
    }
  }, [tableData]);

  const due =
    Math.round(parseInt(NettotalAmount) - parseInt(paid)) || NettotalAmount;

  //all save api

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "https://backendofsupershoppos.onrender.com/api/transactionsRouter/postTransactionFromAnyPageBulk",
        saveData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("data update", JSON.stringify(saveData));
      if (response.status === 200) {
        console.log(response.data);
        setSaveData([]);
        setTabledata([]);
        setPaid("");
        setVat("");

        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
        setSaveData([]);
        setTabledata([]);
        setPaid("");
        setVat("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please try again later");
      setSaveData([]);
      setTabledata([]);
      setPaid("");
      setVat("");
    }
  };
  console.log(brandID);

  const addTransaction = useCallback(async () => {
    const newTransactions = tableData.map((item) => ({
      invoice_no: invoice,
      product_trace_id: product_trace_id,
      quantity_no: item.quantity,
      unit_id: item.unitID,
      brand_id: brandID,
      warranty: item.warranty,
      tax_id: vatID || null,
      amount: NettotalAmount,
      authorized_by_id: 1,
      contributor_name_id: supplierNameID,
      operation_type_id: 2,
      date: formattedDate,
      payment_type_id: payment_id,
      paid: paid,
      employee_id: Employee,
      purchase_price: item.purchase_price,
      sale_price: item.salePrice,
      discount: item.discount,
      shop_name_id: 1,
    }));
    setSaveData((prevSaveData) => [...prevSaveData, ...newTransactions]);
  }, [
    tableData,
    invoice,
    product_trace_id,
    brandID,
    vatID,
    NettotalAmount,
    supplierNameID,
    formattedDate,
    payment_id,
    paid,
    Employee,
  ]);

  useEffect(() => {
    const saveDataNotEmpty = saveData.length > 0;
    if (saveDataNotEmpty && supplierNameID) {
      handleSave();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveData, supplierNameID]);

  const handleButtonClick = async () => {
    await addTransaction();
  };

  const saveBrandName = async () => {
    try {
      const response = await axios.post(
        "https://backendofsupershoppos.onrender.com/api/brand/postBrandFromAnyPage",
        { brand_name }
      );
      if (response.status === 200) {
        setBrand_name("");
        toast.success("Brand name saved successfully!");
      } else {
        toast.error("Failed to save brand name");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  const handlesaveUnit = async () => {
    try {
      const response = await axios.post(
        "https://backendofsupershoppos.onrender.com/api/unit/postUnitFromAnyPage",
        { unit }
      );
      if (response.status === 200) {
        setUnit("");
        toast.success("Unit Add successfully!");
      } else {
        toast.error("Failed to save brand name");
      }
    } catch (error) {
      console.error("Error saving Unit :", error);
    }
  };
  const handlesaveVat = async () => {
    try {
      const response = await axios.post(
        "https://backendofsupershoppos.onrender.com/api/tax/postTaxFromAnyPage",
        { rate }
      );
      if (response.status === 200) {
        setRate("");
        toast.success("Vat Add successfully!");
      } else {
        toast.error("Failed to save Vat");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };
  const handleSaveSupplier = async () => {
    const contributor_type_id = 2;

    try {
      const response = await axios.post(
        "https://backendofsupershoppos.onrender.com/api/contributorname/postContributorNameFromAnyPage",
        { contributor_name, address, mobile, contributor_type_id }
      );
      if (response.status === 200) {
        setContributorName("");
        setAddress("");
        setMobile("");
        toast.success("Supplier Add successfully!");
      } else {
        toast.error("Failed to save Supplier");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  const handlePaidChange = (e) => {
    const newPaid = parseFloat(e.target.value);

    if (newPaid > NettotalAmount) {
      toast.warning("Paid amount cannot exceed Net Total.");
    } else if (newPaid < 0) {
      toast.warning("Paid amount cannot Decrease 0.");
    } else {
      setPaid(newPaid);
    }
  };
  return (
    <>
      {" "}
      <ToastContainer />
      <div className="full_div">
        <div className="first_row_div">
          <div className="invisible_div">
            <div className="input_field_purchase_first_column">
              <div className="input_field_purchase">
                <div className="purchases_input">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Code*
                    </label>
                    <div className="error_handle_input">
                      <input
                        type="text"
                        onChange={(e) => {
                          setProductCode(e.target.value);
                          setError("");
                        }}
                        value={product_code}
                        className="input_field_supershop_purchase_long"
                        style={{
                          borderColor:
                            error && product_code === "" ? "red" : "",
                        }}
                      />

                      <div className="error_message">
                        {error && product_code === "" ? error : ""}
                      </div>
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Category*
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setcategory(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && category === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "4.3vw" }}
                    >
                      {error && category === "" ? error : ""}
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Name*
                    </label>
                    <input
                      type="text"
                      value={product_name}
                      onChange={(e) => setProductName(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && product_name === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "4.3vw" }}
                    >
                      {error && product_name === "" ? error : ""}
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Type*
                    </label>
                    <input
                      type="text"
                      value={product_type}
                      onChange={(e) => setProductType(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && product_type === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "4.3vw" }}
                    >
                      {error && product_name === "" ? error : ""}
                    </div>
                  </div>
                </div>
                <div className="purchases_input">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="input_field_supershop_purchase_long_brand"
                      list="select_invoice_no"
                    />
                    <datalist id="select_invoice_no">
                      {brandData.length > 0 &&
                        brandData.map((brand, index) => {
                          return (
                            <option key={index}>{brand.brand_name}</option>
                          );
                        })}
                    </datalist>
                    <button
                      className="brand_add_button"
                      onClick={showBrandModal}
                    >
                      +
                    </button>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Purchase Price*
                    </label>
                    <div className="error_handle_input">
                      <input
                        type="number"
                        onChange={(e) => {
                          setPurchasePrice(e.target.value);
                          setError("");
                        }}
                        value={purchase_price}
                        className="input_field_supershop_purchase_long"
                        style={{
                          borderColor:
                            error && purchase_price === "" ? "red" : "",
                        }}
                      />

                      <div className="error_message">
                        {error && purchase_price === "" ? error : ""}
                      </div>
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Quantity*
                    </label>

                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                        setError("");
                      }}
                      className="input_field_supershop_purchase_long quantity_add_purchaes"
                      style={{
                        borderColor: error && quantity === "" ? "red" : "",
                      }}
                    />

                    <input
                      type="text"
                      value={unitName}
                      onChange={(e) => {
                        setUnitName(e.target.value);
                        setError("");
                      }}
                      className="unit_add_purchaes_opeartion"
                      style={{ borderColor: error && unit === "" ? "red" : "" }}
                      list="select_unit"
                    />

                    <datalist id="select_unit">
                      {unitData.length > 0 &&
                        unitData.map((unit, index) => {
                          return (
                            <option key={index} value={unit.unit}>
                              {unit.unit}
                            </option>
                          );
                        })}
                    </datalist>
                    <button
                      className="brand_add_button"
                      onClick={ShowUnitModal}
                    >
                      +
                    </button>
                    <div
                      className="error_message"
                      style={{ marginLeft: "4.3vw" }}
                    >
                      {error && quantity === "" && unit === "" ? error : ""}
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Item Total*
                    </label>
                    <input
                      type="number"
                      value={itemTotal}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                </div>
                <div className="purchases_input_last">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Discount
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="input_field_supershop_purchase_long_discount"
                    />
                    <span>%</span>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Total*
                    </label>
                    <input
                      type="number"
                      value={totalWithDiscount}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Sale Price*
                    </label>
                    <input
                      type="number"
                      value={sale_price}
                      onChange={(e) => {
                        setSalePrice(e.target.value);
                        setError("");
                      }}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && sale_price === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "4.3vw" }}
                    >
                      {error && sale_price === "" ? error : ""}
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Warranty
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => {
                        setWarranty(e.target.value);
                      }}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                </div>
                <div className="add_to_cart_purchase_button">
                  <button onClick={AddToCart}>
                    <FaCartPlus className="cart_icon_purchase" />
                  </button>
                  <div className="button_title">Add To cart</div>
                </div>
              </div>
              <div className="barcode_check_box_purchase">
                <input
                  type="checkbox"
                  onClick={() => setIschecked(true)}
                  name=""
                  id=""
                />
                Same Product (Multi Barcode)
              </div>
            </div>

            <fieldset className="customer_fieldset">
              <div
                style={{
                  marginLeft: "1vw",
                  marginTop: ".3vw",
                  fontSize: "1vw",
                }}
              >
                Vendor/Supplier
              </div>

              <div className="customer_inner_div2">
                <div className="input_field_long">
                  <label className="label_field_supershop_purchase">Name</label>
                  <select
                    type="text"
                    className="add_supplier_select_input"
                    onChange={(e) => {
                      setSupplierName(e.target.value);
                    }}
                    style={{
                      borderColor: error && product_name === "" ? "red" : "",
                    }}
                  >
                    <option value="" redOnly>
                      Please Select supplier
                    </option>
                    {supplierData.map((data) => (
                      <option
                        key={data.contributor_name}
                        value={data.contributor_name}
                      >
                        {data.contributor_name}
                      </option>
                    ))}
                  </select>

                  <button className="supplier_add_button" onClick={showModal}>
                    +
                  </button>
                  <div className="error_message_supllier">
                    {error && supplierName === "" ? error : ""}
                  </div>
                </div>
                <div className="input_field_long">
                  <label className="label_field_supershop_purchase">
                    Address
                  </label>
                  <input
                    className="input_field_supershop_purchase"
                    value={Supplieraddress}
                  />
                </div>
                <div className="input_field_long">
                  <label className="label_field_supershop_purchase">
                    Mobile
                  </label>
                  <input
                    className="input_field_supershop_purchase"
                    value={Suppliermobile}
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="third_row_div">
          <div className="table_supershop_purchase">
            <div className="table_div_supershop_purchase">
              <table className="" border={2} cellSpacing={2} cellPadding={6}>
                <thead>
                  <tr>
                    <th style={Color}>Serial No</th>
                    <th style={Color}>Category</th>
                    <th style={Color}>Product Code</th>
                    <th style={Color}>Product Name</th>
                    <th style={Color}>Product Type</th>
                    <th style={Color}>Brand</th>
                    <th style={Color}>Quantity</th>
                    <th style={Color}>Unit</th>
                    <th style={Color}>Purchase Price</th>
                    <th style={Color}>Sale Price</th>
                    <th style={Color}>Item Total</th>
                    <th style={Color}>Discount</th>
                    <th style={Color}>Warranty</th>
                    <th style={Color}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 &&
                    tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.category}</td>
                        <td>{row.product_code}</td>
                        <td>{row.product_name}</td>
                        <td>{row.product_type}</td>
                        <td>{row.brand_name}</td>
                        <td>{row.quantity}</td>
                        <td>{row.unit}</td>
                        <td>{row.purchase_price}</td>
                        <td>{row.salePrice}</td>
                        <td>{row.item_total}</td>
                        <td>{row.discount}</td>
                        <td>{row.warranty}</td>
                        <td>{row.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
                style={{ fontSize: "1vw" }}
                className="input_field_supershop_purchase"
                value={totalAmount}
              />
            </div>
          </div>
        </div>
        <div className="second_row_div">
          <div className="first_column_second_row">
            <div className="first_column_second_row_input_field">
              <div>
                <div className="input_field_short_select">
                  <label className="label_field_supershop_purchase">Shop</label>
                  <select>
                    {shopNameData &&
                      shopNameData.map((shop) => (
                        <option
                          value={shop.shop_name_id}
                          key={shop.shop_name_id}
                        >
                          {shop.shop_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="input_field_short_select1">
                  <label className="label_field_supershop_purchase">
                    Employee
                  </label>
                  <select>
                    <option>{Employee}</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="input_field_short_date">
                  <label className="label_field_supershop_purchase">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    className="input_field_supershop_purchase_long"
                    value={todayDate}
                    onChange={(e) => setTodayDate(e.target.value)}
                  />
                </div>
                <div className="input_field_short_select1">
                  <label className="label_field_supershop_purchase">
                    Payment Type
                  </label>
                  <select name="" id="">
                    {paymentTypeData.map((data) => (
                      <option value="">{data.payment_type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="input_field_long">
              <div
                className="label_field_supershop_purchase"
                style={{ boxShadow: "none" }}
              >
                Amount In Words:
              </div>
              <span style={{ fontWeight: "bold", width: "3vw" }}>
                ..............................................
              </span>
            </div>
            <div className="button_first_column_second_row">
              <div className="save_button">
                <button className=" button_supershop button1">
                  <FcPrint className="print_icon" title="Print" />
                </button>
                Print
              </div>

              <div className="save_button">
                <button
                  className="button_supershop button2"
                  onClick={handleButtonClick}
                >
                  <img src={Save} alt="" />
                </button>
                Save
              </div>
            </div>
          </div>

          <div className="total_div_supershop_purchase">
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Total
              </label>
              <input type="number" style={newWidth} value={totalAmount} />
            </div>
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Total Discount
              </label>
              <input type="number" style={newWidth} value={totalDiscount} />
            </div>
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Vat
              </label>
              <input
                type="number"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                className="vat_input_purchase_operation"
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
              <span>%</span>
              <button className="vat_add_button" onClick={showVatModal}>
                +
              </button>
            </div>
            <div className="bar_net_total">
              <div className="input_field_short_purchase bar_total_purchase">
                <label
                  className="label_field_supershop_purchase"
                  style={newWidth}
                >
                  Net Total
                </label>
                <input type="number" style={newWidth} value={NettotalAmount} />
              </div>
            </div>

            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Paid*
              </label>
              <input
                type="number"
                value={paid}
                onChange={handlePaidChange}
                style={{
                  borderColor: error && paid === "" ? "red" : "",
                }}
              />
            </div>
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Due
              </label>
              <input type="number" value={due} style={newWidth} />
            </div>
          </div>
        </div>

        <div className="popup-window_supershop">
          <Modal
            title="Add Supplier"
            open={visible}
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
                            <label>Supplier Name*</label>
                            <input
                              type="text"
                              value={contributor_name}
                              onChange={(e) =>
                                setContributorName(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="search_permanent_supplier_supershop_column2">
                          <div className="input_field_permanent_supplier_supershop">
                            <label>Mobile*</label>
                            <input
                              type="text"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                            />
                          </div>
                          <div className="input_field_permanent_supplier_supershop">
                            <label>Address*</label>
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
                          onClick={handleSaveSupplier}
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
                      <th style={Color}>Supplier Id</th>
                      <th style={Color}>Name</th>
                      <th style={Color}>Mobile</th>
                      <th style={Color}>Address</th>
                    </tr>
                    {supplierData &&
                      supplierData.map((item, index) => (
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

        <Modal
          title="Add Brand"
          open={brandVisible}
          onCancel={handleBrandCancel}
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
                          <label>Brand Name</label>
                          <input
                            type="text"
                            value={brand_name}
                            onChange={(e) => setBrand_name(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={saveBrandName}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Add Unit"
          open={unitvisible}
          onCancel={handleUnitCancel}
          width={500}
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
                          <label>Unit Name</label>
                          <input
                            type="text"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handlesaveUnit}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Add Vat"
          open={vatVisible}
          onCancel={handleVatCancel}
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
                          <label>Vat</label>
                          <input
                            type="text"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handlesaveVat}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PurchaseOperation;
