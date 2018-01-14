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

  let dnVal = _.filter(a.doneData, (val) => {
    return val.code == num.code;
  });
  num.createdTillNow = _.isEmpty(dnVal) ? 0 : dnVal[0].sum;
  return num;
})
// console.log(result);




var c = [{
    "code": "jcw",
    "name": "Jumbo Chicken Wrap",
    "predictedValue": 2,
    "quantity": 5,
    "createdTillNow": 0
  },
  {
    "code": "vl",
    "name": "Vegetarian Lasagne",
    "predictedValue": 5,
    "quantity": 2,
    "createdTillNow": 2
  }
];

// var d = _.map(c, (num) => {
//   let obj = {};
//   obj["Dish Name"] = num.name;
//   obj["Produced"] = num.createdTillNow;
//   obj["Predicted"] = num.predictedValue;
//   return obj;
// })


var d = [];
for (var i = 0; i < c.length; i++) {
  // console.log(c[i]);
  var obj = {};
  obj["Dish Name"] = c[i].name;
  obj["Produced"] = c[i].createdTillNow;
  obj["Predicted"] = c[i].predictedValue;
  d.push(obj);
}
console.log(d);
