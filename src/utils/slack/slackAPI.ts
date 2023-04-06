import type { RequestInit } from "next/dist/server/web/spec-extension/request";

export default async function slackAPI(endpoint: string, body?: object) {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.SLACKBOT_TOKEN ?? ''}`,
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    }
  }

  if (body !== undefined) {
    options.method = 'POST'
    options.body = JSON.stringify(body)
  }

  console.log(`Sending request to ${endpoint}`, JSON.stringify(options.body, null, 2))

  return fetch(`https://slack.com/api/${endpoint}`, options)
}
