const express = require('express');
const path = require('path');
const app = express();

// ตั้งค่า static ให้ public
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('public'));

// ตั้งค่า view engine เป็น ejs
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// ตัวอย่าง route
app.get("/", (req, res) => {
  res.redirect("/orders");
});

// Order สมมุติ
app.get("/orders", (req, res) => {
  const allOrders = [
    { id: "001", time: "09:30", price: 127.23, base: "แป้งชาเขียว",
      ingredients: ["แยมบลูเบอร์รี่","ไส้กรอกไก่","แฮมไก่","ช็อคโกแลต"], status: "Served" },
    { id: "002", time: "09:30", price: 127.23, base: "แป้งชาเขียว",
      ingredients: ["แยมบลูเบอร์รี่","ไส้กรอกไก่","แฮมไก่","ช็อคโกแลต"], status: "Served" },
    { id: "003", time: "10:00", price: 89.5,  base: "แป้งวานิลลา",
      ingredients: ["สตรอเบอร์รี่","นูเทลล่า"], status: "In Process" },
    { id: "004", time: "10:15", price: 150,   base: "แป้งชาโคล",
      ingredients: ["กล้วย","คาราเมล","วิปครีม"], status: "In Process" },
  ];

  const total = allOrders.length;
  const inProcess = allOrders.filter(o => o.status === "In Process").length;
  const served = allOrders.filter(o => o.status === "Served").length;

  const status = (req.query.status || "all");
  let filtered;
  if (status === "in") {
    filtered = allOrders.filter(o => o.status === "In Process");
  } else if (status === "served") {
    filtered = allOrders.filter(o => o.status === "Served");
  } else {
    filtered = allOrders;
  }


  res.render("index", {
    isLogin: true,
    username: "Porntip",
    orders: filtered,
    counters: { total, inProcess, served },
    activeTab: status
  });
});

module.exports = app;
