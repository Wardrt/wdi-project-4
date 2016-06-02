angular
  .module("twitchRoulette")
  .controller("StreamController", StreamController);

StreamController.$inject = ["$http", "URL", "$stateParams", "$state", "$sce", "socket"];
function StreamController($http, URL, $stateParams, $state, $sce, socket) {
  var self             = this;
  self.all             = [];
  self.getStreams      = getStreams;
  self.getStream       = getStream;
  self.searchForStream = searchForStream;
  self.online          = true;

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
      if (res.data.stream === null) {
        self.online = false;
      } else {
        var streamerName = res.data.stream.channel.url;
        var streamer = streamerName.replace(/(https:\/\/www.twitch.tv\/)/g, "");
        self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + streamer);
      }
    });
  }

  function searchForStream() {
    $state.go("stream", { name: self.search });
  }

  socket.emit("join", $stateParams.name);

  getStreams();
}
