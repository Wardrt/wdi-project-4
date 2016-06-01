angular
  .module("twitchRoulette")
  .controller("MainController", MainController);

MainController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce"];
function MainController($http, URL, $stateParams, $state, $sce) {
  var self             = this;
  self.all             = [];
  self.getStreams      = getStreams;
  self.getStream       = getStream;
  self.searchForStream = searchForStream;

  if ($stateParams.name) {
    getStream($stateParams.name);
  }

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
    $http({
      method: "GET",
      url: URL + "/streams/" + name
    }).then(function(res){
      var streamerName = res.data.stream.channel.url;
      var streamer = streamerName.replace(/(https:\/\/www.twitch.tv\/)/g, "");
      self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + streamer);
    });
  }

  function searchForStream() {
    console.log(self.search);
    $state.go("stream", { name: self.search });
  }


  getStreams();
}
