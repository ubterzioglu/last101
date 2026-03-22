import devuserListHandler from './devuser-list.js';

export default async function handler(req, res) {
  return devuserListHandler(req, res);
}
