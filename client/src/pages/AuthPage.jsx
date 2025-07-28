// // client/src/pages/AuthPage.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

// export default function AuthPage() {
//   const { register, login } = useAuth();
//   const [isLogin, setIsLogin] = useState(true);
//   const [username, setUsername] = useState('');
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isLogin) {
//         // Log in
//         await login(email.trim(), password);
//       } else {
//         // Sign up
//         await register(username.trim(), email.trim(), password);
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Authentication failed');
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-toggle">
//         <button
//           onClick={() => setIsLogin(true)}
//           style={{ fontWeight: isLogin ? 'bold' : 'normal' }}
//         >
//           Log In
//         </button>
//         <button
//           onClick={() => setIsLogin(false)}
//           style={{ fontWeight: !isLogin ? 'bold' : 'normal' }}
//         >
//           Sign Up
//         </button>
//       </div>

//       <form className="auth-form" onSubmit={handleSubmit}>
//         {!isLogin && (
//           <div className="form-group">
//             <label>Username</label>
//             <input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               placeholder="Choose a username"
//             />
//           </div>
//         )}
// <form onSubmit={handleSubmit}></form>
//         <div className="auth-form"></div>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             placeholder="you@example.com"
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             placeholder="••••••••"
//           />
//         </div>

//         <button type="submit" className="submit-btn">
//           {isLogin ? 'Log In' : 'Sign Up'}
//         </button>
//       </form>
//     </div>
//   );
// }





import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { register, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Log in
        await login(email.trim(), password);
      } else {
        // Sign up
        await register(username.trim(), email.trim(), password);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-toggle">
        <button
          onClick={() => setIsLogin(true)}
          style={{ fontWeight: isLogin ? 'bold' : 'normal' }}
        >
          Log In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={{ fontWeight: !isLogin ? 'bold' : 'normal' }}
        >
          Sign Up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="submit-btn">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
