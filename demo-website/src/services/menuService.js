const Menu = require('../models/menu');

// Business logic for menus
const fetchAllMenus = async () => {
  return await Menu.find({ isAvailable: true });
};

const fetchRecommendedMenus = async () => {
  return await Menu.find({ isRecommended: true, isAvailable: true });
};

const createMenu = async (menuData) => {
  const menu = new Menu(menuData);
  await menu.save();
  return menu;
};

const updateMenu = async (id, menuData) => {
  return await Menu.findByIdAndUpdate(id, menuData, { new: true });
};

const deleteMenu = async (id) => {
  await Menu.findByIdAndDelete(id);
  return { message: 'Menu deleted successfully' };
};

module.exports = {
  fetchAllMenus,
  fetchRecommendedMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
