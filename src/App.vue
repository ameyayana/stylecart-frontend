<template>
  <div id="app" class="site-container">
    <header class="site-header">
      <div class="header-content">
        <router-link to="/" class="brand-logo-wrapper">
          <img src="/logo.jpg" alt="Stylish Icon" class="header-logo-image" />
          <span class="brand-text">Stylish<span class="pink-dot">.</span></span>
        </router-link>
        
        <nav class="main-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/cart" class="cart-link">
            Cart <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
          <router-link to="/checkout">Checkout</router-link>
          
          <template v-if="isLoggedIn">
            <router-link to="/orders">Orders</router-link>
            <router-link to="/profile">Profile</router-link>
            <router-link v-if="userRole === 'admin'" to="/admin" class="admin-link">Admin</router-link>
          </template>
          <router-link to="/login" class="login-btn-nav" v-else>Login</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>StyleCart</h3>
          <p>Your one-stop destination for contemporary fashion and street style curation.</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/products">All Collections</router-link></li>
            <li><router-link to="/profile">My Account</router-link></li>
            <li><router-link to="/register">Create Account</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Unit Context</h4>
          <p>COS30043 Interface Design Project</p>
          <p class="copyright">&copy; 2026 StyleCart. Designed by Ameowlia.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartCount: 0,
      isLoggedIn: false,
      userRole: null 
    };
  },
  created() {
    this.refreshAppData();
    window.addEventListener('storage', this.refreshAppData);
    window.addEventListener('storage-update', this.refreshAppData);
  },
  // Note: Updated hook to 'beforeUnmount' if you ever step up to full Vue 3 compatibility standards, 
  // keeping 'beforeDestroy' active for backwards matching setup security
  beforeDestroy() {
    window.removeEventListener('storage', this.refreshAppData);
    window.removeEventListener('storage-update', this.refreshAppData);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.refreshAppData);
    window.removeEventListener('storage-update', this.refreshAppData);
  },
  methods: {
    refreshAppData() {
      this.updateCartCount();
      this.checkLoginState();
    },
    checkLoginState() {
      const userStr = localStorage.getItem('user');
      console.log("Loaded user from storage:", userStr); 
      
      if (userStr) {
        const user = JSON.parse(userStr);
        this.isLoggedIn = true;
        this.userRole = user.role; 
        console.log("Current userRole state:", this.userRole); 
      } else {
        this.isLoggedIn = false;
        this.userRole = null;
      }
    },
    updateCartCount() {
      try {
        const cartData = localStorage.getItem('stylecart_items');
        if (!cartData) {
          this.cartCount = 0;
          return;
        }
        const cart = JSON.parse(cartData);
        this.cartCount = Array.isArray(cart) 
          ? cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0)
          : 0;
      } catch (e) {
        console.error("Cart parsing error:", e);
        this.cartCount = 0;
      }
    }
  },
  watch: {
    '$route'() {
      this.refreshAppData();
    }
  }
}
</script>

<style>
/* Global resets */
html, body {
  margin: 0; padding: 0; height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9; color: #333;
}
.site-container { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; padding-bottom: 40px; }

/* --- NEW: ADVANCED PAGE TRANSITIONS CSS --- */
/* Outgoing page state animation */
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px); /* Smooth slide upward exit */
}

/* Incoming page state animation */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px); /* Soft slide inward from bottom */
}

/* Operational interpolation speed rules */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Header Styles */
.site-header {
  background-color: #222; color: white; padding: 15px 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky; top: 0; z-index: 1000;
}
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.brand-logo-wrapper { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.header-logo-image { height: 42px; width: auto; object-fit: contain; }
.brand-text { font-size: 1.5rem; font-weight: bold; color: white; letter-spacing: 1px; }
.pink-dot { color: #FFB6C1; }

/* Combined and Corrected Main Nav */
.main-nav { 
  display: flex; 
  align-items: center; 
  flex-wrap: wrap; 
  justify-content: center; 
  gap: 5px; 
}

.main-nav a {
  color: #ccc; 
  text-decoration: none; 
  font-size: 1.15rem; 
  font-weight: 500;
  padding: 8px 16px; 
  border-radius: 6px; 
  transition: all 0.3s ease;
}

.main-nav a:hover, .main-nav a.router-link-active {
  background-color: #FFB6C1; 
  color: #222 !important;
}

.cart-link { position: relative; }
.cart-badge {
  background-color: #FFB6C1; color: #222; font-size: 0.75rem; font-weight: bold;
  padding: 2px 6px; border-radius: 10px; position: absolute; top: -6px; right: -8px;
}

.admin-link {
  background-color: #c52e59 !important; 
  color: white !important;
}
.admin-link:hover {
  background-color: #ff3366 !important;
}

/* Footer Styles */
.site-footer {
  background-color: #1a1a1a; color: #aaa; padding: 40px 20px 20px;
  margin-top: auto; border-top: 3px solid #333;
}
.footer-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
.footer-section h3 { color: white; margin-top: 0; }
.footer-section h4 { color: #FFB6C1; margin-top: 0; margin-bottom: 15px; }
.footer-section ul { list-style: none; padding: 0; }
.footer-section ul li { margin-bottom: 10px; }
.footer-section ul li a { color: #aaa; text-decoration: none; font-size: 0.9rem; }
.footer-section ul li a:hover { color: white; }
.copyright { font-size: 0.8rem; color: #666; margin-top: 20px; }

@media (max-width: 600px) {
  .main-nav a {
    font-size: 0.95rem;
    padding: 6px 10px;
  }
}
</style>