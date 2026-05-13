(function() {
    const BOT_UID = document.currentScript.getAttribute('data-bot-uid');
    const API_BASE = 'https://api.samskritisolutions.com/api';
    
    // Create Styles
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        #antigravity-widget { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            position: fixed; 
            bottom: 90px; 
            right: 30px; 
            z-index: 2147483647; 
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 15px;
        }

        /* Launcher Tooltip - 120% Feature */
        .ag-tooltip {
            background: #ffffff;
            color: #0f172a;
            padding: 10px 18px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin-bottom: 5px;
            animation: ag-tooltip-float 3s ease-in-out infinite;
            position: relative;
            border: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
            white-space: nowrap;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ag-tooltip.visible { opacity: 1; transform: translateY(0); }
        .ag-tooltip::after {
            content: '';
            position: absolute;
            bottom: -6px;
            right: 24px;
            width: 12px;
            height: 12px;
            background: #ffffff;
            transform: rotate(45deg);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            border-right: 1px solid rgba(0,0,0,0.05);
        }
        @keyframes ag-tooltip-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        /* Launcher Bubble */
        .ag-bubble { 
            width: 64px; 
            height: 64px; 
            border-radius: 22px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: #2563eb; 
            color: white; 
            box-shadow: 0 15px 35px -5px rgba(37,99,235,0.4), 0 10px 15px -6px rgba(0,0,0,0.1); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            border: 1px solid rgba(255,255,255,0.1);
            outline: none;
            position: relative;
        }
        .ag-bubble::before {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 26px;
            background: #2563eb;
            opacity: 0.25;
            z-index: -1;
            animation: ag-pulse 2s infinite;
        }
        @keyframes ag-pulse {
            0% { transform: scale(1); opacity: 0.25; }
            100% { transform: scale(1.4); opacity: 0; }
        }
        .ag-bubble:hover { 
            transform: scale(1.1) rotate(8deg);
            box-shadow: 0 25px 45px -5px rgba(37,99,235,0.5);
        }
        .ag-bubble svg { width: 30px; height: 30px; stroke-width: 2.5px; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .ag-bubble.open svg { transform: rotate(90deg) scale(0.8); }

        /* Main Window - 120% Glassmorphism */
        .ag-window { 
            width: 400px; 
            max-height: calc(100vh - 120px);
            height: 660px; 
            background: rgba(255, 255, 255, 0.96); 
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            border-radius: 36px; 
            box-shadow: 0 40px 80px -15px rgba(0,0,0,0.25); 
            display: none; 
            flex-direction: column; 
            overflow: hidden; 
            border: 1px solid rgba(255,255,255,0.5);
            animation: ag-window-appear 0.6s cubic-bezier(0.19, 1, 0.22, 1);
            transform-origin: bottom right;
            position: relative;
        }
        .ag-window::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-25deg);
            transition: 0.75s;
            pointer-events: none;
        }
        .ag-window:hover::after { left: 150%; }

        @keyframes ag-window-appear { 
            from { opacity: 0; transform: translateY(40px) scale(0.92); filter: blur(10px); } 
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
        }

        /* Header */
        .ag-header { 
            padding: 30px 32px 20px; 
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0));
            z-index: 10;
        }
        .ag-bot-profile { display: flex; align-items: center; gap: 16px; }
        .ag-avatar { 
            width: 52px; 
            height: 52px; 
            background: #2563eb; 
            border-radius: 18px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white;
            box-shadow: 0 10px 20px -5px rgba(37,99,235,0.3);
            overflow: hidden;
            border: 2px solid #ffffff;
        }
        .ag-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .ag-header-text h4 { margin: 0; font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
        .ag-status { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; color: #64748b; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.08em; }
        .ag-status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 12px #10b981; animation: ag-dot-pulse 2s infinite; }
        @keyframes ag-dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .ag-close-btn { 
            color: #0f172a; 
            cursor: pointer; 
            padding: 10px; 
            border-radius: 16px;
            transition: all 0.3s;
            background: rgba(0,0,0,0.03);
        }
        .ag-close-btn:hover { background: #fef2f2; color: #ef4444; transform: rotate(90deg) scale(1.1); }

        /* Body & Messages */
        .ag-body { flex: 1; overflow-y: auto; padding: 24px 32px; background: transparent; scrollbar-width: none; }
        .ag-body::-webkit-scrollbar { display: none; }

        .ag-chat-msg { 
            margin-bottom: 24px; 
            padding: 16px 20px; 
            border-radius: 24px; 
            font-size: 14.5px; 
            font-weight: 500;
            line-height: 1.6; 
            max-width: 82%; 
            width: fit-content;
            clear: both;
            animation: ag-msg-slide 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            position: relative;
            transition: transform 0.2s;
        }
        .ag-chat-msg:hover { transform: translateY(-2px); }
        @keyframes ag-msg-slide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .ag-msg-user { 
            background: linear-gradient(135deg, #2563eb, #1d4ed8); 
            color: #ffffff; 
            margin-left: auto; 
            border-bottom-right-radius: 6px;
            box-shadow: 0 12px 24px -8px rgba(37,99,235,0.4);
        }
        .ag-msg-bot { 
            background: #ffffff; 
            color: #1e293b; 
            margin-right: auto;
            border-bottom-left-radius: 6px;
            border: 1px solid rgba(0,0,0,0.04);
            box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05);
        }

        /* Lead Form - 120% Tier */
        .ag-form { padding: 10px 0; display: flex; flex-direction: column; gap: 24px; }
        .ag-form h2 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.03em; }
        .ag-form p { font-size: 15px; color: #64748b; margin: -10px 0 5px; font-weight: 500; line-height: 1.6; }
        
        .ag-input-group { display: flex; flex-direction: column; gap: 10px; }
        .ag-input-group label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; padding-left: 5px; }
        .ag-form input { 
            padding: 16px 20px; 
            background: #f8fafc;
            border: 2px solid transparent; 
            border-radius: 20px; 
            font-size: 15px; 
            font-weight: 600;
            transition: all 0.3s;
            font-family: inherit;
        }
        .ag-form input:focus { border-color: #2563eb; outline: none; background: #ffffff; box-shadow: 0 15px 30px -10px rgba(37,99,235,0.1); }
        .ag-form button { 
            background: linear-gradient(135deg, #2563eb, #1d4ed8); 
            color: #ffffff; 
            padding: 20px; 
            border-radius: 22px; 
            font-weight: 800; 
            border: none; 
            cursor: pointer; 
            transition: all 0.4s;
            font-size: 16px;
            margin-top: 10px;
            box-shadow: 0 15px 35px -10px rgba(37,99,235,0.5);
        }
        .ag-form button:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 45px -10px rgba(37,99,235,0.6); }

        /* Typing Indicator */
        .ag-typing { display: flex; gap: 6px; padding: 16px 22px; background: #f8fafc; border-radius: 24px; width: fit-content; margin-bottom: 24px; border: 1px solid rgba(0,0,0,0.02); }
        
        /* Footer Input Area */
        .ag-input-area { 
            padding: 24px 32px 36px; 
            background: rgba(255,255,255,0.7);
            backdrop-filter: blur(15px);
            border-top: 1px solid rgba(0,0,0,0.04); 
            display: flex; 
            gap: 16px; 
            align-items: center;
        }
        .ag-chat-input-wrapper {
            flex: 1;
            background: #f1f5f9;
            border-radius: 24px;
            padding: 14px 22px;
            border: 2px solid transparent;
            transition: all 0.4s;
            display: flex;
            align-items: center;
        }
        .ag-chat-input-wrapper:focus-within {
            background: #ffffff;
            border-color: #2563eb;
            box-shadow: 0 15px 30px -10px rgba(37,99,235,0.08);
        }
        .ag-chat-input { 
            flex: 1; 
            border: none; 
            outline: none; 
            font-size: 15px; 
            font-weight: 600;
            background: transparent; 
            font-family: inherit;
            color: #0f172a;
        }
        .ag-send-btn { 
            color: #2563eb; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: none;
            background: transparent;
            padding: 6px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ag-send-btn:hover:not(:disabled) { transform: scale(1.2) translateX(4px) rotate(-10deg); color: #1d4ed8; }
        .ag-send-btn:disabled { color: #cbd5e1; cursor: not-allowed; }

        .ag-branding { 
            padding: 14px; 
            text-align: center; 
            font-size: 9px; 
            font-weight: 800;
            color: #94a3b8; 
            background: rgba(255,255,255,0.9);
            border-top: 1px solid rgba(0,0,0,0.03);
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }
        .ag-branding span { color: #2563eb; }
    `;
    document.head.appendChild(style);

    // Create DOM
    const widget = document.createElement('div');
    widget.id = 'antigravity-widget';
    widget.innerHTML = `
        <div class="ag-tooltip" id="ag-tooltip">
            How can I help you? 👋
        </div>
        <div class="ag-window" id="ag-window">
            <div class="ag-header" id="ag-header">
                <div class="ag-bot-profile">
                    <div class="ag-avatar" id="ag-avatar-container">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div class="ag-header-text">
                        <h4 id="ag-bot-name">Neural Assistant</h4>
                        <div class="ag-status"><span class="ag-status-dot"></span> Active Core</div>
                    </div>
                </div>
                <div class="ag-close-btn" id="ag-close">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
            <div class="ag-body" id="ag-body">
                <div id="ag-lead-form" class="ag-form">
                    <h2 id="ag-greeting">Hello! 👋</h2>
                    <p id="ag-welcome-prompt">I'm ready to assist you. Please introduce yourself to begin our secure session.</p>
                    
                    <div class="ag-input-group">
                        <label>Neural Identity</label>
                        <input type="text" id="ag-name" placeholder="Full Name" />
                        <span id="err-name" class="error"></span>
                    </div>
                    
                    <div class="ag-input-group">
                        <label>Direct Communication</label>
                        <input type="email" id="ag-email" placeholder="Email Address" />
                        <span id="err-email" class="error"></span>
                    </div>
                    
                    <div class="ag-input-group">
                        <label>Phone Node</label>
                        <input type="tel" id="ag-phone" placeholder="Contact Number" />
                        <span id="err-phone" class="error"></span>
                    </div>
                    
                    <button id="ag-start-chat">Initialize Neural Link</button>
                </div>
                <div id="ag-messages" style="display:none"></div>
                <div id="ag-typing-indicator" class="ag-typing" style="display:none">
                    <div class="ag-dot"></div>
                    <div class="ag-dot"></div>
                    <div class="ag-dot"></div>
                </div>
            </div>
            <div class="ag-input-area" id="ag-input-area" style="display:none">
                <div class="ag-chat-input-wrapper">
                    <input type="text" id="ag-chat-input" class="ag-chat-input" placeholder="Enter message..." />
                    <button class="ag-send-btn" id="ag-send">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
            <div class="ag-branding">
                Intelligence by <span>Antigravity AI</span>
            </div>
        </div>
        <button class="ag-bubble" id="ag-bubble">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </button>
    `;
    document.body.appendChild(widget);

    // Logic
    const bubble = document.getElementById('ag-bubble');
    const windowEl = document.getElementById('ag-window');
    const close = document.getElementById('ag-close');
    const tooltip = document.getElementById('ag-tooltip');
    const leadForm = document.getElementById('ag-lead-form');
    const chatInputArea = document.getElementById('ag-input-area');
    const messagesDiv = document.getElementById('ag-messages');
    const typingIndicator = document.getElementById('ag-typing-indicator');
    const body = document.getElementById('ag-body');
    const greetingEl = document.getElementById('ag-greeting');
    
    let leadData = null;
    let sessionId = localStorage.getItem('ag_session_' + BOT_UID) || Math.random().toString(36).substring(7);
    localStorage.setItem('ag_session_' + BOT_UID, sessionId);
    
    // 120% Feature: Time-based greeting
    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) greetingEl.innerText = 'Good Morning! ☀️';
        else if (hour < 18) greetingEl.innerText = 'Good Afternoon! 👋';
        else greetingEl.innerText = 'Good Evening! 🌙';
    };
    updateGreeting();

    // 120% Feature: Tooltip behavior
    setTimeout(() => { tooltip.classList.add('visible'); }, 3000);
    tooltip.onclick = () => { bubble.click(); };

    let config = { widget_color: '#2563eb', welcome_msg: 'Hi! How can I help you today?', bot_name: 'Neural Assistant' };

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_BASE}/widget/${BOT_UID}/config`);
            const data = await res.json();
            config = data;
            
            document.getElementById('ag-bot-name').innerText = config.bot_name;
            document.getElementById('ag-welcome-prompt').innerText = config.welcome_msg;
            
            if(config.widget_color) {
                document.getElementById('ag-bubble').style.background = config.widget_color;
                document.getElementById('ag-start-chat').style.background = `linear-gradient(135deg, ${config.widget_color}, ${config.widget_color}ee)`;
                document.getElementById('ag-avatar-container').style.background = config.widget_color;
            }

            if(config.avatar_url) {
                document.getElementById('ag-avatar-container').innerHTML = `<img src="${config.avatar_url}" alt="${config.bot_name}" />`;
            }

            fetchHistory();
        } catch (e) { console.error('Config failed', e); }
    };

    let messageCount = 0;
    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_BASE}/widget/${BOT_UID}/history?session_id=${sessionId}`);
            const data = await res.json();
            if (data.length > messageCount) {
                messagesDiv.innerHTML = '';
                leadForm.style.display = 'none';
                messagesDiv.style.display = 'block';
                chatInputArea.style.display = 'flex';
                data.forEach(msg => addMessage(msg.role === 'user' ? 'user' : 'bot', msg.message));
                tooltip.style.display = 'none';
                messageCount = data.length;
            }
        } catch (e) { console.error('History failed', e); }
    };

    fetchConfig();

    bubble.onclick = () => { 
        const isOpen = windowEl.style.display === 'flex';
        windowEl.style.display = isOpen ? 'none' : 'flex'; 
        bubble.classList.toggle('open');
        tooltip.style.display = 'none';
        if (!isOpen) {
            body.scrollTop = body.scrollHeight;
            startPolling();
        } else {
            stopPolling();
        }
    };

    let pollInterval = null;
    const startPolling = () => {
        if (pollInterval) return;
        pollInterval = setInterval(fetchHistory, 5000);
    };
    const stopPolling = () => {
        clearInterval(pollInterval);
        pollInterval = null;
    };
    close.onclick = () => { bubble.click(); };

    document.getElementById('ag-start-chat').onclick = () => {
        const name = document.getElementById('ag-name').value;
        const email = document.getElementById('ag-email').value;
        const phone = document.getElementById('ag-phone').value;
        
        let valid = true;
        const errName = document.getElementById('err-name');
        const errEmail = document.getElementById('err-email');
        const errPhone = document.getElementById('err-phone');

        if (name.trim().length < 2) { errName.innerText = 'Neural identity too short'; valid = false; } else { errName.innerText = ''; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEmail.innerText = 'Node email invalid'; valid = false; } else { errEmail.innerText = ''; }
        if (phone.replace(/\D/g, '').length < 8) { errPhone.innerText = 'Contact node invalid'; valid = false; } else { errPhone.innerText = ''; }

        if (valid) {
            leadData = { name, email, phone };
            leadForm.style.display = 'none';
            messagesDiv.style.display = 'block';
            chatInputArea.style.display = 'flex';
            addMessage('bot', `System link established. Hello ${name.split(' ')[0]}! I am ${config.bot_name}. How can I assist you in this session?`);
        }
    };

    const addMessage = (role, text) => {
        const div = document.createElement('div');
        div.className = 'ag-chat-msg ' + (role === 'user' ? 'ag-msg-user' : 'ag-msg-bot');
        div.innerText = text;
        if (role === 'user' && config.widget_color) {
            div.style.background = `linear-gradient(135deg, ${config.widget_color}, ${config.widget_color}ee)`;
        }
        messagesDiv.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };

    const showTyping = (show) => {
        typingIndicator.style.display = show ? 'flex' : 'none';
        body.scrollTop = body.scrollHeight;
    };

    const sendMessage = async () => {
        const input = document.getElementById('ag-chat-input');
        const text = input.value.trim();
        if (!text || isSending) return;
        
        addMessage('user', text);
        input.value = '';
        showTyping(true);

        try {
            const response = await fetch(`${API_BASE}/widget/${BOT_UID}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, session_id: sessionId, lead: leadData })
            });
            const data = await response.json();
            showTyping(false);
            addMessage('bot', data.reply || 'Neural link interrupted. Please refresh.');
            leadData = null; 
        } catch (e) { 
            showTyping(false);
            addMessage('bot', 'Neural link interrupted. Retrying...'); 
        }
    };

    let isSending = false;
    document.getElementById('ag-send').onclick = sendMessage;
    document.getElementById('ag-chat-input').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

})();