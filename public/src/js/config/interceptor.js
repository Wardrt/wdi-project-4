angular
  .module("twitchRoulette")
  .config(Interceptor);

Interceptor.$inject = ["$httpProvider"];
function Interceptor($httpProvider){
  $httpProvider.interceptors.push("authInterceptor");
}
