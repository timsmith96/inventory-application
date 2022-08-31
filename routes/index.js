var express = require('express');
var router = express.Router();

// Require controller modules
const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

/// CATEGORY ROUTES ///

// GET home page - shows all the categories
router.get('/', category_controller.index);

// GET request for creating a category
router.get('/categories/create', category_controller.category_create_get);

// POST request for creating a category
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

/// ITEM ROUTES ///

// GET request for creating an item
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an item
router.post('/item/create', item_controller.item_create_post);

// GET request to delete item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update item
router.get('/item/:id/update', item_controller.item_update_post);

// GET request for one item
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all items
router.get('/items', item_controller.item_list);

module.exports = router;
