// TODO: Add permissions check to make sure the bot can connect to the voice channel, also check if the bot is already in a voice channel and not playing anything

import { MessageFlags, SlashCommandBuilder } from "discord.js";
export default {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join the voice channel you are in."),
  run: async ({ interaction }) => {
    await interaction.deferReply();

    const { member, guild } = interaction;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply(
        "You need to be in a voice channel to use this command."
      );
    }

    if (guild.members.me.voice.channel) {
      if (guild.members.me.voice.channel.id !== voiceChannel.id) {
        return interaction.editReply(
          "I am already in a voice channel. Please use `/disconnect` to make me leave."
        );
      }
    }

    const player = interaction.client.lavashark.createPlayer({
      guildId: guild.id,
      voiceChannelId: voiceChannel.id,
      textChannelId: interaction.channel.id,
      selfDeaf: true,
    });

    await player.connect().catch((err) => {
      console.error(err);
      return interaction.editReply(
        "There was an error connecting to the voice channel."
      );
    });

    await interaction.editReply(`Joined **${voiceChannel.name}**!`, {
      flags: MessageFlags.Ephemeral,
    });
  },
};
