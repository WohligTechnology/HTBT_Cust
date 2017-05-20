// var adminurl = "http://104.198.28.29:80/api/"; //server
<<<<<<< HEAD
var adminurl = "http://192.168.2.24:1337/api/"; //server
=======
var adminurl = "http://192.168.2.24:1337/api/"; //Nargis Machine
>>>>>>> 51019b1dcfed29c8508574b067811d8da0609dff

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;

angular.module('starter.services', [])
  .factory('MyServices', function ($http) {
    return {

      getProfile: function (id, callback) {
        console.log(id);
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
        console.log(data);
        $http({
          url: adminurl + 'product/getAllCategoryProduct',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      }



    };



  });