const menuService = require('../services/menuService');

// Thin controllers: handle req/res and delegate business logic to services
const renderHome = async (req, res, next) => {
  try {
    const menus = await menuService.fetchAllMenus();
    const recommendedMenus = await menuService.fetchRecommendedMenus();
    res.render('index', { menus, recommendedMenus, cart: [] });
  } catch (err) {
    next(err);
  }
};

const createMenu = async (req, res, next) => {
  try {
    const menu = await menuService.createMenu(req.body);
    res.status(201).json(menu);
  } catch (err) {
    next(err);
  }
};

const getMenus = async (req, res, next) => {
  try {
    const menus = await menuService.fetchAllMenus();
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

const getRecommendedMenus = async (req, res, next) => {
  try {
    const menus = await menuService.fetchRecommendedMenus();
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const menu = await menuService.updateMenu(req.params.id, req.body);
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const result = await menuService.deleteMenu(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderHome,
  createMenu,
  getMenus,
  getRecommendedMenus,
  updateMenu,
  deleteMenu,
};