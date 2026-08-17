import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const Register = () => {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start tracking jobs, applications & interview preparation"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
