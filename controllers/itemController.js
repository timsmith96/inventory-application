const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.item_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Item list');
};

exports.item_create_get = (req, res) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log('error');
        return next(err);
      }
      // Successful, so render
      res.render('item_form', {
        title: 'New item form',
        categories: results.categories,
      });
    }
  );
};

exports.item_create_post = [
  body('name', 'name must not be empty please').isLength({ min: 1 }),
  body('description', 'description must not be empty please').isLength({
    min: 1,
  }),
  body('price', 'price must not be empty please').isLength({
    min: 1,
  }),
  body('number_in_stock', 'number in stock must not be empty please').isLength({
    min: 1,
  }),
  (req, res, next) => {
    const categories = Category.find({}).exec();
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('item_form', {
            title: 'New item form',
            errors: errors.array(),
            categories: results.categories,
          });
        }
      );
      return;
    }

    item.save((err) => {
      if (err) {
        console.log(req.body);
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_delete_post = (req, res) => {
  async.parallel({}, (err, results) => {
    if (err) {
      return next(err);
    }
    Item.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
};

exports.item_update_get = (req, res) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
      itemCategory(callback) {
        Item.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log('error');
        return next(err);
      }
      // Successful, so render
      res.render('item_update_form', {
        title: 'Edit item form',
        item: results.item,
        categories: results.categories,
        itemCategory: results.itemCategory.category,
      });
    }
  );
};

exports.item_update_post = [
  body('name', 'item name is required please').isLength({ min: 1 }),
  body('description', 'item description is required please').isLength({
    min: 1,
  }),
  body('price', 'item price is required please').isLength({ min: 1 }),
  body('number_in_stock', 'item stock number is required please').isLength({
    min: 1,
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          item(callback) {
            Item.findById(req.params.id).exec(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
          itemCategory(callback) {
            Item.findById(req.params.id).populate('category').exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('item_update_form', {
            title: 'Edit item form',
            item: results.item,
            categories: results.categories,
            itemCategory: results.itemCategory.category,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
      if (err) {
        return next(err);
      }
      res.redirect(theitem.url);
    });
  },
];

exports.item_detail = (req, res) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      category(callback) {
        Item.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      res.render('item_detail', {
        title: results.item.name,
        item: results.item,
        category: results.category.category,
      });
    }
  );
};
