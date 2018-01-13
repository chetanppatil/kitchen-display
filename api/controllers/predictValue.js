let insertValue = (inputData) => {
  let deferred = q.defer();

  let qry = queries.insertPredictedValue(inputData.item);
  // console.log('QRY::', qry);
  dbQuery.execute(qry)
    .then((dbResult) => {
      // console.log('DBRES::', !dbResult[0]);
      let out = {
        code: 200,
        msg: ''
      };
      if (dbResult[0] && dbResult[0].insert_update_prediction && dbResult[0].insert_update_prediction.toLowerCase() === 'update') {
        out.msg = 'Prediction updated successfully.';
        deferred.resolve(out);
      } else if (dbResult[0] && dbResult[0].insert_update_prediction && dbResult[0].insert_update_prediction.toLowerCase() === 'insert') {
        out.msg = 'Prediction added successfully.';
        deferred.resolve(out);
      } else {
        deferred.reject({
          code: 'ERR006',
          error: 'Error occurred while adding prediction'
        });
      }

    })
    .catch((err) => {
      deferred.reject({
        dbErr: err
      });
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
    } else if (!inp.predictedValue) {
      deferred.reject({
        code: "ERR005",
        error: "Predicted value missing"
      });
    } else {
      deferred.resolve('ok');
    }
  }

  return deferred.promise;
};

var predictValue = (req, res) => {
  let reqBody = req.body;

  validateInput(reqBody)
    .then((result) => {
      // console.log('VALIDATION: ', result);
      return commonFn.checkProductExists(reqBody.item.productCode);
    })
    .then((checkProductRes) => {
      // console.log('FILE CHECK RES:', checkProductRes);
      return insertValue(reqBody);
    })
    .then((finalRes) => {
      res.status(200).send(finalRes);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.predictValue = predictValue;
