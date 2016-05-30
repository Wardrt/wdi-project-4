angular
  .module("twitchRoulette")
  .config(Sce);

Sce.$inject = ["$sceProvider"];

function Sce($sceProvider) {
  return $sceProvider.enabled(false);
}
