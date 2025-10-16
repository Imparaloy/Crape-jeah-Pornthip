function render(template, data = {}) {
  return String(template).replace(/\{\s*([^\s{}]+)\s*\}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : "";
  });
}

module.exports = function tmpl(template, data) {
  if (arguments.length === 1) {
    return (ctx) => render(template, ctx);
  }
  return render(template, data);
};
