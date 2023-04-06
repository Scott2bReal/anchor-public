import type {
  CampWeek,
  Climber,
  ClimbingSession,
  Gym,
  Offer,
  User,
} from "@prisma/client";
import { formatCampWeekDates } from "../formatCampWeekDates";

interface SlackOfferMessageProps {
  offer: Offer & {
    climber: Climber;
    user: User;
  };
}

const remindersChannel = process.env.REMINDERS_CHANNEL_ID;
const projectsChannel = process.env.PROJECTS_CHANNEL_ID;
const backupInstructions = process.env.BACKUP_INSTRUCTIONS;
const sydney = process.env.SYDNEY_DMS;
const youthAndSupportTeamChannel =
  process.env.YOUTH_AND_SUPPORT_TEAM_CHANNEL_ID;

export function slackOfferMessage({ offer }: SlackOfferMessageProps) {
  return {
    channel: remindersChannel ?? "",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${offer.user.name ?? "Someone"}'s offer to ${
            offer.climber.name
          }: <${offer.zendeskTicket} | View Ticket>`,
        },
      },
    ],
  };
}

export function greetingMessage(userId: string) {
  return `Hi <@${userId}>! I'll be posting reminders about any expired youth offers in the channel at the start of each of your shifts. You can drop an emoji on each of those messages when you've dealt with that offer.`;
}

export const expiredOffersHeader = {
  channel: remindersChannel ?? "",
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Expired Offers",
        emoji: true,
      },
    },
  ],
};

export function sydneyCampAlert(
  campWeek: CampWeek & {
    gym: Gym;
    climbers: Climber[];
  }
) {
  return {
    channel: sydney ?? "",
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `Beep boop! Camp week ${
            campWeek.weekNumber
          } (${formatCampWeekDates(campWeek)}) at ${
            campWeek.gym.name
          } has filled up! Please mark that week as full on the website when you get a chance`,
        },
      },
    ],
  };
}

export function campFullMessage(
  campWeek: CampWeek & {
    gym: Gym;
    climbers: Climber[];
  }
) {
  return {
    channel: youthAndSupportTeamChannel ?? "",
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `Beep boop! Camp week ${
            campWeek.weekNumber
          } (${formatCampWeekDates(campWeek, true)}) at ${
            campWeek.gym.name
          } is now full!`,
        },
      },
    ],
  };
}

export const backupReminder = (climbingSession: ClimbingSession) => {
  return {
    channel: projectsChannel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `It looks like we just switched to a new session! Please remember to back up the *${
            climbingSession.name
          } ${climbingSession.year}* session data following <${
            backupInstructions ?? ""
          }|these> instructions, and emoji this message once you've finished. BEEP BOOP :robot_face:`,
        },
      },
    ],
  };
};
