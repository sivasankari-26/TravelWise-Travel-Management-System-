import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const CUSTOMER_KEY = 'tw_customer_session';
const ADMIN_KEY = 'tw_admin_session';
const CUSTOMER_USERS_KEY = 'tw_customer_users';
const CUSTOMER_TOKEN_KEY = 'tw_customer_token';
const ADMIN_TOKEN_KEY = 'tw_admin_token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Reads the JWT payload to check the role and expiry.
// This only decides what the UI shows. The server is what really enforces security.
const isValidAdminToken = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.role === 'admin' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CUSTOMER_KEY);
      if (c) setCustomer(JSON.parse(c));

      // Admin session is only restored if it has a valid, unexpired admin JWT.
      const a = localStorage.getItem(ADMIN_KEY);
      const at = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (a && at && isValidAdminToken(at)) {
        setAdmin(JSON.parse(a));
      } else {
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setReady(true);
    }
  }, []);

  // Kept only so updateCustomer (profile edits) keeps working.
  const getRegisteredUsers = () => {
    try {
      const raw = localStorage.getItem(CUSTOMER_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUsers = (users) => {
    localStorage.setItem(CUSTOMER_USERS_KEY, JSON.stringify(users));
  };

  // Shared helper: saves the logged-in user + JWT after any real backend login.
  const saveSession = (data) => {
    const session = {
      name: data.user.name,
      email: data.user.email,
      picture: data.user.picture,
      role: data.user.role,
    };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
    localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
    setCustomer(session);
  };

  // Shared helper: sends a POST request to our Express backend.
  const postToServer = async (path, body) => {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Something went wrong.' };
      }
      saveSession(data);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not reach the server. Please try again.' };
    }
  };

  // Real backend: creates the user in MongoDB with a hashed password.
  const registerCustomer = (data) =>
    postToServer('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

  // Real backend: checks email + password in MongoDB, returns a JWT.
  const loginCustomer = (email, password) =>
    postToServer('/auth/login', { email, password });

  // Real backend: Google ID token -> our JWT.
  const loginWithGoogle = (googleToken) =>
    postToServer('/auth/google', { token: googleToken });

  const updateCustomer = (updates) => {
    setCustomer((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(next));

      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.email === prev.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        saveRegisteredUsers(users);
      }

      return next;
    });
  };

  const logoutCustomer = () => {
    localStorage.removeItem(CUSTOMER_KEY);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    setCustomer(null);
  };

  // Real backend: only accounts with role "admin" in MongoDB can log in here.
  const loginAdmin = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Enter your admin email and password.' };
    }
    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Invalid admin credentials.' };
      }
      const session = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setAdmin(session);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not reach the server. Please try again.' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        ready,
        loginCustomer,
        loginWithGoogle,
        registerCustomer,
        updateCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}