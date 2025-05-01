import { ActivityType } from "discord.js";

export default (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity("Music", { type: ActivityType.Listening });

  client.lavashark.start(client.user.id);
};
