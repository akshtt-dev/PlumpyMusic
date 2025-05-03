import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot's invite link."),

  run: async ({ interaction }) => {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=20237376&integration_type=0&scope=applications.commands+bot`;
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Invite Me!")
      .setDescription(
        `You can invite me to your server using the link below:\n\n**[Invite Me](${inviteLink})**`
      )
      .setFooter({
        text: "Thank you for considering inviting me!",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();
    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
