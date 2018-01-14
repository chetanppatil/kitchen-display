var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.firstName = "John";
  $scope.lastName = "Doe";

  var socket = io.connect();
  socket.on('connect', (data) => {
    socket.emit('join', 'Hello World from client');
  });
  socket.on('start', (data) => {
    console.log('START::', data);
    getProducts();
  });
  socket.on('statusUpdate', (data) => {
    console.log('STATUS::', data);
    getProducts();
  });

  var getProducts = () => {
    $http({
        method: "GET",
        url: "/kitchen-display/getProducts"
      })
      .then((response) => {
        // $scope.myWelcome = response.data;
        if (response.data && response.data.data) {
          $scope.orderData = response.data.data
        }
      })
      .catch((err) => {
        $scope.myWelcome = err;
      });
  };

  $scope.updateStatus = (item) => {
    var reqBody = {
      "item": {
        "productCode": item.code,
        "isCompleted": true
      }
    };
    // console.log('item::', reqBody);
    $http({
        method: "POST",
        url: "/kitchen-display/orderStatus",
        data: reqBody
      })
      .then((response) => {
        // console.log('STAT:', response);
        socket.emit('statusUpdate', 'Status updated');
      })
      .catch((err) => {
        $scope.myWelcome = err;
      });
  };

  /*======= JSON to CSV Code STARTS =========*/
  $scope.downloadReport = function(showLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    // var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var arrData = [];

    for (var i = 0; i < $scope.orderData.length; i++) {
      // console.log(c[i]);
      var obj = {};
      obj["Dish Name"] = $scope.orderData[i].name;
      obj["Produced"] = $scope.orderData[i].createdTillNow;
      obj["Predicted"] = $scope.orderData[i].predictedValue;
      arrData.push(obj);
    }

    var CSV = '';
    //Set Report title in first row or line
    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (showLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
        // row += '="' + arrData[i][index] + '",';
        // row += "'" + arrData[i][index] + ",";
        //"=""Data Here"""
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV == '') {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "Order_Report";

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    // link.download = fileName + ".csv";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }; //JSONToCSVConvertor

  /*======= JSON to CSV Code ENDS =========*/



});
