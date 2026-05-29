<template>
  <div class="products-page">
    <h1 class="page-title">Our Stylish Collection</h1>
    
    <div class="search-wrapper mb-4">
      <div class="search-input-container">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="search-bar-input" 
          placeholder="Search..."
        />
        <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search" title="Clear search">
          ✕
        </button>
      </div>
      <div v-if="searchQuery" class="search-feedback small text-muted mt-2">
        Showing {{ filteredProducts.length }} of {{ products.length }} item{{ filteredProducts.length === 1 ? '' : 's' }}
      </div>
    </div>

    <div v-if="filteredProducts.length > 0" class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <img :src="resolveProductImage(product.imageName || product.image)" :alt="product.name" class="product-img" />
        
        <div class="card-body">
          <h3>{{ product.name }}</h3>
          <p class="product-price">${{ Number(product.price || 0).toFixed(2) }}</p>
          
          <span class="stock-badge" :class="{ 'out-of-stock': !product.stock || product.stock === 0 }">
            {{ product.stock > 0 ? `${product.stock} available` : 'Sold Out' }}
          </span>

          <div class="button-group">
            <router-link :to="'/products/' + product.id" class="view-details-btn">View Details</router-link>
            <button 
              @click="addToCart(product)" 
              :disabled="!product.stock || product.stock === 0"
              class="add-to-cart-btn"
            >
              {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-search-state" v-else-if="products.length > 0 && filteredProducts.length === 0">
      <div class="empty-search-icon">🔎</div>
      <h3>No products match your search</h3>
      <p>We couldn't find anything matching "{{ searchQuery }}". Try checking your spelling or view our full inventory list!</p>
      <button @click="clearSearch" class="btn-reset-search">Clear Search Filter</button>
    </div>

    <div class="loading-state" v-else>
      <p>Curating our latest patterns from the live repository...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      searchQuery: '' // Reactive string model tracking the active user input data
    };
  },
  computed: {
    // List transforms reactively as inputs are manipulated on the client application
    filteredProducts() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        return this.products;
      }
      return this.products.filter(product => {
        return (
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.price && String(product.price).includes(query))
        );
      });
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error("Could not retrieve store inventory data.");
      
      this.products = await response.json();
    } catch (err) {
      console.error("Storefront network sync error:", err.message);
    }
  },
  methods: {
    resolveProductImage(imageName) {
      return imageName ? `/${imageName}` : '/new.jpg'; // Automatically assigns fallback asset image if missing
    },
    clearSearch() {
      this.searchQuery = '';
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('stylecart_items')) || [];
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageName: product.imageName || product.image,
          category: product.category,
          quantity: 1
        });
      }

      localStorage.setItem('stylecart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage-update'));
      alert(`${product.name} successfully added to style cart.`);
    }
  }
};
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 30px;
}
.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #222;
}

/* --- SEARCH UTIL COMPONENT STYLES --- */
.search-wrapper {
  max-width: 1200px;
  margin-bottom: 40px;
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
  background-color: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 30px;
  transition: all 0.2s ease;
}
.search-bar-input:focus {
  background-color: #ffffff;
  border-color: #333;
  outline: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
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

/* --- CORE CATALOG CARD STRUCTURES --- */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}
.product-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}
.product-img {
  width: 100%;
  height: 250px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}
.card-body h3 {
  margin: 15px 0 5px;
  font-size: 1.1rem;
  color: #2c3e50;
}
.product-price {
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}
.stock-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 15px;
}
.stock-badge.out-of-stock {
  color: #e74c3c;
}
.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.view-details-btn {
  display: block;
  text-decoration: none;
  background-color: #f4f4f4;
  color: #333;
  padding: 8px 16px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.view-details-btn:hover {
  background-color: #e2e2e2;
}
.add-to-cart-btn {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}
.add-to-cart-btn:hover:not(:disabled) {
  background-color: #FFB6C1;
  color: #222;
}
.add-to-cart-btn:disabled {
  background-color: #ccc;
  color: #777;
  cursor: not-allowed;
}

/* --- EMPTY SEARCH OVERLAY VIEWPORT --- */
.empty-search-state {
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #ddd;
  max-width: 600px;
  margin: 40px auto;
}
.empty-search-icon { font-size: 2.8rem; margin-bottom: 15px; }
.empty-search-state p { color: #7f8c8d; font-size: 0.95rem; margin-bottom: 20px; }
.btn-reset-search {
  background-color: #333; color: white; border: none;
  padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;
}
.btn-reset-search:hover { background-color: #222; }

.loading-state {
  text-align: center;
  padding: 100px;
  font-size: 1.2rem;
  color: #666;
}
</style>