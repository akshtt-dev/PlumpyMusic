import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import config from "../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Get the currently playing song"),
  run: async ({ interaction }) => {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const player = interaction.client.lavashark.players.get(
        interaction.guild.id
      );
      const embed = new EmbedBuilder();

      if (!player || !player.current) {
        embed.setDescription("❌ | No song is currently playing.");
        embed.setColor("Red");
        return interaction.editReply({ embeds: [embed] });
      }

      const track = player.current;
      const videoId = track.uri.split("v=")[1]?.split("&")[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      embed
        .setColor("Blurple")
        .setDescription(
          `${config.emoji.music} Currently playing \`${track.title}\``
        )
        .setThumbnail(thumbnailUrl)
        .addFields(
          {
            name: "Duration",
            value: track.isStream ? "Live" : track?.duration?.label,
            inline: true,
          },
          {
            name: "Requested by",
            value: `<@${track.requester.id}>`,
            inline: true,
          }
        )
        .setFooter({
          iconURL:
            track.requester?.avatarURL() ||
            "https://example.com/default-avatar.png",
          text: `Requested by ${track.requester?.tag || "Unknown"}`,
        });

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in nowplaying command:", error);
    }
  },
};
