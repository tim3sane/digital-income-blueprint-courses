/**
 * Digital Income Blueprint — Auth Module
 * Uses Supabase for backend auth + PostgreSQL
 * Falls back to localStorage if Supabase is not configured
 */

const AUTH = {
    _supabase: null,
    _useSupabase: false,

    // Validation rules
    PASS_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s\-().]{7,20}$/,

    // LocalStorage keys (fallback mode)
    USERS_KEY: 'dib_users',
    SESSION_KEY: 'dib_session',

    // Initialize (called immediately when script loads)
    init() {
        if (typeof CONFIG !== 'undefined' &&
            CONFIG.SUPABASE_URL &&
            CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' &&
            typeof supabase !== 'undefined') {
            this._supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
            this._useSupabase = true;
        } else {
            // Local fallback mode
        }
    },

    // ========== REGISTER ==========
    async register({ name, email, password, phone, address }) {
        // Validations
        if (!name || name.trim().length < 2) return { ok: false, error: 'Name must be at least 2 characters.' };
        if (!this.EMAIL_REGEX.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
        if (!this.PASS_REGEX.test(password)) return { ok: false, error: 'Password must be 8+ chars with uppercase, lowercase, number, and special character.' };
        if (phone && !this.PHONE_REGEX.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };

        if (this._useSupabase) {
            return this._supabaseRegister({ name, email, password, phone, address });
        }
        return this._localRegister({ name, email, password, phone, address });
    },

    // ========== LOGIN ==========
    async login(email, password) {
        if (!email || !password) return { ok: false, error: 'Email and password are required.' };

        if (this._useSupabase) {
            return this._supabaseLogin(email, password);
        }
        return this._localLogin(email, password);
    },

    // ========== LOGOUT ==========
    async logout() {
        if (this._useSupabase) {
            await this._supabase.auth.signOut();
            localStorage.removeItem('dib_supabase_user');
        }
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    // ========== SESSION ==========
    async isLoggedIn() {
        if (this._useSupabase) {
            const { data } = await this._supabase.auth.getSession();
            return !!data.session;
        }
        return this._localGetSession() !== null;
    },

    isLoggedInSync() {
        if (this._useSupabase) {
            // Check localStorage cache for sync check
            const cached = localStorage.getItem('dib_supabase_user');
            return !!cached;
        }
        return this._localGetSession() !== null;
    },

    // ========== GET CURRENT USER ==========
    async getCurrentUser() {
        if (this._useSupabase) {
            return this._supabaseGetUser();
        }
        return this._localGetUser();
    },

    getCurrentUserSync() {
        if (this._useSupabase) {
            try { return JSON.parse(localStorage.getItem('dib_supabase_user')); } catch { return null; }
        }
        return this._localGetUser();
    },

    // ========== UPDATE PROFILE ==========
    async updateProfile({ name, email, phone, address, avatar }) {
        if (name && name.trim().length < 2) return { ok: false, error: 'Name must be at least 2 characters.' };
        if (email && !this.EMAIL_REGEX.test(email)) return { ok: false, error: 'Please enter a valid email.' };
        if (phone && !this.PHONE_REGEX.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };

        if (this._useSupabase) {
            return this._supabaseUpdateProfile({ name, email, phone, address, avatar });
        }
        return this._localUpdateProfile({ name, email, phone, address, avatar });
    },

    // ========== CHANGE PASSWORD ==========
    async changePassword(currentPass, newPass) {
        if (!this.PASS_REGEX.test(newPass)) {
            return { ok: false, error: 'New password must be 8+ chars with uppercase, lowercase, number, and special character.' };
        }

        if (this._useSupabase) {
            const { error } = await this._supabase.auth.updateUser({ password: newPass });
            if (error) return { ok: false, error: error.message };
            return { ok: true };
        }
        return this._localChangePassword(currentPass, newPass);
    },

    // ========== ADMIN ==========
    async isAdmin() {
        const user = await this.getCurrentUser();
        return user?.role === 'admin';
    },

    async getAllUsers() {
        if (!await this.isAdmin()) return { ok: false, error: 'Unauthorized.' };
        if (this._useSupabase) {
            const { data, error } = await this._supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error) return { ok: false, error: error.message };
            return { ok: true, users: data };
        }
        return { ok: true, users: this._getUsers() };
    },

    async updateUserRole(userId, role) {
        if (!await this.isAdmin()) return { ok: false, error: 'Unauthorized.' };
        if (this._useSupabase) {
            const { error } = await this._supabase.from('profiles').update({ role }).eq('id', userId);
            if (error) return { ok: false, error: error.message };
            return { ok: true };
        }
        return { ok: false, error: 'Role management requires Supabase.' };
    },

    // =============================================
    // SUPABASE IMPLEMENTATION
    // =============================================

    async _supabaseRegister({ name, email, password, phone, address }) {
        try {
            const { data, error } = await this._supabase.auth.signUp({
                email: email.toLowerCase().trim(),
                password,
                options: {
                    data: { name: name.trim() }
                }
            });

            if (error) return { ok: false, error: error.message };

            if (!data.user) {
                return { ok: false, error: 'Registration failed. Please check your email settings.' };
            }

            // Upsert profile to ensure it exists even if trigger failed
            await this._supabase.from('profiles').upsert({
                id: data.user.id,
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone?.trim() || '',
                address: address?.trim() || '',
                role: 'user',
                avatar_url: ''
            }, { onConflict: 'id' });

            const user = { id: data.user.id, name: name.trim(), email: data.user.email, phone, address, role: 'user', avatar_url: '', created_at: new Date().toISOString() };
            localStorage.setItem('dib_supabase_user', JSON.stringify(user));

            return { ok: true, user: data.user };
        } catch (err) {
            return { ok: false, error: 'Connection error. Please try again.' };
        }
    },

    async _supabaseLogin(email, password) {
        const { data, error } = await this._supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password
        });

        if (error) return { ok: false, error: 'Invalid email or password.' };

        // Cache user profile
        const profile = await this._supabaseGetUser();
        if (profile) {
            localStorage.setItem('dib_supabase_user', JSON.stringify(profile));
        }

        return { ok: true, user: data.user };
    },

    async _supabaseGetUser() {
        const { data: { user } } = await this._supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await this._supabase.from('profiles').select('*').eq('id', user.id).single();

        const merged = {
            id: user.id,
            name: profile?.name || user.user_metadata?.name || '',
            email: user.email,
            phone: profile?.phone || '',
            address: profile?.address || '',
            avatar_url: profile?.avatar_url || '',
            avatar: profile?.avatar_url || '',
            role: profile?.role || 'user',
            created_at: profile?.created_at || user.created_at,
            createdAt: profile?.created_at || user.created_at
        };

        localStorage.setItem('dib_supabase_user', JSON.stringify(merged));
        return merged;
    },

    async _supabaseUpdateProfile({ name, email, phone, address, avatar }) {
        const { data: { user } } = await this._supabase.auth.getUser();
        if (!user) return { ok: false, error: 'Not logged in.' };

        // Update email in auth if changed
        if (email && email.toLowerCase() !== user.email) {
            const { error } = await this._supabase.auth.updateUser({ email: email.toLowerCase() });
            if (error) return { ok: false, error: error.message };
        }

        // Handle avatar upload
        let avatar_url = undefined;
        if (avatar && avatar.startsWith('data:image/')) {
            const mimeMatch = avatar.match(/^data:(image\/(?:png|jpe?g|gif|webp));base64,/);
            if (!mimeMatch) return { ok: false, error: 'Invalid image format. Use PNG, JPG, GIF, or WebP.' };

            const base64 = avatar.split(',')[1];
            if (base64.length > 2 * 1024 * 1024 * 1.37) return { ok: false, error: 'Image must be under 2MB.' };

            let bytes;
            try { bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0)); }
            catch { return { ok: false, error: 'Invalid image data.' }; }
            const ext = mimeMatch[1].includes('png') ? 'png' : 'jpg';
            const path = `${user.id}/avatar.${ext}`;

            const { error: uploadError } = await this._supabase.storage
                .from('avatars')
                .upload(path, bytes, { contentType: `image/${ext}`, upsert: true });

            if (!uploadError) {
                const { data: urlData } = this._supabase.storage.from('avatars').getPublicUrl(path);
                avatar_url = urlData.publicUrl + '?t=' + Date.now();
            }
        }

        // Update profile table
        const updates = {};
        if (name) updates.name = name.trim();
        if (phone !== undefined) updates.phone = phone.trim();
        if (address !== undefined) updates.address = address.trim();
        if (avatar_url) updates.avatar_url = avatar_url;

        const { error } = await this._supabase.from('profiles').update(updates).eq('id', user.id);
        if (error) return { ok: false, error: error.message };

        // Refresh cache
        const updated = await this._supabaseGetUser();
        return { ok: true, user: updated };
    },

    // =============================================
    // LOCAL (FALLBACK) IMPLEMENTATION
    // =============================================

    _getUsers() {
        try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]'); } catch { return []; }
    },
    _saveUsers(users) { localStorage.setItem(this.USERS_KEY, JSON.stringify(users)); },

    async _hash(str) {
        const data = new TextEncoder().encode(str + 'dib_salt_2026');
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async _localRegister({ name, email, password, phone, address }) {
        const users = this._getUsers();
        if (users.find(u => u.email === email.toLowerCase())) {
            return { ok: false, error: 'An account with this email already exists.' };
        }

        const user = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim() || '',
            address: address?.trim() || '',
            avatar: '',
            role: users.length === 0 ? 'admin' : 'user', // First user is admin
            hashedPass: await this._hash(password),
            createdAt: new Date().toISOString()
        };

        users.push(user);
        this._saveUsers(users);
        this._localSetSession(user);
        return { ok: true, user };
    },

    async _localLogin(email, password) {
        const users = this._getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());
        if (!user) return { ok: false, error: 'Invalid email or password.' };

        if (user.hashedPass !== await this._hash(password)) return { ok: false, error: 'Invalid email or password.' };

        this._localSetSession(user);
        return { ok: true, user };
    },

    _localSetSession(user) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify({
            id: user.id, name: user.name, email: user.email,
            token: crypto.randomUUID(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        }));
    },

    _localGetSession() {
        try {
            const s = JSON.parse(localStorage.getItem(this.SESSION_KEY));
            if (!s || Date.now() > s.expiresAt) { localStorage.removeItem(this.SESSION_KEY); return null; }
            return s;
        } catch { return null; }
    },

    _localGetUser() {
        const s = this._localGetSession();
        if (!s) return null;
        return this._getUsers().find(u => u.id === s.id) || null;
    },

    async _localUpdateProfile({ name, email, phone, address, avatar }) {
        const s = this._localGetSession();
        if (!s) return { ok: false, error: 'Not logged in.' };

        const users = this._getUsers();
        const idx = users.findIndex(u => u.id === s.id);
        if (idx === -1) return { ok: false, error: 'User not found.' };

        if (email && email.toLowerCase() !== users[idx].email) {
            if (users.find(u => u.email === email.toLowerCase())) return { ok: false, error: 'Email already in use.' };
        }

        if (name) users[idx].name = name.trim();
        if (email) users[idx].email = email.toLowerCase().trim();
        if (phone !== undefined) users[idx].phone = phone.trim();
        if (address !== undefined) users[idx].address = address.trim();
        if (avatar !== undefined) users[idx].avatar = avatar;

        this._saveUsers(users);
        this._localSetSession(users[idx]);
        return { ok: true, user: users[idx] };
    },

    async _localChangePassword(currentPass, newPass) {
        const s = this._localGetSession();
        if (!s) return { ok: false, error: 'Not logged in.' };

        const users = this._getUsers();
        const idx = users.findIndex(u => u.id === s.id);
        if (idx === -1) return { ok: false, error: 'User not found.' };

        if (users[idx].hashedPass !== await this._hash(currentPass)) return { ok: false, error: 'Current password is incorrect.' };

        users[idx].hashedPass = await this._hash(newPass);
        this._saveUsers(users);
        return { ok: true };
    },

    // =============================================
    // NAV UI
    // =============================================

    updateNavUI() {
        const authBtn = document.getElementById('authNavBtn');
        if (!authBtn) return;

        const loggedIn = this.isLoggedInSync();
        if (loggedIn) {
            const user = this.getCurrentUserSync();
            const initial = (user?.name?.[0] || 'U').toUpperCase();
            const avatarSrc = user?.avatar_url || user?.avatar;
            authBtn.innerHTML = `
                <a href="profile.html" class="nav-user" title="My Profile">
                    <span class="nav-avatar">${avatarSrc ? `<img src="${this._sanitize(avatarSrc)}" alt="">` : initial}</span>
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

// Init immediately so isLoggedInSync() works in inline scripts
AUTH.init();
// Update nav UI once DOM is ready
document.addEventListener('DOMContentLoaded', () => AUTH.updateNavUI());
