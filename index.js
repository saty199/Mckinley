require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = process.env.PORT || 4000;
const passport = require('passport');
const DB = `mongodb://localhost:27017/Mckinley`;
const mongoose = Promise.promisifyAll(require("mongoose"));
require('util').inspect.defaultOptions.depth = null
const path = require('path');

const Routes = require('./controller');

mongoose.set('useCreateIndex', true);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (res)
    return console.log("----------------->> MongoDB Connected! <<-----------------")
  else
    return console.log("----------------> MongoDB Not Connected! <<---------------")
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ 'limit': '100mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(session({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
}));


app.use('/api', Routes);

app.listen(port, () => console.info(`----->> SERVER RUNNING ON PORT ${port} ON ${process.env.NODE_ENV} <<-----`)); 