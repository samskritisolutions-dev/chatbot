/**
 * AI Chatbot SaaS — Embeddable Widget
 * Usage: <script src="https://yourdomain.com/widget.js" data-bot-id="YOUR_BOT_UID" defer></script>
 */
(function () {
  "use strict";

  const BASE_URL = "https://api.samskritisolutions.com/api";
  const botId = document.currentScript?.getAttribute("data-bot-id");

  if (!botId) {
    console.warn("[ChatBot] Missing data-bot-id attribute");
    return;
  }

  // Session persistence
  let sessionId = localStorage.getItem("_cb_sid");
  if (!sessionId) {
    sessionId = "xxxx-xxxx-xxxx".replace(
      /x/g,
      () => Math.random().toString(36)[2],
    );
    localStorage.setItem("_cb_sid", sessionId);
  }

  let cfg = {};
  let open = false;
  let msgs = [];
  let taken = false; // human agent took over

  // ── Fetch bot config ─────────────────────────────────────────────────────
  fetch(`${BASE_URL}/widget/${botId}/config`)
    .then((r) => r.json())
    .then((data) => {
      cfg = data;
      init();
    })
    .catch(() => console.warn("[ChatBot] Could not load bot config"));

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    renderBubble();
    renderWindow();
    loadHistory();
    connectPusher();
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  function injectStyles() {
    const s = document.createElement("style");
    s.textContent = `
      #_cb-wrap { font-family: ${cfg.font_family || "Inter, sans-serif"}; }
      #_cb-bubble {
        position: fixed; ${cfg.position === "bottom-left" ? "left" : "right"}: 24px;
        bottom: 24px; width: 56px; height: 56px; border-radius: 50%;
        background: ${cfg.widget_color || "#0EA5E9"}; cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,.25); z-index: 2147483646;
        display: flex; align-items: center; justify-content: center;
        transition: transform .2s, box-shadow .2s;
      }
      #_cb-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,.3); }
      #_cb-bubble svg { width: 26px; height: 26px; fill: #fff; }
      #_cb-window {
        position: fixed; ${cfg.position === "bottom-left" ? "left" : "right"}: 20px;
        bottom: 92px; width: 360px; max-height: 520px;
        background: #fff; border-radius: 16px;
        box-shadow: 0 12px 48px rgba(0,0,0,.18);
        z-index: 2147483645; display: none; flex-direction: column; overflow: hidden;
      }
      #_cb-header {
        background: ${cfg.widget_color || "#0EA5E9"};
        padding: 16px 20px; display: flex; align-items: center; gap: 12px; color: #fff;
      }
      #_cb-avatar {
        width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.3);
        display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px;
      }
      #_cb-msgs {
        flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
      }
      .cb-msg {
        max-width: 82%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5;
        word-break: break-word;
      }
      .cb-msg.user { background: ${cfg.widget_color || "#0EA5E9"}; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      .cb-msg.bot  { background: #f1f5f9; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 4px; }
      .cb-msg.agent { background: #7c3aed; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      .cb-typing   { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
      .cb-typing span { width: 7px; height: 7px; background: #94a3b8; border-radius: 50%; animation: cbBounce 1.2s infinite; }
      .cb-typing span:nth-child(2) { animation-delay: .2s; }
      .cb-typing span:nth-child(3) { animation-delay: .4s; }
      @keyframes cbBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      #_cb-footer { padding: 12px 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; }
      #_cb-input {
        flex: 1; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 12px;
        font-size: 13px; outline: none; transition: border-color .2s;
      }
      #_cb-input:focus { border-color: ${cfg.widget_color || "#0EA5E9"}; }
      #_cb-send {
        background: ${cfg.widget_color || "#0EA5E9"}; border: none; border-radius: 10px;
        padding: 8px 14px; cursor: pointer; color: #fff; font-size: 13px; font-weight: 600; transition: opacity .2s;
      }
      #_cb-send:hover { opacity: .88; }
      #_cb-branding { text-align: center; font-size: 10px; color: #94a3b8; padding: 6px; }
    `;
    document.head.appendChild(s);
  }

  // ── Bubble ────────────────────────────────────────────────────────────────
  function renderBubble() {
    const wrap = document.createElement("div");
    wrap.id = "_cb-wrap";

    const bubble = document.createElement("div");
    bubble.id = "_cb-bubble";
    bubble.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
    bubble.onclick = toggle;

    wrap.appendChild(bubble);
    document.body.appendChild(wrap);
  }

  // ── Chat window ───────────────────────────────────────────────────────────
  function renderWindow() {
    const win = document.createElement("div");
    win.id = "_cb-window";
    win.innerHTML = `
      <div id="_cb-header">
        <div id="_cb-avatar">${(cfg.bot_name || "AI")[0].toUpperCase()}</div>
        <div>
          <div style="font-weight:700;font-size:15px">${cfg.bot_name || "AI Assistant"}</div>
          <div style="font-size:11px;opacity:.8">Online — typically replies instantly</div>
        </div>
      </div>
      <div id="_cb-msgs"></div>
      <div id="_cb-footer">
        <input id="_cb-input" placeholder="Type a message..." />
        <button id="_cb-send">Send</button>
      </div>
      <div id="_cb-branding">Powered by AI Chatbot SaaS</div>
    `;

    document.getElementById("_cb-wrap")?.appendChild(win);

    document.getElementById("_cb-send")?.addEventListener("click", sendMessage);
    document.getElementById("_cb-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    addMessage("bot", cfg.welcome_msg || "Hi! How can I help you today?");
  }

  // ── Messages ──────────────────────────────────────────────────────────────
  function addMessage(role, text) {
    const msgs = document.getElementById("_cb-msgs");
    if (!msgs) return;
    const div = document.createElement("div");
    div.className = `cb-msg ${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const msgs = document.getElementById("_cb-msgs");
    const typing = document.createElement("div");
    typing.className = "cb-typing";
    typing.id = "_cb-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    msgs?.appendChild(typing);
    msgs && (msgs.scrollTop = msgs.scrollHeight);
  }

  function removeTyping() {
    document.getElementById("_cb-typing")?.remove();
  }

  // ── Send message ──────────────────────────────────────────────────────────
  function sendMessage() {
    const input = document.getElementById("_cb-input");
    const text = input?.value?.trim();
    if (!text) return;
    input.value = "";
    addMessage("user", text);
    showTyping();

    fetch(`${BASE_URL}/widget/${botId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message: text }),
    })
      .then((r) => r.json())
      .then((data) => {
        removeTyping();
        addMessage("bot", data.reply);
      })
      .catch(() => {
        removeTyping();
        addMessage("bot", cfg.fallback_msg || "Something went wrong.");
      });
  }

  // ── Load history ──────────────────────────────────────────────────────────
  function loadHistory() {
    fetch(`${BASE_URL}/widget/${botId}/history?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const msgs = document.getElementById("_cb-msgs");
          if (msgs) msgs.innerHTML = "";
          data.forEach((m) =>
            addMessage(m.role === "assistant" ? "bot" : m.role, m.message),
          );
        }
      })
      .catch(() => {});
  }

  // ── Pusher real-time (agent takeover) ─────────────────────────────────────
  function connectPusher() {
    if (typeof Pusher === "undefined") return; // Pusher not loaded — skip
    const pusher = new Pusher(window._cbPusherKey || "", {
      cluster: window._cbPusherCluster || "ap2",
    });
    const channel = pusher.subscribe(`chat.${sessionId}`);

    channel.bind("agent-takeover", () => {
      taken = true;
      addMessage("bot", "👤 A human agent has joined the chat.");
    });

    channel.bind("new-message", (data) => {
      if (data.role === "agent") addMessage("agent", data.message);
    });
  }

  // ── Toggle window ─────────────────────────────────────────────────────────
  function toggle() {
    open = !open;
    const win = document.getElementById("_cb-window");
    if (win) win.style.display = open ? "flex" : "none";
  }
})();
