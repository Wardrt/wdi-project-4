angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce"];
function MainController($http, URL, $stateParams, $state, $sce) {
  var self = this;
  self.all = [];
  self.getStreams = getStreams;
  self.getStream  = getStream;

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

  function getStream(name) {
    console.log(name);
    $http({
      method: "GET",
      url: URL + "/streams/" + name
    }).then(function(res){
      self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + res.data.stream.channel.display_name);
      console.log(self.iframesrc);
    });
  }
  getStreams();
}
