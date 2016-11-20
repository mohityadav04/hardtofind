var express = require('express');
var path = require('path');
var mongoose=require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

mongoose.connect("mongodb://mohityadav04:passfornode04@ds050559.mlab.com:50559/first_deploy");
var TODO = mongoose.model('TODO',{
	text:String
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

	app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        TODO.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                return res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        TODO.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                return res.send(err);

            // get and return all the todos after you create another
            TODO.find(function(err, todos) {
                if (err)
                    return res.send(err)
                res.json(todos);
            });
        });

    });

 app.delete('/api/todos/:todo_id', function(req, res) {
        TODO.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                return res.send(err);

            // get and return all the todos after you create another
            TODO.find(function(err, todos) {
                if (err)
                    return res.send(err)
                res.json(todos);
            });
        });
    });   


 app.listen(8080);
 console.log("App listening on port 8080");

module.exports = app;
