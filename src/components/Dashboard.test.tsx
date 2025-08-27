// src/components/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock the API since it might not exist
jest.mock('../store/api', () => ({
  useGetUserDataQuery: jest.fn(),
}));

describe('Dashboard', () => {
  it('renders loading state', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders dashboard components when data is loaded', () => {
    // Wait for loading to complete
    render(<Dashboard />);
    
    // Wait for the loading to finish and components to render
    setTimeout(() => {
      expect(screen.getByTestId('mood-chart')).toBeInTheDocument();
      expect(screen.getByTestId('sleep-tracker')).toBeInTheDocument();
      expect(screen.getByTestId('exercise-progress')).toBeInTheDocument();
    }, 1100);
  });
});