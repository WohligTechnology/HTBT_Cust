angular.module('starter.subscription', [])
    .factory('Subscription', function ($http) {

        var subScriptionObj = {
            product: [{
                product: null,
                quantity: null
            }],
            productDetail: null
        };
        return {
            setObj: function (newObj) {
                subScriptionObj = newObj;
            },
            getObj: function () {
                return subScriptionObj;
            },
            validate: function ($state) {
                if (!subScriptionObj.product[0].product) {
                    $state.go("app.browse");
                }
            },
        };
    });