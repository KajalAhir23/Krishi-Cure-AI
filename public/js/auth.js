// Immediate blocking redirect to prevent UI flickering before scripts execute fully
(function() {
    const path = window.location.pathname;
    // Handle root path or subpages
    const isLoginPage = path.endsWith('/login.html') || path.includes('/login.html');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // If the path is empty, root page (/), or index.html/symptoms.html/result.html
    const isProtectedPage = !isLoginPage && (
        path === '/' || 
        path.endsWith('/') || 
        path.includes('index.html') || 
        path.includes('symptoms.html') || 
        path.includes('result.html') ||
        path.includes('diagnosis-choice.html') ||
        path.includes('upload.html') ||
        path.includes('fertilizer-calculator.html')
    );

    if (isProtectedPage && !isLoggedIn) {
        window.location.href = '/login.html';
    } else if (isLoginPage && isLoggedIn) {
        window.location.href = '/index.html';
    }
})();

// Global Auth and Firebase Refs
window.firebaseApp = null;
window.firebaseAuth = null;
window.confirmationResult = null;

// Initialize Firebase dynamically using configuration from the backend env
// Start immediately (not waiting for DOMContentLoaded) to avoid race condition
window.firebaseInitPromise = (async () => {
    try {
        const response = await fetch('/api/firebase-config');
        if (!response.ok) throw new Error("Failed to load Firebase configuration");
        const json = await response.json();
        // Extract from API wrapper { success: true, data: {...} }
        const firebaseConfig = json.data || json;
        
        if (!firebase.apps.length) {
            window.firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            window.firebaseApp = firebase.app();
        }
        window.firebaseAuth = firebase.auth();
        
        // Setup Auth State Listener to maintain persistent sessions
        window.firebaseAuth.onAuthStateChanged(user => {
            const path = window.location.pathname;
            const isLoginPage = path.includes('login.html');
            
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                window.updateUserProfileUI(user);
                if (isLoginPage) {
                    window.location.href = '/index.html';
                }
            } else {
                localStorage.removeItem('isLoggedIn');
                window.updateUserProfileUI(null);
                if (!isLoginPage && (path === '/' || path.includes('index.html') || path.includes('symptoms.html') || path.includes('result.html'))) {
                    window.location.href = '/login.html';
                }
            }
        });
        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
        return false;
    }
})();

// Legacy wrapper for backward-compatible calls
window.initFirebase = async () => {
    return window.firebaseInitPromise;
};

// Update user profile information across the application UI
window.updateUserProfileUI = (user) => {
    if (!user) {
        const widget = document.getElementById('user-profile-widget');
        if (widget) widget.remove();
        
        const welcomeCard = document.getElementById('dashboard-welcome-card');
        if (welcomeCard) welcomeCard.style.display = 'none';
        return;
    }

    // Find the header flex container containing lang-selector
    const headerFlex = document.querySelector('.app-header > div[style*="display: flex"]');
    if (headerFlex && !document.getElementById('user-profile-widget')) {
        // Create widget element
        const widget = document.createElement('div');
        widget.id = 'user-profile-widget';
        widget.className = 'user-profile-widget';
        
        const avatarImg = document.createElement('img');
        avatarImg.id = 'user-profile-avatar';
        avatarImg.className = 'user-profile-avatar';
        avatarImg.alt = 'Profile';
        avatarImg.style.display = 'none';
        
        const avatarFallback = document.createElement('div');
        avatarFallback.id = 'user-profile-avatar-fallback';
        avatarFallback.className = 'user-profile-avatar';
        avatarFallback.textContent = '🧑‍🌾';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'user-profile-info';
        
        const nameSpan = document.createElement('span');
        nameSpan.id = 'user-profile-name';
        nameSpan.className = 'user-profile-name';
        
        const emailSpan = document.createElement('span');
        emailSpan.id = 'user-profile-email';
        emailSpan.className = 'user-profile-email';
        
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(emailSpan);
        
        widget.appendChild(avatarImg);
        widget.appendChild(avatarFallback);
        widget.appendChild(infoDiv);
        
        // Insert before logout_btn
        const logoutBtn = document.getElementById('logout_btn');
        if (logoutBtn) {
            headerFlex.insertBefore(widget, logoutBtn);
        } else {
            headerFlex.appendChild(widget);
        }
    }
    
    // Update the widget values
    const nameSpan = document.getElementById('user-profile-name');
    const emailSpan = document.getElementById('user-profile-email');
    const avatarImg = document.getElementById('user-profile-avatar');
    const avatarFallback = document.getElementById('user-profile-avatar-fallback');
    
    const langStore = (window.appData && window.appData.langStore) ? (window.appData.langStore[window.currentLang] || window.appData.langStore['en']) : {};
    const fallbackFarmer = langStore.farmer_fallback || (window.currentLang === 'gu' ? "ખેડૂત" : window.currentLang === 'hi' ? "किसान" : "Farmer");
    
    const displayName = user.displayName || user.phoneNumber || fallbackFarmer;
    const displayEmail = user.email || (user.phoneNumber ? "" : "");
    
    if (nameSpan) nameSpan.textContent = displayName;
    if (emailSpan) {
        emailSpan.textContent = displayEmail;
        emailSpan.style.display = displayEmail ? 'block' : 'none';
    }
    
    if (user.photoURL) {
        if (avatarImg) {
            avatarImg.src = user.photoURL;
            avatarImg.style.display = 'block';
        }
        if (avatarFallback) avatarFallback.style.display = 'none';
    } else {
        if (avatarImg) avatarImg.style.display = 'none';
        if (avatarFallback) {
            avatarFallback.style.display = 'flex';
            avatarFallback.textContent = '🧑‍🌾';
        }
    }
    
    const widget = document.getElementById('user-profile-widget');
    if (widget) {
        widget.title = `${displayName}${displayEmail ? ' (' + displayEmail + ')' : ''}`;
    }
    
    // Also update dashboard-welcome-card on index.html if it exists
    const welcomeCard = document.getElementById('dashboard-welcome-card');
    if (welcomeCard) {
        welcomeCard.style.display = 'block';
        const welcomeGreeting = document.getElementById('welcome_greeting');
        const welcomeName = document.getElementById('welcome-name');
        const welcomeEmail = document.getElementById('welcome-email');
        const welcomeImg = document.getElementById('welcome-avatar');
        const welcomeFallback = document.getElementById('welcome-avatar-fallback');
        
        const welcomeBackTexts = {
            'en': "Welcome back,",
            'hi': "आपका स्वागत है,",
            'gu': "સ્વાગત છે,"
        };
        
        const greeting = langStore.welcome_back || welcomeBackTexts[window.currentLang] || welcomeBackTexts['en'];
        const fallbackName = langStore.farmer_fallback || (window.currentLang === 'gu' ? "ખેડૂત" : window.currentLang === 'hi' ? "किसान" : "Farmer");
        
        if (welcomeGreeting) welcomeGreeting.textContent = greeting;
        if (welcomeName) welcomeName.textContent = user.displayName || user.phoneNumber || fallbackName;
        if (welcomeEmail) {
            welcomeEmail.textContent = displayEmail;
            welcomeEmail.style.display = displayEmail ? 'block' : 'none';
        }
        
        if (user.photoURL) {
            if (welcomeImg) {
                welcomeImg.src = user.photoURL;
                welcomeImg.style.display = 'block';
            }
            if (welcomeFallback) welcomeFallback.style.display = 'none';
        } else {
            if (welcomeImg) welcomeImg.style.display = 'none';
            if (welcomeFallback) {
                welcomeFallback.style.display = 'flex';
                welcomeFallback.textContent = '🧑‍🌾';
            }
        }
    }
};

// Event listener for language changes to update user info dynamically
window.addEventListener('languageChanged', () => {
    if (window.firebaseAuth && window.firebaseAuth.currentUser) {
        window.updateUserProfileUI(window.firebaseAuth.currentUser);
    }
});

// Logout User function
window.logoutUser = async () => {
    localStorage.removeItem('isLoggedIn'); // Immediate UI update
    if (window.firebaseAuth) {
        try {
            await window.firebaseAuth.signOut();
            window.location.href = '/login.html';
        } catch (error) {
            console.error("Sign out error:", error);
            window.location.href = '/login.html';
        }
    } else {
        window.location.href = '/login.html';
    }
};

// Setup initial triggers when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // firebaseInitPromise was already started at script load time.
    // Nothing else needed here; the promise handles initialization.
});
