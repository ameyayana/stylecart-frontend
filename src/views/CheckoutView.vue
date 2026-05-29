<template>
  <div class="checkout-page">
    <h1 class="page-title">Checkout</h1>
    
    <div class="checkout-grid">
      <div class="checkout-section shipping-form">
        <h2><span class="step-num">1</span> Shipping Information</h2>
        <form @submit.prevent="submitOrder">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="form.name" placeholder="John Doe" required />
          </div>
          
          <div class="form-group">
            <label for="address">Street Address</label>
            <input type="text" id="address" v-model="form.address" placeholder="123 Fashion Street" required />
          </div>
          
          <div class="form-row">
            <div class="form-group fallback">
              <label for="city">City</label>
              <input type="text" id="city" v-model="form.city" placeholder="Melbourne" required />
            </div>
            <div class="form-group fallback">
              <label for="postcode">Postcode</label>
              <input type="text" id="postcode" v-model="form.postcode" placeholder="3000" required />
            </div>
          </div>
          
          <button type="submit" class="place-order-btn">Complete Purchase</button>
        </form>
      </div>

      <div class="checkout-section summary-sidebar">
        <h2>Order Summary</h2>
        <div class="summary-card">
          <div class="summary-row">
            <span>Total Items:</span>
            <strong>{{ cartCount }}</strong>
          </div>
          <div class="summary-row">
            <span>Est. Arrival:</span>
            <strong>{{ estimatedArrival }}</strong>
          </div>
          <div class="summary-row total-row">
            <span>Grand Total:</span>
            <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="secure-badge">
            🔒 Secure HTTPS Checkout
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      form: { name: '', address: '', city: '', postcode: '' }
    };
  },
  computed: {
    cartCount() {
      return this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    },
    totalPrice() {
      return this.cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
    },
    estimatedArrival() {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  },
  created() {
    this.loadCart();
    this.prefillUserInfo();
  },
  methods: {
    loadCart() {
      const savedCart = localStorage.getItem('stylecart_items');
      this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    },
    prefillUserInfo() {
      // UX Enhancement: Automatically fill the user's name if they're logged in
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.name) {
        this.form.name = userData.name;
      }
    },
    async submitOrder() {
      // FIX: Fetch the token directly from its isolated storage location
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        alert("Authentication required. Please log in.");
        this.$router.push('/login');
        return;
      }

      if (this.cartItems.length === 0) {
        alert("Cart is empty!");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/checkout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Sends the isolated, valid token pass
          },
          body: JSON.stringify({ 
            cartItems: this.cartItems,
            shipping: this.form 
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Success, ${this.form.name}! Your order has been placed.`);
          localStorage.removeItem('stylecart_items');
          this.$router.push('/products');
        } else {
          throw new Error(data.error || data.errors?.join(', ') || "Transaction failed.");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  }
}
</script>

<style scoped>
/* Styles remain exactly unchanged */
.checkout-page { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
.page-title { font-size: 2.2rem; margin-bottom: 30px; font-weight: 700; }
.checkout-grid { display: grid; grid-template-columns: 7fr 4fr; gap: 40px; align-items: start; }
.checkout-section h2 { font-size: 1.4rem; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
.step-num { background: #333; color: #FFB6C1; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; justify-content: center; align-items: center; font-size: 0.9rem; }
.form-group { margin-bottom: 20px; }
.form-row { display: flex; gap: 20px; }
.fallback { flex: 1; }
label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; color: #666; letter-spacing: 0.5px; }
input { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; background-color: #fff; }
input:focus { border-color: #333; outline: none; }
.place-order-btn { width: 100%; padding: 16px; background-color: #ff3366; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
.place-order-btn:hover { background-color: #e02253; }
.summary-card { background-color: #f8f9fa; border: 1px solid #eee; border-radius: 12px; padding: 24px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 1.05rem; }
.total-row { border-top: 1px solid #ddd; padding-top: 15px; }
.total-price { color: #2b9348; font-size: 1.4rem !important; font-weight: bold; }
.secure-badge { text-align: center; font-size: 0.85rem; color: #777; margin-top: 25px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px; }
@media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr; } .summary-sidebar { order: -1; } }
</style>