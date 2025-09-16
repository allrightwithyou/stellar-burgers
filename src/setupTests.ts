import '@testing-library/jest-dom';

// Мокаем fetch для тестов
Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});
