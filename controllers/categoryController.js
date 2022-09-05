const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

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
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log('error');
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
        title: results.category.name,
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  async.parallel({}, (err, results) => {
    if (err) {
      console.log('error');
      return next(err);
    }
    // Successful, so render
    res.render('category_form', {
      title: 'New category form',
    });
  });
};

exports.category_create_post = [
  // Validate and sanitize the name field.
  body('name', 'category name required please').isLength({ min: 1 }),
  body('description', 'category description required please').isLength({
    min: 1,
  }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'New category form',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }
        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page
            res.redirect('/');
          });
        }
      });
    }
  },
];

exports.category_delete_post = (req, res) => {
  async.parallel({}, (err, results) => {
    if (err) {
      return next(err);
    }
    Category.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
};

exports.category_update_get = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render('category_update_form', {
        title: 'Edit category form',
        category: results.category,
      });
    }
  );
};

exports.category_update_post = [
  body('name', 'name is required please').isLength({ min: 1 }),
  body('description', 'description is required please').isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          category(callback) {
            Category.findById(req.params.id).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Successful, so render
          res.render('category_update_form', {
            title: 'Edit category form',
            category: results.category,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    Category.findByIdAndUpdate(
      req.params.id,
      category,
      {},
      (err, thecategory) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.redirect(thecategory.url);
      }
    );
  },
];
