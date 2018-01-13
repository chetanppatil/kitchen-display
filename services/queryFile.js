module.exports = {
    checkProductExists: (inp) => {
      return `SELECT id FROM products WHERE code = '${inp}' AND is_active = true`;
    },
    insertOrder: (inp) => {
      return `SELECT * FROM insertorder(code:= '${inp.productCode}', qnt:= ${parseInt(inp.quantity)})`;
    }
};
