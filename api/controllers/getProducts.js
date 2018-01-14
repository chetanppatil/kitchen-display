let getDbResult = () => {
  let deferred = q.defer();
  let qry = queries.getProductList();
  // console.log('QRY::', qry);
  dbQuery.execute(qry)
    .then((dbResult) => {
      // console.log('DBRES::', dbResult[0]);
      if (dbResult[0]) {
        let dbRes = dbResult[0];
        let result = _.map(dbRes.productsData, (num) => {
          let qty = _.filter(dbRes.quantData, (qntVal) => {
            return qntVal.code == num.code;
          });
          num.quantity = _.isEmpty(qty) ? 0 : qty[0].sum;

          let dnVal = _.filter(dbRes.doneData, (val) => {
            return val.code == num.code;
          });
          num.createdTillNow = _.isEmpty(dnVal) ? 0 : dnVal[0].sum;
          return num;
        })

        deferred.resolve({
          code: 200,
          msg: "Data fetched successfully.",
          data: result
        });
      } else {
        deferred.reject({
          code: "ERR004",
          error: "No order found!"
        });
      }
    })
    .catch((err) => {
      console.log(err);
      deferred.reject({
        dbErr: err
      });
    });

  return deferred.promise;
}

var getProducts = (req, res) => {
  getDbResult()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.getProducts = getProducts;
