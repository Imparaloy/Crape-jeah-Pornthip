import mongoose from "mongoose";
import dotenv from "dotenv";
import Menu from "../models/Menu.js";

dotenv.config();

const dbUrl = process.env.DB_URL;

const menus = [
  {
    name: "Choco Corn Crunch Crepe",
    description: "Banana + Cornflakes + Nutella",
    price: 55,
    image: "img/Choco Corn Crunch Crepe.png",
    isRecommended: true,
    orderCount: 120,
  },
  {
    name: "Black Lemonade",
    description: "Chocolate + Blueberry + Whipped Cream",
    price: 60,
    image: "img/Black Lemonade.png",
    isRecommended: true,
    orderCount: 95,
  },
  {
    name: "Green Fire",
    description: "Matcha + Spicy Pork Floss + Chili Paste",
    price: 65,
    image: "img/Green Fire.png",
    isRecommended: true,
    orderCount: 80,
  },
  {
    name: "Oreo Cream Bomb",
    description: "Vanilla + Whipped Cream + Oreo",
    price: 55,
    image: "img/Oreo Cream Bomb.png",
    isRecommended: true,
    orderCount: 110,
  },
  {
    name: "Black Ruby",
    description: "Chocolate + Strawberry + Strawberry Jam",
    price: 65,
    image: "img/Black Ruby.png",
    isRecommended: true,
    orderCount: 90,
  },
  {
    name: "Green Grove",
    description: "Matcha + Banana + Condensed Milk",
    price: 55,
    image: "img/Green Grove.png",
    isRecommended: true,
    orderCount: 100,
  },
  {
    name: "Green and Meat",
    description: "Matcha + Ham + Sausage",
    price: 65,
    image: "img/Green and Meat.png",
    isRecommended: false,
    orderCount: 60,
  },
  {
    name: "Golden Sunshine",
    description: "Vanilla + Custard Ball + Sweetened Milk",
    price: 50,
    image: "img/Golden Sunshine.png",
    isRecommended: false,
    orderCount: 70,
  },
  {
    name: "Dark Blueberry Blast",
    description: "Chocolate + Whipped Cream + Strawberry Jam",
    price: 60,
    image: "img/Dark Blueberry Blast.png",
    isRecommended: false,
    orderCount: 55,
  },
  {
    name: "Oreo Sundae",
    description: "Vanilla + Whipped Cream + Oreo + Chocolate Sauce",
    price: 60,
    image: "img/Oreo Sundae.png",
    isRecommended: false,
    orderCount: 75,
  },
  {
    name: "Super Pizza Fest",
    description: "Mozzarella + Pizza Sauce + Cheese + Ham",
    price: 70,
    image: "img/Super Pizza Fest.png",
    isRecommended: false,
    orderCount: 50,
  },
  {
    name: "Black Hawaiian",
    description: "Chocolate + Crab Stick + Salad Vegetables",
    price: 65,
    image: "img/Black Hawaiian.png",
    isRecommended: false,
    orderCount: 40,
  },
];

async function seedMenus() {
  try {
    await mongoose.connect(dbUrl);
    await Menu.deleteMany({});
    await Menu.insertMany(menus);
    console.log("Menu seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedMenus();
