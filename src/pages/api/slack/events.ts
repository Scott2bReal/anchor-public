import type { NextApiRequest, NextApiResponse } from 'next'
import isValidSlackRequest from '../../../utils/slack/isValidSlackRequest'
import { greetingMessage } from '../../../utils/slack/messages'
import slackAPI from '../../../utils/slack/slackAPI'

type SlackEventType =
  | 'app_mention'
  | 'reaction_added'
  | 'reaction_removed'
  | 'member_joined_channel'
  | 'app_home_opened'
  | 'url_verification'

type SlackEvent = {
  type: SlackEventType
  event_ts: string
  user: string
}

type MemberJoinedEvent = SlackEvent & {
  channel_type: string
  channel: string
  team: string
  inviter: string
}

type ReactionEvent = SlackEvent & {
  reaction: string
  item_user: string
  item: {
    type: string
    channel: string
    ts: string
  }
}

export interface SlackEventPayload {
  token: string
  team_id: string
  api_app_id: string
  event: MemberJoinedEvent | ReactionEvent
  type: string
  challenge?: string
  authorizations: object[]
  event_context: string
  event_id: string
  event_time: number
}

export default async function events(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify request is legit from Slack to our bot
  if (isValidSlackRequest(req)) {

    const body = req.body as SlackEventPayload

    // Handle validation or bad requests
    if (!('type' in body)) {
      return res.status(400).send('Invalid request format')
    }

    if ('challenge' in body && body.type === 'url_verification') {
      const challenge = body.challenge
      return res.status(200).send(challenge)
    } else {

      // Event handlers
      if (body.event.type === 'member_joined_channel') {
        const event = body.event as MemberJoinedEvent

        // Send greeting to reminders channel
        // Channel check might be unecessary, but just to be sure!
        if (event.channel !== process.env.REMINDERS_CHANNEL_ID) {
          return res.status(200).send('')
        } else {
          const message = {
            channel: event.channel,
            text: greetingMessage(event.user)
          }

          await slackAPI('chat.postMessage', message)
          return res.status(200).send('')
        }
      } else {
        return res.status(200).send('')
      }
    }
  } else {
    // The request didn't pass the validity check
    return res.status(403).send('Unauthorize Request')
  }
}
