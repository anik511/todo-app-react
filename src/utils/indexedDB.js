// IndexedDB utility for persistent todo storage
class TodoIndexedDB {
  constructor() {
    this.dbName = 'TodoAppDB';
    this.dbVersion = 1;
    this.storeName = 'todos';
    this.db = null;
  }

  // Initialize the database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create the todos object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { 
            keyPath: 'id' 
          });
          
          // Create indexes for efficient querying
          objectStore.createIndex('status', 'status', { unique: false });
          objectStore.createIndex('priority', 'priority', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('dueDate', 'dueDate', { unique: false });
          
          console.log('IndexedDB object store created');
        }
      };
    });
  }

  // Get all todos from the database
  async getAllTodos() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => {
        console.error('Failed to get todos:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  // Save a single todo to the database
  async saveTodo(todo) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(todo);

      request.onerror = () => {
        console.error('Failed to save todo:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // Save multiple todos to the database
  async saveTodos(todos) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      // Clear existing data first
      const clearRequest = objectStore.clear();
      
      clearRequest.onsuccess = () => {
        // Add all todos
        let completedCount = 0;
        const totalCount = todos.length;
        
        if (totalCount === 0) {
          resolve();
          return;
        }
        
        todos.forEach(todo => {
          const addRequest = objectStore.add(todo);
          
          addRequest.onsuccess = () => {
            completedCount++;
            if (completedCount === totalCount) {
              resolve();
            }
          };
          
          addRequest.onerror = () => {
            console.error('Failed to save todo:', addRequest.error);
            reject(addRequest.error);
          };
        });
      };
      
      clearRequest.onerror = () => {
        console.error('Failed to clear todos:', clearRequest.error);
        reject(clearRequest.error);
      };
    });
  }

  // Delete a todo from the database
  async deleteTodo(id) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onerror = () => {
        console.error('Failed to delete todo:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  // Get todos by status
  async getTodosByStatus(status) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('status');
      const request = index.getAll(status);

      request.onerror = () => {
        console.error('Failed to get todos by status:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  // Get overdue todos
  async getOverdueTodos() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => {
        console.error('Failed to get overdue todos:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const now = new Date();
        const overdueTodos = request.result.filter(todo => 
          todo.status === 'Ongoing' && 
          todo.dueDate && 
          new Date(todo.dueDate) < now
        );
        resolve(overdueTodos);
      };
    });
  }

  // Close the database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create and export a singleton instance
const todoIndexedDB = new TodoIndexedDB();
export default todoIndexedDB;
