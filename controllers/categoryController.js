const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      category_count(callback) {
        Category.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      list_categories(callback) {
        Category.find({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Inventory application',
        error: err,
        data: results,
      });
    }
  );
};

// Display detail page for a specific Genre.
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_items(callback) {
        Category.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render('category_detail', {
        title: results.category,
        category: results.category,
        category_items: results.category,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.send('category create get');
};

exports.category_create_post = (req, res) => {
  res.send('category create post');
};

exports.category_delete_get = (req, res) => {
  res.send('category delete get');
};

exports.category_delete_post = (req, res) => {
  res.send('category delete post');
};

exports.category_update_get = (req, res) => {
  res.send('category update get');
};

exports.category_update_post = (req, res) => {
  res.send('category update post');
};

exports.category_detail = (req, res) => {
  res.send('category detail');
};
