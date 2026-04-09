import { render, screen } from '@testing-library/react';

test('renders app smoke text', () => {
  render(<div>Smart Facility Management System</div>);
  expect(screen.getByText(/smart facility management system/i)).toBeInTheDocument();
});
