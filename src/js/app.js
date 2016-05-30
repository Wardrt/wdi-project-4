angular
  .module("twitchRoulette", ["ngResource", 'angular-jwt', "ui.router"])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push("authInterceptor");
  });

MainRouter.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
function MainRouter($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "/html/home.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "/html/authentications/login.html"
    })
    .state('register', {
      url: "/register",
      templateUrl: "/html/authentications/register.html"
    })
    .state('users', {
      url: "/users",
      templateUrl: "/html/users/index.html"
    })
    .state('user', {
      url: "/users/:id",
      templateUrl: "/html/users/show.html",
      controller: "UsersController as profile"
    });

  $urlRouterProvider.otherwise("/");
}