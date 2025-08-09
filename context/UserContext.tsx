'use client';

import { createContext, type ReactNode, useContext, useReducer } from 'react';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_AUTH' };

// Context interface
interface UserContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  token: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'SET_TOKEN':
      return { ...state, token: action.payload };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'LOGOUT':
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // TODO: Implement actual API call here
      // const response = await authAPI.login(email, password);

      const user = {}; // TODO: This is a mock user, replace with actual user

      const token = 'jwt-token'; // TODO: This is a mock token, replace with actual token

      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });

      // TODO: Store token in localStorage or secure storage
      // localStorage.setItem('userToken', mockToken);
    } catch (error) {
      console.error('Login error:', error);
      // TODO: Implement proper error handling for web
      alert('Failed to login. Please try again.');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = () => {
    try {
      // TODO: Clear token from localStorage
      // localStorage.removeItem('userToken');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Register function
  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // TODO: Implement actual API call here
      // const response = await authAPI.register(userData);

      const newUser = {}; // TODO: This is a mock user, replace with actual user

      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error) {
      console.error('Registration error:', error);
      // TODO: Implement proper error handling for web
      alert('Failed to register. Please try again.');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Refresh user data function

  const refreshUser = async () => {
    try {
      if (!state.token) return;

      dispatch({ type: 'SET_LOADING', payload: true });

      // TODO: Implement actual API call here
      // const response = await authAPI.getCurrentUser();
      // dispatch({ type: 'SET_USER', payload: response.data });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Refresh user error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: UserContextType = {
    // State
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    token: state.token,

    // Actions
    login,
    logout,
    register,
    updateUser,
    refreshUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

export { UserContext };
