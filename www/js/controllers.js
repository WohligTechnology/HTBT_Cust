angular.module('starter.controllers', ['angular-svg-round-progressbar', 'starter.services', 'ngCordova'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopover, $state,  MyServices) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};


    $ionicPopover.fromTemplateUrl('templates/modal/popover.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })
  .controller('HelpCtrl', function ($scope, $stateParams) {

  })

  .controller('ProductSpecsCtrl', function ($scope, $stateParams,$state,MyServices) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  

    $scope.product = {}
    // alert($stateParams.category);
    $scope.product.category = $stateParams.category;

    console.log("dsjh", $scope.product, $stateParams)
    MyServices.products($scope.product, function (data) {

      console.log(data);
      $scope.prod = data.data;
      console.log("proctid", $scope.prod);

    });
 
  })


  .controller('VerificationCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('RequirementCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })



  .controller('ProfileCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [{
      title: 'Reggae',
      id: 1
    }, {
      title: 'Chill',
      id: 2
    }, {
      title: 'Dubstep',
      id: 3
    }, {
      title: 'Indie',
      id: 4
    }, {
      title: 'Rap',
      id: 5
    }, {
      title: 'Cowbell',
      id: 6
    }];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {})

  .controller('VerifyCtrl', function ($scope, $stateParams) {})

  .controller('LoginCtrl', function ($scope, $stateParams) {})

  .controller('ShippingCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('CheckoutCtrl', function ($scope, $stateParams, ionicDatePicker, $ionicPopover) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.show = '';
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (terms) {
      $scope.terms = terms;
    });



    $scope.closePopover = function() {
        $scope.terms.hide();
     };

  var ipObj1 = {
         callback: function (val) {  //Mandatory
           console.log('Return value from the datepicker popup is : ' + val, new Date(val));
         },
         disabledDates: [            //Optional
           new Date(2016, 2, 16),
           new Date(2015, 3, 16),
           new Date(2015, 4, 16),
           new Date(2015, 5, 16),
           new Date('Wednesday, August 12, 2015'),
           new Date("08-16-2016"),
           new Date(1439676000000)
         ],
         from: new Date(2012, 1, 1), //Optional
         to: new Date(2016, 10, 30), //Optional
         inputDate: new Date(),      //Optional
         mondayFirst: true,          //Optional
         disableWeekdays: [0],       //Optional
         closeOnSelect: false,       //Optional
         templateType: 'popup'       //Optional
       };

       $scope.openDatePicker = function(){
         ionicDatePicker.openDatePicker(ipObj1);
       };

})


.controller('Subpage1Ctrl', function ($scope, $stateParams) {
  $scope.goBackHandler = function () {
    window.history.back(); //This works
  };
})

.controller('Subpage2Ctrl', function ($scope, $stateParams) {
  $scope.goBackHandler = function () {
    window.history.back(); //This works
  };
})

.controller('OrderConfirmCtrl', function ($scope, $stateParams) {
  $scope.goBackHandler = function () {
    window.history.back(); //This works
  };
})


.controller('Subpage3Ctrl', function ($scope, $stateParams) {
  $scope.goBackHandler = function () {
    window.history.back(); //This works
  };
})



.controller('AuthPaymentCtrl', function ($scope, $stateParams) {
  $scope.goBackHandler = function () {
    window.history.back(); //This works
  };
})





  .controller('Subpage1Ctrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('Subpage2Ctrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('OrderConfirmCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })


  .controller('Subpage3Ctrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('BrowseMoreCtrl', function ($scope, $stateParams, MyServices) {

    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
    $scope.product = {};
    $scope.product.category = $stateParams.category;

    MyServices.products($scope.product, function (data) {
      console.log(data);
      $scope.prod = data.data;
      console.log("proctid", $scope.prod);
    });
  })


  .controller('AuthPaymentCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })


  .controller('BrowseCtrl', function ($scope, $ionicSlideBoxDelegate, MyServices) {
    $scope.nextSlide = function () {
      $ionicSlideBoxDelegate.next();
    };
      $scope.nextPage = function (sub, id) {
      if (sub == 'Yes') {
        $state.go('app.browse-more', {
          'category': id
        })
      } else {
        $state.go('app.productSpecs', {
          'category': id
        })

      }
    };
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
    MyServices.categories(function (data) {

      console.log(data);
      $scope.category = _.chunk(data.data, 2);
      console.log($scope.category);
    });

    MyServices.featureprods(function (data) {

      console.log(data);
      $scope.feaprods = data.data;
      console.log("let me know", $scope.feaprods);


      // $ionicSlideBoxDelegate.slide(0);
      $ionicSlideBoxDelegate.update();

    });
  })
  .controller('AddonsCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };


  })

  .controller('ReviewCtrl', function ($scope, $stateParams, ionicDatePicker) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
    var ipObj1 = {
      callback: function (val) { //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      },
      disabledDates: [ //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      disableWeekdays: [0], //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };

    $scope.openDatePicker = function () {
      ionicDatePicker.openDatePicker(ipObj1);
    };

  })

  .controller('OrderhistoryCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('ConfirmationCtrl', function ($scope, $stateParams) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
  })

  .controller('CalendarCtrl', function ($scope, $stateParams, ionicDatePicker, $ionicSlideBoxDelegate) {

    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $scope.date = [{
      d: '',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '1',
      isAvl: false
    }, {
      d: '2',
      isAvl: false
    }, {
      d: '3',
      isAvl: false
    }, {
      d: '4',
      isAvl: false
    }, {
      d: '5',
      isAvl: false
    }, {
      d: '6',
      isAvl: false
    }, {
      d: '7',
      isAvl: false
    }, {
      d: '8',
      isAvl: true
    }, {
      d: '9',
      isAvl: false
    }, {
      d: '10',
      isAvl: true
    }, {
      d: '11',
      isAvl: false
    }, {
      d: '12',
      isAvl: false
    }, {
      d: '13',
      isAvl: false
    }, {
      d: '14',
      isAvl: false
    }, {
      d: '15',
      isAvl: true
    }, {
      d: '16',
      isAvl: false
    }, {
      d: '17',
      isAvl: true
    }, {
      d: '18',
      isAvl: false
    }, {
      d: '19',
      isAvl: false
    }, {
      d: '20',
      isAvl: false
    }, {
      d: '21',
      isAvl: false
    }, {
      d: '22',
      isAvl: true
    }, {
      d: '23',
      isAvl: false
    }, {
      d: '24',
      isAvl: true
    }, {
      d: '25',
      isAvl: false
    }, {
      d: '26',
      isAvl: false
    }, {
      d: '27',
      isAvl: false
    }, {
      d: '28',
      isAvl: false
    }, {
      d: '29',
      isAvl: true
    }, {
      d: '30',
      isAvl: false
    }, {
      d: '31',
      isAvl: true

    }, {
      d: '',
      isAvl: false
    }];
    $scope.date1 = _.chunk($scope.date, 7);
    console.log($scope.date1);
    $scope.dateA = [{
      d: '30',
      isAvl: false
    }, {
      d: '31',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '',
      isAvl: false
    }, {
      d: '1',
      isAvl: false
    }, {
      d: '2',
      isAvl: false
    }, {
      d: '3',
      isAvl: false
    }, {
      d: '4',
      isAvl: false
    }, {
      d: '5',
      isAvl: false
    }, {
      d: '6',
      isAvl: false
    }, {
      d: '7',
      isAvl: false
    }, {
      d: '8',
      isAvl: true
    }, {
      d: '9',
      isAvl: false
    }, {
      d: '10',
      isAvl: true
    }, {
      d: '11',
      isAvl: false
    }, {
      d: '12',
      isAvl: false
    }, {
      d: '13',
      isAvl: false
    }, {
      d: '14',
      isAvl: false
    }, {
      d: '15',
      isAvl: true
    }, {
      d: '16',
      isAvl: false
    }, {
      d: '17',
      isAvl: true
    }, {
      d: '18',
      isAvl: false
    }, {
      d: '19',
      isAvl: false
    }, {
      d: '20',
      isAvl: false
    }, {
      d: '21',
      isAvl: false
    }, {
      d: '22',
      isAvl: true
    }, {
      d: '23',
      isAvl: false
    }, {
      d: '24',
      isAvl: true
    }, {
      d: '25',
      isAvl: false
    }, {
      d: '26',
      isAvl: false
    }, {
      d: '27',
      isAvl: false
    }, {
      d: '28',
      isAvl: false
    }, {
      d: '29',
      isAvl: true
    }];
    $scope.dateA1 = _.chunk($scope.dateA, 7);
    console.log($scope.date1);
    $scope.slidePrevious = function () {

      $ionicSlideBoxDelegate.previous();
    };

    $scope.slideNext = function () {

      $ionicSlideBoxDelegate.next();
    };
    var ipObj1 = {

      callback: function (val) { //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      },
      disabledDates: [ //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      disableWeekdays: [0], //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.openDatePicker = function () {
      ionicDatePicker.openDatePicker(ipObj1);
    };
  })

  .controller('DashboardCtrl', function ($scope, $stateParams, $ionicPopup, $ionicSlideBoxDelegate) {
    $scope.showPopup = function () {
      $scope.show = $ionicPopup.show({
        templateUrl: 'templates/modal/price.html',
        cssClass: "priceCard",
        scope: $scope
      });
    };
    $scope.closePopup = function () {
      $scope.show.close();
    };
    $scope.lockSlide = function () {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    $scope.myActiveSlide = 1;

    $scope.slidePrevious = function () {

      $ionicSlideBoxDelegate.previous();
    };

    $scope.slideNext = function () {

      $ionicSlideBoxDelegate.next();
    };
  })

  .controller('SignUpCtrl', function ($scope, $stateParams, $ionicPopup, $ionicPopover, MyServices, $state) {
    $scope.sorryPopup = function () {
      $scope.sorry = $ionicPopup.show({
        templateUrl: 'templates/modal/pincode.html',
        cssClass: "popupSorry",
        scope: $scope
      });
    };
    $scope.closeSorry = function () {
      console.log("hello");
      $scope.sorry.close();
    };

    $ionicPopover.fromTemplateUrl('templates/modal/popover.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    $scope.show = '';
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (terms) {
      $scope.terms = terms;
    });



    $scope.closePopover = function () {
      $scope.terms.hide();
    };

    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.signupForm = {};
    $scope.signupForm.accessLevel = "Customer"
    $scope.signup = function () {
      console.log("djfgjk", $scope.signupForm);
      MyServices.signup($scope.signupForm, function (data) {

        console.log(data);
        if ("data.value == true") {
          $state.go('app.verification');
        } else {

          $scope.showAlert(data.status, 'login', 'Error Message');
        }
      });
    };
  });