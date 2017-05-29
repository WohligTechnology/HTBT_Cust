// var adminurl = "http://192.168.43.147:80/api/"; //local

// var adminurl = "http://104.198.28.29:80/api/"; //server
var adminurl = "http://192.168.0.117:1337/api/"; //server

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;

angular.module('starter.services', [])
  .factory('MyServices', function ($http) {
    var appDetails = {};
    var calDate = new Date();
    appDetails.cartQuantity = $.jStorage.get("cartQuantity");
    return {
      getAppDetails: function () {
        return appDetails;
      },
      getProfile: function (id, callback) {
        var data = {
          _id: id
        };
        $http({
          url: adminurl + 'user/getProfile',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      signup: function (data, callback) {
        console.log(data);
        $http({
          url: adminurl + 'User/saveUserData',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      saveData: function (data, callback) {
        console.log(data);
        $http({
          url: adminurl + 'User/save',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      getonePro: function (data, callback) {
        $http({
          url: adminurl + 'User/getone',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      getByPin: function (data, callback) {
        $http({
          url: adminurl + 'Pincode/getByPin',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      updateAndGetResponse: function (data, callback) {
        $http({
          url: adminurl + 'User/updateAndGetResponse',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      categories: function (callback) {
        $http({
          url: adminurl + 'Categories/getCategories',
          method: 'POST',
          withCredentials: true,
        }).success(callback);
      },
      featureprods: function (callback) {
        $http({
          url: adminurl + 'product/getAllFeaturedProduct',
          method: 'POST',
          withCredentials: true,
        }).success(callback);
      },
      products: function (data, callback) {
        $http({
          url: adminurl + 'product/getAllCategoryProduct',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      showCardQuantity: function (callback) {
        var obj = {
          user: $.jStorage.get("profile")._id
        };
        $http({
          url: adminurl + 'user/showCartQuantity',
          method: 'POST',
          withCredentials: true,
          data: obj
        }).then(function (data) {
          appDetails.cartQuantity = data.data.data;
          $.jStorage.set("cartQuantity", data.data.data);
          callback(appDetails.cartQuantity);
        });
      },
      setDate: function (sDate) {

        calDate = sDate;

        console.log(calDate, sDate);
      },

      getDate: function () {
        console.log(calDate);

        return calDate;
      },
      addToCart: function (products, callback) {
        var obj = {
          user: $.jStorage.get("profile")._id,
          products: products,
        };
        $http({
          url: adminurl + 'user/addToCart',
          method: 'POST',
          withCredentials: true,
          data: obj
        }).then(function (data) {
          appDetails.cartQuantity = data.data.data;
          $.jStorage.set("cartQuantity", data.data.data);
          callback(data);
        });
      },
      removeFromCart: function (productId, callback) {
        var obj = {
          user: $.jStorage.get("profile")._id,
          product: productId,
        };
        $http({
          url: adminurl + 'user/removeFromCart',
          method: 'POST',
          withCredentials: true,
          data: obj
        }).then(function (data) {
          appDetails.cartQuantity = data.data.data;
          $.jStorage.set("cartQuantity", data.data.data);
          callback(data);
        });
      },
      showCart: function (callback) {
        var obj = {
          user: $.jStorage.get("profile")._id
        };
        $http({
          url: adminurl + 'user/showCart',
          method: 'POST',
          withCredentials: true,
          data: obj
        }).then(function (data) {
          callback(data);
        });
      },
      getProductPrice: function (product, quantity) {
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
      },

      //to get OTP
      getOTP: function (data, callback) {
        $http({
          url: adminurl + 'user/generateOtp',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      getAllOtherProduct: function (data, callback) {
        $http({
          url: adminurl + 'product/getAllOtherProduct',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

      //To verfiy OTP
      verifyOTP: function (data, callback) {
        $http({
          url: adminurl + 'user/verifyOTP',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      }

    };
  });
