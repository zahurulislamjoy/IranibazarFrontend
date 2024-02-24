import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { FcBullish} from "react-icons/fc";

import { FaLuggageCart } from "react-icons/fa";

import { TiShoppingCart } from "react-icons/ti"; //Purchase 
import { BsCashCoin} from "react-icons/bs"; // Cashbook
import { FaSackDollar } from "react-icons/fa6"; // Expense
import { LiaFileInvoiceSolid} from "react-icons/lia"; //Quotation
import { BsMegaphone} from "react-icons/bs"; //Marketing

 
export const SidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Sales",
    icon: <FcBullish/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Sales",
        path: "/salepage",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Product Sales Report",
        path: "/sale/sale_report",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Customer Sales Report",
        path: "/sale/customer_transaction",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Stock",
    icon: <FaLuggageCart/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
        {
          title: "Stock Report",
          path: "/stock/stockreport",
          icon: <IoIcons.IoIosPaper />,
        },
        {
            title: "Add Product",
            path: "/stock/addproduct",
            icon: <IoIcons.IoIosPaper />,
        }
        
      ],
  },
  {
    title: "Purchase",
    icon: <TiShoppingCart />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Purchase",
        path: "/purchase",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Product Purchase Report",
        path: "/purchase/productpurchasereport",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Supplier Report",
        path: "/purchase/supplierreport",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Cash Book",
    icon: <BsCashCoin/>,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Cash Book",
        path: "/cashbook",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Income & Expense",
    icon: <FaSackDollar />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Expense Input",
        path: "/income_expense/expense_iput",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Expense Report",
        path: "/income_expense/expense_report",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Quotation",
    icon: <LiaFileInvoiceSolid />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Quotation",
        path: "/quotation",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Marketing and Collection",
    icon: <BsMegaphone />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Marketing and Collection",
        path: "/marketing/marketing_due_collection",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Employee Setup",
        path: "/marketing/employee_setup",
        icon: <IoIcons.IoIosPaper />,
      }
    ],
  },
];

 