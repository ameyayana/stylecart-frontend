<template>
  <div class="auth-page-wrapper">
    <div class="luxury-card profile-card">
      <div class="avatar-wrapper">
        <div class="profile-avatar">{{ user.name ? user.name[0] : 'A' }}</div>
        <div class="avatar-ring"></div>
      </div>
      
      <h2 class="welcome-heading">Welcome Back</h2>
      <p class="card-subtitle">Stylish. Premium Tier Curation</p>
      
      <div class="info-matrix">
        <div class="info-tile">
          <label>ID / Username</label>
          <p>{{ user.name }}</p> 
        </div>

        <div class="info-tile">
          <label>Verified Email</label>
          <p>{{ user.email }}</p> 
        </div>

        <div class="info-tile status-tile">
          <label>Membership Status</label>
          <p :class="user.role === 'admin' ? 'admin-gradient-text' : 'gold-gradient-text'">
            ✦ {{ user.memberStatus }} ✦
          </p> 
        </div>
      </div>

      <button @click="handleLogout" class="premium-btn">
        <span>Logout Account</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: { name: '', email: '', memberStatus: '', role: '' }
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      // Spread operator copies all properties from DB (role, memberStatus, etc)
      this.user = { ...this.user, ...userData };
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('user');
      // Clear token if you are storing it separately
      localStorage.removeItem('token'); 
      window.dispatchEvent(new Event('storage-update'));
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Keep all your original UI/CSS exactly as requested */
.auth-page-wrapper { min-height: 80vh; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9; padding: 40px 20px; }
.luxury-card { position: relative; background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 50px 40px; width: 100%; max-width: 600px; text-align: center; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04); }
.avatar-wrapper { position: relative; width: 90px; height: 90px; margin: 0 auto 25px; }
.profile-avatar { width: 100%; height: 100%; background: #222; color: #fff; font-size: 2.2rem; font-weight: 800; display: flex; justify-content: center; align-items: center; border-radius: 50%; z-index: 2; position: relative; }
.avatar-ring { position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; border-radius: 50%; border: 2px dashed rgba(255, 182, 193, 0.7); animation: rotateRing 20s linear infinite; }
@keyframes rotateRing { 100% { transform: rotate(360deg); } }
.welcome-heading { font-size: 2.2rem; color: #222; font-weight: 700; margin: 0 0 5px 0; letter-spacing: -1px; }
.card-subtitle { color: #888; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 35px; }
.info-matrix { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.info-tile { background: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 14px; padding: 16px 20px; text-align: left; }
.info-tile label { display: block; font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 4px; }
.info-tile p { margin: 0; font-size: 1.05rem; color: #333; font-weight: 600; }
.gold-gradient-text { background: linear-gradient(90deg, #b9931a, #e4cb67); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
/* Special style for Admin status */
.admin-gradient-text { background: linear-gradient(90deg, #ff3366, #FFB6C1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.premium-btn { width: 100%; background: #222; color: white; padding: 16px; border: none; font-size: 1rem; font-weight: 600; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; }
.premium-btn:hover { background: #FFB6C1; color: #222; }
</style>