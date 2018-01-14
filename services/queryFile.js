module.exports = {
  checkProductExists: (inp) => {
    return `SELECT id FROM products WHERE code = '${inp}' AND is_active = true;`;
  },
  insertOrder: (inp) => {
    return `SELECT * FROM insertorder(code:= '${inp.productCode}', qnt:= ${parseInt(inp.quantity || null)});`;
  },
  insertPredictedValue: (inp) => {
    return `SELECT * FROM insert_update_prediction(code:= '${inp.productCode}', val:= ${parseInt(inp.predictedValue)});`;
  },
  updateOrderStatus: (inp) => {
    return `UPDATE orders SET is_completed = true, updated_on = now() WHERE product_code = '${inp}' AND is_completed = false;`;
  },
  getProductList: () => {
    return `select * from public.get_products_data()`;
    // `SELECT p.code, p."name", (SELECT SUM(o.quantity) FROM orders o WHERE o.is_completed = false),
    //       (SELECT SUM(o.quantity) AS "createdTillNow"  FROM orders o WHERE o.is_completed = true),
    //       pr.predicted_value AS "predictedValue"
    //       FROM products p
    //       INNER JOIN orders o
    //       ON p.code = o.product_code --AND o.is_completed = false
    //       INNER JOIN prediction pr
    //       ON p.code = pr.product_code --AND predicted_on::date = now()::date
    //       WHERE p.is_active = true
    //       GROUP BY p.code, p."name", pr.predicted_value;`;
  }
};


// SELECT code as "productCode", name as "productName",
