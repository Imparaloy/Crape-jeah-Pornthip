
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Add your routes here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
