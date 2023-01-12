import { NextApiRequest, NextApiResponse } from "next";
import isValidSlackRequest from "../../../utils/slack/isValidSlackRequest";

export default function actions(req: NextApiRequest, res: NextApiResponse) {
  if (isValidSlackRequest(req)) {
    if (!req.body || !req.body.payload) {
      return res.status(400).send('Invalid request format')
    }

    return res.status(200).send('')
  } else {
    return res.status(403).send('Unauthorized')
  }
}
