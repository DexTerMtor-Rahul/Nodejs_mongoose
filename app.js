const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//this step allows to call pug file from any where
//by giving the directory globally
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));

//used for passes a staic directory to use any where in file
//like using css from public folder in any where
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6669a73ca6070775b772f478')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotfound);

mongoConnect(() => {
  app.listen(3000);
});
