/**
 * AuthContext is superseded by AppContext which uses the new Supabase backend.
 * This file re-exports from AppContext for backward compatibility.
 */
export { AppContext, AppProvider } from './AppContext';
export { useAppContext } from '@/hooks/useAppContext';
