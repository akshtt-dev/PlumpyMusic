import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the current music queue"),

  run: async ({ interaction }) => {
    try {
      await interaction.deferReply();

      const player = interaction.client.lavashark.players.get(
        interaction.guild.id
      );
      const embed = new EmbedBuilder();
      if (!player) {
        embed.setColor("Red");
        embed.setTitle(`${config.emoji.error} No active player found.`);
        return await interaction.editReply({ embeds: [embed] });
      }

      const queue = player.queue;

      if (!player.current) {
        embed.setColor("Red");
        embed.setTitle(`${config.emoji.error} The queue is currently empty.`);
        return await interaction.editReply({ embeds: [embed] });
      }

      const tracks = queue.tracks
        .map((track, index) => `${index + 1}. ${track.title}`)
        .join("\n");

      embed.setColor("Blurple");
      embed.addFields(
        {
          name: `${config.emoji.music} Now Playing`,
          value: `\`${player.current.title}\``,
        },
        {
          name: `${config.emoji.time} Duration`,
          value: `\`${player.current.duration.label}\``,
          inline: true,
        },
        {
          name: `${config.emoji.guitar} Requested by`,
          value: `\`${player.current.requester.username}\``,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: `${config.emoji.queue} Queue`,
          value: tracks || "No tracks in the queue.",
        }
      );
      embed.setFooter({
        text: `Total tracks: ${queue.tracks.length + 1}`,
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in queue command:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`${config.emoji.error} An error occurred.`)
        .setDescription("Please try again later.");
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
