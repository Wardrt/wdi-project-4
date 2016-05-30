angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce"];
function MainController($http, URL, $stateParams, $state, $sce) {
  var self = this;
  self.getStreams = getStreams;

  self.stream = $sce.getTrustedResourceUrl("https://player.twitch.tv/?channel=kylelong");

  function getStreams() {
    $http({
      method: "GET",
      url: URL + "/streams/incon"
    }).then(function(res){
      // $scope.iframesrc = res.data.stream.channel.display_name;
      // $("#stream-pane").html(res.data.stream.channel.display_name);
    }, function(res){
      console.log(res);
    });
  }
  // getStreams();
}
