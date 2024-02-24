//===================making Top 10 Sale Products starts here====================
export const topTenSaleProducts = (items) => {
  function getTop10Products(data) {
    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error("Data is not an array.");
      return [];
    }

    // Count the quantity of each product
    const productCounts = {};
    data.forEach((item) => {
      if (item.ProductTrace && item.ProductTrace.name) {
        // Add null check for ProductTrace
        const productName = item.ProductTrace.name;
        if (productCounts[productName]) {
          productCounts[productName] += parseInt(item.quantity_no);
        } else {
          productCounts[productName] = parseInt(item.quantity_no);
        }
      }
    });

    // Sort the products by quantity in descending order
    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Get the top 10 products

    // Convert the sorted products to the required format
    const top10Products = sortedProducts.map(([name, quantity]) => ({
      name,
      Quantity: quantity,
    }));

    return top10Products;
  }

  // Call the function with the provided data
  const top10Products = getTop10Products(items);

  const chartBoxProducts = {
    dataKey: "Quantity",
    chartData: top10Products.map((product) => ({
      name: product.name,
      Quantity: product.Quantity,
    })),
  };

  return chartBoxProducts;
};

//===================making Total sale by month starts here====================
export const monthlySale = (items) => {
  function calculateTotalSalesByMonth(transactions) {
    const salesByMonth = {};

    transactions.forEach((transaction) => {
      if (
        transaction.OperationType &&
        transaction.OperationType.operation_type_id === 1
      ) {
        // Add null check for OperationType
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month}-${year}`;

        if (!salesByMonth[key]) {
          salesByMonth[key] = 0;
        }
        salesByMonth[key] += parseFloat(transaction.sale_price);
      }
    });

    const salesArray = Object.entries(salesByMonth).map(([key, value]) => ({
      month: key,
      totalSale: value,
    }));

    return salesArray;
  }

  // Calculate total sale price of each month
  const totalSalesByMonth = calculateTotalSalesByMonth(items);

  // Check if totalSalesByMonth is an array
  if (!Array.isArray(totalSalesByMonth)) {
    console.error("Error: totalSalesByMonth is not an array.");
    return null; // or handle the error in a way that makes sense for your application
  }

  totalSalesByMonth.forEach((item) => {
    const [month, year] = item.month.split("-");
    item.date = new Date(`${month} 01, ${year}`);
  });

  totalSalesByMonth.sort((a, b) => b.date - a.date);

  const last12MonthsSales = totalSalesByMonth.slice(0, 12);

  const chartData = [];

  last12MonthsSales.forEach((item) => {
    const month = item.date.toLocaleString("en-US", { month: "long" });
    chartData.push({ name: month, totalSale: item.totalSale });
  });

  const chartBoxSale = {
    dataKey: "totalSale",
    chartData: chartData,
  };

  return chartBoxSale;
};

//=================== monthlyTopTenSaleProducts===============
export const monthlyTopTenSaleProducts = (items) => {
  const piChartColors = ["#DD4F4F", "#F39C12", "#0088FE", "#9B59B6", "#008080"]; // Example colors for each item

  function getLastMonthTop10Products(data) {
    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error("Error: Data is not an array.");
      return [];
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStart = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    );
    const lastMonthEnd = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    );

    const lastMonthItems = data.filter((item) => {
      // Check if item.date is a valid date
      if (!item.date || isNaN(new Date(item.date))) {
        console.error("Error: Invalid date found in data.");
        return false;
      }

      const itemDate = new Date(item.date);
      return itemDate >= lastMonthStart && itemDate <= lastMonthEnd;
    });

    const productCounts = {};
    lastMonthItems.forEach((item) => {
      if (item.ProductTrace && item.ProductTrace.name) {
        const productName = item.ProductTrace.name;
        if (productCounts[productName]) {
          productCounts[productName] += parseInt(item.quantity_no);
        } else {
          productCounts[productName] = parseInt(item.quantity_no);
        }
      }
    });

    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const top10Products = sortedProducts.map(([name, quantity]) => ({
      name,
      value: quantity,
    }));

    return top10Products;
  }

  // Call the function with the provided data
  const lastMonthTop10Products = getLastMonthTop10Products(items);

  const piChartData = lastMonthTop10Products.map((product, index) => ({
    name: product.name,
    value: product.value,
    color: piChartColors[index % piChartColors.length],
  }));
  return piChartData;
};


//styles:
export const allTimeTopTen_ProductStyle = {
  color: "#009CFF",
  colors: ["#7158e2", "#671686", "#9b59b6"],
  title: "Top 10 Sale Products",
};

export const lastTweelveMonth_SaleStyle = {
  color: "teal",
  colors: ["#0088FE", "#DD4F4F", "#e67e22"],
  title: "Monthly Sale",
};

//=================topbar chart data is handling here===============:

//=============todays total sale========:
export const todaysSaleFunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalSale = 0;

  items.forEach((item) => {
    // Check if item.date is a valid date
    if (!item.date || isNaN(new Date(item.date))) {
      console.error("Error: Invalid date found in items.");
      return 0; // or handle the error in a way that makes sense for your application
    }

    const transactionDate = new Date(item.date);
    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate.getTime() === today.getTime()) {
      totalSale += parseFloat(item.sale_price);
    }
  });

  return totalSale;
};


//================todays income==========:
export const todaysIncomefunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  // sold products total purchase amount
  const todayDate = new Date().toISOString()?.slice(0, 10);

  // Filter items for today's date and operation_type_id equal to 1
  const filteredItems = items.filter((item) => {
    // Check if item is not null or undefined
    if (!item) {
      console.error("Error: Found null or undefined item in 'items'.");
      return false;
    }

    // Get the date part from the item's date string
    const itemDate = item.date?.slice(0, 10);
    
    // Check if the item's date is today and operation_type_id is 1
    return itemDate === todayDate && item.operation_type_id === 1;
  });

  // Calculate the total amount based on purchase_price
  const totalPurchaseAmount = filteredItems.reduce((total, item) => {
    // Check if item is not null or undefined
    if (!item) {
      console.error("Error: Found null or undefined item in 'filteredItems'.");
      return total;
    }

    // Convert purchase_price and quantity_no to numbers and multiply them
    const itemAmount =
      parseFloat(item.purchase_price) * parseFloat(item.quantity_no);
    // Add the calculated amount to the total
    return total + itemAmount;
  }, 0);

  // todays total sell price
  const todaysTotalSell = todaysSaleFunction(items);

  // now todays net income
  const netIncome = todaysTotalSell - totalPurchaseAmount;
  console.log(netIncome);
  return netIncome;
};

//===============todays total quantity:===================
export const todaysTotalQuantityFunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  // Get today's date in UTC format
  const today = new Date().toISOString()?.slice(0, 10);

  // Filter items for today's date and operation_type_id = 1
  const todaysItems = items.filter((item) => {
    return item?.date?.slice(0, 10) === today && item?.operation_type_id === 1;
  });

  // Calculate sum of quantity_no
  const sumOfQuantity = todaysItems.reduce((sum, item) => {
    // Check if item is not null or undefined
    if (!item) {
      console.error("Error: Found null or undefined item in 'todaysItems'.");
      return sum;
    }

    return sum + parseInt(item.quantity_no);
  }, 0);

  return sumOfQuantity;
};


//==================total sale========:
export const totalSaleFunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  let totalAmount = 0;

  items.forEach((item) => {
    // Check if item is not null or undefined
    if (item && item.operation_type_id === 1) {
      totalAmount += parseFloat(item.amount);
    }
  });

  return totalAmount;
};


//============total cost=========:
export const totalCostFunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  let totalAmountNot1 = 0;

  items.forEach((item) => {
    // Check if item is not null or undefined
    if (item) {
      if (item.operation_type_id !== 1) {
        totalAmountNot1 += parseFloat(item.amount);
      }
    }
  });

  return totalAmountNot1;
};


//==============net income =========:
export const netIncomeFunction = (items) => {
  // Check if items is an array
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0; // or handle the error in a way that makes sense for your application
  }

  let totalAmount = 0;
  let totalAmountNot1 = 0;

  items.forEach((item) => {
    // Check if item is not null or undefined
    if (item) {
      if (item.operation_type_id === 1) {
        totalAmount += parseFloat(item.amount);
      } else {
        totalAmountNot1 += parseFloat(item.amount);
      }
    }
  });

  const netIncome = totalAmount - totalAmountNot1;

  return netIncome;
};

