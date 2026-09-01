import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const CUSTOMER_KEY = 'tw_customer_session';
const ADMIN_KEY = 'tw_admin_session';

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

  // NOTE: This is a frontend-only simulation. No real authentication or
  // security is implemented. Replace with real API auth in the backend phase.
  const loginCustomer = (email, password) => {
    if (!email || !password || password.length < 4) {
      return { success: false, message: 'Enter a valid email and password (min 4 characters).' };
    }
    const session = { name: email.split('@')[0].replace(/[._]/g, ' '), email };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
    setCustomer(session);
    return { success: true };
  };

  const registerCustomer = (data) => {
    const session = { name: data.name, email: data.email };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
    setCustomer(session);
    return { success: true };
  };

  const updateCustomer = (updates) => {
    setCustomer((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logoutCustomer = () => {
    localStorage.removeItem(CUSTOMER_KEY);
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
