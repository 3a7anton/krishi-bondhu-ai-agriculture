import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, XCircle, Database, Users, Key } from "lucide-react";

interface AuthTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function AuthDebugger() {
  const [tests, setTests] = useState<AuthTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const addTest = (test: AuthTest) => {
    setTests(prev => [...prev, test]);
  };

  const updateTest = (index: number, updates: Partial<AuthTest>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        setConnectionStatus('error');
        console.error('❌ Supabase connection failed:', error);
      } else {
        setConnectionStatus('connected');
        console.log('✅ Supabase connection successful');
      }
    } catch (err) {
      setConnectionStatus('error');
      console.error('💥 Connection test failed:', err);
    }
  };

  const runAuthTests = async () => {
    setLoading(true);
    setTests([]);

    // Test 1: Check Supabase Connection
    addTest({ name: 'Supabase Connection', status: 'pending', message: 'Testing connection...' });
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      updateTest(0, { status: 'success', message: 'Connection successful' });
    } catch (err: any) {
      updateTest(0, { status: 'error', message: `Connection failed: ${err.message}` });
    }

    // Test 2: Check Auth Configuration
    addTest({ name: 'Auth Configuration', status: 'pending', message: 'Checking auth settings...' });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      updateTest(1, { 
        status: 'success', 
        message: `Auth configured. Current session: ${session ? 'Active' : 'None'}`,
        details: session 
      });
    } catch (err: any) {
      updateTest(1, { status: 'error', message: `Auth config error: ${err.message}` });
    }

    // Test 3: Test Login with farmer@example.com
    addTest({ name: 'Test Login (farmer@example.com)', status: 'pending', message: 'Attempting login...' });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'farmer@example.com',
        password: 'admin1234'
      });
      
      if (error) throw error;
      
      updateTest(2, { 
        status: 'success', 
        message: `Login successful for ${data.user?.email}`,
        details: { userId: data.user?.id, email: data.user?.email }
      });

      // Test 4: Check Profile Fetch
      addTest({ name: 'Profile Fetch', status: 'pending', message: 'Fetching user profile...' });
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user?.id)
          .single();

        if (profileError) throw profileError;

        updateTest(3, {
          status: 'success',
          message: `Profile found: ID ${profile.id} (${profile.role})`,
          details: profile
        });
      } catch (profileErr: any) {
        updateTest(3, {
          status: 'error',
          message: `Profile fetch failed: ${profileErr.message}`,
          details: profileErr
        });
      }

      // Logout after test
      await supabase.auth.signOut();

    } catch (err: any) {
      updateTest(2, { 
        status: 'error', 
        message: `Login failed: ${err.message}`,
        details: err 
      });
    }

    // Test 5: Check Database Users
    addTest({ name: 'Database Users Check', status: 'pending', message: 'Checking user accounts...' });
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, email, role, display_name')
        .order('email');

      if (error) throw error;

      updateTest(tests.length, {
        status: 'success',
        message: `Found ${profiles.length} user profiles in database`,
        details: profiles
      });
    } catch (err: any) {
      updateTest(tests.length, {
        status: 'error',
        message: `Database query failed: ${err.message}`,
        details: err
      });
    }

    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Authentication Debugger
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus === 'connected' ? 'Connected' : 'Connection Issues'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Supabase Project: xbwscvdrghtvsfwnaqoo
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runAuthTests}
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Running Tests...' : 'Run Authentication Tests'}
          </Button>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                  <Badge variant="outline" className={`ml-auto text-white ${getStatusColor(test.status)}`}>
                    {test.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{test.message}</p>
                {test.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Quick Database Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Expected Users:</strong></p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>🚜 farmer@example.com</div>
              <div>🌾 farmer2@example.com</div>
              <div>🌽 farmer3@example.com</div>
              <div>🥕 farmer4@example.com</div>
              <div>🛒 customer@example.com</div>
              <div>🛍️ customer2@example.com</div>
              <div>🚚 delivery@example.com</div>
              <div>🏭 warehouse@example.com</div>
              <div>👑 admin@example.com</div>
            </div>
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground">
              All users should have password: admin1234
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
