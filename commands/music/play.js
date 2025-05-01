// TODO: Currently the play command only supports youtube, it gives an error if you try to play a soundcloud track. This is because it tries the split method on the uri which is not a youtube url. Fix this by checking if the uri is a youtube url before trying to split it. Also add support for soundcloud tracks.

import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song to play")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription("The source of the song")
        .addChoices(
          { name: "YouTube", value: "youtube" },
          { name: "SoundCloud", value: "soundcloud" }
        )
        .setRequired(false)
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const guild = interaction.guild;
    const member = interaction.member;
    const channel = member.voice.channel;
    const track = interaction.options.getString("query");
    const source = interaction.options.getString("source") || "youtube";

    const embed = new EmbedBuilder();

    if (!channel) {
      embed.setDescription("❌ | You are not connected to an audio channel.");
      embed.setColor("Red");
      return interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      guild.members.me.voice.channel &&
      member.voice.channelId !== guild.members.me.voice.channelId
    ) {
      embed.setDescription("❌ | You are not on the same audio channel as me.");
      embed.setColor("Red");
      return interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const res = await interaction.client.lavashark.search(track, source);

    if (res.loadType === "error") {
      embed.setDescription("❌ | An error occurred while searching.");
      embed.setColor("Red");
      console.log(`Search Error: ${res}`);
      return interaction.editReply({ embeds: [embed] });
    } else if (res.loadType === "empty") {
      embed.setDescription("❌ | No matches found.");
      embed.setColor("Red");
      console.log(`Search Error: No matches (empty)`);
      return interaction.editReply({ embeds: [embed] });
    }

    const player = interaction.client.lavashark.createPlayer({
      guildId: guild.id,
      voiceChannelId: channel.id,
      textChannelId: interaction.channel.id,
      selfDeaf: true,
    });

    try {
      await player.connect();
    } catch (error) {
      console.log(error);
      embed.setDescription("❌ | I can't join voice channel.");
      embed.setColor("Red");
      return interaction.editReply({
        embeds: [embed],
      });
    }

    if (res.loadType === "playlist") {
      player.addTracks(res.tracks, interaction.user);
      embed.setDescription(
        `Added \`${res.tracks.length}\` tracks from playlist \`${res.playlistInfo.name}\``
      );
      embed.setColor("Blurple");
      interaction.editReply({ embeds: [embed] });
    } else {
      embed.setDescription(`Added \`${res.tracks[0].title}\``);
      embed.setColor("Blurple");
      embed.setThumbnail(
        `https://img.youtube.com/vi/${
          res.tracks[0].uri.split("v=")[1].split("&")[0]
        }/maxresdefault.jpg`
      );
      embed.setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });
      interaction.editReply({ embeds: [embed] });
      await player.addTracks(res.tracks[0], interaction.user);
    }

    if (!player.playing) await player.play();
  },
};
