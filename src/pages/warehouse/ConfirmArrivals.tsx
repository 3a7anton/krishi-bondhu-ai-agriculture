import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Package,
  User,
  Calendar,
  MapPin,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

const ConfirmArrivals: React.FC = () => {
  const [selectedArrival, setSelectedArrival] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Mock data for pending arrivals
  const pendingArrivals = [
    {
      id: 'ARR001',
      farmer: {
        name: 'Golden Rice Farm',
        phone: '+91 9876543210',
        email: 'ram.kumar@email.com',
        location: 'Rangpur, Rangpur Division'
      },
      product: {
        name: 'Basmati Rice',
        category: 'Grains',
        quantity: 500,
        unit: 'kg',
        variety: 'Pusa Basmati 1121',
        expectedPrice: 45,
        farmingMethod: 'Organic'
      },
      arrival: {
        scheduledDate: '2024-01-15',
        scheduledTime: '09:00 AM',
        actualArrival: '2024-01-15 09:15 AM',
        vehicleNumber: 'UP 14 AB 1234',
        driverName: 'Suresh Kumar'
      },
      images: {
        farmerUpload: '/placeholder.svg',
        received: '/placeholder.svg'
      },
      status: 'pending',
      priority: 'high',
      submittedAt: '2 hours ago'
    },
    {
      id: 'ARR002',
      farmer: {
        name: 'Dhaka Valley Organic',
        phone: '+91 9123456789',
        email: 'sita.devi@email.com',
        location: 'Village Sitapur, Dist. Bareilly'
      },
      product: {
        name: 'Wheat',
        category: 'Grains',
        quantity: 300,
        unit: 'kg',
        variety: 'HD 2967',
        expectedPrice: 25,
        farmingMethod: 'Traditional'
      },
      arrival: {
        scheduledDate: '2024-01-15',
        scheduledTime: '10:30 AM',
        actualArrival: '2024-01-15 10:45 AM',
        vehicleNumber: 'UP 14 CD 5678',
        driverName: 'Ramesh Singh'
      },
      images: {
        farmerUpload: '/placeholder.svg',
        received: '/placeholder.svg'
      },
      status: 'urgent',
      priority: 'high',
      submittedAt: '30 minutes ago'
    },
    {
      id: 'ARR003',
      farmer: {
        name: 'Sylhet Tea & Grains',
        phone: '+91 9876547890',
        email: 'mohan.lal@email.com',
        location: 'Village Mohanganj, Dist. Ghazipur'
      },
      product: {
        name: 'Potato',
        category: 'Vegetables',
        quantity: 200,
        unit: 'kg',
        variety: 'Kufri Jyoti',
        expectedPrice: 18,
        farmingMethod: 'Organic'
      },
      arrival: {
        scheduledDate: '2024-01-15',
        scheduledTime: '11:00 AM',
        actualArrival: 'Expected soon',
        vehicleNumber: 'UP 14 EF 9101',
        driverName: 'Vijay Kumar'
      },
      images: {
        farmerUpload: '/placeholder.svg',
        received: null
      },
      status: 'scheduled',
      priority: 'medium',
      submittedAt: '1 day ago'
    }
  ];

  const handleVerification = (arrival: any) => {
    setSelectedArrival(arrival);
    setBatchNumber(`BATCH_${arrival.id}_${Date.now()}`);
  };

  const handleAccept = () => {
    // Handle acceptance logic
    console.log('Accepted:', selectedArrival?.id);
    setSelectedArrival(null);
  };

  const handleReject = () => {
    // Handle rejection logic
    console.log('Rejected:', selectedArrival?.id);
    setSelectedArrival(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'destructive';
      case 'pending': return 'default';
      case 'scheduled': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Confirm New Arrivals</h1>
          <p className="text-slate-600">Review and verify incoming farmer deliveries</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Refresh ({pendingArrivals.length} pending)
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pending</p>
                <p className="text-2xl font-bold">{pendingArrivals.length}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingArrivals.filter(a => a.status === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Total</p>
                <p className="text-2xl font-bold">1200 kg</p>
              </div>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Expected Value</p>
                <p className="text-2xl font-bold">₹32,500</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Arrivals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-blue-600" />
            Pending Arrival Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arrival ID</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expected Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingArrivals.map((arrival) => (
                <TableRow key={arrival.id}>
                  <TableCell className="font-medium">{arrival.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{arrival.farmer.name}</p>
                      <p className="text-sm text-slate-500">{arrival.farmer.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{arrival.product.name}</p>
                      <p className="text-sm text-slate-500">{arrival.product.variety}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{arrival.product.quantity} {arrival.product.unit}</p>
                      <Badge variant="outline" className="text-xs">
                        {arrival.product.farmingMethod}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>₹{arrival.product.expectedPrice}/{arrival.product.unit}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(arrival.status)}>
                      {arrival.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(arrival.priority)}>
                      {arrival.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerification(arrival)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Verify Arrival - {selectedArrival?.id}</DialogTitle>
                            <DialogDescription>
                              Review farmer information and product details before confirmation
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedArrival && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Farmer Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <User className="mr-2 h-5 w-5" />
                                    Farmer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium">Name</Label>
                                    <p className="text-sm">{selectedArrival.farmer.name}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                    <p className="text-sm">{selectedArrival.farmer.phone}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                    <p className="text-sm">{selectedArrival.farmer.email}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <p className="text-sm">{selectedArrival.farmer.location}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Product Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Package className="mr-2 h-5 w-5" />
                                    Product Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium">Product</Label>
                                    <p className="text-sm">{selectedArrival.product.name} - {selectedArrival.product.variety}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Quantity</Label>
                                    <p className="text-sm">{selectedArrival.product.quantity} {selectedArrival.product.unit}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Expected Price</Label>
                                    <p className="text-sm">₹{selectedArrival.product.expectedPrice}/{selectedArrival.product.unit}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Farming Method</Label>
                                    <Badge variant="outline">{selectedArrival.product.farmingMethod}</Badge>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Photo Comparison */}
                              <Card className="md:col-span-2">
                                <CardHeader>
                                  <CardTitle className="flex items-center text-lg">
                                    <Camera className="mr-2 h-5 w-5" />
                                    Photo Comparison
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-center">
                                      <h4 className="font-medium mb-2">Farmer Upload</h4>
                                      <img 
                                        src={selectedArrival.images.farmerUpload} 
                                        alt="Farmer upload" 
                                        className="w-full h-48 object-cover rounded-lg border"
                                      />
                                    </div>
                                    <div className="text-center">
                                      <h4 className="font-medium mb-2">Received Product</h4>
                                      <div className="w-full h-48 bg-slate-100 rounded-lg border flex items-center justify-center">
                                        <div className="text-center text-slate-500">
                                          <Camera className="h-8 w-8 mx-auto mb-2" />
                                          <p className="text-sm">Take photo of received product</p>
                                          <Button size="sm" className="mt-2">
                                            <Camera className="mr-2 h-4 w-4" />
                                            Capture
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Verification Form */}
                              <Card className="md:col-span-2">
                                <CardHeader>
                                  <CardTitle>Verification Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="batch-number">Batch Number</Label>
                                      <Input
                                        id="batch-number"
                                        value={batchNumber}
                                        onChange={(e) => setBatchNumber(e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="verification-status">Verification Status</Label>
                                      <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="match">Product matches description</SelectItem>
                                          <SelectItem value="partial">Partial match - see notes</SelectItem>
                                          <SelectItem value="no-match">Product does not match</SelectItem>
                                          <SelectItem value="damaged">Product damaged</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Verification Notes</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Add any observations or discrepancies..."
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setSelectedArrival(null)}>
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleReject}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button onClick={handleAccept}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Accept & Store
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmArrivals;