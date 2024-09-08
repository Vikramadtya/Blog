export const notifySlack = (message) => {
  const slackToken1 = process.env.SLACK_TOKEN_1;
  const slackToken2 = process.env.SLACK_TOKEN_2;
  const slackToken3 = process.env.SLACK_TOKEN_3;
  fetch(
    `https://hooks.slack.com/services/${slackToken1}/${slackToken2}/${slackToken3}`,
    {
      method: "POST",
      body: JSON.stringify({
        text: message,
      }),
      headers: {
        "Content-type": "application/json",
      },
    },
  );
};
