/**
 * IndexedDB Database Service for PDF Resume Binary Files
 * Database: JobTrackResumeDB
 * Table: resumes
 */

const DB_NAME = 'JobTrackResumeDB';
const DB_VERSION = 1;
const STORE_NAME = 'resumes';

export function openResumeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('isPrimary', 'isPrimary', { unique: false });
        store.createIndex('uploadDate', 'uploadDate', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Save or update a resume file object in IndexedDB
 */
export async function saveResumeFile(resumeData) {
  const db = await openResumeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // If setting as primary, demote existing primary resumes first
    if (resumeData.isPrimary) {
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.isPrimary && cursor.value.id !== resumeData.id) {
            const updated = { ...cursor.value, isPrimary: false };
            cursor.update(updated);
          }
          cursor.continue();
        }
      };
    }

    const putRequest = store.put(resumeData);
    putRequest.onsuccess = () => resolve(resumeData);
    putRequest.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Get all resume metadata records from IndexedDB
 */
export async function getAllResumes() {
  const db = await openResumeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.getAll();

    getRequest.onsuccess = () => {
      resolve(getRequest.result || []);
    };
    getRequest.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Get a specific resume record by ID
 */
export async function getResumeById(id) {
  const db = await openResumeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => resolve(getRequest.result || null);
    getRequest.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Get primary resume file
 */
export async function getPrimaryResume() {
  const all = await getAllResumes();
  return all.find(r => r.isPrimary) || all[0] || null;
}

/**
 * Set a resume as primary
 */
export async function setPrimaryResumeFile(id) {
  const all = await getAllResumes();
  const db = await openResumeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    all.forEach(item => {
      const updated = { ...item, isPrimary: item.id === id };
      store.put(updated);
    });

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Delete a resume by ID
 */
export async function deleteResumeFile(id) {
  const db = await openResumeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => resolve(true);
    deleteRequest.onerror = (e) => reject(e.target.error);
  });
}
