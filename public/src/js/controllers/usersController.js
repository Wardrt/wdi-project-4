angular
  .module("twitchRoulette")
  .controller("UsersController", UsersController);

  UsersController.$inject = ['User', "CurrentUser", "$state", "$stateParams"];
  function UsersController(User, CurrentUser, $state, $stateParams){

    var self        = this;
    var colors      = ['red', 'blue', 'green'];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];

    if ($stateParams.id) {
      self.user = User.get({ id: $stateParams.id }, function(res){
        self.user = res.user;
      });
    }

    self.all              = [];
    self.user             = null;
    self.currentUser      = null;
    self.error            = null;
    self.getUsers         = getUsers;
    self.register         = register;
    self.login            = login;
    self.logout           = logout;
    self.checkLoggedIn    = checkLoggedIn;
    self.sendMessage      = sendMessage;
    self.pairUsers        = pairUsers;

    function sendMessage(){
      var socket = io();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
      socket.on('message', function(msg){
        var user = self.currentUser.local.username;
        var message = '<li><span>' + user + ': </span>' + msg + '</li>';
        $('#messages').append(message);
        $('span').css('color', randomColor);
      });
    }

    function pairUsers() {

    }

    function getUsers() {
      User.query(function(data){
        self.all = data.users;
      });
    }

    function handleLogin(res) {
      var token = res.token ? res.token : null;
      if (token) {
        self.currentUser = CurrentUser.getUser();
        self.getUsers();
        $state.go("home");
      }
    }

    function handleError(e) {
      self.error = "Something went wrong.";
    }

    function register() {
      User.register(self.user, handleLogin, handleError);
    }

    function login() {
      User.login(self.user, handleLogin, handleError);
    }

    function logout() {
      self.all         = null;
      self.currentUser = null;
      self.user        = null;
      CurrentUser.clearUser();
    }

    function checkLoggedIn() {
      self.currentUser = CurrentUser.getUser();
      return !!self.currentUser;
    }

    if (checkLoggedIn()) {
      self.getUsers();
    }

    return self;
  }
