var _ = require('underscore');

a = {
  "productsData": [{
      "code": "jcw",
      "name": "Jumbo Chicken Wrap",
      "predictedValue": 2
    },
    {
      "code": "vl",
      "name": "Vegetarian Lasagne",
      "predictedValue": 5
    }
  ],
  "quantData": [{
      "code": "jcw",
      "sum": 5
    },
    {
      "code": "vl",
      "sum": 2
    }
  ],
  "doneData": [{
    "code": "vl",
    "sum": 2
  }]
};

var result = _.map(a.productsData, (num) => {
  // console.log(num);
  let qty = _.filter(a.quantData, (qntVal) => {
    return qntVal.code == num.code;
  });
  num.quantity = _.isEmpty(qty) ? 0 : qty[0].sum;

   let dnVal= _.filter(a.doneData, (val) => {
    return val.code == num.code;
  });
  num.createdTillNow = _.isEmpty(dnVal) ? 0 : dnVal[0].sum;
  return num;
})
console.log(result);
