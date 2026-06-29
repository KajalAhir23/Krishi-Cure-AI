/* ================================================================
   KRISHI-CURE PRO — AI Agriculture Chatbot Script
   ================================================================ */

(function () {
    // Localization dictionary
    const localizations = {
        en: {
            title: "Krishi Cure AI Assistant",
            greeting: "Hello! I am your Krishi Cure AI Agriculture Assistant. How can I help you with farming today?",
            placeholder: "Ask about crops, pests, soil, fertilizers...",
            send: "Send",
            connecting: "Connecting...",
            online: "Online",
            offline: "Offline",
            unauthorized: "Please log in to chat."
        },
        hi: {
            title: "कृषि क्योर एआई सहायक",
            greeting: "नमस्ते! मैं आपका कृषि क्योर एआई कृषि सहायक हूं। आज मैं खेती में आपकी क्या मदद कर सकता हूं?",
            placeholder: "फसल, कीट, मिट्टी, खाद के बारे में पूछें...",
            send: "भेजें",
            connecting: "कनेक्ट हो रहा है...",
            online: "ऑनलाइन",
            offline: "ऑफ़लाइन",
            unauthorized: "चैट करने के लिए कृपया लॉग इन करें।"
        },
        gu: {
            title: "કૃષિ ક્યોર એઆઈ સહાયક",
            greeting: "નમસ્તે! હું તમારો કૃષિ ક્યોર એઆઈ કૃષિ સહાયક છું. આજે હું ખેતીમાં તમારી શું મદદ કરી શકું?",
            placeholder: "પાક, જંતુઓ, જમીન, ખાતર વિશે પૂછો...",
            send: "મોકલો",
            connecting: "કનેક્ટ થઈ રહ્યું છે...",
            online: "ઓનલાઇન",
            offline: "ઓફલાઇન",
            unauthorized: "ચેટ કરવા માટે કૃપા કરીને લોગ ઇન કરો."
        }
    };

    let chatHistory = [];
    let isModalOpen = false;


    function loadHistory() {
        try {
            const saved = sessionStorage.getItem('krishiChatHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse chat history:", e);
            return [];
        }
    }

    function saveHistory() {
        try {
            sessionStorage.setItem('krishiChatHistory', JSON.stringify(chatHistory));
        } catch (e) {
            console.error("Failed to save chat history:", e);
        }
    }

    function initChatbotUI() {
        const trigger = document.createElement('button');
        trigger.id = 'krishi-chatbot-trigger';
        trigger.setAttribute('aria-label', 'Open Agriculture Chatbot');
        trigger.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
        `;
        document.body.appendChild(trigger);

        const modal = document.createElement('div');
        modal.id = 'krishi-chatbot-modal';
        modal.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar">🌾</div>
                    <div>
                        <div class="chatbot-title" id="chatbot-ui-title">Krishi Cure AI Assistant</div>
                        <div class="chatbot-status" id="chatbot-ui-status">Online</div>
                    </div>
                </div>
                <button class="chatbot-close-btn" id="chatbot-ui-close" aria-label="Close Chatbot">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-ui-messages"></div>
            <div class="typing-indicator-container" id="chatbot-ui-typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="chatbot-footer">
                <input type="text" class="chatbot-input" id="chatbot-ui-input" placeholder="Ask about crops, pests..." autocomplete="off">
                <button class="chatbot-send-btn" id="chatbot-ui-send" aria-label="Send Message">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        chatHistory = loadHistory();

        window.setChatbotModalOpen = function (val) {
            isModalOpen = val;
        };

        const closeBtn = document.getElementById('chatbot-ui-close');
        const sendBtn = document.getElementById('chatbot-ui-send');
        const input = document.getElementById('chatbot-ui-input');
        const messagesContainer = document.getElementById('chatbot-ui-messages');
        
        trigger.addEventListener('click', () => {
            const path = window.location.pathname;
            if (path.includes('chatbot.html')) {
                const restorePath = window.lastActivePath || '/index.html';
                const finalPath = restorePath.includes('chatbot.html') ? '/index.html' : restorePath;
                history.pushState(null, '', finalPath);
            } else {
                window.lastActivePath = path;
                history.pushState(null, '', '/chatbot.html');
            }
            if (typeof window.handleUrlRouting === 'function') {
                window.handleUrlRouting();
            }
        });

        closeBtn.addEventListener('click', () => {
            const restorePath = window.lastActivePath || '/index.html';
            const finalPath = restorePath.includes('chatbot.html') ? '/index.html' : restorePath;
            history.pushState(null, '', finalPath);
            if (typeof window.handleUrlRouting === 'function') {
                window.handleUrlRouting();
            }
        });

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        window.addEventListener('languageChanged', () => {
            updateUIStrings();
        });
        updateUIStrings();
        renderMessages();
    }

    function updateUIStrings() {
        const lang = window.currentLang || 'en';
        const t = localizations[lang] || localizations.en;

        const titleEl = document.getElementById('chatbot-ui-title');
        const inputEl = document.getElementById('chatbot-ui-input');
        const statusEl = document.getElementById('chatbot-ui-status');

        if (titleEl) titleEl.textContent = t.title;
        if (inputEl) inputEl.placeholder = t.placeholder;
        if (statusEl) statusEl.textContent = t.online;
    }

    function parseMarkdown(text) {
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        const lines = html.split('\n');
        let result = [];
        let inList = null;

        for (let line of lines) {
            const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
            const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);

            if (olMatch) {
                if (inList !== 'ol') {
                    if (inList) result.push(`</${inList}>`);
                    result.push('<ol>');
                    inList = 'ol';
                }
                result.push(`<li>${olMatch[1]}</li>`);
            } else if (ulMatch) {
                if (inList !== 'ul') {
                    if (inList) result.push(`</${inList}>`);
                    result.push('<ul>');
                    inList = 'ul';
                }
                result.push(`<li>${ulMatch[1]}</li>`);
            } else {
                if (inList) {
                    result.push(`</${inList}>`);
                    inList = null;
                }
                if (line.trim() === '') {
                    result.push('<br>');
                } else {
                    result.push(`<p>${line}</p>`);
                }
            }
        }
        if (inList) {
            result.push(`</${inList}>`);
        }

        return result.join('\n');
    }

    function renderMessages() {
        const messagesContainer = document.getElementById('chatbot-ui-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        const lang = window.currentLang || 'en';
        const t = localizations[lang] || localizations.en;

        if (chatHistory.length === 0) {
            const greetingBubble = document.createElement('div');
            greetingBubble.className = 'chat-bubble bot';
            
            const contentDiv = document.createElement('div');
            contentDiv.textContent = t.greeting;
            greetingBubble.appendChild(contentDiv);
            
            messagesContainer.appendChild(greetingBubble);
        } else {
            chatHistory.forEach(msg => {
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = parseMarkdown(msg.content);
                bubble.appendChild(contentDiv);
                
                messagesContainer.appendChild(bubble);
            });
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const input = document.getElementById('chatbot-ui-input');
        const typingIndicator = document.getElementById('chatbot-ui-typing');
        const messagesContainer = document.getElementById('chatbot-ui-messages');

        if (!input || !typingIndicator || !messagesContainer) return;

        const text = input.value.trim();
        if (!text) return;

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            const lang = window.currentLang || 'en';
            const t = localizations[lang] || localizations.en;
            if (window.showToast) {
                window.showToast(t.unauthorized, 'error');
            } else {
                alert(t.unauthorized);
            }
            return;
        }

        chatHistory.push({ role: 'user', content: text });
        renderMessages();

        input.value = '';
        typingIndicator.classList.add('active');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const lang = window.currentLang || 'en';
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: text,
                    lang: lang,
                    history: chatHistory.slice(0, -1).slice(-6)
                })
            });

            const json = await response.json();
            typingIndicator.classList.remove('active');

            // API wraps all responses: { success: true, data: { reply: '...' } }
            const data = json.data || json;

            if (data && data.reply) {
                chatHistory.push({ role: 'assistant', content: data.reply });
                saveHistory();
                renderMessages();
            } else {
                throw new Error("Invalid reply format");
            }
        } catch (error) {
            console.error("Chatbot API Error:", error);
            typingIndicator.classList.remove('active');

            const lang = window.currentLang || 'en';
            const fallbackMsgs = {
                en: "An error occurred. Please verify your connection and try again.",
                hi: "एक त्रुटि हुई। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
                gu: "ભૂલ આવી છે. કૃપા કરીને તમારું કનેક્શન તપાસો અને ફરીથી પ્રયાસ કરો."
            };

            chatHistory.push({
                role: 'assistant',
                content: fallbackMsgs[lang] || fallbackMsgs.en
            });
            renderMessages();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotUI);
    } else {
        initChatbotUI();
    }
})();
