angular
  .module("twitchRoulette")
  .controller("UsersController", UsersController);

  UsersController.$inject = ['User', "CurrentUser", "$state", "$stateParams", "socket"];
  function UsersController(User, CurrentUser, $state, $stateParams, socket){

    var self        = this;
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

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
    self.editUser         = editUser;
    self.logout           = logout;
    self.checkLoggedIn    = checkLoggedIn;
    self.sendMessage      = sendMessage;

    socket.on('connection', function(){
      console.log("I'm connected init");
    });

    self.message = "";

    function sendMessage(){
      if (self.message.length > 0) {
        socket.emit('chat message', {
          text: self.message,
          username: self.currentUser.local.username,
          color: randomColor,
          channel: $stateParams.name
        });
        self.message = "";
      }
    }

    socket.on('message', function(msg){
      var message = '<li><span class="' + msg.username + '">' + msg.username + ': </span>' + trim(msg.text) + '</li>';
      $('#messages').append(message);
      $('.' + msg.username).css('color', msg.color);
      $('.panel-content').animate({scrollTop: $('.panel-content').prop("scrollHeight")}, 500);
    });

    function trim(str){
      return str.replace(/^\s+|\s+$/g, '');
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

    function editUser() {
      User.update({ id: $stateParams._id }, { user: self.currentUser }, function(data){
        self.user = data;
      });
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
