const mongoose = require('mongoose');
const Menu = require('../models/menu');
const connectDB = require('../config/db');

const sampleMenus = [
  {
    name: 'Banana Nutella',
    description: 'Fresh banana with Nutella chocolate spread',
    price: 69,
    image: '/asset/images/banana-nutella.jpg',
    isRecommended: true,
    category: 'sweet'
  },
  {
    name: 'Classic Ham & Cheese',
    description: 'Premium ham with melted cheese',
    price: 79,
    image: '/asset/images/ham-cheese.jpg',
    isRecommended: true,
    category: 'savory'
  },
  {
    name: 'Strawberry Cream',
    description: 'Fresh strawberries with whipped cream',
    price: 89,
    image: '/asset/images/strawberry-cream.jpg',
    isRecommended: false,
    category: 'sweet'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    console.log('Clearing existing menus...');
    const deleteResult = await Menu.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing menus`);

    console.log('Adding sample menus...');
    const insertedMenus = await Menu.insertMany(sampleMenus);
    console.log(`Successfully added ${insertedMenus.length} menus`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to MongoDB. Is MongoDB running?');
    }
    process.exit(1);
  }
};

seedDatabase();