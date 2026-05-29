import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailsView from '../views/ProductDetailsView.vue';
import CartView from '../views/CartView.vue'; 
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ProfileView from '../views/ProfileView.vue';
import OrderTrackingView from '@/views/OrderTrackingView.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/products', component: ProductsView },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetailsView },
  { path: '/cart', component: CartView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/checkout', component: CheckoutView },
  { path: '/orders', component: OrderTrackingView },
  { path: '/profile', component: ProfileView },
  { 
    path: '/admin', 
    component: AdminDashboard,
    meta: { requiresAdmin: true } // Added meta tag for security
  },
  { path: '/product/:id', redirect: to => `/products/${to.params.id}` }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard: Prevent non-admins from accessing /admin
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    next('/login'); // Redirect to login if not admin
  } else {
    next();
  }
});

export default router;