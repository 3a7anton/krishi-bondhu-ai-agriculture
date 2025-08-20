import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Leaf, ArrowLeft, ArrowRight, User, Phone, MapPin, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Registration = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'farmer';
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic auth fields
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Role-specific fields
    full_name: '',
    land_area_acres: '',
    crops_grown: [] as string[],
    farm_location: '',
    farming_experience_years: '',
    organic_certified: false,
    
    // Customer fields
    delivery_address: '',
    city: '',
    postal_code: '',
    food_preferences: [] as string[],
    dietary_restrictions: [] as string[],
    
    // Warehouse fields
    business_name: '',
    capacity_tons: '',
    facilities: [] as string[],
    location: '',
    certifications: [] as string[],
    operating_hours: '',
    contact_person: '',
    
    // Delivery partner fields
    vehicle_type: '',
    vehicle_registration: '',
    license_number: '',
    coverage_areas: [] as string[],
    availability_hours: ''
  });

  const roleConfig = {
    farmer: {
      title: "Farmer Registration",
      bengali: "কৃষক নিবন্ধন",
      icon: "🚜",
      steps: 3
    },
    customer: {
      title: "Customer Registration", 
      bengali: "ক্রেতা নিবন্ধন",
      icon: "🛒",
      steps: 3
    },
    warehouse: {
      title: "Warehouse Registration",
      bengali: "গুদাম নিবন্ধন", 
      icon: "🏢",
      steps: 3
    },
    delivery_partner: {
      title: "Delivery Partner Registration",
      bengali: "ডেলিভারি পার্টনার নিবন্ধন",
      icon: "🚚",
      steps: 3
    }
  };

  const currentConfig = roleConfig[role as keyof typeof roleConfig];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleInputChange(field, newArray);
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.password && formData.confirmPassword && formData.phone;
      case 2:
        if (role === 'farmer') {
          return formData.full_name && formData.farm_location;
        } else if (role === 'customer') {
          return formData.full_name && formData.delivery_address && formData.city;
        } else if (role === 'warehouse') {
          return formData.business_name && formData.location && formData.capacity_tons;
        } else if (role === 'delivery_partner') {
          return formData.full_name && formData.vehicle_type && formData.license_number;
        }
        return false;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        role,
        phone: formData.phone,
        full_name: formData.full_name,
        profile_data: formData
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        navigate('/auth/verification');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{currentConfig.icon}</div>
        <h2 className="text-2xl font-bold text-foreground">{currentConfig.title}</h2>
        <p className="text-sm text-primary font-bengali">{currentConfig.bengali}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+880 1234-567890"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificStep = () => {
    switch (role) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="farm_location">Farm Location</Label>
              <Input
                id="farm_location"
                value={formData.farm_location}
                onChange={(e) => handleInputChange('farm_location', e.target.value)}
                placeholder="Village, District"
                required
              />
            </div>

            <div>
              <Label htmlFor="land_area_acres">Land Area (Acres)</Label>
              <Input
                id="land_area_acres"
                type="number"
                value={formData.land_area_acres}
                onChange={(e) => handleInputChange('land_area_acres', e.target.value)}
                placeholder="5.5"
              />
            </div>

            <div>
              <Label htmlFor="farming_experience_years">Years of Experience</Label>
              <Input
                id="farming_experience_years"
                type="number"
                value={formData.farming_experience_years}
                onChange={(e) => handleInputChange('farming_experience_years', e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label>Crops Grown (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Rice', 'Wheat', 'Vegetables', 'Fruits', 'Pulses', 'Spices'].map((crop) => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={formData.crops_grown.includes(crop)}
                      onCheckedChange={() => handleArrayChange('crops_grown', crop)}
                    />
                    <Label htmlFor={crop} className="text-sm">{crop}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="organic_certified"
                checked={formData.organic_certified}
                onCheckedChange={(checked) => handleInputChange('organic_certified', checked)}
              />
              <Label htmlFor="organic_certified">Organic Certified Farm</Label>
            </div>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="delivery_address">Delivery Address</Label>
              <Textarea
                id="delivery_address"
                value={formData.delivery_address}
                onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                placeholder="Your complete address for delivery"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Dhaka"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Food Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Organic', 'Local', 'Seasonal', 'Premium'].map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Checkbox
                      id={pref}
                      checked={formData.food_preferences.includes(pref)}
                      onCheckedChange={() => handleArrayChange('food_preferences', pref)}
                    />
                    <Label htmlFor={pref} className="text-sm">{pref}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'warehouse':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Your warehouse business name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Manager name"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Warehouse address"
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity_tons">Storage Capacity (Tons)</Label>
              <Input
                id="capacity_tons"
                type="number"
                value={formData.capacity_tons}
                onChange={(e) => handleInputChange('capacity_tons', e.target.value)}
                placeholder="1000"
                required
              />
            </div>

            <div>
              <Label htmlFor="operating_hours">Operating Hours</Label>
              <Input
                id="operating_hours"
                value={formData.operating_hours}
                onChange={(e) => handleInputChange('operating_hours', e.target.value)}
                placeholder="6 AM - 8 PM"
              />
            </div>

            <div className="space-y-2">
              <Label>Facilities Available</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Cold Storage', 'Dry Storage', 'Processing', 'Packaging'].map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility}
                      checked={formData.facilities.includes(facility)}
                      onCheckedChange={() => handleArrayChange('facilities', facility)}
                    />
                    <Label htmlFor={facility} className="text-sm">{facility}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'delivery_partner':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Select value={formData.vehicle_type} onValueChange={(value) => handleInputChange('vehicle_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="bicycle">Bicycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_registration">Vehicle Registration</Label>
                <Input
                  id="vehicle_registration"
                  value={formData.vehicle_registration}
                  onChange={(e) => handleInputChange('vehicle_registration', e.target.value)}
                  placeholder="ABC-1234"
                  required
                />
              </div>
              <div>
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleInputChange('license_number', e.target.value)}
                  placeholder="DL-123456789"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availability_hours">Availability Hours</Label>
              <Input
                id="availability_hours"
                value={formData.availability_hours}
                onChange={(e) => handleInputChange('availability_hours', e.target.value)}
                placeholder="8 AM - 6 PM"
              />
            </div>

            <div className="space-y-2">
              <Label>Coverage Areas</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Dhaka North', 'Dhaka South', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.coverage_areas.includes(area)}
                      onCheckedChange={() => handleArrayChange('coverage_areas', area)}
                    />
                    <Label htmlFor={area} className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h3 className="text-xl font-bold text-foreground">Review Your Information</h3>
      <p className="text-muted-foreground">
        Please review your information before submitting your registration.
      </p>
      
      <div className="bg-accent/30 p-4 rounded-lg text-left space-y-2">
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Name:</strong> {formData.full_name || formData.business_name}</p>
        <p><strong>Role:</strong> {currentConfig.title}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">📋 Next Steps:</h4>
        <ul className="text-sm text-left space-y-1">
          <li>• Verify your email address</li>
          <li>• Upload verification documents</li>
          <li>• Wait for admin approval</li>
          <li>• Start using KrishiBondhu!</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">KrishiBondhu</span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNum ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle className="text-center">
                Step {step} of {currentConfig.steps}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 1 && "Create your account"}
                {step === 2 && "Complete your profile"}
                {step === 3 && "Review and submit"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {step === 1 && renderStep1()}
              {step === 2 && renderRoleSpecificStep()}
              {step === 3 && renderStep3()}

              <Separator className="my-6" />

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : navigate('/auth/role-selection')}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {step > 1 ? 'Previous' : 'Back to Role Selection'}
                </Button>

                <Button
                  onClick={() => {
                    if (step < 3) {
                      if (validateStep(step)) {
                        setStep(step + 1);
                      } else {
                        toast({
                          title: "Please fill required fields",
                          description: "All required fields must be completed to continue.",
                          variant: "destructive"
                        });
                      }
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={loading || (step < 3 && !validateStep(step))}
                  className="flex items-center"
                >
                  {loading ? 'Creating Account...' : (step < 3 ? 'Next' : 'Create Account')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" onClick={() => navigate('/auth/login')} className="p-0 h-auto text-primary">
                Sign in here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;