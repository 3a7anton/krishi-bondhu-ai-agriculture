import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Database, Key, Globe } from 'lucide-react';
import { checkSupabaseHealth } from '@/utils/supabaseTest';
import { getSupabaseConfig } from '@/utils/supabaseHelpers';

export const SupabaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    isAuthenticated: boolean;
    session: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = getSupabaseConfig();

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const health = await checkSupabaseHealth();
      setConnectionStatus(health);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test connection on component mount
    testConnection();
  }, []);

  const renderStatus = (status: boolean | null, label: string) => {
    if (status === null) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Testing...
        </Badge>
      );
    }
    
    return (
      <Badge variant={status ? "default" : "destructive"} className="flex items-center gap-1">
        {status ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Test and verify your Supabase configuration and connection status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Configuration</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">URL Configured</span>
              </div>
              {renderStatus(!!config.url, config.url ? 'Connected' : 'Missing')}
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="text-sm">API Key Configured</span>
              </div>
              {renderStatus(!!config.anonKey, config.anonKey ? 'Present' : 'Missing')}
            </div>
          </div>
          {config.url && (
            <p className="text-xs text-muted-foreground">
              Project URL: {config.url}
            </p>
          )}
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Connection Status</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">Database Connection</span>
                {renderStatus(connectionStatus.isConnected, connectionStatus.isConnected ? 'Connected' : 'Failed')}
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">Authentication Status</span>
                {renderStatus(connectionStatus.isAuthenticated, connectionStatus.isAuthenticated ? 'Signed In' : 'Not Signed In')}
              </div>
            </div>
          </div>
        )}

        {/* Session Info */}
        {connectionStatus?.session && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Session Information</h3>
            <div className="p-3 bg-muted rounded text-xs">
              <p><strong>User ID:</strong> {connectionStatus.session.user?.id}</p>
              <p><strong>Email:</strong> {connectionStatus.session.user?.email}</p>
              <p><strong>Role:</strong> {connectionStatus.session.user?.role || 'Not set'}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Test Button */}
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Note:</strong> This test checks:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Environment variables are properly configured</li>
            <li>Database connection is working</li>
            <li>Authentication service is accessible</li>
            <li>Current session status</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
