import {
  SlashCommandBuilder,
  MessageFlags,
  PermissionsBitField,
  EmbedBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects the bot from the voice channel."),

  run: async ({ interaction }) => {
    const { member, guild } = interaction;
    const voiceChannel = member.voice.channel;
    await interaction.deferReply();

    try {
      const embed = new EmbedBuilder();
      embed.setColor("Red");
      if (!voiceChannel) {
        embed.setDescription(
          "You need to be in a voice channel to use this command."
        );
        return interaction.editReply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (voiceChannel.id !== interaction.guild.members.me.voice.channelId) {
        embed.setDescription(
          "You need to be in the same voice channel as me to use this command."
        );
        return interaction.editReply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (
        !voiceChannel
          .permissionsFor(interaction.client.user)
          .has(PermissionsBitField.Flags.Connect) ||
        !voiceChannel
          .permissionsFor(interaction.client.user)
          .has(PermissionsBitField.Flags.Speak)
      ) {
        embed.setDescription(
          "I don't have permission to connect to this voice channel."
        );
        return interaction.editReply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const player = interaction.client.lavashark.getPlayer(guild.id);
      if (!player) {
        embed.setDescription("I am not connected to any voice channel.");
        return interaction.editReply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      await player.destroy(guild.id);

      embed.setColor("White");
      embed.setDescription(`Disconnected from **${voiceChannel.name}**`);
      embed.setFooter({
        text: "Requested by " + member.user.username,
        iconURL: member.user.displayAvatarURL(),
      });
      await interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error in disconnect command:", error);
      const embed = new EmbedBuilder();
      embed.setColor("Red");
      embed.setDescription(
        "An error occurred while trying to disconnect. Please try again later."
      );
      await interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
