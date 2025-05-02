# 🎵 Plumpy Music - A Discord Music Bot

**TrustMusic** is a powerful and customizable Discord music bot built using [discord.js](https://discord.js.org/).  
It streams music from multiple sources like YouTube and Spotify, and is Lavalink-ready for high-performance audio.

---

## 🚀 Features

- 🎶 Music playback from YouTube, Spotify, and more  
- 🔁 Queue, skip, stop, shuffle, repeat  
- 🗳️ Vote-based skip (Premium Feature, Free on selfhost)  
- 📶 Lavalink integration  
- 🛠️ Easy configuration and self-hosting  
- 🧩 Modular and scalable codebase

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/akshtt-dev/PlumpyMusic.git
cd EchoBeats
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the bot

#### 🔧 `config.js`

```bash
cp config-default.js config.js
```

> Edit `config.js` to customize bot settings (lavalink node, emojis, etc.)

#### 🌐 `.env`

```bash
cp example.env .env
```

> Fill in the required environment variables such as your Discord bot token and Lavalink credentials.

---

## ⚙️ Running the Bot

### With Node.js

```bash
node index.js
```

Or with [PM2](https://pm2.io/):

```bash
pm2 start index.js --name Plumpy Music
```

---

## 🔄 Keeping Up-To-Date

To keep your custom changes safe while still pulling updates:

- Keep your changes in `config.js` and `.env` only.
- Pull updates regularly from the repository using:

```bash
git pull origin main
```

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

---

## 📩 Support

For issues, bugs, or suggestions, feel free to open an issue or join our Discord server: [Invite Link](https://discord.gg/689PYf8C8B)

Happy listening! 🎧
