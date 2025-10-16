module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  // If request expects JSON, send JSON
  if (
    req.xhr ||
    (req.headers.accept && req.headers.accept.indexOf("application/json") > -1)
  ) {
    return res.status(status).json({ message: err.message || "Server Error" });
  }

  // Otherwise render an error view if available
  if (res.render) {
    return res
      .status(status)
      .render("error", { message: err.message || "Server Error" });
  }

  res.status(status).send(err.message || "Server Error");
};
