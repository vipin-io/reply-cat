# ReplyCat (MailCloak)

Local Gmail reply drafting with Ollama (Tauri + React)

## Prerequisites
- Node.js (v18+)
- pnpm
- Rust toolchain
- Ollama (with phi3:mini and stablelm-zephyr models installed)
- Google Cloud OAuth Desktop App credentials

## OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth Client ID (Desktop)
3. Set redirect URI to `http://localhost:<port>` (loopback)
4. Enable Gmail API
5. Download credentials and place in `.env` as needed

## Install & Run
```sh
pnpm install
pnpm tauri dev
```

## Scripts
- `dev`: Vite dev server
- `build`: Build frontend
- `tauri:dev`: Tauri dev
- `tauri:build`: Tauri build

## Mock Mode
Set `.env` variable `REPLYCAT_MOCK=1` to enable mock Gmail mode.

## License
MIT 