# ReplyCat 🐾  
**Your local, privacy-first email assistant**  
> TL;DR your thread. Choose a tone. Insert reply—all locally.

---

## 🚀 Why ReplyCat?

Most email assistants either:
- Auto-blast replies (like **LAMBDA**) with little control, or
- Require training on your inbox (like **Panza**), slowing you down.

**ReplyCat is different:**
- ⚡️ Instant setup—no training or archive scraping
- 💬 One-click TL;DR + 3 AI reply options
- 🔐 100% local inference using Ollama (Phi-3 / Zephyr)
- 🛡️ Gmail tokens stored in OS keychain (never touch frontend)
- 🌐 Works via a browser extension calling your local headless app

---

## 🔍 What Users Actually Want (from Reddit)

> “I feel that is the thing I primarily need rather than AI-generated emails.”  
→ ReplyCat starts with TL;DR, not blind drafts.

> “Does it learn which emails are really important?”  
→ You stay in control. We don’t overstep.

> “I totally get the privacy concern—it’s a big deal…”  
→ ReplyCat runs **entirely on-device**. No cloud APIs. No telemetry.

---

## 🛠️ V1 Core Features

- Setup Wizard: RAM check → Ollama install → Model fetch → Gmail login
- Thread viewer: Recent Gmail threads
- TL;DR: Short summary for each thread
- Reply Generator: 3 replies with tone presets (Friendly, Assertive, Formal)
- Insert as Draft: Sends reply via Gmail API, with quote and headers
- Offline mode: Still works without internet once Gmail auth + model are ready
- Light/Dark UI, keyboard shortcuts, full local crash log

---

## 🔄 Roadmap

- Chrome MV3 extension for Gmail overlay
- Auto-fallback model for low-RAM systems
- Streamed response rendering
- PII scrubber and mock mode for testing
- Outlook support

---

## 🧠 Built With

- **Tauri** (Rust backend)
- **React + Tailwind** (Frontend)
- **Ollama** (for LLM inference)
- **Gmail REST API**

---

## 📦 Local, Private, Fast

ReplyCat never sends your email to the cloud.  
No OpenAI, no Anthropic, no logging.  
It’s your inbox. Let’s keep it that way.

---

## 👋 Contributing

We’re open to contributions—especially around UI polish, extension injection, and low-RAM optimizations. Check `CONTRIBUTING.md` or raise an issue.

---
