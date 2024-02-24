import React, { useEffect, useRef, useState } from "react";
import styles from "./AddProduct.module.css";
import { BsFillFileEarmarkExcelFill } from "react-icons/bs";
import { IoReloadCircleOutline } from "react-icons/io5";
import { BiBarcodeReader } from "react-icons/bi";
import { IoIosSave } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPhotos } from "react-icons/io";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./BarCode";
import axios from "axios";
import exportFromJSON from "export-from-json";

const Addproducts = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [items, setItems] = useState([]);
  const [setFixedItems] = useState([]);

  //categories
  const [categories, setCategories] = useState([]);
  const [category_id, setCategoryId] = useState("");
  const [category_name, setCategoryName] = useState("");

  //racks
  const [racks, setRacks] = useState([]);
  const [rack_id, setRackId] = useState("");
  const [rack_no, setRackNo] = useState("");

  //input state:
  const [product_trace_id, setProductTraceId] = useState("");
  const [product_code, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [image_blob, setImageBlob] = useState(null);

  //moodal & table selection
  const [productModal, setProductModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [deleteCategory, setDeletecategory] = useState(false);
  const [rackModal, setRackModal] = useState(false);
  const [deleteRack, setDeleteRack] = useState(false);

  const [selectedTabID, setSelectedTabID] = useState(null);

  //barcode state:
  const [barcodeProductCode, setBarcodeProductCode] = useState("");
  const [barcodeProductName, setBarcodeProductName] = useState("");
  const [barcodeProductType, setBarcodeProductType] = useState("");
  //==========get all products product=============:
  const fetchAllProducts = async () => {
    try {
      const productData = sessionStorage.getItem("productData");
      if (productData) {
        setItems(JSON.parse(productData));
        setFixedItems(JSON.parse(productData));
      } else {
        const response = await axios.get(
          `${BASE_URL}/api/producttraces/getAll`
        );
        setItems(response.data);
        setFixedItems(response.data);
        sessionStorage.setItem("productData", JSON.stringify(response.data));
      }
      sessionStorage.removeItem("productData");
    } catch (error) {
      console.error("Error fetching or storing productTrace Data :", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    document.title = "Add Product";
    // return () => sessionStorage.removeItem("productData");
  }, []);

  //================category functionality==========================:
  //get all category:
  const fetchAllCategory = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/category/getAll`);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllCategory();
  }, []);

  //================category select=============
  const handleCategorySelect = (value) => {
    if (categories && categories.length > 0) {
      const selectedCategory = categories.find((c) => c.category_id == value);
      if (selectedCategory) {
        setCategoryId(selectedCategory.category_id);
        setCategoryName(selectedCategory.category_name);
      } else {
        console.log("Selected category not found for value:", value);
      }
      console.log("selectedCategory", selectedCategory);
    } else {
      console.log("Categories is empty");
    }
  };

  //========save category:===
  const saveCategory = async () => {
    try {
      if (category_name) {
        const res = await axios.post(
          `${BASE_URL}/api/category/postCategoryFromAnyPage`,
          { category_name }
        );
        setCategoryModal((prevState) => false);
        toast.success(`category save successfully`);
        fetchAllCategory();
        resetCategory();
      } else {
        setCategoryModal((prevState) => false);
        toast.error(`Can't post empty category!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //update category
  const updateCategory = async () => {
    try {
      if (category_name && category_id) {
        const res = await axios.put(
          `${BASE_URL}/api/category/updateCategoryFromAnyPage`,
          { category_name, category_id }
        );
        setCategoryModal((prevState) => false);
        toast.success(`category updated successfully`);
        fetchAllCategory();
        resetCategory();
      } else {
        setCategoryModal((prevState) => false);
        toast.error(`Can't update empty category!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //category delete functionality:
  const handleCategoryDeleteTrue = async () => {
    try {
      if (category_id) {
        const res = await axios.delete(
          `${BASE_URL}/api/category/deleteCategoryFromAnyPage`,
          { data: { category_id } }
        );
        setCategoryModal(false);
        toast.success(`category deleted successfully`);
        fetchAllCategory();
        resetCategory();
      } else {
        setCategoryModal(false);
        toast.error(`Can't deleted empty id category!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //================racks functionality================================:
  //get all racks:
  const getAllRack = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/rack/getAll`);
      setRacks(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRack();
  }, []);
  //rack Handling:
  const handleRackSelect = (value) => {
    if (racks && racks.length > 0) {
      const selectedRack = racks.find((r) => r.rack_id == value);
      if (selectedRack) {
        setRackId(selectedRack.rack_id);
        setRackNo(selectedRack.rack_no);
      } else {
        console.log("Selected category not found for value:", value);
      }
    } else {
      console.log("Categories is empty");
    }
  };

  //===========saveRack:=============
  const saveRack = async () => {
    try {
      if (rack_no) {
        const res = await axios.post(
          `${BASE_URL}/api/rack/postRackFromAnyPage`,
          { rack_no }
        );
        setRackModal((prevState) => false);
        toast.success(`rack save successfully`);
        getAllRack();
        resetRack();
      } else {
        setCategoryModal((prevState) => false);
        toast.error(`Can't post empty rack!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //update rack
  const updateRack = async () => {
    try {
      if (rack_no && rack_id) {
        const res = await axios.put(
          `${BASE_URL}/api/rack/updateRackFromAnyPage`,
          { rack_no, rack_id }
        );
        setRackModal((prevState) => false);
        toast.success(`rack updated successfully`);
        getAllRack();
        resetRack();
      } else {
        setCategoryModal((prevState) => false);
        toast.error(`Can't update empty rack!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //rack delete functionality:
  const handleRackDeleteTrue = async () => {
    try {
      if (rack_id) {
        const res = await axios.delete(
          `${BASE_URL}/api/rack/deleteRackFromAnyPage`,
          { data: { rack_id } }
        );
        setRackModal(false);
        toast.success(`rack ${rack_id} deleted successfully`);
        getAllRack();
        resetRack();
      } else {
        setRackModal(false);
        toast.error(`Can't deleted empty id rack!`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //=============add product functionality=====================
  //handle table row:
  const handleClickTableDataShowInputField = (d) => {
    setSelectedTabID(d.product_trace_id);
    const selectedProduct =
      items &&
      items.length > 0 &&
      items.find((i) => i.product_trace_id === d.product_trace_id);

    if (selectedProduct) {
      console.log(selectedProduct);
      setCategoryId(selectedProduct.Category?.category_id);
      setCategoryName(selectedProduct.Category?.category_name);
      setRackId(selectedProduct.Rack?.rack_id);
      setRackNo(selectedProduct.Rack?.rack_no);
      setProductTraceId(selectedProduct.product_trace_id);
      setProductCode(selectedProduct.product_code);
      setName(selectedProduct.name);
      setModel(selectedProduct.model);
      setType(selectedProduct.type);

      //barcode state
      setBarcodeProductCode(selectedProduct.product_code);
      setBarcodeProductName(selectedProduct.name);
      setBarcodeProductType(selectedProduct.type);
      if (
        selectedProduct.image_blob &&
        selectedProduct.image_blob.type === "Buffer" &&
        Array.isArray(selectedProduct.image_blob.data)
      ) {
        const bufferData = new Uint8Array(selectedProduct.image_blob.data);
        const blob = new Blob([bufferData], { type: "image/*" });
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setImageBlob(fileReader.result);
        };
        fileReader.readAsDataURL(blob);
      } else {
        setImageBlob(null);
      }
    }
  };

  //===========save Product:=============
  const saveProduct = async () => {
    try {
      if (!category_id || !rack_id || !product_code || !name) {
        toast.error(
          `Can't post empty category_id, rack_id, product_code & name!`
        );
      } else {
        const existingProductName = items.find((item) => item.name === name);
        if (!existingProductName) {
          console.log(image_blob);
          const res = await axios.post(
            `${BASE_URL}/api/producttraces/postProductTraceFromAnyPage`,
            {
              category_id,
              rack_id,
              product_code,
              name,
              type,
              model,
              image_blob,
            }
          );
          toast.success(`Product saved successfully!`);
          console.log(res);
          resetAll();
          fetchAllProducts();
        } else {
          toast.error(`Product name already exists!`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //=========== update product===============
  const updateProduct = async () => {
    try {
      if (!product_trace_id) {
        toast.error(`Can't update without product_trace_id !`);
      } else {
        const res = await axios.put(
          `${BASE_URL}/api/producttraces/updateProductTraceFromAnyPage`,
          {
            product_trace_id,
            category_id,
            rack_id,
            product_code,
            name,
            type,
            model,
            image_blob,
          }
        );
        toast.success(`product updated successfully`);
        fetchAllProducts();
        resetAll();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //product delete functionality=================:
  const handleProductDeleteTrue = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/producttraces/deleteProductTraceFromAnyPage`,
        { data: { product_trace_id } }
      );
      setProductModal(false);
      toast.success(`${product_trace_id}Product deleted successfully`);
      fetchAllProducts();
    } catch (error) {
      console.log(error.message);
    }
  };

  //reset functionality:
  const resetCategory = () => {
    setCategoryId("");
    setCategoryName("");
  };
  const resetRack = () => {
    setRackId("");
    setRackNo("");
  };
  const resetProduct = () => {
    setProductTraceId("");
    setProductCode("");
    setName("");
    setModel("");
    setType("");
    setImageBlob(null);
  };
  const resetBarcode = () => {
    setBarcodeProductCode("");
    setBarcodeProductName("");
    setBarcodeProductType("");
  };
  const resetAll = () => {
    resetCategory();
    resetRack();
    resetProduct();
    resetBarcode();
  };
  //barcode print functionality:
  const componentRef = useRef();
  const print = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrint = () => {
    if (product_trace_id) {
      print();
      resetAll();
    } else {
      toast.error("Please select a product to print Barcode");
    }
  };

  // =========handle xl Download==========
  const handleXlDownload = () => {
    if (items && items.length > 0) {
      const data = items;
      const fileName = "All_Product_List ";
      const exportType = exportFromJSON.types.csv;
      exportFromJSON({ data, fileName, exportType });
    } else {
      toast.error("Currently you have no data to export!");
    }
  };

  return (
    <>
      <div className={styles.product_container}>
        {/*================ categories start from here================== */}
        <div className={styles.Categories_container}>
          <div className={styles.card}>
            <div className={styles.Categories_div}>
              <div className={styles.sanitory_div}>
                <h3 className={styles.text_h3}> Categories</h3>
                <div className={styles.sanitory_card}>
                  <select
                    multiple
                    className={styles.sanitary_select}
                    onChange={(event) =>
                      handleCategorySelect(event.target.value)
                    }
                  >
                    {categories &&
                      categories.length > 0 &&
                      categories.map((c) => (
                        <option
                          className="category_option"
                          value={c.category_id}
                        >
                          {c.category_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.sanitory_text}>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Category Id:
                  </label>
                  <input
                    type="text"
                    className={styles.codeInput}
                    value={category_id}
                    disabled
                  />
                </div>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Category Name:
                  </label>
                  <input
                    type="text"
                    className={styles.nameInput}
                    value={category_name}
                  />
                </div>
                <div className={styles.sanitory_btn}>
                  <button
                    className={`${styles.sanity_icon} ${styles.refresh}`}
                    onClick={() => resetCategory()}
                  >
                    <IoReloadCircleOutline />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.add}`}
                    onClick={() => {
                      setCategoryModal(true);
                      setDeletecategory(false);
                    }}
                  >
                    <MdAddBox />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.delete}`}
                    onClick={() => {
                      if (category_id) {
                        setCategoryModal(true);
                        setDeletecategory(true);
                      } else {
                        toast.error(
                          "Please select a category to perform delete!"
                        );
                      }
                    }}
                  >
                    <RiDeleteBin6Line />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*================ Racks start from here================== */}
        <div className={styles.Categories_container}>
          <div className={styles.card}>
            <div className={styles.Categories_div}>
              <div className={styles.sanitory_div}>
                <h3 className={styles.text_h3}>Racks</h3>
                <div className={styles.sanitory_card}>
                  <select
                    multiple
                    className={styles.sanitary_select}
                    onChange={(event) => handleRackSelect(event.target.value)}
                  >
                    {racks &&
                      racks.length > 0 &&
                      racks.map((r) => (
                        <option className="category_option" value={r.rack_id}>
                          {r.rack_no}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.sanitory_text}>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Rack Id:
                  </label>
                  <input
                    type="text"
                    className={styles.codeInput}
                    value={rack_id}
                    disabled
                  />
                </div>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Rack No:
                  </label>
                  <input
                    type="text"
                    className={styles.nameInput}
                    value={rack_no}
                  />
                </div>
                <div className={styles.sanitory_btn}>
                  <button
                    className={`${styles.sanity_icon} ${styles.refresh}`}
                    onClick={() => resetRack()}
                  >
                    <IoReloadCircleOutline />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.add}`}
                    onClick={() => {
                      setRackModal(true);
                      setDeleteRack(false);
                    }}
                  >
                    <MdAddBox />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.delete}`}
                    onClick={() => {
                      if (rack_id) {
                        setRackModal(true);
                        setDeleteRack(true);
                      } else {
                        toast.error("Please select a rack to perform delete!");
                      }
                    }}
                  >
                    <RiDeleteBin6Line />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*================ types start from here================== */}

        {/* ====================product  start from here ========================*/}
        <div className={styles.inventory_product_container}>
          <div className={styles.card}>
            <div className={styles.inventory_product_div}>
              {/* /===========/table */}
              <div className={styles.product_table}>
                <h5 className={styles.types_h3}>Products</h5>

                <div className={styles.product_table_container}>
                  <table class={styles.tables}>
                    <thead>
                      <tr className={styles.heading_row}>
                        <th>
                          {" "}
                          <div className={styles.t_data}>Code</div>{" "}
                        </th>
                        <th>
                          <div className={styles.t_data}>Name</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Category</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Type</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Model</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Rack</div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className={styles.tbody}>
                      {items &&
                        items.length > 0 &&
                        items.map((d) => (
                          <tr
                            key={d.product_trace_id}
                            className={`
          ${
            selectedTabID === d.product_trace_id
              ? `${styles.addProduct_tr} ${styles.tab_selected}`
              : styles.addProduct_tr
          }
        `}
                            onClick={() =>
                              handleClickTableDataShowInputField(d)
                            }
                            tabIndex="0"
                          >
                            <td className={styles.addProduct_td}>
                              {d.product_code}
                            </td>
                            <td className={styles.addProduct_td}>{d.name}</td>
                            <td className={styles.addProduct_td}>
                              {d.Category?.category_name || ""}
                            </td>
                            <td className={styles.addProduct_td}>{d.type}</td>
                            <td className={styles.addProduct_td}>{d.model}</td>
                            <td className={styles.addProduct_td}>
                              {d.Rack?.rack_no || ""}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* /===========/input starts from here */}
              <div className={styles.product_input}>
                <div className={styles.product_input_container}>
                  <div
                    className={`${styles.input_div} ${styles.forSomeMergine}`}
                  >
                    <div className={styles.left_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        Product Code:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={product_code}
                        onChange={(e) => setProductCode(e.target.value)}
                      />
                    </div>
                    <div className={styles.right_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        Name:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.input_div}>
                    <div className={styles.left_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        Type:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      />
                    </div>
                    <div className={styles.right_div}>
                      {" "}
                      <label htmlFor="code" className={styles.pLabel}>
                        Model:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* /=================/images: */}
                  <div className={`${styles.image_input_div} `}>
                    <div className={`${styles.right_div} `}>
                      <div
                        className={`${styles.image_div} ${styles.selected_img_div}`}
                      >
                        <div className={`${styles.mb_1}`}>
                          <label className={`${styles.img_btn}`}>
                            {image_blob ? (
                              <span className={styles.imageName}>
                                {image_blob.substring(0, 19)}
                              </span>
                            ) : (
                              <IoMdPhotos className={styles.imageIcon} />
                            )}
                            <input
                              type="file"
                              name="photo"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setImageBlob(reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              hidden
                            />
                          </label>
                        </div>

                        <div className={`${styles.mb_1} `}>
                          {image_blob ? (
                            <div
                              className={`${styles.text_center} ${styles.img_btn_div}`}
                            >
                              <img
                                src={image_blob}
                                alt="product image"
                                className={`${styles.img} ${styles.img_responsive}`}
                              />
                              {/* <button
                                className={`${styles.btn} ${styles.uploadBtn}`}
                              >
                                UPLOAD
                              </button> */}
                            </div>
                          ) : null}
                        </div>

                        {/* end */}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.input_div} `}>
                    <div
                      className={`${styles.sanitory_btn} ${styles.lastIconDiv}`}
                    >
                      <button
                        className={`${styles.sanity_icon} ${styles.refresh} ${styles.refresh2}`}
                        onClick={() => resetProduct()}
                      >
                        <IoReloadCircleOutline />{" "}
                      </button>
                      <button
                        className={`${styles.sanity_icon} ${styles.save}`}
                        onClick={product_trace_id ? updateProduct : saveProduct}
                      >
                        <IoIosSave className={styles.saveIcon} />
                      </button>
                      <button
                        className={`${styles.sanity_icon} ${styles.delete} ${styles.delete2}`}
                        onClick={() => {
                          if (product_trace_id) {
                            setProductModal(true);
                          } else {
                            toast.error("Please select a product to delete!");
                          }
                        }}
                      >
                        <RiDeleteBin6Line />{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //barcode footer div start from here */}
        <div className={`${styles.cash_Footer} `}>
          <div className={styles.totalDiv}>
            <div className={styles.Amount}>
              <div className={styles.amountebelDiv}>
                <label htmlFor="Amount" className={styles.amountLabel}>
                  Product Code
                </label>
              </div>
              <div className={styles.amountInputDiv}>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={barcodeProductCode}
                />
              </div>
            </div>
            <div className={styles.Amount}>
              <div className={styles.amountebelDiv}>
                <label htmlFor="Amount" className={styles.amountLabel}>
                  Product Name
                </label>
              </div>
              <div className={styles.amountInputDiv}>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={barcodeProductName}
                />
              </div>
            </div>
            <div className={styles.Amount}>
              <div className={styles.amountebelDiv}>
                <label htmlFor="Amount" className={styles.amountLabel}>
                  Type No
                </label>
              </div>
              <div className={styles.amountInputDiv}>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={barcodeProductType}
                />
              </div>
            </div>
          </div>
          <div className={styles.cashOperationDiv}>
            <div className={styles.chasOperationBtnDiv}>
              <div className={styles.divForALlbutton}>
                <button
                  className={styles.chasOperationBtn}
                  onClick={handlePrint}
                >
                  <BiBarcodeReader className={styles.barcodeIcon} />
                </button>
                <p className={styles.buttonText}>Generate Barcode</p>
              </div>
            </div>
          </div>
          <div className={styles.excelExportDiv}>
            <div className={styles.excelExportBtnDiv}>
              <div className={styles.divForALlbutton}>
                <button
                  className={styles.excelExportBtn}
                  onClick={handleXlDownload}
                >
                  <BsFillFileEarmarkExcelFill className={styles.xlIcon} />
                </button>
                <p className={styles.buttonText}>Excel Report</p>
              </div>
            </div>
          </div>
          <div style={{ display: "none" }}>
            <ComponentToPrint ref={componentRef} code={product_code} />
          </div>
        </div>

        {/* =========================/product  modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={productModal}
            onCancel={() => setProductModal(false)}
            footer={null}
            closable={false}
            // styles={{ padding: 0, margin: 0 }}
            style={{
              top: 320,
              bottom: 0,
              left: 80,
              right: 0,
              maxWidth: "24%",
              minWidth: "16%",
              height: "2vh",
            }}
          >
            <div className={styles.delete_modal}>
              <div className={styles.delete_modal_box}>
                <p className={styles.delete_popup_text}>
                  Are you sure to delete this?
                </p>
                <p className={styles.delete_popup_revert_text}>
                  You won't be able to revert this!
                </p>

                <div className={styles.delete_modal_btn_div}>
                  <button
                    className={styles.delete_modal_buttonCancel}
                    onClick={() => setProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProductDeleteTrue}
                    className={styles.delete_modal_buttoDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        {/* =========================/category delete modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={categoryModal}
            onCancel={() => setCategoryModal(false)}
            footer={null}
            closable={false}
            // styles={{ padding: 0, margin: 0 }}
            style={{
              top: 80,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth: deleteCategory ? "24%" : "45%",
              minWidth: deleteCategory ? "16%" : "30%",
              height: "2vh",
            }}
          >
            {deleteCategory ? (
              <>
                <div className={styles.delete_modal}>
                  <div className={styles.delete_modal_box}>
                    <p className={styles.delete_popup_text}>
                      Are you sure to delete this category?
                    </p>
                    <p className={styles.delete_popup_revert_text}>
                      You won't be able to revert this!
                    </p>

                    <div className={styles.delete_modal_btn_div}>
                      <button
                        className={styles.delete_modal_buttonCancel}
                        onClick={() => setCategoryModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCategoryDeleteTrue}
                        className={styles.delete_modal_buttoDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.rackSavemodal}>
                  <div className={styles.sanitory_text}>
                    <div className={styles.input_div}>
                      <label htmlFor="code" className={styles.label}>
                        Category Id:
                      </label>
                      <input
                        type="text"
                        className={styles.codeInput}
                        value={category_id}
                        disabled
                      />
                    </div>
                    <div className={styles.input_div}>
                      <label htmlFor="code" className={styles.label}>
                        Category Name:
                      </label>
                      <input
                        type="text"
                        className={styles.nameInput}
                        value={category_name}
                        onChange={(e) => {
                          setCategoryName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.delete_modal_btn_div}>
                    <button
                      className={styles.delete_modal_buttonCancel2}
                      onClick={() => {
                        setCategoryModal(false);
                      }}
                    >
                      Cancel
                    </button>
                    {!category_id ? (
                      <button
                        className={styles.delete_modal_buttoDelete2}
                        onClick={saveCategory}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className={styles.delete_modal_buttoDelete2}
                        onClick={updateCategory}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </Modal>
        </div>
        {/* =========================/rack  modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={rackModal}
            onCancel={() => setRackModal(false)}
            footer={null}
            closable={false}
            styles={{ padding: 0, margin: 0 }}
            style={{
              top: 150,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth: deleteRack ? "24%" : "45%",
              minWidth: deleteRack ? "16%" : "30%",
              height: "2vh",
            }}
          >
            {deleteRack ? (
              <div className={styles.rackDeleteModal}>
                <div className={styles.delete_modal}>
                  <div className={styles.delete_modal_box}>
                    <p className={styles.delete_popup_text}>
                      Are you sure to delete this rack?
                    </p>
                    <p className={styles.delete_popup_revert_text}>
                      You won't be able to revert this!
                    </p>

                    <div className={styles.delete_modal_btn_div}>
                      <button
                        className={styles.delete_modal_buttonCancel}
                        onClick={() => {
                          setRackModal(false);
                          setDeleteRack(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRackDeleteTrue}
                        className={styles.delete_modal_buttoDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.rackSavemodal}>
                <div className={styles.sanitory_text}>
                  <div className={styles.input_div}>
                    <label htmlFor="code" className={styles.label}>
                      Rack Id:
                    </label>
                    <input
                      type="text"
                      className={styles.codeInput}
                      value={rack_id}
                      disabled
                    />
                  </div>
                  <div className={styles.input_div}>
                    <label htmlFor="code" className={styles.label}>
                      Rack No:
                    </label>
                    <input
                      type="text"
                      className={styles.nameInput}
                      value={rack_no}
                      onChange={(e) => {
                        setRackNo(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.delete_modal_btn_div}>
                  <button
                    className={styles.delete_modal_buttonCancel2}
                    onClick={() => {
                      setRackModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  {!rack_id ? (
                    <button
                      className={styles.delete_modal_buttoDelete2}
                      onClick={saveRack}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className={styles.delete_modal_buttoDelete2}
                      onClick={updateRack}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Addproducts;
