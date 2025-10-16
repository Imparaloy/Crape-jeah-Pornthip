const fs = require('fs');
const path = require('path');

const tmplDir = path.resolve(__dirname, '../../node_modules/tmpl/lib');
const tmplFile = path.join(tmplDir, 'tmpl.js');
const sourceShim = path.resolve(__dirname, 'tmpl.js');

if (!fs.existsSync(tmplDir)) {
  fs.mkdirSync(tmplDir, { recursive: true });
}

if (!fs.existsSync(tmplFile)) {
  fs.copyFileSync(sourceShim, tmplFile);
}

const pureRandSource = path.resolve(__dirname, '../../node_modules/pure-rand');
const pureRandTarget = path.resolve(__dirname, '../../node_modules/jest-circus/node_modules/pure-rand');

const copyRecursive = (src, dest) => {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (fs.existsSync(pureRandSource) && !fs.existsSync(pureRandTarget)) {
  copyRecursive(pureRandSource, pureRandTarget);
}
