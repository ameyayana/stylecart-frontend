<template>
  <div class="product-detail-page" v-if="product">
    <div class="detail-container">
      
      <div class="image-pane">
        <img 
          :src="resolveProductImage(product.imageName)" 
          :alt="product.name" 
          class="main-detail-img"
        />
      </div>
      
      <div class="info-column">
        <span class="category-badge">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>
        <p class="price-tag">${{ Number(product.price).toFixed(2) }}</p>
        <p class="description">{{ product.description || 'Premium high-quality curation tailored for contemporary style hubs.' }}</p>
        
        <div class="stock-status">
          <span class="status-indicator available">●</span> 
          <span>{{ product.stock || 5 }} units remaining in stock</span>
        </div>

        <button @click="handleCart" class="add-to-cart-big-btn">Add To Shopping Cart</button>
        <router-link to="/products" class="back-link">← Back to Catalog</router-link>
      </div>
    </div>
  </div>
  
  <div class="loading-detail-state" v-else-if="loading">
    <p>Fetching product profiles from catalog registry...</p>
  </div>

  <div class="error-detail-state" v-else>
    <p>⚠️ Product profiles could not be found or verified.</p>
    <router-link to="/products" class="back-link">Return to Collections</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
      loading: true
    };
  },
  async created() {
    await this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      const productId = this.$route.params.id;
      
      try {
        const response = await fetch(`http://localhost:5000/api/products`);
        if (!response.ok) throw new Error("Database collection could not be read.");
        
        const allProducts = await response.json();
        this.product = allProducts.find(p => String(p.id) === String(productId));
      } catch (err) {
        console.error("Detail sync failed:", err.message);
      } finally {
        this.loading = false;
      }
    },
    // Simplified resolution using direct paths to the public folder
    resolveProductImage(imageName) {
      return imageName ? `/${imageName}` : '';
    },
    handleCart() {
      if (!this.product) return;
      
      let cart = JSON.parse(localStorage.getItem('stylecart_items')) || [];
      const existingItem = cart.find(item => item.id === this.product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ 
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          imageName: this.product.imageName,
          category: this.product.category,
          quantity: 1 
        });
      }

      localStorage.setItem('stylecart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage-update'));
      alert(`${this.product.name} added to cart!`);
    }
  },
  watch: {
    '$route.params.id': 'fetchProductDetails'
  }
}
</script>

<style scoped>
.product-detail-page {
  max-width: 1100px;
  margin: 50px auto;
  padding: 0 20px;
}

.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

/* Image Pane: Standardizes the 'window' for every image */
.image-pane {
  width: 100%;
  height: 450px; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

/* The Image: Forced to fit inside the pane without distortion */
.main-detail-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; 
}

.info-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.category-badge {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: #e04d70;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-column h1 {
  font-size: 2.5rem;
  color: #222;
  margin: 0 0 15px 0;
}

.price-tag {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 25px 0;
}

.description {
  color: #666;
  line-height: 1.7;
  font-size: 1.05rem;
  margin: 0 0 30px 0;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  font-weight: 500;
  color: #444;
}

.status-indicator.available {
  color: #2ec4b6;
}

.add-to-cart-big-btn {
  background-color: #222;
  color: #FFB6C1;
  border: none;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.add-to-cart-big-btn:hover {
  background-color: #ff3366;
  color: white;
  transform: translateY(-2px);
}

.back-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  display: inline-block;
}

.back-link:hover {
  color: #222;
}

.loading-detail-state, .error-detail-state {
  text-align: center;
  padding: 100px 0;
  color: #666;
  font-size: 1.2rem;
}
</style>