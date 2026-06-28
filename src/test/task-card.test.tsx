import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskCard } from '../components/TaskCard';
import { TASKS } from '../data/content';

describe('TaskCard', () => {
  it('calls onChange when completed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const task = TASKS[0];
    render(<TaskCard task={task} status="pending" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: `Hoàn thành: ${task.title}` }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });
});
