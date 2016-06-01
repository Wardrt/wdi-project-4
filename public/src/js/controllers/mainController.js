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
      self.iframesrc = $sce.getTrustedResourceUrl("http://player.twitch.tv/?channel=" + res.data.stream.channel.display_name);
    });
  }

  function searchForStream(data) {
    // On search run this function to find by display_name, and load the stream show page for that stream.
    // If the stream doesn't exist (wrong name or is offline) load a page that has some info saying to search again for a new stream.

  }


  getStreams();
}
