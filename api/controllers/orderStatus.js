let updateOrder = (inputData) => {
  let deferred = q.defer();

  let qry = queries.updateOrderStatus(inputData.item.productCode);
  // console.log('QRY::', qry);
  dbQuery.execute(qry)
  .then((dbResult) => {
    // console.log('DBRES::', dbResult);
    if (_.isEmpty(dbResult)) {
      deferred.resolve({
        code: 200,
        msg: "Order completed successfully."
      });
    } else {
      deferred.reject({
        code: 'ERR0008',
        error: 'Order could not be completed'
      });
    }

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
    let inp = data.item;
    if (!inp.productCode) {
      deferred.reject({
        code: "ERR002",
        error: "Please select product from list"
      });
    } else if (!inp.isCompleted) {
      deferred.reject({
        code: "ERR007",
        error: "Order status missing"
      });
    } else {
      deferred.resolve('ok');
    }
  }

  return deferred.promise;
};

var orderStatus = (req, res) => {
  let reqBody = req.body;

  validateInput(reqBody)
    .then((result) => {
      // console.log('VALIDATION: ', result);
      return commonFn.checkProductExists(reqBody.item.productCode);
    })
    .then((checkProductRes) => {
      // console.log('FILE CHECK RES:', checkProductRes);
      return updateOrder(reqBody);
    })
    .then((finalRes) => {
      res.status(200).send(finalRes);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.orderStatus = orderStatus;
