/**
 * Safe LocalStorage Utility for JobTrack
 * Handles JSON serialization, deserialization, corruption recovery, and error catching.
 */

export const STORAGE_KEYS = {
  PROFILE: 'jobtrack_profile',
  SAVED_JOBS: 'jobtrack_saved_jobs',
  APPLICATIONS: 'jobtrack_applications'
};

export function getStoredItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`LocalStorage read error for key "${key}":`, error.message);
    return defaultValue;
  }
}

export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`LocalStorage write error for key "${key}":`, error.message);
    return false;
  }
}

export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`LocalStorage remove error for key "${key}":`, error.message);
    return false;
  }
}
