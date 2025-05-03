import { EmbedBuilder, MessageFlags } from "discord.js";
import config from "../../config.js";

const miscCommands = [
  {
    name: "help",
    description: "Shows this help menu.",
  },
  {
    name: "ping",
    description: "Check if the bot is alive.",
  },
  {
    name: "invite",
    description: "Get the bot's invite link.",
  },
];

export default async (interaction) => {
  try {
    if (
      !interaction.isStringSelectMenu() ||
      interaction.customId !== "help-menu"
    )
      return;

    let selectedCommands;
    let categoryTitle;
    let thumbnail = interaction.client.user.displayAvatarURL();
    switch (interaction.values[0]) {
      case "misc":
        selectedCommands = miscCommands;
        categoryTitle = `${config.emoji.misc} Miscellaneous Commands`;
        break;
      default:
        return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(thumbnail)
      .setColor("White")
      .setTitle(categoryTitle)
      .addFields(
        selectedCommands.map((cmd) => ({
          name: `\`/${cmd.name}\``,
          value: cmd.description,
          inline: false,
        }))
      );

    await interaction.update({ embeds: [embed] });
  } catch (error) {
    console.error("Error in helpSelect.js:", error);
    await interaction.reply({
      content: "An error occurred while processing your request.",
      flags: MessageFlags.Ephemeral,
    });
  }
};

export { miscCommands };
