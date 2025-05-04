import {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  MessageFlags,
} from "discord.js";
import GuildConfig from "../../models/guildConfig.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("stay-connected")
    .setDescription(
      "Keep the bot connected to the voice channel even when no one is in it. (Premium only)"
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable the stay connected feature.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    try {
      const enabled = interaction.options.getBoolean("enabled");
      const guildId = interaction.guild.id;
      const guildConfig = await GuildConfig.findOne({ guildId });
      const nonPremiumEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Premium Feature")
        .setDescription(
          "**This is a premium only feature.**\n\nPlease upgrade your plan to use this feature.\n**Run `/premium` to see the available plans.**"
        );

      if (!guildConfig) {
        await GuildConfig.create({
          guildId,
          stayConnected: enabled,
          premium: false,
        });
        return interaction.editReply({ embeds: [nonPremiumEmbed] }); //No config found, so we create one with the new setting and it also means the user is not premium
      }
      if (config.premiumCmds.stayConnected) {
        if (!guildConfig.premium) {
          return interaction.editReply({ embeds: [nonPremiumEmbed] });
        }
      }

      if (guildConfig.stayConnected === enabled) {
        const alreadySetEmbed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `The stay connected feature is already **${
              enabled ? "enabled" : "disabled"
            }** for this server.`
          );
        return interaction.editReply({ embeds: [alreadySetEmbed] });
      }

      guildConfig.stayConnected = enabled;
      await guildConfig.save();
      const embed = new EmbedBuilder()
        .setColor("White")
        .setDescription(
          `The stay connected feature has been **${
            enabled ? "enabled" : "disabled"
          }** for this server.`
        )
        .setFooter({
          text: "Requested by " + interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error in keep-connected.js:", error);
      await interaction.editReply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
