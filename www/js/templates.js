angular.module("appTemplates",[]).run(["$templateCache",function(e){e.put("templates/home.html",'<ion-view id="home" title="{{AppName}}" hide-back-button="true" left-buttons="menuButton"><ion-content><div class="row"><div class="col"><h1>Hello World</h1></div><div class="col"><h1>World Hello</h1></div></div></ion-content></ion-view>'),e.put("templates/layout.html",'<ion-nav-view name="app"></ion-nav-view>')}]);