let processOrder = (inputData) => {
  let deferred = q.defer();

  let qry = queries.insertOrder(inputData.item);
  // console.log('QRY::', qry);
  dbQuery.execute(qry)
  .then((dbResult) => {
    // console.log('DBRES::', dbResult[0]);
    deferred.resolve({
      code: 200,
      msg: 'Your order placed successfully. Your order number is ' + dbResult[0].insertorder
    });
  })
  .catch((err) => {
    deferred.reject({ dbErr: err});
  });

  return deferred.promise;
};

let validateInput = (data) => {
  let deferred = q.defer();
  if (data && !data.item) {
    deferred.reject({
      code: "ERR001",
      error: "Invalid request"
    });
  } else {
    let orderItem = data.item;
    if (!orderItem.productCode) {
      deferred.reject({
        code: "ERR002",
        error: "Please select product from list"
      });
    } else if (!orderItem.quantity) {
      deferred.reject({
        code: "ERR003",
        error: "Order quantity missing"
      });
    } else {
      deferred.resolve('ok');
    }
  }

  return deferred.promise;
};

var placeOrder = (req, res) => {
  let reqBody = req.body;

  validateInput(reqBody)
    .then((result) => {
      // console.log('VALIDATION: ', result);
      return commonFn.checkProductExists(reqBody.item.productCode);
    })
    .then((checkProductRes) => {
      // console.log('FILE CHECK RES:', checkProductRes);
      return processOrder(reqBody);
    })
    .then((finalRes) => {
      req.app.io.emit('statusUpdate', 'Status updated');
      res.status(200).send(finalRes);
    })
    .catch((err) => {
      res.status(400).send(err);
    });

};

module.exports.placeOrder = placeOrder;
