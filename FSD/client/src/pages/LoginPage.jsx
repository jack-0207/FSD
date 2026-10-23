import { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submitLogin = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }

    onLogin({ email: form.email });
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <p className="eyebrow">Food Processing</p>
        <h1>Laboratory Management System</h1>
        <p className="login-intro">One clear view of every batch, test result, and compliance decision.</p>
        <div className="login-mark" aria-hidden="true">FL</div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <p className="eyebrow">Secure workspace</p>
        <h2 id="login-title">Welcome back</h2>
        <p className="login-subtitle">Sign in to access your laboratory operations.</p>
        <form onSubmit={submitLogin} className="login-form">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn login-btn">Sign in</button>
        </form>
        <p className="login-note">Local workspace login. Connect this form to your identity provider before production use.</p>
      </section>
    </main>
  );
};

export default LoginPage;
