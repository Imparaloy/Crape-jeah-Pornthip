const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const asyncHandler = require('../middlewares/asyncHandler');

// Get homepage with menus
router.get('/', asyncHandler(menuController.renderHome));

// API Routes
router.post('/api/menus', asyncHandler(menuController.createMenu));
router.get('/api/menus', asyncHandler(menuController.getMenus));
router.get('/api/menus/recommended', asyncHandler(menuController.getRecommendedMenus));
router.put('/api/menus/:id', asyncHandler(menuController.updateMenu));
router.delete('/api/menus/:id', asyncHandler(menuController.deleteMenu));

module.exports = router;