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


angular
  .module("twitchRoulette")
  .controller("UsersController", UsersController);

  UsersController.$inject = ['User', "CurrentUser", "$state", "$stateParams"];
  function UsersController(User, CurrentUser, $state, $stateParams){

    var self = this;

    if ($stateParams.id) {
      self.user = User.get({ id: $stateParams.id }, function(res){
        self.user = res.user;
      });
    }

    self.all           = [];
    self.user          = null;
    self.currentUser   = null;
    self.error         = null;
    self.getUsers      = getUsers;
    self.register      = register;
    self.login         = login;
    self.logout        = logout;
    self.checkLoggedIn = checkLoggedIn;

    function getUsers() {
      User.query(function(data){
        self.all = data.users;
      });
    }

    function handleLogin(res) {
      var token = res.token ? res.token : null;
      if (token) {
        self.currentUser = CurrentUser.getUser();
        self.getUsers();
        $state.go("home");
      }
    }

    function handleError(e) {
      self.error = "Something went wrong.";
    }

    function register() {
      User.register(self.user, handleLogin, handleError);
    }

    function login() {
      User.login(self.user, handleLogin, handleError);
    }

    function logout() {
      self.all         = null;
      self.currentUser = null;
      self.user        = null;
      CurrentUser.clearUser();
    }

    function checkLoggedIn() {
      self.currentUser = CurrentUser.getUser();
      return !!self.currentUser;
    }

    if (checkLoggedIn()) {
      self.getUsers();
    }

    return self;
  }

angular
  .module('twitchRoulette')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API){

  return $resource(
    API+'/users/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register': {
        url: API + "/register",
        method: "POST"
      },
      'login': {
        url: API + "/login",
        method: "POST"
      }
    }
  );
}

angular
  .module("twitchRoulette")
  .factory("authInterceptor", AuthInterceptor);

AuthInterceptor.$inject = ["API", "TokenService"];
function AuthInterceptor(API, TokenService) {
  return {
    request: function(config){
      var token = TokenService.getToken();

      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    response: function(res){
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        TokenService.setToken(res.data.token);
      }
      return res;
    }
  };
}

angular
  .module("twitchRoulette")
  .service("CurrentUser", CurrentUser);

CurrentUser.$inject = ["TokenService"];
function CurrentUser(TokenService) {
  var self = this;
  self.getUser   = getUser;
  self.clearUser = clearUser;
  self.user      = getUser();

  function getUser() {
    return self.user ? self.user : TokenService.decodeToken();
  }

  function clearUser() {
    TokenService.removeToken();
    self.user = null;
  }
}

angular
  .module("twitchRoulette")
  .service("TokenService", TokenService);

TokenService.$inject = ["$window", "jwtHelper"];
function TokenService($window, jwtHelper) {
  var self = this;
  self.setToken    = setToken;
  self.getToken    = getToken;
  self.removeToken = removeToken;
  self.decodeToken = decodeToken;

  function setToken(token) {
    return $window.localStorage.setItem("auth-token", token);
  }

  function getToken() {
    return $window.localStorage.getItem("auth-token");
  }

  function removeToken() {
    return $window.localStorage.removeItem("auth-token");
  }

  function decodeToken() {
    var token = self.getToken();
    if (token) {
      var decodedUser = jwtHelper.decodeToken(token);
      return decodedUser ? decodedUser._doc : null;
    }
  }

}
