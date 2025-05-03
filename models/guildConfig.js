import mongoose from "mongoose";

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  stayConnected: {
    type: Boolean,
    default: false,
  },
  premium: {
    type: Boolean,
    default: false,
  },
});

const GuildConfig = mongoose.model("GuildConfig", guildConfigSchema);

export default GuildConfig;
