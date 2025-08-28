# Promos API Documentation (Updated with Device Type Support)

## Base URL

```
/api/promos
```

## Device Type Support

The API now supports device-specific promos with the following values:

- `DESKTOP` - Promo for desktop devices only
- `MOBILE` - Promo for mobile devices only
- `BOTH` - Promo for both desktop and mobile (default)

## Authentication

- **Public Endpoints**: `/active`, `/device/:deviceType` - No authentication required
- **Admin Endpoints**: All other endpoints require admin authentication via `requireAdmin` middleware

---

## Endpoints

### 1. Get Active Promos (Public)

**Endpoint**: `GET /api/promos/active`  
**Authentication**: None required  
**Query Parameters**:

- `limit` (optional) - Number of promos to return
- `deviceType` (optional) - Filter by device type (DESKTOP, MOBILE, BOTH)

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "imageUrl": "https://supabase-url/storage/promos/image.jpg",
      "title": "Summer Sale",
      "description": "50% off all products",
      "isActive": true,
      "displayOrder": 1,
      "deviceType": "BOTH",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "createdBy": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

---

### 2. Get Active Promos by Device Type (Public)

**Endpoint**: `GET /api/promos/device/:deviceType`  
**Authentication**: None required  
**Path Parameters**:

- `deviceType` (required) - Device type (DESKTOP, MOBILE, BOTH)
  **Query Parameters**:
- `limit` (optional) - Number of promos to return

**Example**: `GET /api/promos/device/MOBILE?limit=5`

**Response**:

```json
{
  "data": [
    {
      "id": 2,
      "imageUrl": "https://supabase-url/storage/promos/mobile-banner.jpg",
      "title": "Mobile App Exclusive",
      "description": "Special offer for mobile users",
      "isActive": true,
      "displayOrder": 1,
      "deviceType": "MOBILE",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "createdBy": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

---

### 3. Get All Promos (Admin)

**Endpoint**: `GET /api/promos`  
**Authentication**: Admin required  
**Query Parameters**:

- `active` (optional) - Filter by active status (true/false)
- `deviceType` (optional) - Filter by device type (DESKTOP, MOBILE, BOTH)
- `limit` (optional) - Number of results (default: 10, max: 100)
- `offset` (optional) - Number of results to skip (default: 0)
- `orderBy` (optional) - Field to order by (default: 'displayOrder')
- `order` (optional) - Order direction 'asc'/'desc' (default: 'asc')

**Example**: `GET /api/promos?deviceType=DESKTOP&active=true&limit=5`

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "imageUrl": "https://supabase-url/storage/promos/desktop-banner.jpg",
      "title": "Desktop Sale",
      "description": "Big screen, bigger savings",
      "isActive": true,
      "displayOrder": 1,
      "deviceType": "DESKTOP",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "createdBy": {
        "id": 1,
        "username": "admin"
      },
      "updatedBy": {
        "id": 1,
        "username": "admin"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 4. Create Promo (Admin)

**Endpoint**: `POST /api/promos`  
**Authentication**: Admin required

**Request Body**:

```json
{
  "imageUrl": "https://supabase-url/storage/promos/image.jpg",
  "title": "Summer Sale",
  "description": "50% off all products",
  "isActive": true,
  "displayOrder": 1,
  "deviceType": "MOBILE"
}
```

**Response** (201 Created):

```json
{
  "data": {
    "id": 1,
    "imageUrl": "https://supabase-url/storage/promos/image.jpg",
    "title": "Summer Sale",
    "description": "50% off all products",
    "isActive": true,
    "displayOrder": 1,
    "deviceType": "MOBILE",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "createdBy": {
      "id": 1,
      "username": "admin"
    },
    "updatedBy": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

---

### 5. Update Promo (Admin)

**Endpoint**: `PUT /api/promos/:id` or `PATCH /api/promos/:id`  
**Authentication**: Admin required

**Request Body** (all fields optional for PATCH):

```json
{
  "imageUrl": "https://supabase-url/storage/promos/updated-image.jpg",
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false,
  "displayOrder": 2,
  "deviceType": "DESKTOP"
}
```

---

## Field Details

### Promo Object Fields

- `id`: Number - Unique identifier
- `imageUrl`: String (required) - URL to promo image (max 500 chars)
- `title`: String (optional) - Promo title (max 255 chars)
- `description`: String (optional) - Promo description
- `isActive`: Boolean - Whether promo is active (default: true)
- `displayOrder`: Number - Order for display (auto-incremented if not provided)
- `deviceType`: String - Device type (DESKTOP, MOBILE, BOTH) (default: BOTH)
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp
- `createdBy`: Object - User who created the promo (id, username)
- `updatedBy`: Object - User who last updated the promo (id, username)

### Business Rules

1. **imageUrl** is required and must be a valid HTTP/HTTPS URL
2. **deviceType** must be one of: DESKTOP, MOBILE, BOTH (defaults to BOTH)
3. **displayOrder** is auto-incremented to highest existing order + 1 if not provided
4. Only admin users can perform CRUD operations (except viewing active promos)
5. Device filtering: When fetching promos for a specific device, both device-specific and BOTH promos are returned

### Device Type Logic

- When requesting `DESKTOP` promos: Returns promos with `deviceType: DESKTOP` OR `deviceType: BOTH`
- When requesting `MOBILE` promos: Returns promos with `deviceType: MOBILE` OR `deviceType: BOTH`
- When requesting `BOTH` promos: Returns only promos with `deviceType: BOTH`
- Admin endpoints can filter by exact device type without including BOTH

## Usage Examples

### Frontend Implementation

```javascript
// Get mobile-specific promos for homepage
const mobilePromos = await fetch("/api/promos/device/MOBILE?limit=3");

// Get desktop-specific promos for homepage
const desktopPromos = await fetch("/api/promos/device/DESKTOP?limit=5");

// Admin: Get all desktop promos
const allDesktopPromos = await fetch("/api/promos?deviceType=DESKTOP", {
  headers: { Authorization: "Bearer admin-token" },
});

// Create mobile-only promo
await fetch("/api/promos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer admin-token",
  },
  body: JSON.stringify({
    imageUrl: "https://example.com/mobile-banner.jpg",
    title: "Mobile Sale",
    deviceType: "MOBILE",
  }),
});
```

## Quick Reference

### Public Endpoints

- `GET /api/promos/active` - Get active promos (supports deviceType query)
- `GET /api/promos/device/MOBILE` - Get mobile + both promos
- `GET /api/promos/device/DESKTOP` - Get desktop + both promos
- `GET /api/promos/device/BOTH` - Get only universal promos

### Admin Endpoints

- `GET /api/promos` - Get all promos (supports deviceType filter)
- `POST /api/promos` - Create promo (deviceType defaults to BOTH)
- `PUT/PATCH /api/promos/:id` - Update promo (can change deviceType)
- `DELETE /api/promos/:id` - Delete promo
- `GET /api/promos/stats` - Get statistics
- `PUT /api/promos/reorder` - Reorder promos
- `PATCH /api/promos/:id/toggle` - Toggle active status
