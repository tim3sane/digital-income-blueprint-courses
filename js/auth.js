/**
 * Digital Income Blueprint — Auth Module
 * Client-side auth with localStorage + validation
 * For production: integrate with Cloudflare Workers + D1 / Supabase
 */

const AUTH = {
    USERS_KEY: 'dib_users',
    SESSION_KEY: 'dib_session',

    // Password rules
    MIN_PASS_LENGTH: 8,
    PASS_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,

    // Email validation
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Phone validation (international)
    PHONE_REGEX: /^\+?[\d\s\-().]{7,20}$/,

    _getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        } catch { return []; }
    },

    _saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    // Simple hash (for demo — production should use bcrypt via Workers)
    async _hash(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str + 'dib_salt_2026');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async register({ name, email, password, phone, address }) {
        // Validations
        if (!name || name.trim().length < 2) return { ok: false, error: 'Name must be at least 2 characters.' };
        if (!this.EMAIL_REGEX.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
        if (!this.PASS_REGEX.test(password)) return { ok: false, error: 'Password must be 8+ chars with uppercase, lowercase, number, and special character.' };
        if (phone && !this.PHONE_REGEX.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };

        const users = this._getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { ok: false, error: 'An account with this email already exists.' };
        }

        const hashedPass = await this._hash(password);
        const user = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim() || '',
            address: address?.trim() || '',
            avatar: '',
            hashedPass,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        this._saveUsers(users);
        this._setSession(user);
        return { ok: true, user };
    },

    async login(email, password) {
        if (!email || !password) return { ok: false, error: 'Email and password are required.' };

        const users = this._getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());
        if (!user) return { ok: false, error: 'Invalid email or password.' };

        const hashedPass = await this._hash(password);
        if (user.hashedPass !== hashedPass) return { ok: false, error: 'Invalid email or password.' };

        this._setSession(user);
        return { ok: true, user };
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    _setSession(user) {
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            token: crypto.randomUUID(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    },

    getSession() {
        try {
            const session = JSON.parse(localStorage.getItem(this.SESSION_KEY));
            if (!session || Date.now() > session.expiresAt) {
                localStorage.removeItem(this.SESSION_KEY);
                return null;
            }
            return session;
        } catch { return null; }
    },

    isLoggedIn() {
        return this.getSession() !== null;
    },

    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        const users = this._getUsers();
        return users.find(u => u.id === session.id) || null;
    },

    async updateProfile({ name, email, phone, address, avatar }) {
        const session = this.getSession();
        if (!session) return { ok: false, error: 'Not logged in.' };

        if (name && name.trim().length < 2) return { ok: false, error: 'Name must be at least 2 characters.' };
        if (email && !this.EMAIL_REGEX.test(email)) return { ok: false, error: 'Please enter a valid email.' };
        if (phone && !this.PHONE_REGEX.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };

        const users = this._getUsers();
        const idx = users.findIndex(u => u.id === session.id);
        if (idx === -1) return { ok: false, error: 'User not found.' };

        // Check email uniqueness
        if (email && email.toLowerCase() !== users[idx].email) {
            if (users.find(u => u.email === email.toLowerCase())) {
                return { ok: false, error: 'Email already in use.' };
            }
        }

        if (name) users[idx].name = name.trim();
        if (email) users[idx].email = email.toLowerCase().trim();
        if (phone !== undefined) users[idx].phone = phone.trim();
        if (address !== undefined) users[idx].address = address.trim();
        if (avatar !== undefined) users[idx].avatar = avatar;

        this._saveUsers(users);
        this._setSession(users[idx]);
        return { ok: true, user: users[idx] };
    },

    async changePassword(currentPass, newPass) {
        const session = this.getSession();
        if (!session) return { ok: false, error: 'Not logged in.' };

        if (!this.PASS_REGEX.test(newPass)) {
            return { ok: false, error: 'New password must be 8+ chars with uppercase, lowercase, number, and special character.' };
        }

        const users = this._getUsers();
        const idx = users.findIndex(u => u.id === session.id);
        if (idx === -1) return { ok: false, error: 'User not found.' };

        const hashedCurrent = await this._hash(currentPass);
        if (users[idx].hashedPass !== hashedCurrent) return { ok: false, error: 'Current password is incorrect.' };

        users[idx].hashedPass = await this._hash(newPass);
        this._saveUsers(users);
        return { ok: true };
    },

    // Update nav UI based on auth state
    updateNavUI() {
        const authBtn = document.getElementById('authNavBtn');
        if (!authBtn) return;

        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            const initial = (user?.name?.[0] || 'U').toUpperCase();
            authBtn.innerHTML = `
                <a href="profile.html" class="nav-user" title="My Profile">
                    <span class="nav-avatar">${user?.avatar ? `<img src="${this._sanitize(user.avatar)}" alt="">` : initial}</span>
                    <span class="nav-username">${this._sanitize(user?.name?.split(' ')[0] || 'User')}</span>
                </a>
            `;
        } else {
            authBtn.innerHTML = `<a href="login.html" class="nav-cta">Login</a>`;
        }
    },

    _sanitize(str) {
        const el = document.createElement('div');
        el.textContent = str || '';
        return el.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => AUTH.updateNavUI());
