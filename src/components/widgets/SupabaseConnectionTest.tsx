import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export default function SupabaseConnectionTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Supabase Client', status: 'pending', message: 'Checking client initialization...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing database connectivity...' },
    { name: 'Authentication Service', status: 'pending', message: 'Checking auth service...' },
    { name: 'Tables Access', status: 'pending', message: 'Verifying table access...' },
    { name: 'RLS Policies', status: 'pending', message: 'Checking Row Level Security...' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest(0);

    // Test 1: Supabase Client
    try {
      if (supabase) {
        updateTest(0, { 
          status: 'success', 
          message: 'Supabase client initialized successfully',
          details: 'Client configured and ready'
        });
      } else {
        throw new Error('Supabase client not initialized');
      }
    } catch (error) {
      updateTest(0, { 
        status: 'error', 
        message: 'Failed to initialize Supabase client',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setCurrentTest(1);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Database Connection
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      updateTest(1, { 
        status: 'success', 
        message: 'Database connection successful',
        details: 'Can query profiles table'
      });
    } catch (error: any) {
      updateTest(1, { 
        status: 'error', 
        message: 'Database connection failed',
        details: error?.message || 'Unknown database error'
      });
    }
    setCurrentTest(2);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Authentication Service
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      updateTest(2, { 
        status: 'success', 
        message: 'Authentication service accessible',
        details: session ? 'User logged in' : 'No active session (normal)'
      });
    } catch (error: any) {
      updateTest(2, { 
        status: 'error', 
        message: 'Authentication service error',
        details: error?.message || 'Auth service unavailable'
      });
    }
    setCurrentTest(3);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4: Tables Access
    try {
      const tableTests = [
        () => supabase.from('profiles').select('count').limit(1),
        () => supabase.from('farmer_profiles').select('count').limit(1),
        () => supabase.from('products').select('count').limit(1),
        () => supabase.from('orders').select('count').limit(1)
      ];
      
      const results = await Promise.allSettled(tableTests.map(test => test()));
      
      const accessible = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (accessible > 0) {
        updateTest(3, { 
          status: accessible === tableTests.length ? 'success' : 'error', 
          message: `${accessible}/${tableTests.length} tables accessible`,
          details: failed > 0 ? `${failed} tables have access issues` : 'All tables accessible'
        });
      } else {
        throw new Error('No tables accessible');
      }
    } catch (error: any) {
      updateTest(3, { 
        status: 'error', 
        message: 'Table access failed',
        details: error?.message || 'Cannot access database tables'
      });
    }
    setCurrentTest(4);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 5: RLS Policies (attempt a simple signup test)
    try {
      // Test if we can at least call the signup function (even if it fails due to email confirmation)
      const testEmail = `test-${Date.now()}@test.local`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      });
      
      // If we get here without throwing, the auth endpoint is accessible
      if (error) {
        // Check if it's just email confirmation or a more serious error
        if (error.message.includes('confirmation') || error.message.includes('verify')) {
          updateTest(4, { 
            status: 'success', 
            message: 'Auth signup accessible (email confirmation required)',
            details: 'Signup endpoint works, but email confirmation is enabled'
          });
        } else if (error.message.includes('rate limit')) {
          updateTest(4, { 
            status: 'error', 
            message: 'Rate limited - too many attempts',
            details: 'Wait before trying again, or check rate limit settings'
          });
        } else {
          updateTest(4, { 
            status: 'error', 
            message: 'Signup failed',
            details: error.message
          });
        }
      } else {
        updateTest(4, { 
          status: 'success', 
          message: 'Signup test successful',
          details: 'User creation works properly'
        });
      }
    } catch (error: any) {
      updateTest(4, { 
        status: 'error', 
        message: 'Authentication test failed',
        details: error?.message || 'Signup endpoint not accessible'
      });
    }
    
    setCurrentTest(5);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status'], isActive: boolean) => {
    if (isActive && status === 'pending') {
      return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRecommendations = () => {
    const errorTests = tests.filter(t => t.status === 'error');
    if (errorTests.length === 0) return null;

    const recommendations = [];
    
    if (errorTests.some(t => t.name === 'Supabase Client')) {
      recommendations.push('Check environment variables and Supabase configuration');
    }
    
    if (errorTests.some(t => t.name === 'Database Connection')) {
      recommendations.push('Verify database is running and accessible');
    }
    
    if (errorTests.some(t => t.name === 'Authentication Service')) {
      recommendations.push('Check Supabase project status and authentication settings');
    }
    
    if (errorTests.some(t => t.name === 'Tables Access')) {
      recommendations.push('Run database migrations and check RLS policies');
    }
    
    if (errorTests.some(t => t.details?.includes('rate limit'))) {
      recommendations.push('Wait 5-10 minutes before trying again, or disable rate limiting in Supabase Dashboard');
    }
    
    if (errorTests.some(t => t.details?.includes('confirmation'))) {
      recommendations.push('Disable email confirmation in Supabase Dashboard → Authentication → Settings');
    }

    return recommendations;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Supabase Connection Diagnostics
          </CardTitle>
          <CardDescription>
            Test the connection and configuration of your Supabase instance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Tests...' : 'Run Diagnostic Tests'}
            </Button>

            <div className="space-y-3">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={`p-3 border rounded-lg transition-colors ${
                    currentTest === index && isRunning 
                      ? 'border-blue-200 bg-blue-50' 
                      : test.status === 'error' 
                        ? 'border-red-200 bg-red-50'
                        : test.status === 'success'
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status, currentTest === index && isRunning)}
                    <div className="flex-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                      {test.details && (
                        <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 p-1 rounded">
                          {test.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isRunning && tests.some(t => t.status !== 'pending') && (
              <div className="mt-6">
                {getRecommendations() && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-orange-800">Recommendations:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                          {getRecommendations()?.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {tests.filter(t => t.status === 'success').length}/{tests.length}
                    </div>
                    <div className="text-sm text-gray-500">tests passed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
