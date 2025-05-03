import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { CommandKit } from "commandkit";
import { fileURLToPath } from "url";
import path from "path";
import { LavaShark } from "lavashark";
import dotenv from "dotenv";
import config from "./config.js";
import mongoose from "mongoose";
import GuildConfig from "./models/guildConfig.js";
dotenv.config();

// Connect to MongoDB
await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Instance.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

new CommandKit({
  client,
  commandsPath: path.join(__dirname, "commands"),
  eventsPath: path.join(__dirname, "events"),
  devUserIds: config.devUserIds,
  devGuildIds: config.devGuildIds,
  bulkRegister: true,
});

const lavashark = new LavaShark({
  nodes: config.nodes,
  sendWS: (guildId, payload) => {
    client.guilds.cache.get(guildId)?.shard.send(payload);
  },
});

client.lavashark = lavashark;

// -- LavaShark events --
client.lavashark.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannelId);

  if (!channel) return;

  const videoId = track.uri.split("v=")[1]?.split("&")[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const requesterAvatar =
    track.requester?.avatarURL() || "https://example.com/default-avatar.png";

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setDescription(`${config.emoji.music} Now playing \`${track.title}\``)
    .setThumbnail(thumbnailUrl)
    .setFooter({
      iconURL: requesterAvatar,
      text: `Requested by ${track.requester?.tag || "Unknown"}`,
    })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

client.lavashark.on("queueEnd", async (player) => {
  const channel = client.channels.cache.get(player.textChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setDescription(`${config.emoji.sad} Queue ended`)
    .setTimestamp();
  channel.send({ embeds: [embed] });

  try {
    const guildConfig = await GuildConfig.findOne({
      guildId: player.guildId,
    });

    if (!guildConfig || !guildConfig.stayConnected) {
      player.destroy();
    }
  } catch (err) {
    console.error("Error in queueEnd:", err);
  }
});

client.lavashark.on("error", (node, err) => {
  console.error("[LavaShark]", `Error on node ${node.identifier}`, err.message);
});

client.on("raw", (packet) => client.lavashark.handleVoiceUpdate(packet));

client.login(process.env.DISCORD_BOT_TOKEN);
