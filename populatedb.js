#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(name, description, category, price, number_in_stock, cb) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  };

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  categorydetail = {
    name: name,
    description: description,
  };

  var category = new Category(categorydetail);
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Rackets',
          'Different types of rackets for all different types of racket sports! Including: tennis rackets, squash rackets, ping-pong rackets, badminton racket and more!',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Shoes',
          'Lots of different shoes. Part-worn, new, old, any sort of shoe. Left shoes particularly worn out but right shoes are in good condition. Get them here!',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Balls',
          'Tennis balls, squash balls, ping-pong balls, swimming balls, badminton balls, bowling balls. Any type of ball you can think of, no doubt you will be able to find here. Look now!',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Shorts',
          'All different types of shorts. Essential sportswear.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Shirts',
          'A vast range of sports shirts. Breathable shirts, non-breathable shirts. Male and female shirts, collared shirts, white shirts, black shirts. All the shirts you could possibly need',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel([
    function (callback) {
      itemCreate(
        'Squash racket',
        'Dunlop Triple Threat squash racket',
        categories[0],
        59.99,
        3,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Tennis racket',
        'Head Super Smasher tennis racket',
        categories[0],
        99.99,
        1,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Badminton racket',
        'Nike Big Boy Elite badminton racket',
        categories[0],
        39.99,
        9,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Squash shoes',
        'Asics Gel Rocket 9 squash shoes',
        categories[1],
        24.99,
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Tennis balls',
        'A can containing 6 of the finest tennis balls',
        categories[2],
        9.99,
        1,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Squash balls',
        'Pack of 3 Dunlop double dot professional squash balls',
        categories[2],
        9.99,
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Men's shorts",
        "Wilson Double Trouble pair of men's shorts. One size fits all!",
        categories[3],
        9.99,
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Women's shorts",
        "Wilson Double Trouble pair of women's shorts. One size fits all!",
        categories[3],
        9.99,
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Unisex sports top',
        'Addidas unisex sports top - one size fits all! Looks fantastic.',
        categories[4],
        29.99,
        11,
        callback
      );
    },
  ]);
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('BOOKInstances: ' + bookinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
