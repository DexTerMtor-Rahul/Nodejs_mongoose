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
const mongoose = require('mongoose');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));

//used for passes a staic directory to use any where in file
//like using css from public folder in any where
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('666b1e2503f7ba2b54f3e416')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotfound);

mongoose
  .connect(
    'mongodb+srv://dextermtor:dextermtor@cluster0.0m4h3tp.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Rahul',
          email: 'rahul@gmail.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
