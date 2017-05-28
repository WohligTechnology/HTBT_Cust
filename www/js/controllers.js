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

    .controller('ProductSpecsCtrl', function ($scope, $stateParams, $ionicPopup, $state, MyServices) {
        $scope.goBackHandler = function () {
            window.history.back();
        };
        $scope.userDetails = MyServices.getAppDetails();

        $scope.profile = $.jStorage.get('profile');
        MyServices.products({
            category: $stateParams.category
        }, function (data) {
            $scope.products = data.data;
            _.each($scope.products, function (n) {
                n.productQuantity = 0;
            });
        });
        $scope.checkMinProduct = function (product) {
            if (product.productQuantity <= 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.checkMaxProduct = function (product) {
            if (product.productQuantity >= parseInt(product.quantity)) {
                return true;
            } else {
                return false;
            }
        };
        $scope.changeProductQuantity = function (product, change) {
            if (_.isNaN(parseInt(product.productQuantity))) {
                product.productQuantity = 0;
            }
            if (change) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
            }
        };
        $scope.addToCart = function () {
            var products = _.map(_.filter($scope.products, function (n) {
                return (n.productQuantity && n.productQuantity >= 1);
            }), function (n) {

                return {
                    productQuantity: n.productQuantity,
                    product: n._id,
                    totalAmount: n.productQuantity * parseFloat(n.price)
                };
            });
            if (products.length > 0) {
                MyServices.addToCart(products, function (data) {
                    if (data.status == 200) {
                        var alertPopup = $ionicPopup.alert({
                            title: "Products Added to Cart",
                            template: "Products Added to Cart Successfully"
                        });
                        alertPopup.then(function (res) {
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

    .controller('VerificationCtrl', function ($scope, $stateParams) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
    })

    .controller('VerifyCtrl', function ($scope, $stateParams, $state, MyServices) {
        $.jStorage.flush();
        var reqObj = {};
        var otp = {};
        reqObj.mobile = $stateParams.no;
        reqObj.accessLevel = "Relationship Partner";

        //Function to verify OTP
        $scope.verifyOTP = function (value) {
            reqObj.otp = value.first + value.second + value.third + value.forth;

            MyServices.verifyOTP(reqObj, function (data) {
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

    .controller('LoginCtrl', function ($scope, $stateParams, $state, MyServices, $ionicPopup) {
        //Variable declaration
        $scope.loginInfo = {};

        $scope.profile = $.jStorage.get('profile');
        if ($scope.profile != null) {
            $state.go('app.browse');
        }

        $scope.getOTP = function (value) {
            console.log("value", value);
            value.accessLevel = "Relationship Partner"
            if (value.mobile != null && value.mobile != "") {
                MyServices.getOTP({
                    mobile: value.mobile,
                    accessLevel: value.accessLevel
                }, function (data) {
                    if (data.value) {
                        if (data.data.message == "OTP sent") {
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
                    title: 'Please provide mobile number'
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
        if (products.length > 0) {
            MyServices.addToCart(products, function (data) {
                if (data.status == 200) {
                    var alertPopup = $ionicPopup.alert({
                        title: "Products Added to Cart",
                        template: "Products Added to Cart Successfully"
                    });
                    alertPopup.then(function (res) {
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


    })

    .controller('RequirementCtrl', function ($scope, $stateParams) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
        MyServices.getProfile($scope.product, function (data) {

            console.log(data);
            $scope.prod = data.data;
            console.log("proctid", $scope.prod);

        });
    })

    .controller('ProfileCtrl', function ($scope, $stateParams) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
        $scope.profile = $.jStorage.get('profile');

        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getProfile($scope.getProfield, function (data) {
            console.log(data);
            if (data.value) {
                $scope.signupForm = data.data;
                console.log($scope.review);
            } else {

            }
        });

        $scope.save = function () {

            MyServices.saveData($scope.signupForm, function (data) {

                console.log(data);
                $scope.signupForm = data.data;

                console.log($scope.signupForm)
                if (data.value == true) {


                    $scope.signupForm._id = $.jStorage.get('profile')._id;
                    MyServices.getonePro($scope.signupForm, function (data) {
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



        $scope.closePopover = function () {
            $scope.terms.hide();
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
        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function (num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };

        MyServices.products({
            category: $stateParams.category
        }, function (data) {
            $scope.products = data.data;
        });
        $scope.productTap = function (product) {
            $scope.subscription.product[0].product = product._id;
            $scope.subscription.productDetail = product;
            if ($scope.totalQuantity === 0) {
                $state.go("app.subpage1");
            } else {
                $ionicPopup.alert({
                    title: "Product already in Cart",
                    template: "Please remove all the Products from the cart to proceed with Subscription Products."
                });
            }
        };
    })

    .controller('AuthPaymentCtrl', function ($scope, $stateParams) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
    })

    .controller('BrowseCtrl', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, MyServices, $state) {
        $scope.userDetails = MyServices.getAppDetails();
        $scope.nextPage = function (sub, id) {
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
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
        MyServices.categories(function (data) {

            console.log(data);
            $scope.category = _.chunk(data.data, 2);
            console.log($scope.category);

        });
        $scope.profile = $.jStorage.get('profile');
        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getProfile($scope.getProfield, function (data) {
            if (data.value) {
                $scope.browse = data.data;
            } else {

            }
        });
        MyServices.featureprods(function (data) {

            console.log(data);
            $scope.feaprods = data.data;
            console.log("let me know", $scope.feaprods);
            $ionicSlideBoxDelegate.update();

        });
    })
    .controller('AddonsCtrl', function ($scope, $stateParams) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };


    })

    .controller('ReviewCtrl', function ($scope, $stateParams, ionicDatePicker, $ionicPopup, MyServices) {
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };

        function showCart() {
            MyServices.showCart(function (data) {
                if (data.data && data.data.data) {
                    $scope.products = data.data.data;
                }
                console.log($scope.products);
            });
        }
        showCart();

        $scope.getProductPrice = function (product, quantity) {
            var foundPrice = {};
            var orderedPrice = _.orderBy(product.priceList, ['endRange'], ['asc']);
            _.each(orderedPrice, function (obj) {
                if (parseInt(quantity) <= parseInt(obj.endRange)) {
                    foundPrice = obj;
                    product.priceUsed = obj.finalPrice;
                    product.totalPriceUsed = obj.finalPrice * parseInt(quantity);
                    return false;
                }
            });
            return product.priceUsed;
        };

        $scope.calculateTotalPrice = function () {
            var total = 0;
            var savingPriceTotal = 0;
            _.each($scope.products, function (n) {
                total += n.product.totalPriceUsed;
                savingPriceTotal += parseInt(n.product.price) * parseInt(n.product.quantity);
            });
            $scope.savingAmount = savingPriceTotal - total;
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
            return total;
        };
        $scope.removeCart = function (productId) {
            console.log(productId);
            MyServices.removeFromCart(productId, function (data) {
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

    .controller('CalendarCtrl', function ($scope, $stateParams, $filter, MyServices, ionicDatePicker, $ionicSlideBoxDelegate) {
        $scope.calDate = new Date();
        $scope.goBackHandler = function () {
            window.history.back(); //This works
        };
        $scope.getDate = function () {
            $scope.calDate = MyServices.getDate(); //This works
        };


    })

    .controller('CalendarViewCtrl', function ($scope, $stateParams, $filter, $ionicPopup, MyServices, $ionicSlideBoxDelegate) {

        $scope.userDetails = $.jStorage.get('profile');
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
        }]
        $scope.user.pin = $scope.userDetails.pincode;
        MyServices.getByPin($scope.user, function (data) {
            if (data.value) {
                $scope.pindays = data.data;
                _.forEach($scope.pindays.days, function (value) {
                    _.forEach($scope.days, function (value1) {
                        if (value.substr(0, 3) == value1.day) {
                            value1.value = true;
                        }
                    });
                });


            }
            console.log($scope.days);
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

        $scope.displayCompleteDate = function () {
            var timeStamp = new Date(selectedYear, selectedMonth, selectedDate).getTime();
            if (angular.isUndefined($scope.dateformat)) {
                var format = "dd - MMM - yy";
            } else {
                var format = $scope.dateformat;
            }
            $scope.display = $filter('date')(timeStamp, format);
            $scope.display1 = $filter('date')(timeStamp);
            MyServices.setDate($scope.display1);

        }

        //Onload Display Current Date
        $scope.displayCompleteDate();

        $scope.UIdisplayDatetoMonth = function () {
            $scope.UICalendarDisplay.Date = false;
            $scope.UICalendarDisplay.Month = true;
            $scope.UICalendarDisplay.Year = false;
        }

        $scope.UIdisplayMonthtoYear = function () {
            $scope.UICalendarDisplay.Date = false;
            $scope.UICalendarDisplay.Month = false;
            $scope.UICalendarDisplay.Year = true;
        }

        $scope.UIdisplayYeartoMonth = function () {
            $scope.UICalendarDisplay.Date = false;
            $scope.UICalendarDisplay.Month = true;
            $scope.UICalendarDisplay.Year = false;
        }
        $scope.UIdisplayMonthtoDate = function () {
            $scope.UICalendarDisplay.Date = true;
            $scope.UICalendarDisplay.Month = false;
            $scope.UICalendarDisplay.Year = false;
        }

        $scope.selectedMonthPrevClick = function () {
            selectedDate = 1;
            if (selectedMonth == 0) {
                selectedMonth = 11;
                selectedYear--;
            } else {
                $scope.dislayMonth = selectedMonth--;

            }
            $scope.displayMonthCalendar();
        }

        $scope.selectedMonthNextClick = function () {
            selectedDate = 1;
            if (selectedMonth == 11) {
                selectedMonth = 0;
                selectedYear++;
            } else {
                $scope.dislayMonth = selectedMonth++;
            }
            $scope.displayMonthCalendar();
        }

        $scope.selectedMonthYearPrevClick = function () {
            selectedYear--;
            $scope.displayYear = selectedYear;
            $scope.displayMonthCalendar();
        }

        $scope.selectedMonthYearNextClick = function () {
            selectedYear++;
            $scope.displayYear = selectedYear;
            $scope.displayMonthCalendar();
        }

        $scope.selectedDecadePrevClick = function () {
            selectedYear -= 10;
            $scope.displayMonthCalendar();
        }

        $scope.selectedDecadeNextClick = function () {
            selectedYear += 10;
            $scope.displayMonthCalendar();
        }

        $scope.selectedYearClick = function (year) {
            $scope.displayYear = year;
            selectedYear = year;
            $scope.displayMonthCalendar();
            $scope.UICalendarDisplay.Date = false;
            $scope.UICalendarDisplay.Month = true;
            $scope.UICalendarDisplay.Year = false;
            $scope.displayCompleteDate();
        }

        $scope.selectedMonthClick = function (month) {
            $scope.dislayMonth = month;
            selectedMonth = month;
            $scope.displayMonthCalendar();
            $scope.UICalendarDisplay.Date = true;
            $scope.UICalendarDisplay.Month = false;
            $scope.UICalendarDisplay.Year = false;
            $scope.displayCompleteDate();
        }

        $scope.selectedDateClick = function (date) {
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

        $scope.displayMonthCalendar = function () {

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
    .controller('PincodeCtrl', function ($scope, $ionicPopup, $stateParams, $ionicActionSheet, $cordovaFileTransfer, $cordovaCamera, $ionicPopover, $state, MyServices, $cordovaImagePicker) {})

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

        $scope.signup = function () {
            $scope.signupForm.accessLevel = "Customer";
            console.log("djfgjk", $scope.signupForm);
            if (!$.jStorage.get('profile')) {

                MyServices.signup($scope.signupForm, function (data) {

                    console.log(data);
                    $scope.signupForm = data.data;
                    $.jStorage.set('profile', data.data);
                    console.log($scope.signupForm)
                    if (data.value == true) {


                        $scope.signupForm._id = $.jStorage.get('profile')._id;
                        MyServices.getonePro($scope.signupForm, function (data) {
                            $.jStorage.set('profile', data.data);
                            $scope.signupForm = data.data;
                            $scope.user = {};
                            $scope.user.pin = data.data.pincode
                            MyServices.getByPin($scope.user, function (data) {
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

                MyServices.saveData($scope.signupForm, function (data) {


                    console.log(data);
                    $scope.signupForm = data.data;

                    console.log($scope.signupForm)
                    if (data.value == true) {


                        $scope.signupForm._id = $.jStorage.get('profile')._id;
                        MyServices.getonePro($scope.signupForm, function (data) {
                            $.jStorage.set('profile', data.data);
                            $scope.signupForm = data.data;
                            $scope.user = {};
                            $scope.user.pin = data.data.pincode
                            MyServices.getByPin($scope.user, function (data) {
                                if (data.value) {
                                    $scope.profile = $.jStorage.get('profile');
                                    tate.go('app.browse');

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