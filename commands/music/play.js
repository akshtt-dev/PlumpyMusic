import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option.setName("query").setDescription("The song to play").setRequired(true)
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
    const channel = member.voice?.channel;
    const track = interaction.options.getString("query");
    const source = interaction.options.getString("source") || "youtube";

    const embed = new EmbedBuilder();

    if (!channel) {
      embed.setDescription("❌ | You are not connected to a voice channel.");
      embed.setColor("Red");
      return interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const botChannel = guild.members.me.voice?.channel;

    // Fix: Handle deleted bot channel case
    if (botChannel && !guild.channels.cache.has(botChannel.id)) {
      // Disconnect the ghost player
      const ghostPlayer = interaction.client.lavashark.players.get(guild.id);
      if (ghostPlayer) await ghostPlayer.destroy();
    }

    if (botChannel && botChannel.id !== channel.id) {
      embed.setDescription("❌ | You are not in the same voice channel as me.");
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
      embed.setDescription("❌ | I can't join the voice channel.");
      embed.setColor("Red");
      return interaction.editReply({ embeds: [embed] });
    }

    if (res.loadType === "playlist") {
      player.addTracks(res.tracks, interaction.user);
      embed.setDescription(
        `Added \`${res.tracks.length}\` tracks from playlist \`${res.playlistInfo.name}\``
      );
      embed.setColor("Blurple");
      interaction.editReply({ embeds: [embed] });
    } else {
      const trackInfo = res.tracks[0];
      let thumbnail = "";

      if (source === "youtube" && trackInfo.uri.includes("v=")) {
        try {
          const videoId = new URL(trackInfo.uri).searchParams.get("v");
          thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        } catch {
          thumbnail = "";
        }
      }

      embed.setDescription(`🎵 Added \`${trackInfo.title}\``);
      embed.setColor("Blurple");
      if (thumbnail) embed.setThumbnail(thumbnail);
      embed.setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

      interaction.editReply({ embeds: [embed] });
      await player.addTracks(trackInfo, interaction.user);
    }

    if (!player.playing) await player.play();
  },
};
