<template>
  <div class="auth-page-wrapper">
    <div class="luxury-card register-wide">
      <h2 class="editorial-title">Join Us<span>.</span></h2>
      <p class="brand-tagline">Begin your collection journey</p>
      
            <form @submit.prevent="handleRegister" class="luxury-form matrix-grid">
        <div class="interactive-input-box">
          <input v-model="name" type="text" required placeholder=" " id="fullName" />
          <label for="fullName">Full Name</label>
          <div class="focus-line"></div>
        </div>

        <div class="interactive-input-box">
          <input v-model="email" type="email" required placeholder=" " id="email" />
          <label for="email">Email Address</label>
          <div class="focus-line"></div>
        </div>

        <div class="interactive-input-box">
          <input v-model="password" type="password" required placeholder=" " id="password" />
          <label for="password">Password</label>
          <div class="focus-line"></div>
        </div>

        <div class="interactive-input-box checkbox-box">
          <input type="checkbox" v-model="isAdmin" id="isAdmin" />
          <label for="isAdmin" class="checkbox-label">Register as Admin</label>
        </div>

        <button type="submit" class="action-submit-pill">
          <span class="btn-text">Register Account</span>
          <span class="btn-arrow">&rarr;</span>
        </button>
      </form>

      <div class="form-navigation-links">
        <p>Already on the list? <router-link to="/login">Sign In</router-link></p>
      </div>
    </div>
  </div>


</template>

<script>
export default {
  data() {
    return {
      name: '',    // Must match v-model in template
      email: '',   // Must match v-model in template
      password: '',// Must match v-model in template
      isAdmin: false // New state
    };
  },
  methods: {
    async handleRegister() {
      try {
          const response = await fetch('https://stylecart-backend-b3zd.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: this.name,      // Make sure this is not empty!
              email: this.email,    // Make sure this is not empty!
              password: this.password,
              isAdmin: this.isAdmin
            })
          });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        alert('Success!');
      } catch (err) {
        alert(err.message);
      }
    }
  }
}
</script>

<style scoped>
/* Follows the same clean light framework */
.auth-page-wrapper {
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 40px 20px;
}

.luxury-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 55px 45px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
}

.editorial-title {
  font-size: 2.6rem;
  color: #222;
  font-weight: 800;
  letter-spacing: -1.5px;
  margin: 0;
}

.editorial-title span {
  color: #FFB6C1;
}

.brand-tagline {
  color: #888;
  font-size: 0.95rem;
  margin: 5px 0 45px 0;
}

.luxury-form {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.interactive-input-box {
  position: relative;
}

.interactive-input-box input {
  width: 100%;
  padding: 12px 0 6px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 1.1rem;
  color: #222;
  transition: all 0.3s ease;
}

.interactive-input-box label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #999;
  font-size: 1.05rem;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.interactive-input-box input:focus ~ label,
.interactive-input-box input:not(:placeholder-shown) ~ label {
  top: -14px;
  font-size: 0.75rem;
  color: #FFB6C1;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

.focus-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: #FFB6C1;
  transition: all 0.4s ease;
}

.interactive-input-box input:focus ~ .focus-line {
  width: 100%;
}

.interactive-input-box input:focus {
  outline: none;
  border-bottom-color: transparent;
}

.action-submit-pill {
  background: #222;
  color: white;
  padding: 16px 25px;
  border: none;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.action-submit-pill:hover {
  background: #FFB6C1;
  color: #222;
  box-shadow: 0 8px 25px rgba(255, 182, 193, 0.4);
  transform: translateY(-2px);
}

.btn-arrow {
  font-size: 1.3rem;
  transition: transform 0.3s;
}

.action-submit-pill:hover .btn-arrow {
  transform: translateX(4px);
}

.form-navigation-links {
  margin-top: 40px;
  font-size: 0.9rem;
  color: #777;
  text-align: center;
}

.form-navigation-links a {
  color: #222;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2px;
  transition: all 0.2s;
}

.form-navigation-links a:hover {
  color: #FFB6C1;
  border-bottom-color: #FFB6C1;
}

.checkbox-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.checkbox-box input {
  width: auto;
  accent-color: #FFB6C1;
}
.checkbox-label {
  position: static !important; /* Override absolute positioning */
  font-size: 0.9rem !important;
  color: #333 !important;
  text-transform: none !important;
}

</style>