let getDbResult = () => {
  let deferred = q.defer();
  let qry = queries.getProductList();
  console.log('QRY::', qry);
  dbQuery.execute(qry)
  .then((dbResult) => {
    console.log('DBRES::', dbResult);
    // if (dbResult[0] && dbResult[0].id) {
    //   deferred.resolve('productExists');
    // } else {
    //   deferred.reject({
    //     code: "ERR004",
    //     error: "Product does not exists!"
    //   });
    // }
  })
  .catch((err) => {
    console.log(err);
    deferred.reject({ dbErr: err});
  });

  return deferred.promise;
}

var getProducts = (req, res) => {
  getDbResult()
  .then((result) => {
    res.status(200).send(result);
  })
  .catch((err) => {
    res.status(400).send({
      code: 'ERR009'
    });
  });
};

module.exports.getProducts = getProducts;
