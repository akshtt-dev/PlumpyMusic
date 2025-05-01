import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song in the queue."),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    try {
      const player = interaction.client.lavashark.players.get(
        interaction.guild.id
      );
      const member = interaction.member;
      const channel = member.voice.channel;

      if (!channel) {
        const embed = new EmbedBuilder()
          .setDescription("❌ | You are not connected to an audio channel.")
          .setColor("Red");
        return await interaction.editReply({ embeds: [embed] });
      }

      if (
        interaction.guild.members.me.voice.channel &&
        member.voice.channelId !== interaction.guild.members.me.voice.channelId
      ) {
        const embed = new EmbedBuilder()
          .setDescription("❌ | You are not on the same audio channel as me.")
          .setColor("Red");
        return await interaction.editReply({ embeds: [embed] });
      }

      const embed = new EmbedBuilder();
      if (!player) {
        embed.setDescription("❌ | No player found for this guild.");
        embed.setColor("Red");
        return await interaction.editReply({ embeds: [embed] });
      }

      if (!player.current) {
        embed.setDescription("❌ | No track is currently playing.");
        embed.setColor("Red");
        return await interaction.editReply({ embeds: [embed] });
      }
      embed.setDescription(
        `${config.emoji.skip} | Skipping the current track...`
      );
      embed.setColor("Blurple");
      await player.skip(1);

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in skip command:", error);
      const embed = new EmbedBuilder()
        .setDescription("❌ | An error occurred while skipping the track.")
        .setColor("Red");
      return await interaction.editReply({ embeds: [embed] });
    }
  },
};
