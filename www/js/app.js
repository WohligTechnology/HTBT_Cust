// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-datepicker', 'ngCordova'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })



  .config(function ($stateProvider, $urlRouterProvider, ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider


      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })


      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.help', {
        url: '/help',
        views: {
          'menuContent': {
            templateUrl: 'templates/help.html',
            controller: 'HelpCtrl'
          }
        }
      })
      .state('app.calendar', {
        url: '/calendar',
        views: {
          'menuContent': {
            templateUrl: 'templates/calendar.html',
            controller: 'CalendarCtrl'
          }
        }
      })

      .state('app.confirmation', {
        url: '/confirmation',
        views: {
          'menuContent': {
            templateUrl: 'templates/confirmation.html',
            controller: 'ConfirmationCtrl'
          }
        }
      })

      .state('app.orderconfirm', {
        url: '/orderconfirm',
        views: {
          'menuContent': {
            templateUrl: 'templates/orderconfirm.html',
            controller: 'OrderConfirmCtrl'
          }
        }
      })

      .state('app.requirement', {
        url: '/confirmation',
        views: {
          'menuContent': {
            templateUrl: 'templates/requirement.html',
            controller: 'RequirementCtrl'
          }
        }
      })

      .state('app.verification', {
        url: '/verification',
        views: {
          'menuContent': {
            templateUrl: 'templates/verification.html',
            controller: 'VerificationCtrl'
          }
        }
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })

      .state('app.orderhistory', {
        url: '/orderhistory',
        views: {
          'menuContent': {
            templateUrl: 'templates/orderhistory.html',
            controller: 'OrderhistoryCtrl'
          }
        }
      })

      .state('app.browse-more', {
        url: '/browse-more/:category',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse-more.html',
            controller: 'BrowseMoreCtrl'
          }
        }
      })

      .state('app.productSpecs', {
        url: '/productSpecs/:category',
        views: {
          'menuContent': {
            templateUrl: 'templates/productSpecs.html',
            controller: 'ProductSpecsCtrl'
          }
        }
      })

      .state('app.auth-payment', {
        url: '/auth-payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/auth-payment.html',
            controller: 'AuthPaymentCtrl'
          }
        }
      })

      .state('app.shipping', {
        url: '/shipping',
        views: {
          'menuContent': {
            templateUrl: 'templates/shipping.html',
            controller: 'ShippingCtrl'
          }
        }
      })

      .state('app.checkout', {
        url: '/checkout',
        views: {
          'menuContent': {
            templateUrl: 'templates/checkout.html',
            controller: 'CheckoutCtrl'
          }
        }
      })

      .state('app.subpage1', {
        url: '/subpage1',
        views: {
          'menuContent': {
            templateUrl: 'templates/subpage1.html',
            controller: 'Subpage1Ctrl'
          }
        }
      })

      .state('app.review', {
        url: '/review',
        views: {
          'menuContent': {
            templateUrl: 'templates/review.html',
            controller: 'ReviewCtrl'
          }
        }
      })

      .state('app.subpage2', {
        url: '/subpage2',
        views: {
          'menuContent': {
            templateUrl: 'templates/subpage2.html',
            controller: 'Subpage2Ctrl'
          }
        }
      })

      .state('app.subpage3', {
        url: '/subpage3',
        views: {
          'menuContent': {
            templateUrl: 'templates/subpage3.html',
            controller: 'Subpage3Ctrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html',
            controller: 'BrowseCtrl'
          }
        }
      })

      .state('app.addons', {
        url: '/add-ons',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-ons.html',
            controller: 'AddonsCtrl'
          }
        }
      })

      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })


      .state('verify', {
        url: '/verify',
        templateUrl: 'templates/verify.html',
        controller: 'VerifyCtrl'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
      })

      .state('pincode', {
            cache:false,
            url: '/pincode',
            templateUrl: 'templates/pincode.html',
            controller: 'PincodeCtrl'
          })

      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })




  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {

        $timeout(function () {
          element[0].focus();
        });
      }
    };
  })

  .directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        var digits;

        function inputValue(val) {
          if (val) {
            if (attr.type == "tel") {
              digits = val.replace(/[^0-9\+\\]/g, '');
            } else {
              digits = val.replace(/[^0-9\-\\]/g, '');
            }


            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits, 10);
          }
          return undefined;
        }
        ctrl.$parsers.push(inputValue);
      }
    };
  })
  .filter('uploadpath', function () {
    return function (input, width, height, style) {
      var other = "";
      if (width && width != "") {
        other += "&width=" + width;
      }
      if (height && height != "") {
        other += "&height=" + height;
      }
      if (style && style != "") {
        other += "&style=" + style;
      }
      if (input) {
        if (input.indexOf('https://') == -1) {
          return imgpath + input + other;

        } else {
          return input;
        }
      }
    }
  });
