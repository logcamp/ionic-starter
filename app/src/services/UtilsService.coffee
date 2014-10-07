# Inpired by this
# http://benhollis.net/blog/2014/01/17/cleanly-declaring-angularjs-services-with-coffeescript/
APPNAME = "template"
angular.module("#{APPNAME}.services")
.factory 'Utils', () ->
  new class Utils
    store: (key, data) ->
      window.localStorage[key] = JSON.stringify data

    getFromStorage: (key) ->
      if window.localStorage[key]?
        return JSON.parse window.localStorage[key]
      else
        return null
