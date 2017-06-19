angular.module('starter.subscription', [])
    .factory('Subscription', function($http) {

        var subScriptionObj = {
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
        return {
            setObj: function(newObj) {
                subScriptionObj = newObj;
            },
            getObj: function() {
                return subScriptionObj;
            },
            validate: function($state) {
                if (!subScriptionObj.product[0].product) {
                    $state.go("app.browse");
                }
            },
        };
    });
