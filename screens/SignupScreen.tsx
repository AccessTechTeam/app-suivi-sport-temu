
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { APP_NAME } from '../constants';

const SignupScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCoach, setIsCoach] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, setPage, users } = useAppContext();

  const isCoachAlreadyExists = users.some(u => u.isCoach);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    setError('');
    setLoading(true);
    const success = await signup(username, password, isCoach);
    if (!success) {
      setError('Username already taken. Please choose another one.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-primary">{APP_NAME}</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username-signup"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password-signup"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                placeholder="Password (min. 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {!isCoachAlreadyExists && (
            <div className="flex items-center">
              <input
                id="is-coach"
                name="is-coach"
                type="checkbox"
                className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300 rounded"
                checked={isCoach}
                onChange={(e) => setIsCoach(e.target.checked)}
              />
              <label htmlFor="is-coach" className="ml-2 block text-sm text-gray-900">
                I am the coach
              </label>
            </div>
          )}

          <div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setPage('login')} className="font-medium text-brand-secondary hover:text-brand-primary">
            Already have an account? Sign in
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SignupScreen;
