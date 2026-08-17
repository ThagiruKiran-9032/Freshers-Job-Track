import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

export const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to access your fresher job discovery dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
};
