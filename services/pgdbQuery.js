let pg = require('pg');
let config = require('../config/db.json');


/* Get data from postgresql server */
function execute(qry) {
  let deferred = q.defer();

  if (!config) {
    deferred.reject('No Config');
  }
  // console.log(config)
  if (qry === null) {
    deferred.reject('No Query Found');
  }
  let pool = new pg.Pool(config);
  // console.log(qry)
  pool.connect()
    .then(client => {
      client.query(qry).then(res => {
          //  console.log("res", res);
          // client.release();
           client.end();
          deferred.resolve(res.rows);
        })
        .catch(e => {
          // client.release();
           client.end();
          console.error('query error in', e.message, e.stack);
          deferred.reject(e.message);
        })

    }).catch(e => {
      console.error('query error out', e.message, e.stack);
      deferred.reject(e.message);
    })
  return deferred.promise;
}

/* Export functions */
exports.execute = execute;
