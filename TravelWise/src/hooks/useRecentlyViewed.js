// src/hooks/useRecentlyViewed.js
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const MAX_ITEMS = 8;

// Each logged-in customer gets their own list.
const keyFor = (customer) => `tw_recent_${customer?.email || 'guest'}`;

const readList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function useRecentlyViewed() {
  const { customer } = useAuth();
  const key = keyFor(customer);
  const [items, setItems] = useState(() => readList(key));

  // Reload the list if a different user logs in.
  useEffect(() => {
    setItems(readList(key));
  }, [key]);

  // item = { type: 'destination' | 'package', id, title, image, path }
  const addRecent = useCallback(
    (item) => {
      const current = readList(key);
      const withoutDuplicate = current.filter(
        (i) => !(i.type === item.type && String(i.id) === String(item.id))
      );
      const next = [{ ...item, viewedAt: Date.now() }, ...withoutDuplicate].slice(0, MAX_ITEMS);
      localStorage.setItem(key, JSON.stringify(next));
      setItems(next);
    },
    [key]
  );

  const clearRecent = useCallback(() => {
    localStorage.removeItem(key);
    setItems([]);
  }, [key]);

  return { items, addRecent, clearRecent };
}