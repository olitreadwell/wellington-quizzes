import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';

describe('homepage', () => {
  it('renders the calendar heading and quiz count', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'WLG NZ Quizzes' })).toBeTruthy();
    expect(screen.getByText(/recurring pub quizzes/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'All quizzes by day' })).toBeTruthy();
  });
});
