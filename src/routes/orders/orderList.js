export default async function(req) {
  let { page, limit } = req.query;

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 0;

  let offset = page * limit - limit;

  return await req.db.orders.find({}).skip(offset).limit(limit).toArray()
}