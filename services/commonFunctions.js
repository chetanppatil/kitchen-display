module.exports = {
  checkProductExists: (productCode) => {
    let deferred = q.defer();
    let qry = queries.checkProductExists(productCode);
    // console.log('QRY::', qry);
    dbQuery.execute(qry)
    .then((dbResult) => {
      // console.log('DBRES::', dbResult[0]);
      if (dbResult[0] && dbResult[0].id) {
        deferred.resolve('productExists');
      } else {
        deferred.reject({
          code: "ERR004",
          error: "Product does not exists!"
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      deferred.reject({ dbErr: err});
    });

    return deferred.promise;
  }
}
