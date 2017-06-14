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
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
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
        if (!product.productQuantity || product.productQuantity <= 0) {
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
                    var myPopup = $ionicPopup.show({
                        cssClass: 'successpopup',
                        title: '<img src="img/tick.png">',
                        subTitle: 'Products Added Successfully!',
                        buttons: [{

                            text: 'Buy More',
                            onTap: function(e) {
                                $state.go("app.browse");
                            }
                        }, {
                            text: 'View Cart',
                            type: 'button-positive',
                            onTap: function(e) {
                                $state.go("app.review");
                            }
                        }]
                    });
                } else {
                    $ionicPopup.alert({
                        cssClass: 'productspopup',
                        title: '<img src="img/linkexpire.png">',
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


.controller('SorryCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('LinkExpireCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})


.controller('VerifyCtrl', function($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicPopup, MyServices) {

    $.jStorage.flush();
    $scope.resend = true;
    $scope.otp = null;

    var reqObj = {};
    var otp = {};
    reqObj.mobile = $stateParams.no;
    reqObj.accessLevel = "Customer";

    $(".inputs").keyup(function() {
        if (this.value.length == this.maxLength) {
            var $next = $(this).next('.inputs');
            if ($next.length) {
                $(this).next('.inputs').focus();
            } else {
                $(this).blur();
            }
        }
    });
    $scope.otpenable = false;

    $scope.disableotp = function(value) {
        console.log(value);
        if (value.first >= 0 && value.second >= 0 && value.third >= 0 && value.forth >= 0) {
            $scope.otpenable = true;
        } else {
            $scope.otpenable = false;
        }
    }

    //Function to verify OTP
    $scope.verifyOTP = function(value) {
        reqObj.otp = "" + value.first + value.second + value.third + value.forth;

        MyServices.verifyOTP(reqObj, function(data) {
            console.log(data);
            if (data.value) {
                $scope.profile = $.jStorage.set('profile', data.data);
                $state.go('signup');
            } else {
                $scope.otp = null;
                // alert("OTP verification failed")
                $ionicPopup.alert({
                    title: "OTP verification failed",
                    template: "Please enter correct otp"
                });


            }
        });
    };
    $scope.getOTP = function() {
        $scope.resend = false;
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        MyServices.getOTP({
            mobile: $stateParams.no,
            accessLevel: "Customer"
        }, function(data) {

            if (data.value) {
                $ionicLoading.hide();
                $timeout(function() {
                    $scope.resend = true;
                }, 10000);
            } else {
                alert("unable to generate OTP. Please try again");
            }
        });



    };
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
                console.log(data);
                if (data.data.value) {
                    $state.go('verify', {
                        no: value.mobile
                    });
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

.controller('CheckoutCtrl', function($scope, $stateParams, MyServices, Subscription, $state, $ionicPopup, ionicDatePicker, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
        scope: $scope,
        cssClass: 'menupop',

    }).then(function(terms) {
        $scope.terms = terms;
    });

    $scope.closePopover = function() {
        $scope.terms.hide();
    };

    $scope.userDetails = MyServices.getAppDetails();
    $scope.terms = {};
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    console.log($scope.subscription);
    console.log($scope.subscription.toString());
    Subscription.validate($state);
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
        $scope.totalQuantity = 0;
        $scope.deposit = 0;
        _.each($scope.subscription.otherProducts, function(n) {
            $scope.otherProductstotal += n.price * n.productQuantity;
        });
        if ($scope.subscription.productDetail.applicableBefore > $scope.subscription.product[0].quantity && $scope.subscription.plan == 'Onetime') {
            total += parseFloat($scope.subscription.productDetail.AmtDeposit) * parseInt($scope.subscription.product[0].quantity);
            $scope.deposit += parseFloat($scope.subscription.productDetail.AmtDeposit) * parseInt($scope.subscription.product[0].quantity);
        }
        total += parseInt($scope.otherProductstotal);
        $scope.totalPriceForJar = parseFloat(MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.productQuantity)) * $scope.subscription.productQuantity;
        total += $scope.totalPriceForJar;
        return total;
    };

    $scope.cancelSubscription = function() {

        $ionicPopup.alert({
            cssClass: 'productspopup',
            title: 'Cancel Subscription',
            template: "Are you sure ?",
            buttons: [{

                text: 'Yes',
                onTap: function(e) {
                    $scope.subscription = {
                        product: [{
                            product: null,
                            quantity: null
                        }],
                        productDetail: null,
                        productQuantity: 0,
                        otherProducts: [],
                        customerName: null,
                        customerMobile: null,
                        totalQuantity: null,
                        totalAmt: null,
                        user: null
                    };
                    Subscription.setObj($scope.subscription);
                    console.log(Subscription.getObj());
                    $state.go('app.browse')
                }
            }, {
                text: 'No',
                type: 'button-positive',
                onTap: function(e) {}
            }]
        });

    }

    $scope.gotoshipping = function() {


        console.log($scope.subscription);

        $scope.subscription.customer = {};
        $scope.subscription.customer.name = $.jStorage.get('profile').name;
        $scope.subscription.customer.mobile = $.jStorage.get('profile').mobile;
        $scope.subscription.methodOfPayment = 'Customer';
        $scope.subscription.orderFor = 'CustomerForSelf';
        $scope.subscription.methodOfOrder = 'Application';
        $scope.subscription.methodofjoin = 'App';
        $scope.subscription.totalAmt = $scope.total;
        $scope.subscription.totalQuantity = $scope.totalQuantity;

        var options = "location=no,toolbar=yes";
        var target = "_blank";
        var url = "";
        console.log($scope.subscription);
        MyServices.saveOrderCheckout($scope.subscription, function(data) {
            console.log(data.data.data._id);
            if (data.status == 200) {
                console.log("sad");
                $state.go('app.shipping', {
                    orderId: data.data.data._id
                });

                // $scope.finalURL = 'http://htbt.wohlig.co.in/orderconfirmation/' + data.data.data._id;
                // var ref = cordova.InAppBrowser.open($scope.finalURL, target, options);
                // ref.addEventListener('loadstop', function(event) {
                //     // event.url="http://wohlig.co.in/paisoapk/success.html?orderid=1231321231";
                //     var url = event.url;
                //     // var orderid = event.url.split("=")[1];
                //     console.log(url);
                //     if (url == "http://htbt.wohlig.co.in/sorry") {
                //         ref.close();
                //         var alertPopup = $ionicPopup.alert({
                //             template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                //         });
                //         alertPopup.then(function(res) {
                //             alertPopup.close();
                //             $state.go('app.sorry');
                //         });
                //     } else if (url == "http://htbt.wohlig.co.in/thankyou") {
                //         ref.close();
                //         $state.go('app.orderconfirm');
                //     }
                // });
            }
        });
    };
})

.controller('RequirementCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };

})

.controller('ProfileCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $state) {
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
                        $ionicPopup.alert({
                            title: "Profile",
                            template: "Profile saved Successfully"
                        });
                        $state.go('app.dashboard');
                    });


                } else {

                    // $scope.showAlert(data.status, 'login', 'Error Message');
                }
            });



        }
    })
    .controller('ShippingCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPlatform, MyServices) {
        $scope.shippingCheck = true;
        $scope.shippingDetails = {}
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        if ($stateParams.orderId) {
            console.log("orderId", $stateParams.orderId);
            var formData = {};
            formData._id = $stateParams.orderId;
            MyServices.OrderGetOne(formData, function(data) {
                if (data.value === true) {
                    console.log("Order/getOne", data.data);
                    $scope.shippingDetails = data.data;
                    //we only need few fields,so remove extras
                    $scope.shippingAddress = {};
                    $scope.shippingAddress.name = data.data.customer.name;
                    $scope.shippingAddress.mobile = data.data.customer.mobile;
                    $scope.shippingAddress.establishmentAddress = data.data.customer.establishmentAddress;
                    $scope.shippingAddress.email = data.data.customer.email;
                    $scope.shippingAddress.establishmentName = data.data.customer.establishmentName;
                    $scope.shippingAddress.pincode = data.data.customer.pincode;
                    $scope.billingAddress = {};
                    $scope.billingAddress.shippingCheck = true;
                    $scope.orderData = data.data;
                    $scope.options = {
                        description: 'Pay for Order ' + $scope.orderData.orderID,
                        image: 'https://i.imgur.com/3g7nmJC.png',
                        currency: 'INR',
                        key: 'rzp_test_BrwXxB7w8pKsfS',
                        // key: 'rzp_live_gFWckrbme2wT4J',
                        external: {
                            wallets: ['paytm']
                        },
                        amount: parseInt($scope.orderData.totalAmount) * 100,
                        name: $scope.orderData.customer.name,
                        prefill: {
                            email: $scope.orderData.customer.email,
                            contact: $scope.orderData.customer.mobile,
                            name: $scope.orderData.customer.name
                        },
                        theme: {
                            color: '#FF414D'
                        }
                    };
                    var pinForm = {};
                    pinForm.pin = $scope.orderData.shippingAddress.pincode;
                    MyServices.getByPin(pinForm, function(pinData) {
                        if (pinData.value === true) {
                            $scope.daysByPincode = pinData.data;
                            console.log($scope.daysByPincode.days);
                        } else {
                            $state.go("pincode");
                        }
                    });
                    // if (_.isEqual($scope.orderData.paymentStatus, 'Paid')) {
                    //   $state.go("linkexpire");
                    // }
                    _.each($scope.orderData.product, function(n, key) {
                        $scope.amountToBePaid += parseFloat(n.product.price) * parseInt(n.productQuantity);
                    });

                }
            });
        };

        $scope.transactionHandler = function(success) {
            console.log("transaction", success);
            if (success.razorpay_payment_id) {
                // $state.go("thankyou");
                $scope.orderData.razorpay_payment_id = success.razorpay_payment_id;
                $state.go("app.orderconfirm");
                MyServices.orderConfirmationOrPay($scope.orderData, function(data) {
                    if (data.value === true) {
                        console.log("payAndCapture");
                        if (data.data.product[0].product.category.subscription == 'Yes' && data.data.plan != 'Ontime') {
                            $state.go("app.orderconfirm");
                        } else {
                            console.log("data.data.deliverdate", moment(data.data.deliverdate).format("YYYY-MM-DD"));
                            $state.go("app.orderconfirm");
                        }

                        //redirect to thank you page

                    }
                });
            }
        };
        $scope.saveDetails = function(billingAddress, shippingAddress) {
            console.log("null", billingAddress, shippingAddress);
            if (billingAddress.shippingCheck) {
                $scope.shippingDetails.billingAddress = shippingAddress;
                $scope.shippingDetails.shippingAddress = shippingAddress;
            } else {
                $scope.shippingDetails.billingAddress = billingAddress;
                $scope.shippingDetails.shippingAddress = shippingAddress;
            }

            MyServices.OrderSave($scope.shippingDetails, function(data) {
                if (data.value === true) {
                    console.log("Order/save", data.data);
                    $scope.OrderSaveData = data.data;
                    $scope.pay();
                }
            });
        }


        // `ng-click` is triggered twice on ionic. (See https://github.com/driftyco/ionic/issues/1022).
        // This is a dirty flag to hack around it
        var called = false



        var successCallback = function(success) {
          console.log(success);
            alert('payment_id: ' + success.razorpay_payment_id)
            var orderId = success.razorpay_order_id
            var signature = success.razorpay_signature
            if (success.razorpay_payment_id) {
                // $state.go("thankyou");
                $scope.orderData.razorpay_payment_id = success.razorpay_payment_id;
                $state.go("app.orderconfirm");
                MyServices.orderConfirmationOrPay($scope.orderData, function(data) {
                    if (data.value === true) {
                        console.log("payAndCapture");
                        if (data.data.product[0].product.category.subscription == 'Yes' && data.data.plan != 'Ontime') {
                            $state.go("app.orderconfirm");
                        } else {
                            console.log("data.data.deliverdate", moment(data.data.deliverdate).format("YYYY-MM-DD"));
                            $state.go("app.orderconfirm");
                        }

                        //redirect to thank you page

                    }
                });
            }
        }

        var cancelCallback = function(error) {
            alert(error.description + ' (Error ' + error.code + ')')
        }


        $ionicPlatform.ready(function() {
            $scope.pay = function() {
                if (!called) {
                    // $.getScript('https://checkout.razorpay.com/v1/checkout.js', function() {
                    //     var rzp1 = new Razorpay($scope.options, successCallback, cancelCallback);
                    //     rzp1.open($scope.options, successCallback, cancelCallback);
                    //     called = true;
                    // });

                    RazorpayCheckout.on('payment.success', successCallback);
                    RazorpayCheckout.on('payment.cancel', cancelCallback);
                    RazorpayCheckout.open($scope.options);

                }
            }
        });


        $scope.terms = function() {
            $uibModal.open({
                    animation: true,
                    templateUrl: "views/terms.html",
                    // $scope:scope
                })
                // $scope.template = TemplateService.getHTML("/terms.html");
        }
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var currentDay = _.upperCase(moment(data.date).format("dddd"));
            var retVal = true;
            _.each($scope.daysByPincode.days, function(n) {
                var capN = _.upperCase(n);
                if (capN == currentDay) {
                    retVal = false;
                }
            });
            var diff = moment(data.date).diff(moment(), 'days')
            console.log(a);
            if (diff <= 0) {
                retVal = true;
            }
            return retVal;
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
    })

.controller('Subpage1Ctrl', function($scope, MyServices, Subscription, $state, $stateParams) {
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    $scope.subscription = Subscription.getObj();
    Subscription.validate($state);

    $scope.goToProduct = function() {
        var id = $.jStorage.get("prevId");
        $state.go("app.browse-more", {
            category: id
        });
    };
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.takeToNext = function() {
        var orderedPrice = _.orderBy($scope.subscription.productDetail.priceList, function(n) {
            return parseInt(n.endRange);
        });
        var lastQuantity = 0;
        if (orderedPrice.length > 0) {
            lastQuantity = parseInt(orderedPrice[orderedPrice.length - 1].endRange);
        }
        if ($scope.subscription.product[0].quantity >= lastQuantity) {
            $state.go("app.requirement");
        } else {
            $state.go("app.subpage3");
        }
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
    $scope.addPlan = function(planName, times) {
        MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.product[0].quantity * times);
        $scope.subscription.productQuantity = $scope.subscription.product[0].quantity * times;
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
    $scope.emptyCartFun = function() {
        $scope.emptyCart = {};
        $scope.emptyCart._id = $.jStorage.get('profile')._id;
        $scope.emptyCart.cartProducts = [];
        MyServices.saveData($scope.emptyCart, function(data) {
            console.log(data);
            if (data.value) {
                MyServices.showCardQuantity(function(num) {
                    $scope.totalQuantity = num;
                });
            }

        });

    }

    $scope.productTap = function(product) {
        $scope.subscription.product[0].product = product._id;
        $scope.subscription.productDetail = product;

        if ($scope.totalQuantity === 0) {
            $state.go("app.subpage1");
        } else {
            var myPopup = $ionicPopup.show({
                cssClass: 'productspopup',
                title: '<img src="img/sorry.png">',
                subTitle: 'You cannot purchase a 20L Jar plan and other products at the same time.',
                buttons: [{

                    text: 'Empty Cart',
                    onTap: function(e) {
                        $scope.emptyCartFun();
                    }
                }, {
                    text: 'View Cart',
                    type: 'button-positive',
                    onTap: function(e) {
                        $state.go("app.review");
                    }
                }]
            });
            // $ionicPopup.alert({
            //     title: "Product already in Cart",
            //     template: "Please remove all the Products from the cart to proceed with Subscription Products."
            // });
        }
    };
})

.controller('AuthPaymentCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('OrderConfirmCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })

.controller('BrowseCtrl', function($scope, $ionicSlideBoxDelegate, Subscription, $timeout, $ionicPopup, MyServices, $state) {
    $scope.userDetails = MyServices.getAppDetails();
    MyServices.showCardQuantity(function(num) {
        $scope.totalQuantity = num;
    });
    // $ionicLoading.show({
    //     content: '<img src="img/loading.gif" alt="">',
    //     animation: 'fade-in',
    //     showBackdrop: true,
    //     maxWidth: 200,
    //     showDelay: 0
    // });
    $scope.loader = true;

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
    $scope.homeSlider = {};
    $scope.homeSlider.data = [];
    $scope.homeSlider.currentPage = 0;

    $scope.setupSlider = function() {

        //some options to pass to our slider
        $scope.homeSlider.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', //or vertical
            speed: 300,

            autoplay: "5000",
            effect: 'fade',

        };


        //create delegate reference to link with slider
        $scope.homeSlider.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('homeSlider.sliderDelegate', function(newVal, oldVal) {
            if (newVal != null) {
                $scope.homeSlider.sliderDelegate.on('slideChangeEnd', function() {
                    $scope.homeSlider.currentPage = $scope.homeSlider.sliderDelegate.activeIndex;
                    //use $scope.$apply() to refresh any content external to the slider
                    $scope.$apply();
                });
            }
        });
    };

    $scope.setupSlider();



    //detect when sliderDelegate has been defined, and attatch some event listeners
    $scope.$watch('sliderDelegate', function(newVal, oldVal) {
        if (newVal != null) {
            $scope.sliderDelegate.on('slideChangeEnd', function() {
                console.log('updated slide to ' + $scope.sliderDelegate.activeIndex);
                $scope.$apply();
            });
        }
    });
    $scope.nextPage = function(sub, id) {
        $.jStorage.set("prevId", id);
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



    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    MyServices.categories(function(data) {
        // $ionicLoading.hide();
        $scope.loader = false;

        console.log(data);
        $scope.category = _.chunk(data.data, 2);
        console.log($scope.category);

    });
    $scope.profile = $.jStorage.get('profile');
    $scope.getProfield = {};
    console.log($scope.profile);
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
    $scope.subscription.otherProducts = [];
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

        if (!product.productQuantity || product.productQuantity <= 0) {
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

.controller('ReviewCtrl', function($scope, $stateParams, $ionicLoading, $state, $ionicPopup, $ionicPopover, MyServices) {
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
    $scope.terms = {};

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
            savingPriceTotal += parseInt(n.product.price) * parseInt(n.productQuantity);
        });
        $scope.savingAmount = savingPriceTotal - total;
        $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
        return total;
    };
    $scope.removeCart = function(productId) {
        MyServices.removeFromCart(productId, function(data) {
            showCart();
            if (data.status == 200) {
                $ionicPopup.alert({
                    cssClass: 'removedpopup',
                    title: '<img src="img/tick.png">',
                    template: "Products Removed Successfully!"
                });
            } else {
                $ionicPopup.alert({
                    cssClass: 'productspopup',
                    title: '<img src="img/linkexpire.png">',
                    template: "Error Occured while Removing Products to Cart"
                });
            }
        });
    };
    var options = "location=no,toolbar=yes";
    var target = "_blank";
    var url = "";
    $scope.placeOrder = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.OrderData = {};
        $scope.OrderData.customer = {};
        $scope.OrderData.customer.name = $.jStorage.get('profile').name;
        $scope.OrderData.customer.mobile = $.jStorage.get('profile').mobile;
        $scope.OrderData.methodOfPayment = 'Customer';
        $scope.OrderData.orderFor = 'CustomerForSelf';
        $scope.OrderData.methodOfOrder = 'Application';
        $scope.OrderData.methodofjoin = 'App';
        MyServices.saveOrderCheckoutCart($scope.OrderData, function(data) {
            if (data.value) {
                $ionicLoading.hide();
                $state.go('app.shipping', {
                    orderId: data.data._id
                });
                //     $scope.finalURL = 'http://htbt.wohlig.co.in/orderconfirmation/' + data.data._id;
                //     var ref = cordova.InAppBrowser.open($scope.finalURL, target, options);
                //
                //     ref.addEventListener('loadstop', function(event) {
                //         // event.url="http://wohlig.co.in/paisoapk/success.html?orderid=1231321231";
                //         var url = event.url;
                //         // var orderid = event.url.split("=")[1];
                //         console.log(url);
                //         if (url == "http://htbt.wohlig.co.in/sorry") {
                //             ref.close();
                //             var alertPopup = $ionicPopup.alert({
                //                 template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                //             });
                //             alertPopup.then(function(res) {
                //                 alertPopup.close();
                //                 $state.go('app.sorry');
                //             });
                //         } else if (url == "http://htbt.wohlig.co.in/thankyou") {
                //             ref.close();
                //             $state.go('app.orderconfirm');
                //         }
                //     });
            }
        });
    };


})

.controller('ConfirmationCtrl', function($scope, $stateParams, MyServices) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
    $scope.orderDetails = {};
    $scope.orderDetails._id = $stateParams.deliverId;
    MyServices.DeliverGetone($scope.orderDetails, function(data) {
        if (data.value) {
            $scope.deliverData = data.data;
        }
    });
})

.controller('OrderhistoryCtrl', function($scope, $stateParams) {
    $scope.goBackHandler = function() {
        window.history.back(); //This works
    };
})

.controller('CalendarCtrl', function($scope, $stateParams, $state, $filter, MyServices, $filter, ionicDatePicker, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate) {
    $scope.calDate = new Date();
    $scope.goBackHandler = function() {
        window.history.back();
    };
    $scope.getDate = function() {
        $scope.calDate = $filter('date')(MyServices.getDate(), 'yyyy-MM-dd');
        $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    }
    $scope.order = {};
    $scope.order._id = $stateParams.orderId;
    MyServices.OrderGetOne($scope.order, function(data) {
        if (data.value) {
            console.log(data);
            $scope.limitQuantity = null;
            $scope.orderData = data.data;
            if ($scope.orderData.plan == 'Monthly') {
                $scope.limitQuantity = $scope.orderData.product[0].productQuantity / 4;
            } else if ($scope.orderData.plan == 'Quarterly') {
                $scope.limitQuantity = $scope.orderData.product[0].productQuantity / 12;
            }
        }
    });
    $scope.userDetails = $.jStorage.get('profile');
    $scope.scheduleDelivery = function(calendarData) {
        $scope.calDate = $filter('date')(MyServices.getDate(), 'yyyy-MM-dd');
        $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        if ($scope.calDate == $scope.todayDate) {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorrect Date',
                template: 'Please select future Date'
            });
        } else {


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            calendarData.deliverdate = MyServices.getDate();
            calendarData.order = $stateParams.orderId;
            calendarData.methodOfRequest = 'App';
            calendarData.customer = $.jStorage.get('profile')._id;
            console.log(calendarData);
            MyServices.scheduleDelivery(calendarData, function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.value) {

                    $state.go('app.confirmation', {
                        deliverId: data.data._id
                    });
                } else {
                    $ionicPopup.alert({
                        cssClass: 'productspopup',
                        title: '<img src="img/linkexpire.png">',
                        template: "Error Occured while scheduleing delivery"
                    });
                }
            });
        };
    }
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
            $scope.lastJar = {};
            $scope.lastJar.customer = $scope.profile._id;
        }

        MyServices.getProfile($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.dashboardData = data.data;
            } else {

            }
        });
        MyServices.getLastJarScheduledByUser($scope.lastJar, function(data) {
            console.log("jarBalnce", data);
            $scope.showSchdeule = data.value;
            if (data.value) {
                $scope.lastJarBal = data.data;
                console.log("dsjif", data.data);
            }

        });
        MyServices.getDeliveryRequestByUser($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.delivery = data.data;
            } else {

            }
        });
        $scope.cancelJarDelivery = function() {
            $scope.deliverydata = {};
            $scope.deliverydata.customer = $.jStorage.get('profile')._id;
            $scope.deliverydata.order = $scope.dashboardData.subscribedProd[0].recentOrder;

            MyServices.cancelJarDelivery($scope.deliverydata, function(data) {
                console.log(data);
                if (data.value) {
                    MyServices.getLastJarScheduledByUser($scope.lastJar, function(data) {
                        console.log("jarBalnce", data);
                        $scope.showSchdeule = data.value;
                        if (data.value) {
                            $scope.lastJarBal = data.data;
                            console.log("dsjif", data.data);
                        }

                    });
                } else {

                }
            });
        };
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
