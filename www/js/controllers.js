angular.module('starter.controllers', ['angular-svg-round-progressbar', 'starter.services', "starter.subscription", 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopover, $state,  MyServices) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};
        if ($.jStorage.get('profile')) {
            $scope.profile = $.jStorage.get('profile');
            $scope.getProfield = {};
            $scope.getProfield._id = $scope.profile._id;
        }

        MyServices.getProfile($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.signupForm = data.data;
            } else {

            }
        });

        $ionicPopover.fromTemplateUrl('templates/modal/popover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        $scope.logout = function() {
            $.jStorage.set('profile', {});
            $.jStorage.flush();
            $state.go('login');

        };

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })
    .controller('HelpCtrl', function($scope, $stateParams) {

    })

.controller('ProductSpecsCtrl', function($scope, $stateParams, $ionicPopup, $state, MyServices) {
    $scope.goBackHandler = function() {
        window.history.back();
    };
    $scope.userDetails = MyServices.getAppDetails();

    $scope.profile = $.jStorage.get('profile');
    MyServices.products({
        category: $stateParams.category
    }, function(data) {
        $scope.products = data.data;
        _.each($scope.products, function(n) {
            n.productQuantity = 0;
        });
    });
    $scope.checkMinProduct = function(product) {
        if (product.productQuantity <= 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.checkMaxProduct = function(product) {
        if (product.productQuantity >= parseInt(product.quantity)) {
            return true;
        } else {
            return false;
        }
    };
    $scope.changeProductQuantity = function(product, change) {
        if (_.isNaN(parseInt(product.productQuantity))) {
            product.productQuantity = 0;
        }
        if (change) {
            product.productQuantity++;
        } else {
            product.productQuantity--;
        }
    };
    $scope.addToCart = function() {
        var products = _.map(_.filter($scope.products, function(n) {
            return (n.productQuantity && n.productQuantity >= 1);
        }), function(n) {

            return {
                productQuantity: n.productQuantity,
                product: n._id,
                totalAmount: n.productQuantity * parseFloat(n.price)
            };
        });
        if (products.length > 0) {
            MyServices.addToCart(products, function(data) {
                if (data.status == 200) {
                    var alertPopup = $ionicPopup.alert({
                        title: "Products Added to Cart",
                        template: "Products Added to Cart Successfully"
                    });
                    alertPopup.then(function(res) {
                        $state.go("app.review");
                    });
                } else {
                    $ionicPopup.alert({
                        title: "Error Occured",
                        template: "Error Occured while adding Products to Cart"
                    });
                }
            });
        } else {
            $ionicPopup.alert({
                title: "No Product",
                template: "No Product for Add to Cart"
            });

        }

    };
})

.controller('VerificationCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('VerifyCtrl', function($scope, $stateParams, $state, MyServices) {
    $.jStorage.flush();
    var reqObj = {};
    var otp = {};
    reqObj.mobile = $stateParams.no;
    reqObj.accessLevel = "Customer";


    $(".inputs").keyup(function() {
        if (this.value.length == this.maxLength) {
            var $next = $(this).next('.inputs');
            if ($next.length)
                $(this).next('.inputs').focus();
            else
                $(this).blur();
        }
    });

    //Function to verify OTP
    $scope.verifyOTP = function(value) {
        reqObj.otp = value.first.toString() + value.second.toString() + value.third.toString() + value.forth.toString();
        console.log(value);
        MyServices.verifyOTP(reqObj, function(data) {
            if (data.value) {
                $scope.profile = $.jStorage.set('profile', data.data);
                $state.go('signup');
            } else {
                alert("OTP verification failed")
                $state.go('login');
            }
        })
    }
})

.controller('LoginCtrl', function($scope, $stateParams, $state, MyServices, $ionicPopup) {
    //Variable declaration
    $scope.loginInfo = {};

    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile != null) {
        $state.go('app.browse');
    }

    $scope.getOTP = function(value) {
        console.log("value", value);
        value.accessLevel = "Customer"
        if (value.mobile != null && value.mobile != "") {
            MyServices.getOTP({
                mobile: value.mobile,
                accessLevel: value.accessLevel
            }, function(data) {
                if (data.value) {
                    if (data.value) {
                        $state.go('verify', {
                            no: value.mobile
                        });
                    } else {
                        alert("unable to generate OTP. Please try again");
                        var alertPopup = $ionicPopup.alert({
                            title: 'Unable to generate OTP',
                            template: 'Please try again'
                        });
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Unable to generate OTP',
                        template: 'Please try again'
                    });
                }
            })
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Please provide correct mobile number'
            });
        }

    }


    // $scope.getOTP = function () {
    //     var alertPopup = $ionicPopup.alert({
    //         title: 'Unable to generate OTP',
    //         template: 'Please try again'
    //     });
    //     alertPopup.then(function (res) {
    //         console.log('Thank you for not eating my delicious ice cream cone');
    //     });
    // };

})

.controller('CheckoutCtrl', function($scope, $stateParams, MyServices, Subscription, $state, ionicDatePicker, $ionicPopover) {
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    Subscription.validate($state);
    $scope.Quarterly = 12;
    $scope.Monthly = 4;
    $scope.Onetime = 1;
    console.log($scope.subscription);
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.getProductPrice = MyServices.getProductPrice;
    $scope.addPlan = function(planName) {
        $scope.subscription.plan = planName;
    };
    $scope.calculateTotalPrice = function() {
        var total = 0;
        var savingPriceTotal = 0;
        $scope.totalAmt = 0;
        $scope.otherProductstotal = 0;
        $scope.deposit = 0;
        $scope.subscription.totalQuantity = 0;


        _.each($scope.subscription.otherProducts, function(n) {
            $scope.otherProductstotal += n.price * n.productQuantity;
        });
        if ($scope.subscription.productDetail.applicableBefore > $scope.subscription.product[0].quantity) {
            $scope.deposit = ($scope.subscription.product[0].quantity * $scope.subscription.productDetail.AmtDeposit);
        }
        if ($scope.subscription.plan == 'Quarterly') {
            $scope.subscription.totalQuantity = 12 * $scope.subscription.product[0].quantity;
            total = 12 * ($scope.subscription.product[0].quantity * $scope.subscription.productDetail.priceUsed);
            savingPriceTotal = ($scope.subscription.totalQuantity * $scope.subscription.productDetail.price);
            $scope.savingAmount = savingPriceTotal - total;
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
            $scope.totalAmt = $scope.deposit + $scope.otherProductstotal + total;

            return $scope.savingAmount;
        } else if ($scope.subscription.plan == 'Monthly') {
            $scope.subscription.totalQuantity = 4 * $scope.subscription.product[0].quantity;
            total = ($scope.subscription.totalQuantity * $scope.subscription.productDetail.priceUsed);
            savingPriceTotal = 4 * ($scope.subscription.product[0].quantity * $scope.subscription.productDetail.price);
            $scope.savingAmount = savingPriceTotal - total;
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
            $scope.totalAmt = $scope.deposit + $scope.otherProductstotal + total;
            return $scope.savingAmount;
        } else {
            $scope.subscription.totalQuantity = $scope.subscription.product[0].quantity;
            total = ($scope.subscription.totalQuantity * $scope.subscription.productDetail.priceUsed);
            savingPriceTotal = ($scope.subscription.product[0].quantity * $scope.subscription.productDetail.price);
            $scope.savingAmount = savingPriceTotal - total;
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
            $scope.totalAmt = $scope.deposit + $scope.otherProductstotal + total;
            return $scope.savingAmount;
        }

    };


    $scope.gotopayment = function() {

        // // $scope.subscription.user=$.jStorage.get('profile')._id;
        // $scope.subscription.customer={};
        // $scope.subscription.customer=$.jStorage.get('profile');
        // _.each($scope.subscription.otherProducts, function(n) {
        //   $scope.subscription.product.push(n);
        // });
        // $scope.subscription.totalAmt=  $scope.totalAmt;
        console.log($scope.subscription);
        $scope.OrderData = {};
        $scope.OrderData.totalAmount = $scope.totalAmt;
        $scope.OrderData.customer = {};
        // $scope.OrderData.customer = $.jStorage.get('profile');
        $scope.OrderData.customer.name = $.jStorage.get('profile').name;
        $scope.OrderData.customer.mobile = $.jStorage.get('profile').mobile;
        $scope.OrderData.methodOfPayment = 'Customer';
        $scope.OrderData.orderFor = 'CustomerForSelf';
        $scope.OrderData.totalQuantity = $scope.subscription.totalQuantity;
        MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.product[0].quantity)

        $scope.OrderData.product = [{
            product: {},
            productQuantity: null,
            finalPrice: null,
        }];
        $scope.OrderData.product[0].product = $scope.subscription.productDetail;
        $scope.OrderData.product[0].productQuantity = $scope.subscription.product[0].quantity;
        $scope.OrderData.product[0].finalPrice = MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.product[0].quantity);
        $scope.OrderData.product[0].jarDeposit = $scope.deposit;



        _.each($scope.subscription.otherProducts, function(n) {
            $scope.product = {};
            $scope.product.product = n._id;
            $scope.product.productQuantity = n.productQuantity;
            $scope.product.finalPrice = n.price;
            $scope.OrderData.product.push($scope.product);
        });
        var options = "location=no,toolbar=yes";
        var target = "_system";
        var url = "";
        console.log($scope.OrderData);
        MyServices.saveOrderCheckout($scope.OrderData, function(data) {
            console.log(data);
            if (data.value) {
                $scope.finalURL = 'http://htbt.wohlig.co.in/orderconfirmation/' + data.data._id;
                var ref = cordova.InAppBrowser.open($scope.finalURL, target, options);
                ref.addEventListener('loadstop', function(event) {
                    // event.url="http://wohlig.co.in/paisoapk/success.html?orderid=1231321231";
                    var url = event.url.split(".html")[0] + ".html";
                    var orderid = event.url.split("=")[1];
                    console.log(url, order_id);
                    if (url == "http://htbt.wohlig.co.in/sorry") {
                        ref.close();
                        var alertPopup = $ionicPopup.alert({
                            template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                        });
                        alertPopup.then(function(res) {
                            alertPopup.close();
                            $state.go('app.orderconfirm');
                        });
                    } else if (url == "http://htbt.wohlig.co.in/thankyou") {
                        ref.close();
                        $state.go('app.orderconfirm');
                    }
                });
            }
        });
    };
})

.controller('RequirementCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };

})

.controller('ProfileCtrl', function($scope, $stateParams, MyServices, $state) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.profile = $.jStorage.get('profile');

    $scope.getProfield = {};
    console.log($scope.profile);
    $scope.getProfield._id = $scope.profile._id;
    MyServices.getProfile($scope.getProfield, function(data) {
        console.log(data);
        if (data.value) {
            $scope.signupForm = data.data;
            console.log($scope.review);
        } else {

        }
    });

    $scope.save = function() {

        MyServices.saveData($scope.signupForm, function(data) {

            console.log(data);
            $scope.signupForm = data.data;

            console.log($scope.signupForm)
            if (data.value == true) {


                $scope.signupForm._id = $.jStorage.get('profile')._id;
                MyServices.getonePro($scope.signupForm, function(data) {
                    $.jStorage.set('profile', data.data);
                    $scope.signupForm = data.data;
                    $scope.user = {};
                    $scope.user.pin = data.data.pincode

                });


            } else {

                // $scope.showAlert(data.status, 'login', 'Error Message');
            }
        });



    }
})

.controller('ShippingCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('Subpage1Ctrl', function($scope, MyServices, Subscription, $state, $stateParams) {
    $scope.userDetails = MyServices.getAppDetails();
    $scope.product = {};
    $scope.product._id = $stateParams.id;
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();

    Subscription.validate($state);

    MyServices.getoneProduct($scope.product, function(data) {
        if (data.value) {
            $scope.product = data.data;
        } else {

        }
    });
    $scope.checkLimit = function(limit) {
        if ($scope.product.limit >= limit) {
          $state.go('app.subpage3');
        }else{
          $state.go('app.requirement');
        }
    };
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    console.log($scope.subscription);

})

.controller('Subpage2Ctrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('OrderConfirmCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('Subpage3Ctrl', function($scope, $stateParams, MyServices, Subscription, $state) {
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    Subscription.validate($state);
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.getProductPrice = MyServices.getProductPrice;
    $scope.addPlan = function(planName) {
        $scope.subscription.plan = planName;
    };
})

.controller('BrowseMoreCtrl', function($scope, $state, $stateParams, $ionicPopup, MyServices, Subscription) {
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };

    MyServices.products({
        category: $stateParams.category
    }, function(data) {
        $scope.products = data.data;
    });
    $scope.productTap = function(product) {
        $scope.subscription.product[0].product = product._id;
        $scope.subscription.productDetail = product;
        if ($scope.totalQuantity === 0) {
            $state.go("app.subpage1", {
                id: product._id
            });
        } else {
            $ionicPopup.alert({
                title: "Product already in Cart",
                template: "Please remove all the Products from the cart to proceed with Subscription Products."
            });
        }
    };
})

.controller('AuthPaymentCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('BrowseCtrl', function($scope, $ionicSlideBoxDelegate, Subscription, $timeout, $ionicPopup, MyServices, $state) {
    $scope.userDetails = MyServices.getAppDetails();
    $scope.nextPage = function(sub, id) {
        if (sub == 'Yes') {
            $state.go('app.browse-more', {
                'category': id
            });

        } else {
            $state.go('app.productSpecs', {
                'category': id
            });
        }
    };
    $scope.subscription = Subscription.getObj();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.productTap = function(product) {
        $scope.subscription.product[0].product = product._id;
        $scope.subscription.productDetail = product;
        console.log($scope.subscription);
        if ($scope.totalQuantity === 0) {
            $state.go("app.subpage1", {
                id: product._id
            });
        } else {
            $ionicPopup.alert({
                title: "Product already in Cart",
                template: "Please remove all the Products from the cart to proceed with Subscription Products."
            });
        }
    };
    $scope.slideHasChanged = function(index) {
        $ionicSlideBoxDelegate.cssClass = 'fade-in'
        $scope.slideIndex = index;
        if (($ionicSlideBoxDelegate.count() - 1) == index) {
            $timeout(function() {
                $ionicSlideBoxDelegate.slide(0);
            }, $scope.interval);
        }
    };
    $scope.interval = 5000;
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    MyServices.categories(function(data) {

        console.log(data);
        $scope.category = _.chunk(data.data, 2);
        console.log($scope.category);

    });
    $scope.profile = $.jStorage.get('profile');
    $scope.getProfield = {};
    MyServices.getProfile($scope.getProfield, function(data) {
        if (data.value) {
            $scope.browse = data.data;
        } else {

        }
    });
    $scope.getProfield._id = $scope.profile._id;
    MyServices.getProfile($scope.getProfield, function(data) {
        if (data.value) {
            $scope.browse = data.data;
        } else {

        }
    });
    MyServices.featureprods(function(data) {

        $scope.feaprods = data.data;
        $ionicSlideBoxDelegate.update();

    });
})

.controller('AddonsCtrl', function($scope, $stateParams, Subscription, $state, MyServices) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    Subscription.validate($state);
    $scope.getProductPrice = MyServices.getProductPrice;
    $scope.addPlan = function(planName) {
        $scope.subscription.plan = planName;
    };
    MyServices.getOtherProducts(function(data) {
        if (data.status == 200) {
            if (data.data && data.data.data && data.data.data.results) {
                $scope.otherProducts = _.groupBy(data.data.data.results, "addones");
                $scope.saveSpace = $scope.otherProducts["Save Space"];
                $scope.saveTime = $scope.otherProducts["Save Time"];
            }
        } else {
            $ionicPopup.alert({
                title: "Error Occured",
                template: "Error Occured while retriving Products"
            });
        }
    });
    $scope.checkMinProduct = function(product) {
        if (product.productQuantity <= 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.checkMaxProduct = function(product) {
        if (product.productQuantity >= parseInt(product.quantity)) {
            return true;
        } else {
            return false;
        }
    };
    $scope.changeProductQuantity = function(product, change) {
        if (_.isNaN(parseInt(product.productQuantity))) {
            product.productQuantity = 0;
        }
        if (change) {
            product.productQuantity++;
        } else {
            product.productQuantity--;
        }
        $scope.addProduct(product);
    };
    $scope.addProduct = function(product) {
        _.remove($scope.subscription.otherProducts, function(n) {
            return n._id == product._id;
        });
        if (product.productQuantity > 0) {
            $scope.subscription.otherProducts.push(product);
        }
    };
})

.controller('ReviewCtrl', function($scope, $stateParams, ionicDatePicker, $state, $ionicPopup, MyServices) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };


    //
    // $scope.getProductPrice = function(product, quantity) {
    //     var foundPrice = {};
    //     var orderedPrice = _.orderBy(product.priceList, ['endRange'], ['asc']);
    //     _.each(orderedPrice, function(obj) {
    //         if (parseInt(quantity) <= parseInt(obj.endRange)) {
    //             foundPrice = obj;
    //             product.priceUsed = obj.finalPrice;
    //             product.totalPriceUsed = obj.finalPrice * parseInt(quantity);
    //             return false;
    //         }
    //     });
    //     return product.priceUsed;
    // };
    // // $scope.getProductPrice = MyServices.getProductPrice;

    function showCart() {
        MyServices.showCart(function(data) {
            if (data.data && data.data.data) {
                $scope.products = data.data.data;
            }
        });
    }
    showCart();
    $scope.getProductPrice = MyServices.getProductPrice;

    $scope.calculateTotalPrice = function() {
        var total = 0;
        var savingPriceTotal = 0;
        _.each($scope.products, function(n) {
            total += n.product.totalPriceUsed;
            savingPriceTotal = savingPriceTotal + (parseInt(n.product.price) * parseInt(n.productQuantity));
        });
        $scope.savingAmount = savingPriceTotal - total;
        if ($scope.savingAmount != 0) {
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
        } else {
            $scope.savingPercent = 0;
        }
        return total;
    };
    $scope.removeCart = function(productId) {
        MyServices.removeFromCart(productId, function(data) {
            showCart();
            if (data.status == 200) {
                $ionicPopup.alert({
                    title: "Products Removed",
                    template: "Products Removed from Cart Successfully"
                });
            } else {
                $ionicPopup.alert({
                    title: "Error Occured",
                    template: "Error Occured while Removing Products to Cart"
                });
            }
        });
    };
    var options = "location=no,toolbar=yes";
    var target = "_system";
    var url = "";
    $scope.placeOrder = function(productId) {
        $scope.OrderData = {};
        $scope.OrderData.customer = {};
        $scope.OrderData.customer.name = $.jStorage.get('profile').name;
        $scope.OrderData.customer.mobile = $.jStorage.get('profile').mobile;
        $scope.OrderData.methodOfPayment = 'Customer';
        $scope.OrderData.orderFor = 'CustomerForSelf';
        MyServices.saveOrderCheckoutCart($scope.OrderData, function(data) {
            if (data.value) {
                $scope.finalURL = 'http://htbt.wohlig.co.in/orderconfirmation/' + data.data._id;
                var ref = cordova.InAppBrowser.open($scope.finalURL, target, options);

                ref.addEventListener('loadstop', function(event) {
                    // event.url="http://wohlig.co.in/paisoapk/success.html?orderid=1231321231";
                    var url = event.url.split(".html")[0] + ".html";
                    var orderid = event.url.split("=")[1];
                    console.log(url, order_id);
                    if (url == "http://htbt.wohlig.co.in/sorry") {
                        ref.close();
                        var alertPopup = $ionicPopup.alert({
                            template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                        });
                        alertPopup.then(function(res) {
                            alertPopup.close();
                            $state.go('app.orderconfirm');
                        });
                    } else if (url == "http://htbt.wohlig.co.in/thankyou") {
                        ref.close();
                        $state.go('app.orderconfirm');
                    }
                });
            }
        });
    };
    var ipObj1 = {
        callback: function(val) { //Mandatory
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

    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(ipObj1);
    };

})

.controller('ConfirmationCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('OrderhistoryCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('CalendarCtrl', function($scope, $stateParams, $filter, MyServices, ionicDatePicker, $ionicSlideBoxDelegate) {
    $scope.calDate = new Date();
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.getDate = function() {
        $scope.calDate = MyServices.getDate(); //This works
    };



})

.controller('CalendarViewCtrl', function($scope, $stateParams, $filter, $ionicPopup, MyServices, $ionicSlideBoxDelegate) {

    $scope.userDetails = $.jStorage.get('profile');
    $scope.incorrect = false;
    $scope.user = {};
    $scope.days = [{
        "day": "Sun",
        "value": false,
        "position": 0
    }, {
        "day": "Mon",
        "value": false,
        "position": 1
    }, {
        "day": "Tue",
        "value": false,
        "position": 2
    }, {
        "day": "Wed",
        "value": false,
        "position": 3
    }, {
        "day": "Thu",
        "value": false,
        "position": 4
    }, {
        "day": "Fri",
        "value": false,
        "position": 5
    }, {
        "day": "Sat",
        "value": false,
        "position": 6
    }];
    $scope.user.pin = $scope.userDetails.pincode;
    MyServices.getByPin($scope.user, function(data) {
        if (data.value) {
            $scope.pindays = data.data;
            _.forEach($scope.pindays.days, function(value) {
                _.forEach($scope.days, function(value1) {
                    if (value.substr(0, 3) == value1.day) {
                        value1.value = true;
                    }
                });
            });


        }
    });

    var calMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.getcurrentMonth = calMonths[new Date().getMonth()];
    $scope.getNextMonth = calMonths[new Date().getMonth() + 1];

    // these are the days of the week for each month, in order
    var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var selectedYear, selectedMonth, selectedDate, shortMonth;

    var CurrentDate = new Date();

    selectedYear = CurrentDate.getFullYear(),
        selectedMonth = CurrentDate.getMonth(),
        selectedDate = CurrentDate.getDate();

    $scope.UICalendarDisplay = {};
    $scope.UICalendarDisplay.Date = true;
    $scope.UICalendarDisplay.Month = false;
    $scope.UICalendarDisplay.Year = false;

    $scope.displayCompleteDate = function() {
        var timeStamp = new Date(selectedYear, selectedMonth, selectedDate).getTime();
        if (angular.isUndefined($scope.dateformat)) {
            var format = "dd - MMM - yy";
        } else {
            var format = $scope.dateformat;
        }
        $scope.display = $filter('date')(timeStamp, format);
        $scope.display1 = $filter('date')(timeStamp);
        MyServices.setDate($scope.display1);
        $scope.display = $filter('date')(timeStamp, format);
        $scope.display1 = new Date(timeStamp);
        $scope.getcurrentDate = new Date();

        if ($scope.display1 < $scope.getcurrentDate && $scope.incorrect) {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorrect Date',
                template: 'Please select future Date'
            });
        }
        $scope.incorrect = true;
        console.log($scope.incorrect);
        MyServices.setDate($scope.display1);

    }

    //Onload Display Current Date
    $scope.displayCompleteDate();

    $scope.UIdisplayDatetoMonth = function() {
        $scope.UICalendarDisplay.Date = false;
        $scope.UICalendarDisplay.Month = true;
        $scope.UICalendarDisplay.Year = false;
    }

    $scope.UIdisplayMonthtoYear = function() {
        $scope.UICalendarDisplay.Date = false;
        $scope.UICalendarDisplay.Month = false;
        $scope.UICalendarDisplay.Year = true;
    }

    $scope.UIdisplayYeartoMonth = function() {
        $scope.UICalendarDisplay.Date = false;
        $scope.UICalendarDisplay.Month = true;
        $scope.UICalendarDisplay.Year = false;
    }
    $scope.UIdisplayMonthtoDate = function() {
        $scope.UICalendarDisplay.Date = true;
        $scope.UICalendarDisplay.Month = false;
        $scope.UICalendarDisplay.Year = false;
    }

    $scope.selectedMonthPrevClick = function() {
        selectedDate = 1;
        if (selectedMonth == 0) {
            selectedMonth = 11;
            selectedYear--;
        } else {
            $scope.dislayMonth = selectedMonth--;

        }
        $scope.displayMonthCalendar();
    }

    $scope.selectedMonthNextClick = function() {
        selectedDate = 1;
        if (selectedMonth == 11) {
            selectedMonth = 0;
            selectedYear++;
        } else {
            $scope.dislayMonth = selectedMonth++;
        }
        $scope.displayMonthCalendar();
    }

    $scope.selectedMonthYearPrevClick = function() {
        selectedYear--;
        $scope.displayYear = selectedYear;
        $scope.displayMonthCalendar();
    }

    $scope.selectedMonthYearNextClick = function() {
        selectedYear++;
        $scope.displayYear = selectedYear;
        $scope.displayMonthCalendar();
    }

    $scope.selectedDecadePrevClick = function() {
        selectedYear -= 10;
        $scope.displayMonthCalendar();
    }

    $scope.selectedDecadeNextClick = function() {
        selectedYear += 10;
        $scope.displayMonthCalendar();
    }

    $scope.selectedYearClick = function(year) {
        $scope.displayYear = year;
        selectedYear = year;
        $scope.displayMonthCalendar();
        $scope.UICalendarDisplay.Date = false;
        $scope.UICalendarDisplay.Month = true;
        $scope.UICalendarDisplay.Year = false;
        $scope.displayCompleteDate();
    }

    $scope.selectedMonthClick = function(month) {
        $scope.dislayMonth = month;
        selectedMonth = month;
        $scope.displayMonthCalendar();
        $scope.UICalendarDisplay.Date = true;
        $scope.UICalendarDisplay.Month = false;
        $scope.UICalendarDisplay.Year = false;
        $scope.displayCompleteDate();
    }

    $scope.selectedDateClick = function(date) {
        $scope.displayDate = date.date;
        selectedDate = date.date;
        if (date.type == 'newMonth') {
            var mnthDate = new Date(selectedYear, selectedMonth, 32)
            selectedMonth = mnthDate.getMonth();
            selectedYear = mnthDate.getFullYear();
            $scope.displayMonthCalendar();
        } else if (date.type == 'oldMonth') {
            var mnthDate = new Date(selectedYear, selectedMonth, 0);
            selectedMonth = mnthDate.getMonth();
            selectedYear = mnthDate.getFullYear();
            $scope.displayMonthCalendar();
        }
        $scope.displayCompleteDate();
    }

    $scope.displayMonthCalendar = function() {

        /*Year Display Start*/
        $scope.startYearDisp = (Math.floor(selectedYear / 10) * 10) - 1;
        $scope.endYearDisp = (Math.floor(selectedYear / 10) * 10) + 10;
        /*Year Display End*/
        $scope.datesDisp = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        countDatingStart = 1;

        if (calMonths[selectedMonth] === 'February') {
            if (selectedYear % 4 === 0) {
                endingDateLimit = 29;
            } else {
                endingDateLimit = 28;
            }
        } else {
            endingDateLimit = calDaysForMonth[selectedMonth];
        }
        startDay = new Date(selectedYear, selectedMonth, 1).getDay();

        $scope.displayYear = selectedYear;
        $scope.dislayMonth = calMonths[selectedMonth];
        $scope.shortMonth = calMonths[selectedMonth].slice(0, 3);

        $scope.displayDate = selectedDate;

        var nextMonthStartDates = 1;
        var prevMonthLastDates = new Date(selectedYear, selectedMonth, 0).getDate();

        for (i = 0; i < 6; i++) {
            if (typeof $scope.datesDisp[0][6] === 'undefined') {
                for (j = 0; j < 7; j++) {
                    if (j < startDay) {
                        $scope.datesDisp[i][j] = {
                            "type": "oldMonth",
                            "date": (prevMonthLastDates - startDay + 1) + j
                        };
                    } else {
                        $scope.datesDisp[i][j] = {
                            "type": "currentMonth",
                            "date": countDatingStart++
                        };
                    }
                }
            } else {
                for (k = 0; k < 7; k++) {
                    if (countDatingStart <= endingDateLimit) {
                        $scope.datesDisp[i][k] = {
                            "type": "currentMonth",
                            "date": countDatingStart++
                        };
                    } else {
                        $scope.datesDisp[i][k] = {
                            "type": "newMonth",
                            "date": nextMonthStartDates++
                        };
                    }
                }
            }

        }
    }
    $scope.displayMonthCalendar();
})

.controller('DashboardCtrl', function($scope, $stateParams, $ionicPopup, MyServices) {
        $scope.showPopup = function() {
            $scope.show = $ionicPopup.show({
                templateUrl: 'templates/modal/price.html',
                cssClass: "priceCard",
                scope: $scope
            });
        };
        $scope.closePopup = function() {
            $scope.show.close();
        };
        if ($.jStorage.get('profile')) {
            $scope.profile = $.jStorage.get('profile');
            $scope.getProfield = {};
            $scope.getProfield._id = $scope.profile._id;
        }

        MyServices.getProfile($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.dashboardData = data.data;
            } else {

            }
        });

    })
    .controller('PincodeCtrl', function($scope, $ionicPopup, $stateParams, $ionicActionSheet, $cordovaFileTransfer, $cordovaCamera, $ionicPopover, $state, MyServices, $cordovaImagePicker) {})

.controller('SignUpCtrl', function($scope, $stateParams, $ionicPopup, $ionicPopover, MyServices, $state) {
    $scope.sorryPopup = function() {
        $scope.sorry = $ionicPopup.show({
            templateUrl: 'templates/modal/pincode.html',
            cssClass: "popupSorry",
            scope: $scope
        });
    };
    $scope.closeSorry = function() {
        console.log("hello");
        $scope.sorry.close();
    };
    $scope.show = '';
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
        scope: $scope,
        cssClass: 'menupop',
    }).then(function(terms) {
        $scope.terms = terms;
    });
    $scope.closePopover = function() {
        $scope.terms.hide();
    };
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };

    $scope.signupForm = {};

    $scope.signup = function() {
        $scope.signupForm.accessLevel = "Customer";
        console.log("djfgjk", $scope.signupForm);
        if (!$.jStorage.get('profile')) {

            MyServices.signup($scope.signupForm, function(data) {

                console.log(data);
                $scope.signupForm = data.data;
                $.jStorage.set('profile', data.data);
                console.log($scope.signupForm)
                if (data.value == true) {


                    $scope.signupForm._id = $.jStorage.get('profile')._id;
                    MyServices.getonePro($scope.signupForm, function(data) {
                        $.jStorage.set('profile', data.data);
                        $scope.signupForm = data.data;
                        $scope.user = {};
                        $scope.user.pin = data.data.pincode
                        MyServices.getByPin($scope.user, function(data) {
                            if (data.value) {
                                $state.go('app.browse');

                            } else {
                                console.log("dsjg");
                                $state.go('pincode');
                            }
                        });
                    });


                } else {

                    // $scope.showAlert(data.status, 'login', 'Error Message');
                }
            });
        } else {

            MyServices.saveData($scope.signupForm, function(data) {


                console.log(data);
                $scope.signupForm = data.data;

                console.log($scope.signupForm)
                if (data.value == true) {


                    $scope.signupForm._id = $.jStorage.get('profile')._id;
                    MyServices.getonePro($scope.signupForm, function(data) {
                        $.jStorage.set('profile', data.data);
                        $scope.signupForm = data.data;
                        $scope.user = {};
                        $scope.user.pin = data.data.pincode
                        MyServices.getByPin($scope.user, function(data) {
                            if (data.value) {
                                $scope.profile = $.jStorage.get('profile');
                                $state.go('app.browse');

                            } else {
                                console.log("dsjg");
                                $state.go('pincode');
                            }
                        });
                    });


                } else {

                    // $scope.showAlert(data.status, 'login', 'Error Message');
                }
            });
        }


    }
    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile != null) {
        $scope.signupForm = $scope.profile;
    }
});
