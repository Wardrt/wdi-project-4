angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce"];
function MainController($http, URL, $stateParams, $state, $sce) {
  var self = this;
  self.getStreams = getStreams;

  function getStreams() {
    $http({
      method: "GET",
      url: URL + "/streams/phantomsfx"
    }).then(function(res){
      self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + res.data.stream.channel.display_name);
    }, function(res){
      console.log(res);
    });
  }
  getStreams();
}
