/**
 * Frontend Authentication LocalStorage Service
 * Centralizes user account storage (jobtrack_users) and session state (jobtrack_session).
 */

const USERS_KEY = 'jobtrack_users';
const SESSION_KEY = 'jobtrack_session';

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading users from LocalStorage:', err);
    return [];
  }
}

export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error reading session from LocalStorage:', err);
    return null;
  }
}

export function setCurrentSession(user) {
  try {
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      profileCompleted: Boolean(user.profileCompleted)
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
  } catch (err) {
    console.error('Error setting session in LocalStorage:', err);
    throw new Error('Failed to create login session.');
  }
}

export function clearCurrentSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Error clearing session:', err);
  }
}

export async function registerUser({ name, email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Check if account already exists
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: cleanName,
    email: cleanEmail,
    password: password, // Simulated frontend auth storage
    createdAt: new Date().toISOString(),
    profileCompleted: false
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Automatically start session for new user
  const session = setCurrentSession(newUser);
  return session;
}

export async function loginUser({ email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();

  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No account found with this email address. Please check your email or register.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const session = setCurrentSession(user);
  return session;
}

export function updateUserProfileCompleted(userId) {
  try {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].profileCompleted = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const session = getCurrentSession();
    if (session && session.id === userId) {
      session.profileCompleted = true;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Error updating user profile completed state:', err);
  }
}
