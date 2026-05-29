<template>
  <div class="tracking-page">
    <div class="page-header">
      <h1 class="page-title">My Orders</h1>
      <div v-if="orders && orders.length > 0" class="order-counter">
        {{ orders.length }} Incoming Order{{ orders.length > 1 ? 's' : '' }}
      </div>
    </div>
    
    <div v-if="orders && orders.length > 0" class="orders-list">
      <div v-for="(order, index) in orders" :key="order.orderId" class="order-card">
        <span class="order-number-badge">Order #{{ index + 1 }}</span>

        <div class="status-header">
          <span class="status-label">STATUS</span>
          <div class="status-pill">
            <span class="pulse">●</span> {{ order.status }}
          </div>
        </div>

        <div class="order-main-content">
          <div class="shipping-details">
            <span class="section-title">Shipping Address</span>
            <p class="address-text" v-if="order.shipping">{{ order.shipping.address }}, {{ order.shipping.city }}</p>
          </div>
          
          <div class="order-meta">
            <div>
              <span class="section-title">Order ID</span>
              <p>{{ order.orderId }}</p>
            </div>
            <div>
              <span class="section-title">Date</span>
              <p>{{ formatDate(order.timestamp) }}</p>
            </div>
            <div>
              <span class="section-title">Est. Arrival</span>
              <p>{{ calculateEstArrival(order.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No shipments found</h3>
      <p>Your orders will appear here once they are processed.</p>
      <router-link to="/products" class="shop-btn">Explore Collection</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { orders: [] };
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        // FIX: Extract the token directly from its isolated local storage spot
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        // If either is missing, the user isn't fully authenticated
        if (!token || !user) return;

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the correct separate token string
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          this.orders = await response.json();
        } else {
          console.error("Backend returned an error status:", response.status);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    },
    calculateEstArrival(dateString) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + 7);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
/* Styles remain completely untouched */
.tracking-page { max-width: 1200px; margin: 40px auto; padding: 20px; }
.order-card { 
  position: relative; 
  background: white; padding: 30px; border-radius: 20px; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin-bottom: 25px;
  border: 1px solid #eee;
} 
.order-number-badge {
  position: absolute; top: 20px; left: 30px;
  font-size: 0.7rem; font-weight: 800; color: #aaa;
  text-transform: uppercase; letter-spacing: 1px;
}
.order-meta { 
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 20px; border-top: 1px solid #f0f0f0; padding-top: 20px; 
}
.status-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.order-counter { background: #e02253; color: white; padding: 6px 15px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; }
.status-label { font-size: 0.7rem; letter-spacing: 2px; color: #e02253; font-weight: 800; margin-bottom: 12px; }
.status-pill { display: inline-flex; align-items: center; gap: 12px; background: #222; color: #FFB6C1; padding: 14px 28px; border-radius: 50px; font-weight: 700; font-size: 1rem; }
.order-main-content { display: flex; flex-direction: column; gap: 20px; }
.section-title { font-size: 0.75rem; text-transform: uppercase; color: #999; font-weight: 800; }
.address-text { font-size: 1.1rem; font-weight: 500; margin: 5px 0 0 0; }
.empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 2px dashed #eee; }
.shop-btn { display: inline-block; margin-top: 20px; padding: 12px 25px; background: #333; color: white; text-decoration: none; border-radius: 8px; }
</style>