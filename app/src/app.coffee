APPNAME = "template"

angular.module "#{APPNAME}", [ "ionic", "#{APPNAME}.controllers",  "ngTouch" ]
angular.module "#{APPNAME}.controllers", []
angular.module("#{APPNAME}.services", [
  'firebase'
]).run(($rootScope, $location, $ionicPlatform, $ionicPopup) ->

).config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state "app",
    url: "/app"
    abstract: true
    templateUrl: "templates/layout.html"
    controller: "AppCtrl"
  .state "app.home",
    url: "/home"
    views:
      app:
        templateUrl: "templates/home.html"
        controller: "HomeCtrl"
  $urlRouterProvider.otherwise "/app/home"
