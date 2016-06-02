var express        = require("express");
var cors           = require("cors");
var path           = require("path");
var morgan         = require("morgan");
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var passport       = require("passport");
var cookieParser   = require("cookie-parser");
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var app            = express();

var config         = require("./config/config");
var User           = require("./models/user");
var Chat           = require("./models/chat");
var secret         = require("./config/config").secret;

var http           = require("http").createServer(app);
var io             = require("socket.io")(http);

mongoose.connect(config.database);

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use("/", express.static("public"));
app.use("/", express.static("bower_components"));

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

var routes = require('./config/routes');
app.use("/api", routes);

app.get("/*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

io.on('connection', function(socket){
  console.log(socket.client.conn.id);
  socket.on('chat message', function(msg){
    io.in(msg.channel).emit('message', msg);
  });
  socket.on("join", function(room){
    socket.join(room);
  });
});

http.listen(config.port, function(){
  console.log("listening to the server", config.port);
});
