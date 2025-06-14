import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

// Mock para useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

// Mock para useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

import { useAuth } from '../context/AuthContext';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login exitoso redirige a /admin', () => {
    const mockLogin = jest.fn().mockReturnValue(true);
    useAuth.mockReturnValue({ login: mockLogin });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '1234' } });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(mockLogin).toHaveBeenCalledWith('admin', '1234');
    expect(mockedNavigate).toHaveBeenCalledWith('/admin');
    expect(screen.queryByText(/usuario o contraseña incorrectos/i)).not.toBeInTheDocument();
  });

  test('login fallido muestra mensaje de error', () => {
    const mockLogin = jest.fn().mockReturnValue(false);
    useAuth.mockReturnValue({ login: mockLogin });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(mockLogin).toHaveBeenCalledWith('user', 'wrongpass');
    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument();
  });
});
