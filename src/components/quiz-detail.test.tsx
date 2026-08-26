import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { QuizDetail } from '@/components/quiz-detail';
import { quizzes } from '@/data/quizzes';

describe('QuizDetail', () => {
  it('renders the venue and key details', () => {
    const quiz = quizzes[0];
    render(<QuizDetail quiz={quiz} date={new Date(2026, 7, 26)} />);
    expect(screen.getByRole('heading', { name: quiz.venue })).toBeTruthy();
    expect(screen.getByText(quiz.address)).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(<QuizDetail quiz={quizzes[0]} date={new Date(2026, 7, 26)} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
