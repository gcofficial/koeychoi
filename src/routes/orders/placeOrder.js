import rp from 'request-promise';
import qs from 'query-string';
import { get } from 'lodash';

export default async function(req) {
  const { origin, destination } = req.body;
  const { APP_ID, APP_CODE } = process.env;

  validateParam(origin);
  validateParam(destination);

  const query_arguments = qs.stringify({
    "waypoint0": origin.join(','),
    "waypoint1": destination.join(','),
    mode: 'fastest;car;traffic:enabled',
    app_id: APP_ID,
    app_code: APP_CODE
  });

  const query_string = `https://route.api.here.com/routing/7.2/calculateroute.json?${ query_arguments }`;

  const response = await rp({
    method: 'POST',
    uri: query_string,
    json: true
  });

  const data = {
    distance: get(response, 'response.route.0.summary.distance', 0),
    status: 'UNASSIGNED'
  };

  await req.db.orders.insertOne(data);

  return {
    id: data._id,
    distance: data.distance,
    status: data.status
  };
}


function validateParam(param) {
  if (!(param instanceof Array) || param.length != 2) {
    throw new Error('Invalid param! Param: ' + JSON.stringify(param));
  }

  const dictionary = ['lat', 'lng'];
  param.forEach(
    (v, index) => {
      v = parseFloat(v);
      if (isNaN(v) || v <= 0) {
        throw new Error(`Invalid ${ dictionary[index] } (${ v })!`);
      }
    }
  );
}
