import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import React from 'react';
import NewPostForm from './NewPostForm';
import api from '../services/api';

// Mock the API module
vi.mock('../services/api');

describe('NewPostForm', () => {
  it('submits content and tags, calls onPost with new post', async () => {
    const fakePost = { _id: '1', content: 'Hello', tags: ['t1'] };
    // Mock api.post 
    api.post.mockResolvedValue({ data: fakePost });

    const onPost = vi.fn();
    render(<NewPostForm onPost={onPost} />);

    // Fill in the textarea and tags input
    const textarea = screen.getByPlaceholderText(/what's on your mind\?/i);
    const tagsInput= screen.getByPlaceholderText(/tags/i);
    const submitBtn= screen.getByRole('button', { name: /post/i });

    await userEvent.type(textarea, 'Hello');
    await userEvent.type(tagsInput, 't1');
    await userEvent.click(submitBtn);

    // Expect api.post 
    expect(api.post).toHaveBeenCalledWith('/posts', {
      content: 'Hello',
      tags: ['t1']
    });

    // …and onPost to receive the returned post
    expect(onPost).toHaveBeenCalledWith(fakePost);
  });
});
