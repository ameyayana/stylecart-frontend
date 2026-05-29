<template>
  <div class="cart-page">
    <h1 class="page-title">Your Stylish Items</h1>
    
    <div v-if="cartItems.length > 0" class="cart-container">
      <div class="cart-items-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item-row">
          <div class="cart-img-container">
            <img :src="resolveProductImage(item.imageName)" :alt="item.name" class="cart-item-img" />
          </div>
          
          <div class="cart-item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">${{ Number(item.price).toFixed(2) }}</p>
          </div>
          
          <div class="quantity-controls">
            <button @click="decreaseQty(item)" class="qty-btn" :disabled="item.quantity <= 1">-</button>
            <span class="qty-number">{{ item.quantity || 1 }}</span>
            <button @click="increaseQty(item)" class="qty-btn">+</button>
          </div>
          
          <button @click="removeItem(item.id)" class="remove-btn">Remove</button>
        </div>
      </div>

      <div class="cart-summary-box">
        <div class="total-row">
          <span>Total:</span>
          <span class="grand-total-price">${{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="action-row">
          <router-link to="/products" class="continue-btn">← Continue Shopping</router-link>
          
          <button @click="goToCheckout" class="checkout-btn">
            Confirm & Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <div class="empty-icon">🛍️</div>
      <h2>Your Cart is Empty</h2>
      <p>Looks like you haven't added anything to your style cart yet.</p>
      <router-link to="/products" class="shop-now-btn">Shop Our Collection</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: []
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
    }
  },
  created() {
    this.loadCart();
  },
  methods: {
    resolveProductImage(imageName) {
      return imageName ? `/${imageName}` : '';
    },
    loadCart() {
      this.cartItems = JSON.parse(localStorage.getItem('stylecart_items')) || [];
    },
    saveCart() {
      localStorage.setItem('stylecart_items', JSON.stringify(this.cartItems));
      window.dispatchEvent(new Event('storage-update'));
    },
    increaseQty(item) {
      item.quantity = (item.quantity || 1) + 1;
      this.saveCart();
    },
    decreaseQty(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      }
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
      this.saveCart();
    },
    // NEW: Strictly for navigation
    goToCheckout() {
      if (this.cartItems.length > 0) {
        this.$router.push('/checkout');
      }
    }
  }
}
</script>

<style scoped>
/* Keeping your existing styles to maintain the UI design */
.cart-page { max-width: 1200px; margin: 40px auto; padding: 0 30px; box-sizing: border-box; }
.page-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 30px; color: #222; }
.cart-items-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
.cart-item-row { display: flex; align-items: center; background: white; border: 1px solid #eee; border-radius: 12px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.cart-img-container { width: 120px; height: 120px; display: flex; justify-content: center; align-items: center; background-color: #fafafa; border-radius: 8px; overflow: hidden; margin-right: 25px; border: 1px solid #f0f0f0; }
.cart-item-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.cart-item-details { flex: 2; text-align: left; }
.cart-item-details h3 { margin: 0 0 5px 0; font-size: 1.2rem; color: #222; }
.item-price { margin: 0; color: #42b983; font-weight: bold; }
.quantity-controls { display: flex; align-items: center; gap: 12px; margin-right: 40px; }
.qty-btn { width: 32px; height: 32px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: all 0.2s; }
.qty-btn:hover:not(:disabled) { background: #333; color: #FFB6C1; border-color: #333; }
.qty-number { font-weight: bold; font-size: 1.1rem; min-width: 20px; text-align: center; }
.remove-btn { background-color: #ff3366; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.remove-btn:hover { background-color: #e02253; }
.cart-summary-box { background-color: #f8f9fa; border: 1px solid #eee; border-radius: 12px; padding: 30px; }
.total-row { display: flex; justify-content: space-between; align-items: center; font-size: 1.3rem; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
.grand-total-price { font-size: 1.8rem; color: #42b983; }
.action-row { display: flex; justify-content: space-between; align-items: center; }
.continue-btn { text-decoration: none; color: #333; font-weight: bold; transition: color 0.2s; }
.continue-btn:hover { color: #ff3366; }
.checkout-btn { border: none; background-color: #333; color: #FFB6C1; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: all 0.2s; }
.checkout-btn:hover { background-color: #444; }
.empty-cart { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
.empty-icon { font-size: 4rem; margin-bottom: 20px; }
.shop-now-btn { display: inline-block; margin-top: 20px; background-color: #333; color: #FFB6C1; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; }
</style>