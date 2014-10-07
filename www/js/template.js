var APPNAME;

APPNAME = "template";

angular.module("" + APPNAME, ["ionic", "" + APPNAME + ".controllers", "ngTouch"]);

angular.module("" + APPNAME + ".controllers", []);

angular.module("" + APPNAME + ".services", ['firebase']).run(["$rootScope", "$location", "$ionicPlatform", "$ionicPopup", function($rootScope, $location, $ionicPlatform, $ionicPopup) {}]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("app", {
    url: "/app",
    abstract: true,
    templateUrl: "templates/layout.html",
    controller: "AppCtrl"
  }).state("app.home", {
    url: "/home",
    views: {
      app: {
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
      }
    }
  });
  return $urlRouterProvider.otherwise("/app/home");
}]);

var APPNAME;

APPNAME = "template";

angular.module("" + APPNAME + ".controllers", ["" + APPNAME + ".services", "appTemplates"]).controller("AppCtrl", ["$scope", "User", function($scope, User) {
  return console.log("AppCtrl");
}]).controller("HomeCtrl", ["$scope", "User", function($scope, User) {
  return console.log("Here");
}]);

var APPNAME, firebaseRef;

APPNAME = "template";

firebaseRef = "https://" + APPNAME + ".firebaseio.com";

angular.module("" + APPNAME + ".services").factory('User', ["$q", "$firebase", "Utils", function($q, $firebase, Utils) {
  var User;
  return new (User = (function() {
    function User() {}

    User.prototype.init = function() {
      return this._firebase = new Firebase("" + firebaseRef);
    };

    User.prototype._store = function(key, value) {
      this[key] = value;
      return Utils.store(key, value);
    };

    return User;

  })());
}]);

var APPNAME;

APPNAME = "template";

angular.module("" + APPNAME + ".services").factory('Utils', function() {
  var Utils;
  return new (Utils = (function() {
    function Utils() {}

    Utils.prototype.store = function(key, data) {
      return window.localStorage[key] = JSON.stringify(data);
    };

    Utils.prototype.getFromStorage = function(key) {
      if (window.localStorage[key] != null) {
        return JSON.parse(window.localStorage[key]);
      } else {
        return null;
      }
    };

    return Utils;

  })());
});
