// src/utils/api.js
// Simple API helper and auth helpers.
// Adjust API_BASE if your backend isn't on localhost:4000

export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// token helpers (dev-friendly)
export function saveToken(token) {
  if (!token) return;
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

// build headers including Authorization if token exists
export function authHeaders(contentType = 'application/json') {
  const token = getToken();
  const headers = {};
  if (contentType) headers['Content-Type'] = contentType;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// helper to handle non-OK responses and parse JSON
export async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const message = (data && data.error) || (data && data.message) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}
