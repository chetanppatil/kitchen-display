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
    getProducts: () => {
      return `SELECT * FROM products`;
    }
};


// SELECT code as "productCode", name as "productName",
