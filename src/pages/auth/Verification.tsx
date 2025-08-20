import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Leaf, Upload, CheckCircle, Clock, XCircle, FileText, Camera, Shield, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setVerificationSkipped } from "@/utils/verification";

const Verification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  
  // Mock verification status - in real app, this would come from Supabase
  const verificationStatus = {
    email_verified: true,
    profile_submitted: true,
    documents_uploaded: false,
    admin_reviewed: false,
    status: 'pending' as 'pending' | 'verified' | 'rejected'
  };

  const requiredDocuments = [
    {
      id: 'national_id',
      title: 'National ID Card',
      description: 'Clear photo of your National ID card (both sides)',
      uploaded: false,
      status: 'pending' as 'pending' | 'verified' | 'rejected'
    },
    {
      id: 'profile_photo',
      title: 'Profile Photo',
      description: 'Recent passport-size photograph',
      uploaded: false,
      status: 'pending' as 'pending' | 'verified' | 'rejected'
    },
    {
      id: 'farm_certificate',
      title: 'Farm Ownership Certificate',
      description: 'Land ownership or lease documents',
      uploaded: false,
      status: 'pending' as 'pending' | 'verified' | 'rejected'
    },
    {
      id: 'address_proof',
      title: 'Address Proof',
      description: 'Utility bill or bank statement',
      uploaded: false,
      status: 'pending' as 'pending' | 'verified' | 'rejected'
    }
  ];

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploadingDocument(documentId);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and is awaiting verification.",
      });
      
      // In real app, this would upload to Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('verification-documents')
      //   .upload(`${auth.user.id}/${documentId}`, file);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingDocument(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleSkipVerification = () => {
    // Store skip status using utility function
    setVerificationSkipped();
    
    toast({
      title: "Verification Skipped",
      description: "You can complete verification later from your profile settings. Some features may be limited.",
      variant: "default"
    });
    
    // Navigate to dashboard based on user role (you can customize this)
    navigate('/dashboard');
  };

  const calculateProgress = () => {
    let completed = 0;
    if (verificationStatus.email_verified) completed += 25;
    if (verificationStatus.profile_submitted) completed += 25;
    if (verificationStatus.documents_uploaded) completed += 25;
    if (verificationStatus.admin_reviewed) completed += 25;
    return completed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-foreground">KrishiBondhu</h1>
              <span className="ml-2 text-sm text-muted-foreground font-bengali">কৃষিবন্ধু</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Account Verification
            </h2>
            <p className="text-muted-foreground mb-6">
              Complete your verification to unlock all KrishiBondhu features
            </p>
            
            {/* Skip Verification Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowSkipDialog(true)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-4 h-4" />
                Skip for Now
              </Button>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8 shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Verification Progress
                </div>
                <Badge variant="outline" className="text-xs">
                  Optional
                </Badge>
              </CardTitle>
              <CardDescription>
                Follow these steps to complete your account verification. You can skip this process and complete it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{calculateProgress()}% complete</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    {getStatusIcon(verificationStatus.email_verified ? 'verified' : 'pending')}
                    <p className="text-sm mt-2">Email Verified</p>
                  </div>
                  <div className="text-center">
                    {getStatusIcon(verificationStatus.profile_submitted ? 'verified' : 'pending')}
                    <p className="text-sm mt-2">Profile Submitted</p>
                  </div>
                  <div className="text-center">
                    {getStatusIcon(verificationStatus.documents_uploaded ? 'verified' : 'pending')}
                    <p className="text-sm mt-2">Documents Uploaded</p>
                  </div>
                  <div className="text-center">
                    {getStatusIcon(verificationStatus.admin_reviewed ? 'verified' : 'pending')}
                    <p className="text-sm mt-2">Admin Reviewed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Section */}
          <Card className="mb-8 shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Upload the following documents for verification. All documents should be clear and readable. 
                <span className="text-orange-600 font-medium"> You can skip this step and complete it later from your profile settings.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {requiredDocuments.map((doc, index) => (
                  <div key={doc.id}>
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-medium">{doc.title}</h4>
                          {getStatusBadge(doc.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {doc.description}
                        </p>
                        
                        {!doc.uploaded ? (
                          <div className="space-y-3">
                            <Label htmlFor={`upload-${doc.id}`} className="sr-only">
                              Upload {doc.title}
                            </Label>
                            <Input
                              id={`upload-${doc.id}`}
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(doc.id, file);
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById(`upload-${doc.id}`)?.click()}
                              disabled={uploadingDocument === doc.id}
                              className="w-full sm:w-auto"
                            >
                              {uploadingDocument === doc.id ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Document
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Document uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < requiredDocuments.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification Guidelines */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle>Verification Guidelines</CardTitle>
              <CardDescription>
                Please follow these guidelines to ensure quick approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-primary" />
                    Photo Guidelines
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Take photos in good lighting</li>
                    <li>• Ensure all text is clearly visible</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Use high resolution images</li>
                    <li>• Keep documents flat and straight</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Security & Privacy
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• All documents are encrypted and secure</li>
                    <li>• Only verified staff can access your documents</li>
                    <li>• Documents are used solely for verification</li>
                    <li>• Your privacy is protected at all times</li>
                    <li>• Data complies with local regulations</li>
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📞 Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  If you're having trouble with verification or have questions, our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm">
                    📧 Email Support
                  </Button>
                  <Button variant="outline" size="sm">
                    📱 Call: +880 1234-567890
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 Live Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skip Verification Confirmation Dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SkipForward className="w-5 h-5 text-orange-500" />
              Skip Verification?
            </DialogTitle>
            <DialogDescription>
              You can skip verification for now and complete it later. However, some features may be limited until your account is fully verified.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Limited Access</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Some advanced features may be restricted</li>
              <li>• Payment processing may require verification</li>
              <li>• You can complete verification anytime from settings</li>
            </ul>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSkipDialog(false)}
              className="w-full sm:w-auto"
            >
              Continue Verification
            </Button>
            <Button
              variant="default"
              onClick={handleSkipVerification}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            >
              Skip for Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Verification;