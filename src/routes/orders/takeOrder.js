import { ObjectID } from 'mongodb';

export default async function(req) {
  const { id } = req.params;
  const { status } = req.body;

  const order = await req.db.orders.findOne({ _id: new ObjectID(id) });

  if (order.status === 'TAKEN') {
    throw new Error('ORDER_ALREADY_BEEN_TAKEN');
  }
  await req.db.orders.updateOne({ _id: order._id }, { '$set': { status: status }})

  return 'updated';
}