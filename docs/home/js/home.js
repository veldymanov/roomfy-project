"use strict";jQuery(document).ready(function(){$("p a").css({"background-color":"#ccc"})}),"serviceWorker"in navigator&&navigator.serviceWorker.register("service-worker.js").then(function(e){return console.log("Service Worker registration succeeded. Scope is "+e.scope)}).catch(function(e){return console.log("Registration failed"+e)});