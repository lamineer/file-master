const apiRoutes = require('./api');
const authRoutes = require('./auth');
const authController = require('../controllers/authController');

module.exports = (app) => {
    app.get("/", (req, res) => res.send("Nohting to see here!"))
    app.use('/api', authController.checkAuth, apiRoutes);
    app.use('/auth', authRoutes);
}