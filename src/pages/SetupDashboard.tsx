import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Settings, Users, TestTube, AlertTriangle, CheckCircle } from 'lucide-react';
import StandardUserCreator from '../components/StandardUserCreator';
import SimpleUserSetup from '../components/widgets/SimpleUserSetup';
import SupabaseConnectionTest from '../components/widgets/SupabaseConnectionTest';

export default function SetupDashboard() {
  const [activeTab, setActiveTab] = useState('test');
  const [setupComplete, setSetupComplete] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Krishi Bondhu Setup Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure and test your agricultural platform. Set up demo users, test connections, and verify functionality.
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Connection Test</p>
                  <p className="text-xs text-gray-500">Verify Supabase connectivity</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">User Setup</p>
                  <p className="text-xs text-gray-500">Create demo accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                {setupComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Settings className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Platform Status</p>
                  <p className="text-xs text-gray-500">
                    {setupComplete ? 'Ready for use' : 'Setup required'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Alert */}
        {!setupComplete && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Setup Required:</strong> Run connection tests and create demo users to fully configure the platform.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Setup Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Setup & Configuration</CardTitle>
            <CardDescription>
              Follow these steps to set up your Krishi Bondhu platform for development and testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="test">Connection Test</TabsTrigger>
                <TabsTrigger value="auto">Auto Setup</TabsTrigger>
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="test" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Supabase Connection Diagnostics</h3>
                    <p className="text-gray-600 mb-6">
                      Test your Supabase configuration and identify any issues before proceeding with setup.
                    </p>
                  </div>
                  <SupabaseConnectionTest />
                </div>
              </TabsContent>
              
              <TabsContent value="auto" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Automated User Creation</h3>
                    <p className="text-gray-600 mb-6">
                      Automatically create all demo users and profiles for testing the platform.
                    </p>
                  </div>
                  <StandardUserCreator 
                    onUsersCreated={() => {
                      setSetupComplete(true);
                      console.log('Setup completed successfully!');
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Manual Setup Guide</h3>
                    <p className="text-gray-600 mb-6">
                      Step-by-step instructions for manually setting up users when automated creation fails.
                    </p>
                  </div>
                  <SimpleUserSetup 
                    onSetupComplete={() => {
                      setSetupComplete(true);
                      console.log('Manual setup completed!');
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {setupComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Setup Complete! 🎉</CardTitle>
              <CardDescription>
                Your platform is configured and ready for testing. Try logging in with the demo accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/auth/login', '_blank')}
                  className="h-20 flex-col"
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Test Login</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('/farmer/dashboard', '_blank')}
                  className="h-20 flex-col"
                >
                  <span className="text-lg mb-2">🚜</span>
                  <span>Farmer View</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('/customer/dashboard', '_blank')}
                  className="h-20 flex-col"
                >
                  <span className="text-lg mb-2">🛒</span>
                  <span>Customer View</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('/delivery/dashboard', '_blank')}
                  className="h-20 flex-col"
                >
                  <span className="text-lg mb-2">🚚</span>
                  <span>Delivery View</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Need help? Check the{' '}
            <span className="font-mono bg-gray-100 px-1 rounded">manual_user_creation.sql</span>{' '}
            file for SQL-based setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
