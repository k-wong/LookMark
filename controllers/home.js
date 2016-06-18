

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * GET /
 * Home page.
 */
exports.map = (req, res) => {
  res.render('map', {
    title: 'Map'
  });
};