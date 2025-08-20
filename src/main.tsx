import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvironment } from './config/env'
import { checkSupabaseHealth } from './utils/supabaseTest'

// Validate environment variables
validateEnvironment();

// Test Supabase connection in development
if (import.meta.env.DEV) {
  checkSupabaseHealth().then((health) => {
    console.log('🔍 Supabase Health Check:', health);
  }).catch((error) => {
    console.error('🔍 Supabase Health Check Failed:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
