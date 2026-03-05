const API_URL = "http://localhost:8000";
let activeUser = null;
let currentForum = 'GENERAL';

// RELOJ (Se mantiene igual)
setInterval(() => {
    document.getElementById('sys-clock').innerText = new Date().toLocaleTimeString();
}, 1000);

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDark);
    document.getElementById('theme-icon').className = isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';
}

function toggleAuthMode(mode) {
    document.getElementById('login-form').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('reg-form').style.display = mode === 'reg' ? 'block' : 'none';
}

// --- REGISTRO REAL ---
document.getElementById('reg-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('r-user').value;
    const email = document.getElementById('r-email').value;
    const password = document.getElementById('r-pass').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user, email: email, pass_word: password })
    });

    if (response.ok) {
        alert("IDENTIDAD CREADA EN EL NODO");
        toggleAuthMode('login');
    } else {
        alert("ERROR: El usuario ya existe o el servidor no responde");
    }
});

// --- LOGIN REAL ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('l-identity').value;
    const password = document.getElementById('l-pass').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user, pass_word: password })
    });

    if (response.ok) {
        const data = await response.json();
        activeUser = data.username;
        unlockInterface();
    } else {
        alert("ACCESO DENEGADO: Credenciales inválidas");
    }
});

function unlockInterface() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('forum-section').style.display = 'flex';
    document.getElementById('user-display').innerText = `ID_${activeUser.toUpperCase()}`;
    // Aquí cargarías los mensajes iniciales
    renderMessages();
}

// --- MENSAJES REALES (PROCESO) ---
async function renderMessages() {
    const response = await fetch(`${API_URL}/messages/${currentForum}`);
    const messages = await response.json();
    
    const box = document.getElementById('messages-display');
    box.innerHTML = messages.map(m => `
        <div class="msg-bubble">
            <div style="font-size:0.6rem; color:var(--neon); font-weight:800;">${m.username.toUpperCase()}</div>
            <div>${m.text}</div>
        </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
}