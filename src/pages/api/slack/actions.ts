import type { NextApiRequest, NextApiResponse } from "next";
import isValidSlackRequest from "../../../utils/slack/isValidSlackRequest";
import type { SlackEventPayload } from "./events";

export default function actions(req: NextApiRequest, res: NextApiResponse) {
  if (isValidSlackRequest(req)) {
    const body = req.body as SlackEventPayload

    if (!body) {
      return res.status(400).send('Invalid request format')
    }

    return res.status(200).send('')
  } else {
    return res.status(403).send('Unauthorized')
  }
}
