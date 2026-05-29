<template>
  <div class="product-card">
    <div class="image-container">
      <img 
        :src="resolveProductImage(product.imageName || product.image)" 
        :alt="product.name" 
        class="product-image"
      />
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">${{ Number(product.price).toFixed(2) }}</p>
      
      <p v-if="product.stock > 0" class="stock-status in-stock">
        {{ product.stock }} available
      </p>
      <p v-else class="stock-status out-of-stock">Sold Out</p>
    </div>

    <div class="card-actions">
      <router-link :to="`/products/${product.id}`" class="details-btn">
        View Details
      </router-link>
      
      <button 
        @click="addToCart" 
        class="add-to-cart-btn" 
        :disabled="product.stock <= 0"
      >
        {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['product'],
  
  methods: {
      resolveProductImage(imageName) {
      return imageName ? `/${imageName}` : '';
    
    // 1. Map the database values to your physical file names
    let fileTarget = imageName;
    if (imageName === 'skirt.jpg') fileTarget = 'piano-skirt.png';
    if (imageName === 'skirt2.jpg') fileTarget = 'forest-skirt.png';
    if (imageName === 'skirt3.jpg') fileTarget = 'polka-skirt.png';
    if (imageName === 'jacket.jpg') fileTarget = 'brown-leather-jacket.png';
    if (imageName === 'jacket3.jpg') fileTarget = 'red-leather-jacket.png';
    if (imageName === 'jacket2.jpg') fileTarget = 'reversible-jacket.png';
    if (imageName === 'pants.jpg') fileTarget = 'shorts.png';
    if (imageName === 'pants2.jpg') fileTarget = 'jean-shorts.png';
    if (imageName === 'pants3.jpg') fileTarget = 'brown-pants.png';
    if (imageName === 'sweater.jpg') fileTarget = 'star-sweater.png';
    if (imageName === 'sweater2.jpg') fileTarget = 'cat-sweater.png';
    if (imageName === 'sweater3.jpg') fileTarget = 'swirl-sweater.png';

    // 2. 🔥 Vite dynamic module resolution rule
    // This tells Vite to crawl your src/assets folder and safely bundle the image binary.
    return new URL(`../assets/${fileTarget}`, import.meta.url).href;
  },
  addToCart() {
    this.$emit('add-to-cart', this.product);
  }
}
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fafafa;
  border-radius: 8px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  text-align: center;
  margin-bottom: 15px;
  flex-grow: 1;
}

.product-name {
  font-size: 1.15rem;
  color: #222;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.product-price {
  font-size: 1.05rem;
  color: #444;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.stock-status {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}

.stock-status.in-stock {
  color: #2ec4b6;
}

.stock-status.out-of-stock {
  color: #e04d70;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.details-btn, .add-to-cart-btn {
  width: 100%;
  padding: 10px;
  font-size: 0.95rem;
  font-weight: bold;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.details-btn {
  background-color: #f0f0f0;
  color: #444;
  border: none;
}

.details-btn:hover {
  background-color: #e5e5e5;
  color: #222;
}

.add-to-cart-btn {
  background-color: #222;
  color: #FFB6C1;
  border: none;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #ff3366;
  color: white;
}

.add-to-cart-btn:disabled {
  background-color: #edd3d8;
  color: #a0a0a0;
  cursor: not-allowed;
}
</style>