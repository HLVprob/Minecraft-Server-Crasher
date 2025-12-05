# 🚀 MCPwn - Minecraft Server Stress Tester

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

Advanced, high-performance Minecraft bot flooder designed for stability testing and finding server limits. Built with Node.js and Mineflayer.

> [!WARNING]
> **EDUCATIONAL USE ONLY.** This tool is designed for server owners to test their own infrastructure. Unsolicited stess testing or "DDoS" attacks are illegal. The author takes no responsibility for misuse.

## � Key Features

- **⚡ High-Speed Flooding** - Connects 50-100 bots per second using async/await batching
- **🤖 Smart AI Movement** - Bots look around, sprint, jump, and act like real players to bypass basic AFK checks
- **💥 Packet Spam Mode (Lag Machine)** - Sends excessive `arm_animation` and `offhand_swap` packets to maximize server CPU load
- **🛠️ Interactive CLI** - No code editing required! Configure IP, amount, and attack modes directly from the terminal
- **🛡️ Auto-Version Detection** - Automatically detects and adapts to the target server version (1.8 - 1.20+)
- **📊 Real-time Analytics** - Monitor successful connections, kicks, and errors live

## � Installation

Requires **Node.js 16+** installed.

```bash
# Clone the repo
git clone https://github.com/HLVprob/Minecraft-Server-Crasher.git

# Enter directory
cd mcpwn

# Install dependencies (only required once)
npm install
```

## 🎮 Usage

Simply run the tool and follow the on-screen prompts:

```bash
node index.js
```

### Configuration Prompts:
1. **Server IP**: `play.target.com` or `127.0.0.1:25565`
2. **Bot Count**: Recommended `100-300` for basic testing, `500+` for heavy load
3. **Random Movement**: `y` to enable AI wandering (uses more RAM)
4. **Packet Spam**: `y` to enable Lag Machine mode (uses more bandwidth/CPU)

## 🔧 Optimization Tips

| Setting | Recommendation | Effect |
|:---|:---|:---|
| **Bot Count** | `100-200` | Good for small server testing |
| **Bot Count** | `500+` | Extreme load test, requires 16GB+ RAM |
| **Packet Spam** | `Enable` | **CRITICAL HIT** to server TPS (Ticks Per Second) |
| **Movement** | `Enable` | Makes bots look real, harder to distinguish |

## 🧪 How It Works

This tool utilizes the `mineflayer` library to create lightweight Minecraft client instances. Unlike standard bots, these are stripped down for maximum performance:
- **No Rendering**: No GPU usage, purely protocol-based
- **Async Batching**: Spawns bots in "waves" to prevent your own PC from freezing
- **Event-Driven**: Only reacts to necessary server packets

## 📝 License

WTFPL (Do What The Fuck You Want Public License)
