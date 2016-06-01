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
      if ($('#m').val().length > 0) {
        socket.emit('chat message', { text: $('#m').val(), username: self.currentUser.local.username });
        $('#m').val('');

        socket.on('message', function(msg){
          for (var i = 0; i < msg.text.length; i++) {
            if (msg.text.charAt(i) === " ") {
              return;
            } else {
              var user = self.currentUser.local.username;
              var message = '<li><span>' + msg.username + ': </span>' + msg.text + '</li>';
              $('#messages').append(message);
              $('span').css('color', randomColor);
              $('.panel-content').animate({scrollTop: $('.panel-content').prop("scrollHeight")}, 500);
            }
          }
        });
      }
    }

    function pairUsers() {
      // Do stuff in the backend, to find users with a socket id and only show the page to those two users.
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
