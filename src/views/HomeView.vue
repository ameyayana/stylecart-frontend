<template>
  <div class="home">
    <header class="hero-image-bg" :style="{ backgroundImage: `url(${heroBgImage})` }">
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <h1>Style with Stylish</h1>
        <p>Modern Fashion for Modern People</p>
      </div>
    </header>

    <section class="hot-selling-section">
      <div class="section-header">
        <span class="badge">Trending Now</span>
        <h2>🔥 Hot Selling Items</h2>
        <p>Grab our most popular pieces before they sell out completely.</p>
      </div>

      <div class="product-grid" v-if="hotSelling.length > 0">
        <ProductCard 
          v-for="item in hotSelling" 
          :key="item.id" 
          :product="item"
          @add-to-cart="handleCart"
        />
      </div>
      
      <div class="loading-state" v-else>
        <p>Syncing hot selling trends with live database registry...</p>
      </div>

      <div class="view-all-container">
        <router-link to="/products" class="view-all-btn">View Full Collection →</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';

export default {
  components: { ProductCard },
  data() {
    return {
      heroBgImage: '/hero-bg.jpg',
      hotSelling: []
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error("Could not download promotional layout items.");
      
      const liveProducts = await response.json();
      this.generateRandomProducts(liveProducts);
    } catch (err) {
      console.error("HomeView server sync failed:", err.message);
    }
  },
  methods: {
    // Standardized image resolution method
    resolveProductImage(imageName) {
      return imageName ? `/${imageName}` : '';
    },
    generateRandomProducts(productsPool) {
      if (!productsPool || productsPool.length === 0) return;
      
      const shuffled = [...productsPool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      this.hotSelling = shuffled.slice(0, 4);
    },
    handleCart(product) {
      let cart = JSON.parse(localStorage.getItem('stylecart_items')) || [];
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ 
          id: product.id,
          name: product.name,
          price: product.price,
          // Using the property from your JSON database directly
          imageName: product.imageName,
          category: product.category,
          quantity: 1 
        });
      }

      localStorage.setItem('stylecart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage-update'));
      alert(`${product.name} added to cart!`);
    }
  }
}
</script>

<style scoped>
/* All your previous styles remain unchanged */
.home { background-color: #fcfcfc; padding-bottom: 60px; }
.hero-image-bg { position: relative; width: 100%; height: 380px; background-size: cover; background-position: center; background-repeat: no-repeat; margin-bottom: 0; display: flex; justify-content: center; align-items: center; }
.hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.35); z-index: 1; }
.hero-content { position: relative; z-index: 2; text-align: center; color: white; padding: 0 20px; }
.hero-content h1 { font-size: 3.2rem; font-weight: 800; margin: 0 0 10px 0; letter-spacing: 1px; }
.hero-content p { font-size: 1.25rem; margin: 0; color: #e5e5e5; }
.hot-selling-section { max-width: 1200px; margin: 60px auto 0; padding: 0 30px; }
.section-header { text-align: center; margin-bottom: 40px; }
.badge { background: rgba(255, 182, 193, 0.3); color: #e04d70; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; letter-spacing: 1px; display: inline-block; margin-bottom: 12px; }
.section-header h2 { font-size: 2.2rem; color: #222; margin: 0 0 10px 0; }
.section-header p { color: #666; font-size: 1rem; margin: 0; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
.loading-state { text-align: center; padding: 40px 0; color: #777; font-style: italic; }
.view-all-container { text-align: center; margin-top: 50px; }
.view-all-btn { display: inline-block; background-color: #222; color: #FFB6C1; text-decoration: none; padding: 14px 35px; font-weight: bold; border-radius: 8px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.view-all-btn:hover { background-color: #ff3366; color: white; transform: translateY(-2px); }
</style>