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


});

// $('form').submit(function(e) {
//   e.preventDefault();
//   var message = $('#chat_input').val();
//   socket.emit('messages', message);
// });
