import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";

export const notify = async (email) => {
  if (!validateEmail(email)) {
    console.log(`email: ${email} is not valid`);
    return;
  }

  // notify in slack someone has subscribed
  const slackToken1 = process.env.SLACK_TOKEN_1;
  const slackToken2 = process.env.SLACK_TOKEN_2;
  const slackToken3 = process.env.SLACK_TOKEN_3;
  fetch(
    `https://hooks.slack.com/services/${slackToken1}/${slackToken2}/${slackToken3}`,
    {
      method: "POST",
      body: JSON.stringify({
        text: `${email} has subscribed to the blog`,
      }),
      headers: {
        "Content-type": "application/json",
      },
    },
  ).then((r) => {});

  // insert into firebase document
  const subscriptionCollectionRef = await collection(db, "subscriptions");
  await addDoc(subscriptionCollectionRef, {
    email: email,
    subscribedAt: Timestamp.now(),
  });
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
