import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';


export default function Sidebar() {
  const { toggleTheme, theme } = useTheme();

  const buttons = [
    'Profile',
    'Settings',
    'Notifications',
    'New Post'
  ];

  return (
    <div className="sidebar">
      <ul>
        {buttons.map((item) => (
          <li key={item}>{item}</li>
        ))}
        <li>
          <button onClick={toggleTheme}>
            {theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </li>
      </ul>
    </div>
  );
}
