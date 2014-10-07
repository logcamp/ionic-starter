# Inpired by this
# http://benhollis.net/blog/2014/01/17/cleanly-declaring-angularjs-services-with-coffeescript/
APPNAME = "template"
firebaseRef = "https://#{APPNAME}.firebaseio.com"

angular.module("#{APPNAME}.services")
.factory 'User', ($q, $firebase, Utils) ->
  new class User
    init: () ->
      @_firebase = new Firebase("#{firebaseRef}")

    _store: (key, value) ->

      @[key] = value
      Utils.store(key, value)
