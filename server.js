var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/images', express.static(path.join(__dirname, '/public/images')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));

app.get('/', function(req, res) {
    let userId = makeid(10);
    res.redirect(`/${userId}`);
});

app.get('/flair/:userId', function(req, res) {
    let userId = req.params.userId;

    getUserFlair(userId, res);
});

app.patch('/flair/:userId', function(req, res) {
    let userId = req.params.userId;
    let flair = req.body;
    saveUserFlair(userId, flair, res);
});

app.get('/:userId', function(req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    });
});


var server = app.listen(5000);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getUserFlair(userId, res) {
    let fileName = `./users/${userId}.json`;
    fs.exists(fileName, (exists) => {
        if (exists) {
            fs.readFile(fileName, (err, data) => {
                if (err) throw err;
                res.send(JSON.parse(data))
            });
        } else {
            res.send({
                pickedFlair: []
            });
        }

    })
}

function saveUserFlair(userId, flair, res) {
    let fileName = `./users/${userId}.json`;

    fs.writeFile(fileName, JSON.stringify(flair), 'utf8', (err) => {
        if (err) throw err;
        res.send({
            message: "Flair Updated"
        })
    });
}