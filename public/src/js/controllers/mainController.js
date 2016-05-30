angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$scope", "$state"];
function MainController($http, URL, $stateParams, $scope, $state) {
  var self = this;
  self.getStreams = getStreams;

  function getStreams() {
    $http({
      method: "GET",
      url: URL + "streams/incon"
    }).then(function(res){
      console.log(res);
    });
  }

}
