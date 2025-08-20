# Delivery Tracking API Service

This service provides comprehensive delivery tracking functionality for the KrishiBondhu platform.

## Features

- **Real-time Delivery Tracking**: Monitor delivery progress and location updates
- **Route Optimization**: Get multiple route alternatives with traffic information
- **Traffic Alerts**: Real-time traffic and road condition alerts
- **Customer Communication**: Send notifications and updates to customers
- **Emergency Contacts**: Quick access to emergency and support contacts
- **Delivery Completion**: Handle delivery completion with signature capture

## API Endpoints

### Base URL
```
http://localhost:3001/api/delivery
```

### Endpoints

#### Get Active Delivery
```
GET /active/{deliveryPartnerId}
```
Returns the currently active delivery for a delivery partner.

#### Update Delivery Progress
```
POST /progress
```
Updates the delivery progress and location.

**Body:**
```json
{
  "orderId": "string",
  "progress": "number (0-100)",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "timestamp": "ISO string"
}
```

#### Get Route Alternatives
```
POST /routes
```
Returns multiple route alternatives between two locations.

**Body:**
```json
{
  "start": {
    "lat": "number",
    "lng": "number"
  },
  "end": {
    "lat": "number",
    "lng": "number"
  }
}
```

#### Get Traffic Alerts
```
GET /traffic-alerts?lat={lat}&lng={lng}&radius={radius}
```
Returns real-time traffic alerts for a given location.

#### Send Customer Notification
```
POST /notify-customer
```
Sends a notification to the customer.

**Body:**
```json
{
  "orderId": "string",
  "message": "string",
  "type": "eta_update|arrival|delivery_complete",
  "timestamp": "ISO string"
}
```

#### Complete Delivery
```
POST /complete
```
Marks a delivery as completed.

**Body:**
```json
{
  "orderId": "string",
  "signature": "string (optional)",
  "timestamp": "ISO string"
}
```

#### Get Delivery History
```
GET /history/{deliveryPartnerId}?limit={limit}
```
Returns delivery history for a delivery partner.

## Data Models

### DeliveryOrder
```typescript
interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  deliveryAddress: string;
  pickupCoordinates: MapLocation;
  deliveryCoordinates: MapLocation;
  totalDistance: number;
  remainingDistance: number;
  startTime: string;
  estimatedTime: number;
  items: DeliveryItem[];
  deliveryFee: number;
  specialInstructions?: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  progress: number;
  currentLocation?: MapLocation;
  routeInfo?: RouteInfo;
  trafficAlerts: TrafficAlert[];
  emergencyContacts: EmergencyContact[];
}
```

### RouteAlternative
```typescript
interface RouteAlternative {
  id: number;
  name: string;
  time: number;
  distance: number;
  traffic: 'light' | 'moderate' | 'heavy';
  trafficColor: string;
  isActive: boolean;
  coordinates: [number, number][];
}
```

### TrafficAlert
```typescript
interface TrafficAlert {
  id: string;
  type: 'traffic' | 'road' | 'weather' | 'accident';
  message: string;
  severity: 'low' | 'medium' | 'high';
  location?: MapLocation;
  time: string;
  isActive: boolean;
}
```

## Usage Example

```typescript
import { deliveryService } from './deliveryApi';

// Get active delivery
const delivery = await deliveryService.getActiveDelivery('user123');

// Update progress
await deliveryService.updateDeliveryProgress('order123', 75, {
  lat: 28.6196,
  lng: 77.3678
});

// Send customer notification
await deliveryService.sendCustomerNotification(
  'order123',
  'Your delivery is 75% complete',
  'eta_update'
);

// Complete delivery
await deliveryService.completeDelivery('order123');
```

## Error Handling

The service includes comprehensive error handling with fallback to mock data for development. All API calls are wrapped in try-catch blocks and return appropriate error responses.

## Development

For development, the service uses mock data when API calls fail. This allows for frontend development without requiring a backend server.

To enable real API calls, set the `VITE_DELIVERY_API_URL` environment variable to your backend server URL. 