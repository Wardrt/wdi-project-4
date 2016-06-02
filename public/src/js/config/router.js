angular
  .module("twitchRoulette")
  .config(MainRouter);

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
    })
    .state('streams', {
      url: "/streams",
      templateUrl: "/html/streams/index.html",
      controller: "StreamController as streams"
    })
    .state('stream', {
      url: "/streams/:name",
      templateUrl: "/html/streams/show.html",
      controller: "StreamController as streams"
    });

  $urlRouterProvider.otherwise("/");
}
