import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Component', () => {
  it('renders card correctly', () => {
    render(
      <Card data-testid="card">
        <CardContent>Card content</CardContent>
      </Card>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders card with description', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders card with footer', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders complete card with all parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
