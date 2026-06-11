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
    let activeSpeakBtn = null;

    // Speech Synthesis Helper
    window.speakText = (text, lang) => {
        if (!('speechSynthesis' in window)) {
            console.warn("[SpeechSynthesis] API is not supported in this browser.");
            return;
        }
        window.speechSynthesis.cancel();
        
        const cleanText = text
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/[\*\_#`~]/g, "")
            .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
            
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const localeMap = { en: 'en-US', hi: 'hi-IN', gu: 'gu-IN' };
        utterance.lang = localeMap[lang] || 'en-US';
        
        const voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.lang.toLowerCase() === utterance.lang.toLowerCase());
        if (!voice) {
            voice = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
        }
        if (voice) {
            utterance.voice = voice;
            console.log(`[SpeechSynthesis] Voice selected: ${voice.name} (${voice.lang})`);
        } else {
            console.warn(`[SpeechSynthesis] No matching voice found for lang: ${utterance.lang}`);
        }
        
        utterance.rate = 0.9;
        
        utterance.onstart = () => {
            window.dispatchEvent(new CustomEvent('speechStarted'));
        };
        utterance.onend = () => {
            window.dispatchEvent(new CustomEvent('speechEnded'));
        };
        utterance.onerror = (e) => {
            console.error("[SpeechSynthesis] Error speaking utterance:", e);
            window.dispatchEvent(new CustomEvent('speechEnded'));
        };
        
        window.speechSynthesis.speak(utterance);
    };

    // Pre-trigger loading of voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        if ('onvoiceschanged' in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                console.log("[SpeechSynthesis] Loaded voices count:", window.speechSynthesis.getVoices().length);
            };
        }
    }

    window.addEventListener('speechStarted', () => {
        if (activeSpeakBtn) {
            activeSpeakBtn.innerHTML = `⏹️ <span class="voice-indicator"><span></span><span></span><span></span></span>`;
            activeSpeakBtn.classList.add('speaking');
        }
    });

    window.addEventListener('speechEnded', () => {
        if (activeSpeakBtn) {
            activeSpeakBtn.innerHTML = `🔊 <span>${window.t('speak_btn') || 'Listen'}</span>`;
            activeSpeakBtn.classList.remove('speaking');
            activeSpeakBtn = null;
        }
    });

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

        const closeBtn = document.getElementById('chatbot-ui-close');
        const sendBtn = document.getElementById('chatbot-ui-send');
        const input = document.getElementById('chatbot-ui-input');
        const messagesContainer = document.getElementById('chatbot-ui-messages');
        
        const micBtn = document.createElement('button');
        micBtn.id = 'chatbot-mic-btn';
        micBtn.className = 'mic-btn';
        micBtn.type = 'button';
        micBtn.title = 'Voice Input';
        micBtn.style.fontSize = '1.15rem';
        micBtn.innerHTML = '🎤';
            
        const footer = document.querySelector('.chatbot-footer');
        if (footer) {
            footer.insertBefore(micBtn, sendBtn);
        }

        trigger.addEventListener('click', () => {
            isModalOpen = !isModalOpen;
            if (isModalOpen) {
                modal.classList.add('active');
                input.focus();
                renderMessages();
            } else {
                modal.classList.remove('active');
                window.speechSynthesis.cancel();
                window.dispatchEvent(new Event('speechEnded'));
            }
        });

        closeBtn.addEventListener('click', () => {
            isModalOpen = false;
            modal.classList.remove('active');
            window.speechSynthesis.cancel();
            window.dispatchEvent(new Event('speechEnded'));
        });

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        let recognition = null;
        let micState = 'idle';
        let timeoutId = null;
        let autoSendTimeoutId = null;
        let resetTimeoutId = null;

        const voiceStates = {
            en: {
                listening: "🔴 Listening...",
                completed: "✅ Speech captured",
                error_denied: "⚠️ Microphone permission denied",
                error_no_speech: "⚠️ No speech detected",
                error_unsupported: "⚠️ Browser not supported",
                error_timeout: "⚠️ Recognition timeout",
                error_network: "⚠️ Network error",
                error_generic: "⚠️ Could not recognize speech"
            },
            hi: {
                listening: "🔴 सुन रहा है...",
                completed: "✅ आवाज़ कैप्चर की गई",
                error_denied: "⚠️ माइक्रोफ़ोन अनुमति अस्वीकृत",
                error_no_speech: "⚠️ कोई आवाज़ नहीं मिली",
                error_unsupported: "⚠️ यह ब्राउज़र सपोर्ट नहीं करता",
                error_timeout: "⚠️ समय समाप्त हो गया",
                error_network: "⚠️ नेटवर्क त्रुटि",
                error_generic: "⚠️ आवाज़ पहचान नहीं पाए"
            },
            gu: {
                listening: "🔴 સાંભળી રહ્યો છું...",
                completed: "✅ અવાજ મેળવ્યો",
                error_denied: "⚠️ માઇક્રોફોન મંજૂરી નકારવામાં આવી",
                error_no_speech: "⚠️ કોઈ અવાજ મળ્યો નહીં",
                error_unsupported: "⚠️ આ બ્રાઉઝર સપોર્ટ કરતું નથી",
                error_timeout: "⚠️ સમય સમાપ્ત થઈ ગયો",
                error_network: "⚠️ નેટવર્ક ભૂલ",
                error_generic: "⚠️ અવાજ ઓળખી શકાયો નહીં"
            }
        };

        function setMicState(state, errorKey = null) {
            micState = state;
            const lang = window.currentLang || 'en';
            const states = voiceStates[lang] || voiceStates.en;
            const t = localizations[lang] || localizations.en;

            // Clear any pending timeouts
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (autoSendTimeoutId) {
                clearTimeout(autoSendTimeoutId);
                autoSendTimeoutId = null;
            }
            if (resetTimeoutId) {
                clearTimeout(resetTimeoutId);
                resetTimeoutId = null;
            }

            switch (state) {
                case 'idle':
                    micBtn.innerHTML = '🎤';
                    micBtn.classList.remove('active', 'completed', 'error');
                    micBtn.title = 'Voice Input';
                    input.placeholder = t.placeholder;
                    break;
                case 'listening':
                    micBtn.innerHTML = '🔴';
                    micBtn.classList.add('active');
                    micBtn.classList.remove('completed', 'error');
                    micBtn.title = states.listening;
                    input.placeholder = states.listening;
                    break;
                case 'completed':
                    micBtn.innerHTML = '✅';
                    micBtn.classList.add('completed');
                    micBtn.classList.remove('active', 'error');
                    micBtn.title = states.completed;
                    input.placeholder = states.completed;
                    break;
                case 'error':
                    micBtn.innerHTML = '⚠️';
                    micBtn.classList.add('error');
                    micBtn.classList.remove('active', 'completed');
                    const errorMsg = states[errorKey] || states.error_generic;
                    micBtn.title = errorMsg;
                    input.placeholder = errorMsg;
                    input.value = '';

                    // Auto-reset to idle after 3 seconds
                    resetTimeoutId = setTimeout(() => {
                        setMicState('idle');
                    }, 3000);
                    break;
            }
        }

        function startSpeechRecognition() {
            const lang = window.currentLang || 'en';
            
            // Check browser support
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.error("[SpeechRecognition] Browser does not support Web Speech API.");
                setMicState('error', 'error_unsupported');
                return;
            }

            // Cancel any active SpeechSynthesis before starting microphone
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                window.dispatchEvent(new Event('speechEnded'));
            }

            try {
                recognition = new SpeechRecognition();
                
                // Configure recognition settings
                const langMap = { en: 'en-US', hi: 'hi-IN', gu: 'gu-IN' };
                recognition.lang = langMap[lang] || 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                recognition.continuous = false;

                console.log(`[SpeechRecognition] Initialized with language: ${recognition.lang}`);

                recognition.onstart = () => {
                    console.log("[SpeechRecognition] Session started.");
                    setMicState('listening');
                    
                    // Safety timeout of 10 seconds if user starts recognition but does not speak
                    timeoutId = setTimeout(() => {
                        console.warn("[SpeechRecognition] Safety timeout reached. Stopping...");
                        if (recognition) {
                            recognition.abort();
                        }
                        setMicState('error', 'error_timeout');
                    }, 10000);
                };

                recognition.onresult = (event) => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    
                    const transcript = event.results[0][0].transcript;
                    console.log(`[SpeechRecognition] Successfully transcribed: "${transcript}"`);
                    
                    input.value = transcript;
                    input.focus();
                    
                    setMicState('completed');
                    
                    // Automatically process the message after 1 second
                    autoSendTimeoutId = setTimeout(() => {
                        setMicState('idle');
                        sendMessage();
                    }, 1000);
                };

                recognition.onerror = (event) => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    console.error(`[SpeechRecognition] Error: ${event.error}`);
                    
                    let errorKey = 'error_generic';
                    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                        errorKey = 'error_denied';
                    } else if (event.error === 'no-speech') {
                        errorKey = 'error_no_speech';
                    } else if (event.error === 'network') {
                        errorKey = 'error_network';
                    } else if (event.error === 'aborted') {
                        // User manual stop/abort, ignore showing error
                        return;
                    }
                    
                    setMicState('error', errorKey);
                };

                recognition.onend = () => {
                    console.log("[SpeechRecognition] Session ended.");
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    // Only return to idle if we aren't in completed or error transient states
                    if (micState === 'listening') {
                        setMicState('idle');
                    }
                };

                // Explicit stop when user finishes speaking
                recognition.onspeechend = () => {
                    console.log("[SpeechRecognition] User stopped speaking.");
                    recognition.stop();
                };

                recognition.start();
            } catch (e) {
                console.error("[SpeechRecognition] Could not start recognition:", e);
                setMicState('error', 'error_generic');
            }
        }

        micBtn.addEventListener('click', () => {
            if (micState === 'listening') {
                console.log("[SpeechRecognition] User manually stopped recognition.");
                if (recognition) {
                    recognition.abort();
                }
                setMicState('idle');
            } else if (micState === 'idle') {
                startSpeechRecognition();
            }
        });

        window.addEventListener('languageChanged', () => {
            updateUIStrings();
            if (micState !== 'idle') {
                if (recognition) {
                    recognition.abort();
                }
                setMicState('idle');
            }
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
            
            const speakBtn = document.createElement('button');
            speakBtn.className = 'chat-speak-btn';
            speakBtn.innerHTML = `🔊 <span>${window.t('speak_btn') || 'Listen'}</span>`;
            
            speakBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeSpeakBtn === speakBtn) {
                    window.speechSynthesis.cancel();
                    window.dispatchEvent(new Event('speechEnded'));
                } else {
                    if (activeSpeakBtn) {
                        window.speechSynthesis.cancel();
                        window.dispatchEvent(new Event('speechEnded'));
                    }
                    activeSpeakBtn = speakBtn;
                    window.speakText(t.greeting, lang);
                }
            });

            greetingBubble.appendChild(speakBtn);
            messagesContainer.appendChild(greetingBubble);
        } else {
            chatHistory.forEach(msg => {
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = parseMarkdown(msg.content);
                bubble.appendChild(contentDiv);
                
                if (msg.role === 'assistant') {
                    const speakBtn = document.createElement('button');
                    speakBtn.className = 'chat-speak-btn';
                    speakBtn.innerHTML = `🔊 <span>${window.t('speak_btn') || 'Listen'}</span>`;
                    
                    speakBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (activeSpeakBtn === speakBtn) {
                            window.speechSynthesis.cancel();
                            window.dispatchEvent(new Event('speechEnded'));
                        } else {
                            if (activeSpeakBtn) {
                                window.speechSynthesis.cancel();
                                window.dispatchEvent(new Event('speechEnded'));
                            }
                            activeSpeakBtn = speakBtn;
                            window.speakText(msg.content, lang);
                        }
                    });

                    bubble.appendChild(speakBtn);
                }
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

        // Cancel any active speech when sending a new message
        window.speechSynthesis.cancel();
        window.dispatchEvent(new Event('speechEnded'));

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

            const data = await response.json();
            typingIndicator.classList.remove('active');

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
