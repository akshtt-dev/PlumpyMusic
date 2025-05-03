import {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
} from "discord.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows the help menu."),
  run: async ({ interaction }) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help-menu")
      .setPlaceholder("Select a category")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Misc")
          .setDescription("See a list of miscellaneous commands")
          .setValue("misc")
          .setEmoji(config.emoji.misc),
        new StringSelectMenuOptionBuilder()
          .setLabel("Music")
          .setDescription("See a list of music commands")
          .setValue("music")
          .setEmoji(config.emoji.music),
        new StringSelectMenuOptionBuilder()
          .setLabel("Settings")
          .setDescription("See a list of settings commands")
          .setValue("settings")
          .setEmoji(config.emoji.settings)
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setColor("White")
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(
        `Hello, I am **${interaction.client.user.username}**!\n\nI am here to assist you with various commands. Please select a category from the dropdown menu below to see the available commands.\n\n**Support Server**: **[Join](${config.supportGuildLink})**`
      )
      .setFooter({
        text: "Use the command `/help` to see this message again.",
      });

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};
