APPNAME = "template"

angular.module("#{APPNAME}.controllers", [
  "#{APPNAME}.services"
  "appTemplates"
]).controller "AppCtrl", ($scope, User) ->
  console.log "AppCtrl"

.controller "HomeCtrl", ($scope, User) ->
  console.log "Here"
