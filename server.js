var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var Regex = require("regex");
var movies = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

fs.readFile("movies.json", 'utf8', (err, data) => {
    if (err) throw err;
    movies = JSON.parse(data);
});

// List all movies.
app.get('/movies', function (req, res) {
    res.send(movies.movies);
});

// Add a movie.
app.get('/addmovie', function(req, res) {
    var newmovie = {
        "name": req.query.name,
        "year": req.query.year
    };
    movies.movies.push(newmovie);
    console.log(movies);

    fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
        if (err) res.send("Unable to add movie!");
        else res.send("Movie added!");
    });
});

// Remove a movie.
app.get('/removemovie', function(req, res) {
    var oldmovie = {
        "name": req.query.name,
        "year": req.query.year
    };
    var found = false;
    console.log(oldmovie);

    for (var i = 0; i < movies.movies.length; i++) {
        if (movies.movies[i].name == oldmovie.name && movies.movies[i].year == oldmovie.year) {
            console.log("FOUNDIT!");
            found = true;
            movies.movies.splice(i,1);
            fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
                if (err) res.send("Unable to remove movie!");
                else res.send("Movie removed!");
            });
        }
    }
    if (found === false) {
        res.send("Movie not found!");
    }
});

// Edit a movie
app.get('/editmovie', function(req, res) {
    var editmovie = {
        "name": req.query.name,
        "year": req.query.year,
        "newname": req.query.newname,
        "newyear": req.query.newyear
    };
    var found = false;
    console.log(editmovie);

    for (var i = 0; i < movies.movies.length; i++) {
        if (movies.movies[i].name == editmovie.name && movies.movies[i].year == editmovie.year) {
            console.log("FOUNDIT!");
            found = true;
            movies.movies[i].name = editmovie.newname;
            movies.movies[i].year = editmovie.newyear;
            fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
                if (err) res.send("Unable to edit movie!");
                else res.send("Movie edited!");
            });
        }
    }
    if (found === false) {
        res.send("Movie not found!");
    }
});

// Search and list matches on movie titles.
app.get('/searchmovie', function(req, res) {
    var returnmovies = [];
    var patt = new RegExp(req.query.name, 'gi');

    for (var i = 0; i < movies.movies.length; i++) {
        if (patt.test(movies.movies[i].name)) {
            console.log("Found One.");
            returnmovies.push(movies.movies[i]);
        }
    }
    res.send(returnmovies);
});

var port = 3000;
app.listen(port, function() {
    console.log(`App listening on port ${port}...`);
});