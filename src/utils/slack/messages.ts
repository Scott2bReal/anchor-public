import { Climber, Offer, User } from "@prisma/client";

interface SlackOfferMessageProps {
  offer: (Offer & {
    climber: Climber,
    user: User,
  })
}

const channel = process.env.REMINDERS_CHANNEL_ID

export function slackOfferMessage({ offer }: SlackOfferMessageProps) {

  return {
    channel: channel ?? '',
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${offer.user.name}'s offer to ${offer.climber.name}: <${offer.zendeskTicket} | View Ticket>`
        }
      }
    ]
  }
}

export function greetingMessage(userId: string) {
  return `Hi <@${userId}>! I'll be posting reminders about any expired youth offers in the channel at the start of each of your shifts. You can drop an emoji on each of those messages when you've dealt with that offer.`
}

export const expiredOffersHeader = {
  channel: channel ?? '',
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Expired Offers",
        emoji: true
      }
    },
  ]
}
