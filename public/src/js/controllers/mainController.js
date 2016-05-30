angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce"];
function MainController($http, URL, $stateParams, $state, $sce) {
  var self = this;
  self.all = [];
  self.getStreams = getStreams;

  function getStreams() {
    $http({
      method: "GET",
      url: URL + "/streams"
    }).then(function(res){
      self.all = $sce.getTrustedResourceUrl(res.data.streams);
    }, function(res){
      console.log(res);
    });
  }

  function getStream() {
    $http({
      method: "GET",
      url: URL + "/streams/" + $stateParams
    }).then(function(res){
      self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + res.data.stream.channel.display_name);
    });
  }
  getStreams();
}
