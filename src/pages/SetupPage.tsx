import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Database, Users, FileText, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StandardUserCreator from '@/components/StandardUserCreator';
import { DatabaseTestComponent } from '@/components/DatabaseTestComponent';

export default function SetupPage() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const setupSteps = [
    {
      id: 'database',
      title: 'Database Connection',
      description: 'Verify database connection and tables',
      component: <DatabaseTestComponent />
    },
    {
      id: 'users',
      title: 'Create Users',
      description: 'Create standardized test users',
      component: <StandardUserCreator />
    },
    {
      id: 'data',
      title: 'Import Sample Data',
      description: 'Import sample products and farmer data',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Sample Data Import
            </CardTitle>
            <CardDescription>
              Import sample data using the provided SQL file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Import Instructions</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
                <li>Open your Supabase dashboard</li>
                <li>Go to SQL Editor</li>
                <li>Copy the contents of <code className="bg-gray-200 px-1 rounded">sample_data.sql</code></li>
                <li>Paste and run the SQL</li>
                <li>Verify data was imported successfully</li>
              </ol>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">Link Farmers to Users</h3>
              <p className="text-sm text-gray-700 mb-2">
                After creating users and importing data, run these linking commands:
              </p>
              <div className="text-xs bg-gray-800 text-white p-2 rounded font-mono">
                SELECT link_farmer_profile('farmer@example.com', 'farmer-001');<br/>
                SELECT link_farmer_profile('farmer2@example.com', 'farmer-002');<br/>
                SELECT link_farmer_profile('farmer3@example.com', 'farmer-003');<br/>
                SELECT link_farmer_profile('farmer4@example.com', 'farmer-004');
              </div>
            </div>

            <Button 
              onClick={() => markStepComplete('data')} 
              className="w-full"
            >
              Mark Data Import Complete
            </Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'test',
      title: 'Test Login',
      description: 'Test the login functionality',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Test Login Functionality</CardTitle>
            <CardDescription>
              Test logging in with the created users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Test Users</h4>
                <div className="space-y-2 text-sm">
                  <div>👨‍🌾 farmer@example.com</div>
                  <div>🛒 customer@example.com</div>
                  <div>🚚 delivery@example.com</div>
                  <div>🏭 warehouse@example.com</div>
                  <div>👑 admin@example.com</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password: admin1234 (all users)
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Test Steps</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700">
                  <li>Go to login page</li>
                  <li>Enter test credentials</li>
                  <li>Verify dashboard access</li>
                  <li>Test role-specific features</li>
                </ol>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/auth/login')}
                variant="outline"
                className="flex-1"
              >
                Go to Login Page
              </Button>
              <Button 
                onClick={() => markStepComplete('test')} 
                className="flex-1"
              >
                Mark Testing Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  const isStepComplete = (stepId: string) => completedSteps.includes(stepId);
  const allStepsComplete = setupSteps.every(step => isStepComplete(step.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KrishiBondhu Setup</h1>
                <p className="text-gray-600">Complete setup to start using the platform</p>
              </div>
            </div>
            {allStepsComplete && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Setup Complete
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${isStepComplete(step.id) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {isStepComplete(step.id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  isStepComplete(step.id) ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < setupSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="database" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {setupSteps.map((step) => (
              <TabsTrigger 
                key={step.id} 
                value={step.id}
                className={isStepComplete(step.id) ? 'bg-green-100' : ''}
              >
                <div className="flex items-center space-x-1">
                  {isStepComplete(step.id) && <CheckCircle className="w-3 h-3" />}
                  <span>{step.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {setupSteps.map((step) => (
            <TabsContent key={step.id} value={step.id}>
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{step.title}</h2>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {step.component}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Final Steps */}
        {allStepsComplete && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Setup Complete!</CardTitle>
              <CardDescription className="text-green-700">
                Your KrishiBondhu platform is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button onClick={() => navigate('/')} className="flex-1">
                  Go to Homepage
                </Button>
                <Button 
                  onClick={() => navigate('/auth/login')} 
                  variant="outline"
                  className="flex-1"
                >
                  Login to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
