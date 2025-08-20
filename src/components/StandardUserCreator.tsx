import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Plus, CheckCircle } from 'lucide-react';

interface StandardUser {
  email: string;
  password: string;
  role: 'farmer' | 'customer' | 'delivery' | 'warehouse' | 'admin';
  display_name: string;
}

const standardUsers: StandardUser[] = [
  { email: 'farmer@example.com', password: 'admin1234', role: 'farmer', display_name: 'Farmer User' },
  { email: 'farmer2@example.com', password: 'admin1234', role: 'farmer', display_name: 'Farmer 2' },
  { email: 'farmer3@example.com', password: 'admin1234', role: 'farmer', display_name: 'Farmer 3' },
  { email: 'farmer4@example.com', password: 'admin1234', role: 'farmer', display_name: 'Farmer 4' },
  { email: 'customer@example.com', password: 'admin1234', role: 'customer', display_name: 'Customer User' },
  { email: 'customer2@example.com', password: 'admin1234', role: 'customer', display_name: 'Customer 2' },
  { email: 'delivery@example.com', password: 'admin1234', role: 'delivery', display_name: 'Delivery Partner' },
  { email: 'warehouse@example.com', password: 'admin1234', role: 'warehouse', display_name: 'Warehouse Manager' },
  { email: 'admin@example.com', password: 'admin1234', role: 'admin', display_name: 'Administrator' }
];

interface StandardUserCreatorProps {
  onUsersCreated?: () => void;
}

export default function StandardUserCreator({ onUsersCreated }: StandardUserCreatorProps = {}) {
  const [loading, setLoading] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);
  const [customUser, setCustomUser] = useState({ email: '', password: '', role: 'customer' as const });
  const [authTestResult, setAuthTestResult] = useState<string>('');
  const { toast } = useToast();

  // Test Supabase Auth Configuration
  const testAuthSetup = async () => {
    setLoading(true);
    try {
      // Test basic Supabase connection
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      // Test a simple signup with a test email
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'admin1234',
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        throw error;
      }

      // If successful, clean up the test user (or just ignore it)
      setAuthTestResult(`✅ Auth test successful. Test user created: ${testEmail}`);
      
      toast({
        title: "Auth test successful",
        description: "Supabase authentication is working correctly",
      });

    } catch (error: any) {
      const errorMsg = `❌ Auth test failed: ${error.message}`;
      setAuthTestResult(errorMsg);
      
      toast({
        title: "Auth test failed",
        description: error.message,
        variant: "destructive"
      });
      
      console.error('Auth test error:', error);
    }
    setLoading(false);
  };

  const createUser = async (user: StandardUser) => {
    try {
      console.log(`🔄 Attempting to create user: ${user.email} with role: ${user.role}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation for demo users
          data: {
            full_name: user.display_name,
            role: user.role
          }
        }
      });

      if (error) {
        console.error(`❌ Signup error for ${user.email}:`, {
          message: error.message,
          status: error.status,
          details: error
        });
        
        // Check if it's a duplicate user error
        if (error.message.includes('already registered') || 
            error.message.includes('already been registered') ||
            error.message.includes('User already registered')) {
          return { success: true, user: null, message: 'User already exists' };
        }
        throw error;
      }

      console.log(`✅ User created successfully: ${user.email}`, data.user);

      // Create profile entry if user was created
      if (data.user) {
        const roleMapping = {
          'farmer': 'farmer',
          'customer': 'customer', 
          'delivery': 'delivery_partner',
          'warehouse': 'warehouse',
          'admin': 'customer' // Admin users use customer role for now
        };

        console.log(`🔄 Creating profile for ${user.email} with role: ${roleMapping[user.role]}`);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            role: roleMapping[user.role] as 'farmer' | 'customer' | 'warehouse' | 'delivery_partner',
            phone: '',
            verification_status: 'verified'
          });

        if (profileError) {
          console.warn(`⚠️ Profile creation warning for ${user.email}:`, profileError);
        } else {
          console.log(`✅ Profile created successfully for ${user.email}`);
        }
      }
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error(`❌ Complete user creation error for ${user.email}:`, {
        message: error.message,
        status: error.status,
        stack: error.stack,
        fullError: error
      });
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  };

  const createAllStandardUsers = async () => {
    setLoading(true);
    const results: string[] = [];
    const errors: string[] = [];

    toast({
      title: "Starting user creation",
      description: `Creating ${standardUsers.length} standard users...`,
    });

    for (const user of standardUsers) {
      if (createdUsers.includes(user.email)) {
        continue; // Skip already created users
      }

      const result = await createUser(user);
      if (result.success) {
        results.push(user.email);
        toast({
          title: "User created",
          description: `${user.display_name} (${user.email}) ${result.message || 'created successfully'}`,
        });
      } else {
        errors.push(`${user.email}: ${result.error}`);
        toast({
          title: "User creation failed",
          description: `Failed to create ${user.email}: ${result.error}`,
          variant: "destructive"
        });
      }

      // Longer delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setCreatedUsers(prev => [...prev, ...results]);
    setLoading(false);

    if (results.length > 0) {
      toast({
        title: "Batch creation complete",
        description: `Successfully created ${results.length} users. ${errors.length > 0 ? `${errors.length} failed.` : ''}`,
      });
      
      // Call the callback if all users were created successfully
      if (errors.length === 0 && onUsersCreated) {
        onUsersCreated();
      }
    }

    if (errors.length > 0) {
      console.error('User creation errors:', errors);
    }
  };

  const createCustomUser = async () => {
    if (!customUser.email || !customUser.password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await createUser({
      ...customUser,
      display_name: customUser.email.split('@')[0]
    });

    if (result.success) {
      toast({
        title: "User created",
        description: `User ${customUser.email} created successfully`,
      });
      setCustomUser({ email: '', password: '', role: 'customer' });
    } else {
      toast({
        title: "User creation failed",
        description: result.error,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const resetDemo = async () => {
    setLoading(true);
    try {
      // Note: In production, you would need admin privileges to delete users
      // For now, we'll just clear the local state
      setCreatedUsers([]);
      
      toast({
        title: "Demo reset",
        description: "Demo users state cleared. Note: Actual users in database remain.",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to reset demo users",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Standardized User Creator
        </h1>
        <p className="text-gray-600">
          Create standardized users for testing and demo purposes
        </p>
      </div>

      {/* Auth Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Authentication Test
          </CardTitle>
          <CardDescription>
            Test Supabase authentication setup before creating users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testAuthSetup} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Auth...
              </>
            ) : (
              'Test Authentication Setup'
            )}
          </Button>
          
          {authTestResult && (
            <div className={`p-3 rounded-lg text-sm font-mono ${
              authTestResult.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {authTestResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Standard Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Standard Test Users
          </CardTitle>
          <CardDescription>
            Create all standard users with admin1234 password for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standardUsers.map((user) => (
              <div 
                key={user.email}
                className={`p-3 rounded-lg border ${
                  createdUsers.includes(user.email) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{user.display_name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-blue-600 capitalize">{user.role}</div>
                  </div>
                  {createdUsers.includes(user.email) && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={createAllStandardUsers} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Users...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create All Standard Users
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetDemo}
              disabled={loading}
            >
              Reset Demo State
            </Button>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Created:</strong> {createdUsers.length} / {standardUsers.length} users</p>
            <p><strong>Password for all users:</strong> admin1234</p>
          </div>
        </CardContent>
      </Card>

      {/* Custom User Creator */}
      <Card>
        <CardHeader>
          <CardTitle>Create Custom User</CardTitle>
          <CardDescription>
            Create additional users with custom details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="custom-email">Email</Label>
              <Input
                id="custom-email"
                type="email"
                value={customUser.email}
                onChange={(e) => setCustomUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="custom-password">Password</Label>
              <Input
                id="custom-password"
                type="password"
                value={customUser.password}
                onChange={(e) => setCustomUser(prev => ({ ...prev, password: e.target.value }))}
                placeholder="password"
              />
            </div>
            <div>
              <Label htmlFor="custom-role">Role</Label>
              <Select 
                value={customUser.role} 
                onValueChange={(value: any) => setCustomUser(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="delivery">Delivery Partner</SelectItem>
                  <SelectItem value="warehouse">Warehouse Manager</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={createCustomUser} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Custom User
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting 400 Errors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Common causes of 400 Bad Request errors:</h4>
            <ul className="space-y-1 text-gray-600 ml-4">
              <li>• <strong>Email Confirmation Required:</strong> Check Supabase Dashboard → Authentication → Settings → Email confirmation is disabled</li>
              <li>• <strong>Rate Limiting:</strong> Too many signup requests in short time</li>
              <li>• <strong>Password Policy:</strong> Password doesn't meet requirements (min 6 chars)</li>
              <li>• <strong>User Already Exists:</strong> Email already registered in system</li>
              <li>• <strong>Invalid Email Format:</strong> Malformed email address</li>
              <li>• <strong>Auth Configuration:</strong> Missing RLS policies or incorrect settings</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-600">Recommended fixes:</h4>
            <ol className="space-y-1 text-gray-600 ml-4">
              <li>1. Go to Supabase Dashboard → Authentication → Settings</li>
              <li>2. Disable "Enable email confirmations" for testing</li>
              <li>3. Check "Enable automatic account creation"</li>
              <li>4. Ensure RLS policies allow public signup</li>
              <li>5. Use the "Test Authentication Setup" button above</li>
            </ol>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-xs">
              <strong>Note:</strong> Check the browser console for detailed error logs. 
              The component now provides extensive debugging information for troubleshooting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>1. ✅ Create users using the buttons above</p>
          <p>2. 📥 Import the sample data using the SQL file: <code>sample_data.sql</code></p>
          <p>3. 🔗 Link farmer profiles to users by running the linking functions</p>
          <p>4. 🧪 Test login functionality with any created user</p>
          <p>5. 🎯 Start using the application with real data!</p>
        </CardContent>
      </Card>
    </div>
  );
}
