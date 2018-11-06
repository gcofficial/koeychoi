import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes/';
import { MongoClient } from 'mongodb';

const { MONGO, DB_NAME } = process.env;

const app = express();
app.disable('x-powered-by');

// Mongo
let db = {};
MongoClient.connect(
  MONGO,
  { useNewUrlParser: true }
).then(
  client => {
    db = client.db(DB_NAME);
  }
)

app.use((req, res, next) => {
  db.orders = db.collection('orders');
  req.db = db;
  next();
})

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
