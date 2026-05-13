(function() {
    const script = document.currentScript;
    const botUid = script.getAttribute('data-bot-id');
    const baseUrl = 'http://localhost:3000';

    if (!botUid) {
        console.error('Antigravity Widget: Missing data-bot-id attribute.');
        return;
    }

    // 1. Create Floating Button
    const button = document.createElement('div');
    button.id = 'antigravity-widget-button';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #2563eb;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 999998;
    `;
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
    `;
    document.body.appendChild(button);

    // 2. Create Iframe Container
    const container = document.createElement('div');
    container.id = 'antigravity-widget-container';
    container.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        height: 600px;
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: 20px;
        box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        display: none;
        overflow: hidden;
        z-index: 999999;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/widget/${botUid}`;
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    container.appendChild(iframe);
    document.body.appendChild(container);

    // 3. Toggle Logic
    let isOpen = false;
    button.onclick = () => {
        isOpen = !isOpen;
        if (isOpen) {
            container.style.display = 'block';
            setTimeout(() => {
                container.style.transform = 'translateY(0) scale(1)';
                container.style.opacity = '1';
                button.style.transform = 'rotate(90deg) scale(0.9)';
            }, 10);
        } else {
            container.style.transform = 'translateY(20px) scale(0.95)';
            container.style.opacity = '0';
            button.style.transform = 'rotate(0) scale(1)';
            setTimeout(() => container.style.display = 'none', 300);
        }
    };
})();
