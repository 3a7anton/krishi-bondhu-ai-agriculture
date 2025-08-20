import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, LogOut, User, Shield, Bell, Settings } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">KrishiBondhu Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 shadow-fresh">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Welcome back!
            </CardTitle>
            <CardDescription>
              Your account is being set up. Here's your current status:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Status:</span>
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Pending Verification
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>User ID:</span>
                <span className="font-mono text-sm">{user?.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-fresh">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Complete these steps to fully activate your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  ✅
                </div>
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">Your email has been confirmed</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  ⏳
                </div>
                <div className="flex-1">
                  <p className="font-medium">Complete Profile Verification</p>
                  <p className="text-sm text-muted-foreground">Upload required documents for verification</p>
                </div>
                <Button size="sm" onClick={() => window.location.href = '/auth/verification'}>
                  Continue
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  ⭕
                </div>
                <div>
                  <p className="font-medium">Admin Approval</p>
                  <p className="text-sm text-muted-foreground">Wait for admin to review your application</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  🎉
                </div>
                <div>
                  <p className="font-medium">Start Using KrishiBondhu</p>
                  <p className="text-sm text-muted-foreground">Access all platform features</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;