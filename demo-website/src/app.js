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
app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
