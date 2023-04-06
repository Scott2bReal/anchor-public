import * as crypto from "crypto"
import type { NextApiRequest } from "next";

function isRecentRequest(timestamp: string) {
  // Convert time to seconds to match timestamp
  const now = Math.floor(Date.now() / 1000)
  const requestAge = now - Number(timestamp)

  // 300 seconds === 5 minutes
  return requestAge < 300
}

export default function isValidSlackRequest(req: NextApiRequest) {
  // Process described here: https://api.slack.com/authentication/verifying-requests-from-slack
  const signingSecret = process.env.SLACKBOT_SIGNING_SECRET ?? ''

  // We want the request to be within the last 5 minutes
  if (!isRecentRequest) return false

  const {
    'x-slack-request-timestamp': timestamp,
    'x-slack-signature': signature,
  } = req.headers || {}

  if (!timestamp || !signature) return false

  const timestampString = Array.isArray(timestamp) && timestamp[0] ? timestamp[0] : ''

  // Slack docs tell us this will always be 'v0'
  const version = 'v0'

  // The body is automatically parsed into an object by Vercel
  // We need the raw body data from the request
  let rawBody = ''
  const result = req
    .setEncoding('utf-8')
    .on('data', (data) => {
      rawBody += data
    })
    .on('end', () => {
      const hmac = crypto
        .createHmac('sha256', signingSecret)
        .update(`${version}:${timestampString ?? timestamp}:${rawBody}`)
        .digest('hex')
      return `${version}=${hmac}` === signature
    })

  return result
}
