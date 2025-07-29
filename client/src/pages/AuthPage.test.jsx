import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AuthPage from './AuthPage';
import * as AuthContextModule from '../contexts/AuthContext';

describe('AuthPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form by default and calls login on submit', async () => {
    const login = vi.fn().mockResolvedValue();
    const register = vi.fn();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ login, register, user: null });

    render(<AuthPage />);

    // Grab inputs by placeholder text
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passInput  = screen.getByPlaceholderText(/•+/);

    //  two "Log In" buttons (toggle & submit),
    const loginButtons = screen.getAllByRole('button', { name: /log in/i });
    const submitBtn = loginButtons.find(btn => btn.getAttribute('type') === 'submit');

    await userEvent.type(emailInput, 'a@b.com');
    await userEvent.type(passInput, 'secret');
    await userEvent.click(submitBtn);

    expect(login).toHaveBeenCalledWith('a@b.com', 'secret');
    expect(register).not.toHaveBeenCalled();
  });

  it('toggles to sign‑up, shows username field, and calls register', async () => {
    const login = vi.fn();
    const register = vi.fn().mockResolvedValue();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ login, register, user: null });

    render(<AuthPage />);
    // Click the toggle "Sign Up" button 
    const toggleButtons = screen.getAllByRole('button', { name: /sign up/i });
    const toggleBtn = toggleButtons.find(btn => btn.getAttribute('type') !== 'submit');
    await userEvent.click(toggleBtn);

    //grab inputs by placeholder
    const userInput  = screen.getByPlaceholderText(/choose a username/i);
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passInput  = screen.getByPlaceholderText(/•+/);

    // find the submit "Sign Up" button
    const signUpButtons = screen.getAllByRole('button', { name: /sign up/i });
    const submitBtn = signUpButtons.find(btn => btn.getAttribute('type') === 'submit');

    await userEvent.type(userInput, 'newuser');
    await userEvent.type(emailInput, 'x@y.com');
    await userEvent.type(passInput, 'pwd1234');
    await userEvent.click(submitBtn);

    expect(register).toHaveBeenCalledWith('newuser', 'x@y.com', 'pwd1234');
    expect(login).not.toHaveBeenCalled();
  });
});
