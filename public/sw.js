const CACHE_NAME = 'todo-app-v1';
const STATIC_CACHE = 'todo-static-v1';
const DYNAMIC_CACHE = 'todo-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.origin === 'https://api.oluwasetemi.dev') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached response if available
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for todos
              if (request.url.includes('/todos')) {
                return new Response(
                  JSON.stringify({
                    data: [],
                    message: 'You are offline. Data will sync when connection is restored.',
                    offline: true
                  }),
                  {
                    headers: { 'Content-Type': 'application/json' }
                  }
                );
              }
              throw new Error('Network request failed');
            });
          });
      })
    );
  } else {
    // Handle static assets
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          // Cache new static assets
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });

        // Remove successful action from pending
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for pending actions
function getPendingActions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('todo-app-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending-actions'], 'readonly');
      const store = transaction.objectStore('pending-actions');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-actions')) {
        db.createObjectStore('pending-actions', { keyPath: 'id' });
      }
    };
  });
}

function removePendingAction(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('todo-app-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending-actions'], 'readwrite');
      const store = transaction.objectStore('pending-actions');
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}
