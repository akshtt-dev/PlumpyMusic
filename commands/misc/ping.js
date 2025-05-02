import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot to check if it's alive!"),

  run: async ({ interaction }) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      const ping = interaction.client.ws.ping;
      const embed = new EmbedBuilder()
        .setColor("White")
        .setDescription(`${config.emoji.ping} Pong! ${ping}ms`);
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `${config.emoji.error} An error occurred while pinging the bot.`
        );
      await interaction.editReply({
        embeds: [embed],
      });
    }
  },
};
