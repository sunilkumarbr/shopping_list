/***************************modules***************************/
var express = require('express');
var mongo = require('mongodb');
var ejs = require('ejs');
var bodyParser = require('body-parser');

var app = express();

/************************middlewares**************************/
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

/************************connection to mongodb server**************************/

var db,col;

mongo.connect("mongodb://shoppinglist:sunil@ds056698.mongolab.com:56698/shoppinglist", function(error, r) {
    if (error)
        throw error;
    else {
        console.log("Connected to db");
        db = r;

        col = db.collection('shopping_list');
    }
})

/************************routing**************************/
app.get('/', function(req, res) {
    fromcol = col.find().sort({
        item: 1
    });
    fromcol.toArray(function(e, fildes) {
        if (e)
            console.log(e);
        else
            res.render('index', {
                table: fildes,
                entry: '',
                id: ''
            });
    });
});

/************************insertion**************************/

app.post('/', function(req, res) {
    var item = req.body.item;
    quantity = req.body.quantity;
    entryval = '';
    existid = '';

    entry = col.find({
        item: item
    });
    entry.toArray(function(e, fildes) {
        if (e)
            console.log(e);
        else {
            if (fildes[0] === undefined) {
                coll = db.collection('shopping_list');
                coll.insert({
                    item: item,
                    quantity: quantity
                }, function(e, r) {
                    if (e)
                        console.log(e);
                    else
                        existid = '';
                });
                entryval = '';
            } else {
                entryval = 'This item is already exist in your list! Would you like to update it';
                existid = fildes[0]._id;
            }
            fromcol = col.find().sort({
                item: 1
            });
            fromcol.toArray(function(e, fildes) {
                if (e)
                    console.log(e);
                else
                    res.render('index', {
                        table: fildes,
                        entry: entryval,
                        id: existid
                    });
            });
        }
    });

});

/************************deletion**************************/

app.post('/modify', function(req, res) {
    var deleteid = req.body.deleteid;
    col.remove({
        _id: new mongo.ObjectID(deleteid)
    }, function(e, r) {
        if (e)
            console.log(e);
    });
    fromcol = col.find().sort({
        item: 1
    });
    fromcol.toArray(function(e, fildes) {
        if (e)
            console.log(e);
        else
            res.render('index', {
                table: fildes,
                entry: '',
                id: ''
            });
    });

});

/************************delete all**************************/

app.post('/removeall', function(req, res) {

    col.remove({}, function(e, r) {
        if (e)
            console.log(e);
    });
    fromcol = col.find().sort({
        item: 1
    });
    fromcol.toArray(function(e, fildes) {
        if (e)
            console.log(e);
        else
            res.render('index', {
                table: fildes,
                entry: '',
                id: ''
            });
    });

});

/************************updation**************************/

app.post('/update', function(req, res) {
    var item = req.body.item;
    quantity = req.body.quantity;
    id = req.body.hidden;
    focusid=req.body.hidden;
    entryval = '';
    if (req.body.row === '1') {

        fromcol = col.find({
            $and: [{
                item: item
            }, {
                quantity: quantity
            }]
        });
    } else if (req.body.row === undefined) {

        fromcol = col.find({
            item: item
        });
    }
    fromcol.toArray(function(e, doc) {
        if (e)
            console.log(e);
        else {
            if (doc[0] === undefined) {
                if (req.body.row === '1') {
                    c = col.find({
                        item: item
                    });
                    c.toArray(function(e, d) {
                        if (d[0] === undefined || (d[0] !== undefined && String(d[0]._id) === id))
                            col.update({
                                _id: new mongo.ObjectID(id)
                            }, {
                                $set: {
                                    item: item,
                                    quantity: quantity
                                }
                            }, function(e, r) {
                                if (e)
                                    console.log(e);
                                else {
                                    entryval = '';
                                }
                            });
                        else{
                            entryval = ' You have not changed anythig OR This item is already exist';
                            focusid=String(d[0]._id);
                        }
                    });

                } else
                    col.update({
                        _id: new mongo.ObjectID(id)
                    }, {
                        $set: {
                            item: item,
                            quantity: quantity
                        }
                    }, function(e, r) {
                        if (e)
                            console.log(e);
                        else {
                            entryval = '';
                        }
                    });
            } else if (String(doc[0]._id) === id) {
                col.update({
                    _id: new mongo.ObjectID(id)
                }, {
                    $set: {
                        item: item,
                        quantity: quantity
                    }
                }, function(e, r) {
                    if (e)
                        console.log(e);
                    else {
                        entryval = '';
                    }
                });
            } else {
                entryval = ' You have not changed anythig OR This item is already exist';
                focusid=String(doc[0]._id);
            }

            fromcol = col.find().sort({
                item: 1
            });
            fromcol.toArray(function(e, fildes) {
                if (e)
                    console.log(e);
                else
                    res.render('index', {
                        table: fildes,
                        entry: entryval,
                        id: focusid
                    });
            });

        }
    });

});

/************************assigning port**************************/

app.listen(5350, function() {
    console.log('running at 5350');
});