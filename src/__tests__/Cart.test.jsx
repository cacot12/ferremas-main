import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';

// Mock del contexto CartContext y el hook useCart
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

import { useCart } from '../context/CartContext';

describe('Cart Component', () => {
  test('muestra mensaje cuando el carrito está vacío', () => {
    useCart.mockReturnValue({
      cart: [],
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText(/no tienes productos en el carrito/i)).toBeInTheDocument();
  });

  test('muestra productos en el carrito y calcula total', () => {
    const mockRemove = jest.fn();
    const mockClear = jest.fn();

    useCart.mockReturnValue({
      cart: [
        {
          id: 1,
          nombre: 'Producto 1',
          precio: 5000,
          quantity: 2,
          imagen: 'img1.png',
        },
        {
          id: 2,
          nombre: 'Producto 2',
          precio: 2000,
          quantity: 1,
          imagen: 'img2.png',
        },
      ],
      removeFromCart: mockRemove,
      clearCart: mockClear,
    });

    render(<Cart />);

    // Revisa que estén los nombres y cantidades
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // quantity producto 1
    expect(screen.getByText('1')).toBeInTheDocument(); // quantity producto 2

    // Revisa el total correcto: 5000*2 + 2000*1 = 12000
    expect(screen.getByText(/total: \$12000/i)).toBeInTheDocument();

    // Simula click en eliminar del primer producto
    fireEvent.click(screen.getAllByText(/eliminar/i)[0]);
    expect(mockRemove).toHaveBeenCalledWith(1);

    // Simula click en Vaciar Carrito
    fireEvent.click(screen.getByText(/vaciar carrito/i));
    expect(mockClear).toHaveBeenCalled();
  });
});
