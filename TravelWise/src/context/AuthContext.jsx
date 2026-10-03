import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const CUSTOMER_KEY = 'tw_customer_session';
const ADMIN_KEY = 'tw_admin_session';
const CUSTOMER_USERS_KEY = 'tw_customer_users';
const CUSTOMER_TOKEN_KEY = 'tw_customer_token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CUSTOMER_KEY);
      const a = localStorage.getItem(ADMIN_KEY);
      if (c) setCustomer(JSON.parse(c));
      if (a) setAdmin(JSON.parse(a));
    } catch {
      // ignore corrupted storage
    } finally {
      setReady(true);
    }
  }, []);

  // Helpers to read/write the list of registered customers.
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

  // NOTE: This is a frontend-only simulation. Passwords are stored in plain
  // text in localStorage for demo purposes only. Replace with real API auth
  // in the backend phase.
  const registerCustomer = (data) => {
    const email = data.email?.trim().toLowerCase();
    if (!email || !data.password || data.password.length < 4) {
      return { success: false, message: 'Enter a valid email and password (min 4 characters).' };
    }

    const users = getRegisteredUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser = { name: data.name || email.split('@')[0].replace(/[._]/g, ' '), email, password: data.password };
    users.push(newUser);
    saveRegisteredUsers(users);

    const session = { name: newUser.name, email: newUser.email };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
    setCustomer(session);
    return { success: true };
  };

  const loginCustomer = (email, password) => {
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !password || password.length < 4) {
      return { success: false, message: 'Enter a valid email and password (min 4 characters).' };
    }

    const users = getRegisteredUsers();
    const match = users.find((u) => u.email === cleanEmail);

    if (!match) {
      return { success: false, message: 'No account found with this email. Please register first.' };
    }
    if (match.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const session = { name: match.name, email: match.email };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
    setCustomer(session);
    return { success: true };
  };

  // Real backend call: sends the Google ID token to our Express server,
  // which verifies it with Google, creates/finds the user in MongoDB,
  // and returns our own JWT.
  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Google sign-in failed.' };
      }

      const session = { name: data.user.name, email: data.user.email, picture: data.user.picture };
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      setCustomer(session);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Could not reach the server. Please try again.' };
    }
  };

  const updateCustomer = (updates) => {
    setCustomer((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(next));

      // Keep the registered-users record in sync so future logins see updates.
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

  const loginAdmin = (email, password) => {
    if (!email || !password || password.length < 4) {
      return { success: false, message: 'Enter valid admin credentials.' };
    }
    const session = { name: 'Admin', email };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    setAdmin(session);
    return { success: true };
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_KEY);
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