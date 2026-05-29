<template>
  <div class="product-management-container p-4 mx-auto">
    <h2 class="mb-4 font-weight-bold">Product Management</h2>
    
    <div class="management-card p-4 mb-5">
      <h3 class="h5 mb-4 text-secondary font-weight-bold">
        {{ isEditing ? '✏️ Edit Existing Product' : '✨ Create New Product' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="product-form">
        <div class="form-group mb-3">
          <label for="productName" class="form-label small font-weight-bold text-muted text-uppercase mb-2">
            Product Name
          </label>
          <input 
            type="text" 
            id="productName" 
            v-model="form.name" 
            class="form-control-custom" 
            placeholder="e.g., Piano Skirt" 
            required 
          />
        </div>
        
        <div class="form-row-grid mb-4">
          <div class="form-group">
            <label for="productPrice" class="form-label small font-weight-bold text-muted text-uppercase mb-2">
              Price ($)
            </label>
            <input 
              type="number" 
              id="productPrice" 
              v-model.number="form.price" 
              step="0.01" 
              class="form-control-custom" 
              placeholder="0.00" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="productStock" class="form-label small font-weight-bold text-muted text-uppercase mb-2">
              Available Stock
            </label>
            <input 
              type="number" 
              id="productStock" 
              v-model.number="form.stock" 
              class="form-control-custom" 
              placeholder="0" 
              required 
            />
          </div>
        </div>
        
        <div class="action-buttons-row">
          <button type="submit" class="btn-action btn-submit flex-grow-1">
            {{ isEditing ? 'Update Product' : 'Add Product' }}
          </button>
          
          <button 
            v-if="isEditing" 
            type="button" 
            @click="cancelEdit" 
            class="btn-action btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div class="inventory-section">
      <h3 class="h5 mb-3 text-dark font-weight-bold">Current Stock Inventory</h3>
      
      <div class="search-wrapper mb-4">
        <div class="search-input-container">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-bar-input" 
            placeholder="Search..."
          />
          <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search" title="Clear query">
            ✕
          </button>
        </div>
        <div v-if="searchQuery" class="search-feedback small text-muted mt-2">
          Showing {{ filteredAndSortedProducts.length }} of {{ products.length }} items in matching criteria
        </div>
      </div>
      
      <div class="table-responsive-wrapper">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredAndSortedProducts" :key="product.id">
              <td class="font-weight-medium text-dark">{{ product.name }}</td>
              <td class="text-secondary">${{ Number(product.price).toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', product.stock <= 2 ? 'stock-low' : 'stock-normal']">
                  {{ product.stock }} units
                </span>
              </td>
              <td>
                <div class="table-actions-cell">
                  <button @click="startEdit(product)" class="btn-table btn-table-edit">
                    Edit
                  </button>
                  <button @click="deleteProduct(product.id)" class="btn-table btn-table-delete">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            
            <tr v-if="filteredAndSortedProducts.length === 0">
              <td colspan="4" class="text-center text-muted py-4">
                {{ products.length === 0 ? 'No products found in the database inventory.' : `No items match your search for "${searchQuery}"` }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      searchQuery: '', // Tracks the active filter input text string
      isEditing: false,
      form: {
        id: null,
        name: '',
        price: '',
        stock: ''
      }
    };
  },
  computed: {
    // Pipeline combined filter and alphabetical sorting block map rules
    filteredAndSortedProducts() {
      // 1. Convert lookup text query to regular casing format standards
      const query = this.searchQuery.toLowerCase().trim();
      let result = [...this.products];

      // 2. Filter match items conditionally
      if (query) {
        result = result.filter(product => {
          return (
            (product.name && product.name.toLowerCase().includes(query)) ||
            (product.price && String(product.price).includes(query))
          );
        });
      }

      // 3. Sort remaining filtered assets smoothly from A to Z alphabetics
      return result.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();
        return nameA.localeCompare(nameB);
      });
    }
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('https://stylecart-backend-b3zd.onrender.com/api/products');
        if (response.ok) {
          this.products = await response.json();
        }
      } catch (err) {
        console.error("Error loading products:", err);
      }
    },
    clearSearch() {
      this.searchQuery = '';
    },
    async handleSubmit() {
      // 🎯 NOTE: Changed endpoint structure to match your backend routes exactly.
      // Removed the /admin/ segment so it maps directly to /api/products
      const url = this.isEditing 
        ? `https://stylecart-backend-b3zd.onrender.com/api/products/${this.form.id}`
        : 'https://stylecart-backend-b3zd.onrender.com/api/products';
      
      const method = this.isEditing ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.form.name,
            price: Number(this.form.price),
            stock: Number(this.form.stock),
            // Added default values for properties required by your MongoDB schema
            category: this.form.category || 'Apparel',
            imageName: this.form.imageName || 'skirt.jpg',
            description: this.form.description || 'New arrivals collection piece.'
          })
        });

        if (response.ok) {
          alert(this.isEditing ? "Product updated successfully!" : "Product added successfully!");
          this.resetForm();
          await this.fetchProducts(); 
        } else {
          const data = await response.json();
          alert(data.error || "Operation failed.");
        }
      } catch (err) {
        alert("Network connection error.");
      }
    },
    async deleteProduct(id) {
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        // 🎯 FIXED: Aligned delete routing path format to match backend constraints
        const response = await fetch(`https://stylecart-backend-b3zd.onrender.com/api/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert("Product removed from inventory.");
          await this.fetchProducts();
        } else {
          alert("Could not complete delete operation.");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    },
    startEdit(product) {
      this.isEditing = true;
      this.form = { ...product };
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.isEditing = false;
      this.form = { id: null, name: '', price: '', stock: '' };
    }
  }
}
</script>

<style scoped>
.product-management-container {
  max-width: 900px;
}

/* --- FORM STYLES --- */
.management-card {
  background: var(--bg-card, #fdfdfd);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border-color, #eaeaea);
}
.form-label { display: block; letter-spacing: 0.5px; }
.form-control-custom {
  width: 100%; padding: 12px 16px; font-size: 1rem;
  border: 1px solid var(--input-border, #ddd); border-radius: 8px; box-sizing: border-box;
  background-color: var(--input-bg, #ffffff);
  color: var(--text-main, #333);
}
.form-control-custom:focus { border-color: #222; outline: none; }
.form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.action-buttons-row { display: flex; align-items: center; gap: 12px; }
.flex-grow-1 { flex: 1; }
.btn-action { padding: 14px 24px; font-size: 1rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; }
.btn-submit { background-color: #222; color: #fff; }
.btn-cancel { background-color: #f1f3f5; color: #495057; border: 1px solid #e9ecef; }

/* --- FILTER UTILITY BAR EXTENSION STYLES --- */
.search-wrapper {
  max-width: 100%;
}
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  color: #aaa;
  pointer-events: none;
}
.search-bar-input {
  width: 100%;
  padding: 12px 40px 12px 46px;
  font-size: 0.95rem;
  background-color: var(--input-bg, #f9f9f9);
  border: 1px solid var(--border-color, #e2e2e2);
  color: var(--text-main, #333);
  border-radius: 30px;
  transition: all 0.2s ease;
}
.search-bar-input:focus {
  background-color: var(--bg-card, #ffffff);
  border-color: #222;
  outline: none;
}
.btn-clear-search {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #bbb;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px;
}
.btn-clear-search:hover { color: #333; }
.search-feedback { padding-left: 14px; font-style: italic; }

/* --- TABLE INVENTORY STYLES --- */
.table-responsive-wrapper {
  background: var(--bg-card, white);
  border: 1px solid var(--border-color, #eee);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}
.inventory-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
}
.inventory-table th {
  background-color: var(--input-bg, #f8f9fa);
  color: var(--text-muted, #6c757d);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #eee);
}
.inventory-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #f8f9fa);
  vertical-align: middle;
  color: var(--text-main);
}
.inventory-table tbody tr:hover {
  background-color: var(--input-bg, #fafbfc);
}

/* Stock Badges */
.stock-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.stock-normal { background-color: #e6f4ea; color: #137333; }
.stock-low { background-color: #fce8e6; color: #c5221f; } 

/* Table Button Triggers */
.table-actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
.btn-table {
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-table:hover { opacity: 0.85; }
.btn-table-edit { background-color: #e9ecef; color: #495057; }
.btn-table-delete { background-color: #fce8e6; color: #c5221f; }

/* Responsive adjustments */
@media (max-width: 576px) {
  .form-row-grid { grid-template-columns: 1fr; gap: 15px; }
  .inventory-table th, .inventory-table td { padding: 12px; }
}
</style>