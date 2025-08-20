import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SimpleUserSetupProps {
  onSetupComplete?: () => void;
}

export default function SimpleUserSetup({ onSetupComplete }: SimpleUserSetupProps) {
  const [step, setStep] = useState(1);
  const [currentTask, setCurrentTask] = useState('');

  const steps = [
    {
      title: "Manual User Creation Required",
      description: "Due to authentication configuration, users need to be created manually",
      action: "Go to Supabase Dashboard"
    },
    {
      title: "Create Standard Users",
      description: "Add demo users through Supabase Authentication panel",
      action: "Add users manually"
    },
    {
      title: "Run Profile Setup",
      description: "Execute SQL script to create user profiles",
      action: "Run SQL script"
    },
    {
      title: "Verify Setup",
      description: "Confirm all users and profiles are created correctly",
      action: "Test login"
    }
  ];

  const userList = [
    { email: 'farmer@example.com', role: 'Farmer', dashboard: '/farmer/dashboard' },
    { email: 'farmer2@example.com', role: 'Farmer', dashboard: '/farmer/dashboard' },
    { email: 'farmer3@example.com', role: 'Farmer', dashboard: '/farmer/dashboard' },
    { email: 'farmer4@example.com', role: 'Farmer', dashboard: '/farmer/dashboard' },
    { email: 'customer@example.com', role: 'Customer', dashboard: '/customer/dashboard' },
    { email: 'customer2@example.com', role: 'Customer', dashboard: '/customer/dashboard' },
    { email: 'delivery@example.com', role: 'Delivery Partner', dashboard: '/delivery/dashboard' },
    { email: 'warehouse@example.com', role: 'Warehouse Manager', dashboard: '/warehouse/dashboard' },
    { email: 'admin@example.com', role: 'Administrator', dashboard: '/admin/dashboard' },
  ];

  const handleNextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onSetupComplete?.();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCurrentTask(`Copied: ${text}`);
    setTimeout(() => setCurrentTask(''), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Manual User Setup Required
          </CardTitle>
          <CardDescription>
            Automated user creation is experiencing issues. Please follow these manual steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 < step ? 'bg-green-500 text-white' :
                    index + 1 === step ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1 < step ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 ${index + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Current step */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg mb-2">
                Step {step}: {steps[step - 1]?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {steps[step - 1]?.description}
              </p>

              {step === 1 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> You need access to the Supabase Dashboard for your project.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <p className="font-medium">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Open <span className="font-mono bg-gray-100 px-1">https://supabase.com/dashboard</span></li>
                      <li>Navigate to your project</li>
                      <li>Go to <strong>Authentication → Users</strong></li>
                      <li>Check if Email Confirmation is disabled in <strong>Authentication → Settings</strong></li>
                    </ol>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="font-medium">Create these users manually:</p>
                  <div className="grid gap-2">
                    {userList.map((user) => (
                      <div key={user.email} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="font-mono text-sm">{user.email}</span>
                          <span className="text-gray-500 ml-2">({user.role})</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(user.email)}
                          >
                            Copy Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard('admin1234')}
                          >
                            Copy Password
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Use password: <span className="font-mono bg-gray-100 px-1">admin1234</span> for all users
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="font-medium">Run the SQL script:</p>
                  <div className="space-y-2">
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to <strong>SQL Editor</strong> in Supabase Dashboard</li>
                      <li>Open the file: <span className="font-mono bg-gray-100 px-1">manual_user_creation.sql</span></li>
                      <li>Copy and paste the profile creation functions</li>
                      <li>Run the SQL to create user profiles</li>
                    </ol>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This will link the manually created users to the appropriate profiles and roles.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="font-medium">Verify the setup:</p>
                  <div className="space-y-2">
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Try logging in with any of the created users</li>
                      <li>Verify you're redirected to the correct dashboard</li>
                      <li>Check that the dashboard loads with real data</li>
                    </ol>
                  </div>
                  <div className="bg-green-50 p-3 rounded border">
                    <h4 className="font-medium text-green-800 mb-2">Test Credentials:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {userList.slice(0, 4).map((user) => (
                        <div key={user.email} className="font-mono">
                          {user.email} → {user.dashboard}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentTask && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {currentTask}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                {step === steps.length ? 'Complete Setup' : 'Next Step'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick reference card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Supabase URLs:</h4>
              <div className="space-y-1 font-mono text-xs">
                <div>Dashboard: supabase.com/dashboard</div>
                <div>Auth: Authentication → Users</div>
                <div>SQL: SQL Editor</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Default Password:</h4>
              <div className="font-mono bg-gray-100 px-2 py-1 rounded">admin1234</div>
            </div>
            <div>
              <h4 className="font-medium mb-2">User Count:</h4>
              <div className="text-2xl font-bold text-blue-600">{userList.length}</div>
              <div className="text-gray-500">total demo users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
