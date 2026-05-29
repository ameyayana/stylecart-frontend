<template>
  <div class="auth-page-wrapper">
    <div class="luxury-card">
      <h2 class="editorial-title">Sign In<span>.</span></h2>
      <p class="brand-tagline">Access your curation vault</p>
      
      <form @submit.prevent="handleLogin" class="luxury-form">
        <div class="interactive-input-box">
          <input type="email" v-model="email" required placeholder=" " id="email" />
          <label for="email">Email Address</label>
          <div class="focus-line"></div>
        </div>

        <div class="interactive-input-box">
          <input type="password" v-model="password" required placeholder=" " id="password" />
          <label for="password">Password</label>
          <div class="focus-line"></div>
        </div>

        <button type="submit" class="action-submit-pill">
          <span class="btn-text">Enter Portal</span>
          <span class="btn-arrow">&rarr;</span>
        </button>
      </form>

      <div class="form-navigation-links">
        <p><router-link to="/register">Create Account</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('https://stylecart-backend.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failure.');
        }

        // FIX: Save the entire 'data.user' object directly from the server.
        // This ensures the 'role' and 'memberStatus' sent by the server are preserved.
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Dispatch the event so App.vue catches the change immediately
        window.dispatchEvent(new Event('storage-update'));
        
        // Redirect to profile
        this.$router.push('/profile');
      } catch (err) {
        alert(err.message);
      }
    }
  }
}
</script>

<style scoped>
/* Keep your existing styles as they are perfect */
.auth-page-wrapper { min-height: 80vh; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9; padding: 40px 20px; }
.luxury-card { background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 55px 45px; width: 100%; max-width: 600px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04); }
.editorial-title { font-size: 2.6rem; color: #222; font-weight: 800; letter-spacing: -1.5px; margin: 0; }
.editorial-title span { color: #FFB6C1; }
.brand-tagline { color: #888; font-size: 0.95rem; margin: 5px 0 40px 0; }
.luxury-form { display: flex; flex-direction: column; gap: 30px; }
.interactive-input-box { position: relative; width: 100%; }
.interactive-input-box input { width: 100%; padding: 14px 0 8px 0; background: transparent; border: none; border-bottom: 2px solid #ddd; font-size: 1.1rem; color: #222; transition: all 0.3s ease; box-sizing: border-box; }
.interactive-input-box label { position: absolute; top: 14px; left: 0; color: #999; font-size: 1.05rem; pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.interactive-input-box input:focus ~ label, .interactive-input-box input:not(:placeholder-shown) ~ label { top: -12px; font-size: 0.75rem; color: #FFB6C1; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
.focus-line { position: absolute; bottom: 0; left: 0; width: 0%; height: 2px; background: #FFB6C1; transition: all 0.4s ease; }
.interactive-input-box input:focus ~ .focus-line { width: 100%; }
.interactive-input-box input:focus { outline: none; border-bottom-color: transparent; }
.action-submit-pill { margin-top: 15px; background: #222; color: white; padding: 16px 25px; border: none; border-radius: 50px; font-size: 1.05rem; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; }
.action-submit-pill:hover { background: #FFB6C1; color: #222; box-shadow: 0 8px 25px rgba(255, 182, 193, 0.4); transform: translateY(-2px); }
.btn-arrow { font-size: 1.3rem; transition: transform 0.3s; }
.action-submit-pill:hover .btn-arrow { transform: translateX(4px); }
.form-navigation-links { margin-top: 35px; font-size: 0.9rem; color: #777; text-align: center; }
.form-navigation-links a { color: #222; text-decoration: none; font-weight: 600; border-bottom: 1px solid #ddd; padding-bottom: 2px; transition: all 0.2s; }
.form-navigation-links a:hover { color: #FFB6C1; border-bottom-color: #FFB6C1; }
</style>