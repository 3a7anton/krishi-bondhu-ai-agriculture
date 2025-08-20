import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth/simple-login' 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔒 Checking authentication for protected route...');
      
      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setError('Session error');
        setLoading(false);
        return;
      }

      if (!session?.user) {
        console.log('🚫 No authenticated user, redirecting to login');
        navigate(fallbackPath);
        return;
      }

      console.log('✅ User authenticated:', session.user.email);
      setUser(session.user);

      // Try to fetch profile, but don't block if it fails
      if (requiredRole) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.warn('⚠️ Profile fetch error:', profileError);
          }

          if (profileData) {
            console.log('👤 Profile loaded:', profileData.role);
            setProfile(profileData);
            
            // Check role if required
            if (requiredRole && profileData.role !== requiredRole) {
              console.log(`🚫 Role mismatch: required ${requiredRole}, got ${profileData.role}`);
              setError(`Access denied. This page requires ${requiredRole} role.`);
              setLoading(false);
              return;
            }
          } else {
            console.log('ℹ️ No profile found, but allowing access');
          }
        } catch (profileErr) {
          console.warn('⚠️ Profile check failed, but allowing access:', profileErr);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('💥 Auth check failed:', err);
      setError('Authentication check failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={() => navigate(fallbackPath)} className="flex-1">
              Go to Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This shouldn't happen due to redirect above
  }

  // Render the protected content
  return <>{children}</>;
}
