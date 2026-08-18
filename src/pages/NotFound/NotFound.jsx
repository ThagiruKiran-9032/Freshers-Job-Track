import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Compass } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-xl)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-md)'
        }}>
          <Compass size={32} />
        </div>

        <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
          404
        </h1>

        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-sm)' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '440px', margin: '0 auto var(--spacing-lg)', lineHeight: 1.5 }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home Page
        </Button>
      </Card>
    </Container>
  );
};
