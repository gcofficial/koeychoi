import { Router } from 'express';
import placeOrder from './orders/placeOrder';
import takeOrder from './orders/takeOrder';
import orderList from './orders/orderList';

const routes = Router();

async function launch(req, res, fn){
  try {
    res.status(200).send(await fn(req, res));
  } catch(e) {
    res.status(500).send(e.message);
  }
}

routes.post('/orders', (req, res) => launch(req, res, placeOrder));
routes.patch('/orders/:id', (req, res) => launch(req, res, takeOrder));
routes.get('/orders', (req, res) => launch(req, res, orderList));

export default routes;
