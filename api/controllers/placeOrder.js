let processOrder = (inputData, fileData) => {
  let deferred = q.defer();

  fileData.items.push(inputData.item);
  fs.writeFile(ordersPath, JSON.stringify(fileData), function(err) {
    if (err) {
      deferred.reject({
        code: "ERR004",
        error: "Error occured in updating file"
      });
    } else {
      deferred.resolve({
        code: 200,
        msg: "Your order placed successfully."
      });
    }

  }); //fs.writeFile

  return deferred.promise;
};

let checkFileExists = () => {
  let deferred = q.defer();
  fs.stat(ordersPath, function(err, stat) {
    // console.log('EEE', err, stat);
    if (err) {
      let fileData = {
        items: []
      };

      fs.writeFile(ordersPath, JSON.stringify(fileData), function(err) {
        if (err) {
          deferred.reject({
            code: "ERR004",
            error: "Error occured in writing file"
          });
        } else {
          deferred.resolve(fileData);
        }

      }); //fs.writeFile
    } else {
      fs.readFile(ordersPath, function read(err, data) {
        if (err) {
          deferred.reject({
            code: "ERR005",
            error: "Error occured in reading file"
          });
        } else {
          deferred.resolve(JSON.parse(data.toString('utf8')));
        }

      });
    }

  }); //fs.stat
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
    if (!orderItem.productId) {
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
      return checkFileExists();
    })
    .then((fileExistsData) => {
      // console.log('FILE CHECK RES:', fileExistsData);
      return processOrder(reqBody, fileExistsData);
    })
    .then((finalRes) => {
      res.status(200).send(finalRes);
    })
    .catch((err) => {
      res.status(400).send(err);
    });

};

module.exports.placeOrder = placeOrder;
