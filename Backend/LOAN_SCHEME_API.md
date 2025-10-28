# Loan Scheme API Documentation

## Overview
The Loan Scheme API provides endpoints for managing government loan schemes. Users can view available schemes, while admins can create, update, and delete loan schemes.

## Schema Fields
Based on the frontend loan schemes data structure:

### Basic Information
- `name` (String, required) - Full name of the loan scheme
- `shortName` (String, optional) - Abbreviated name
- `description` (String, required) - Detailed description
- `provider` (String, optional) - Government ministry/department
- `category` (Enum) - 'startup', 'msme', 'women', 'sc-st', 'agriculture', 'all', 'other'
- `icon` (String, optional) - Icon identifier
- `color` (String, optional) - Color gradient class

### Financial Details
- `minAmount` (Number, required) - Minimum loan amount
- `maxAmount` (Number, required) - Maximum loan amount
- `interestRate` (String, optional) - Interest rate description
- `tenure` (String, optional) - Loan tenure

### Display Settings
- `featured` (Boolean, default: false) - Show as featured
- `popular` (Boolean, default: false) - Show as popular
- `isActive` (Boolean, default: true) - Active status
- `imageUrl` (String, optional) - Scheme image URL

### Content
- `types` (Array of Objects) - Loan types
  - `name` - Type name
  - `maxAmount` - Max amount for this type
  - `description` - Type description
- `benefits` (Array of Strings) - List of benefits
- `eligibility` (Array of Strings) - Eligibility criteria
- `documents` (Array of Strings) - Required documents
- `applicationSteps` (Array of Strings) - Application process steps
- `subsidy` (Array of Objects, optional) - Subsidy information
  - `category` - Subsidy category
  - `rate` - Subsidy rate
  - `maxCost` - Maximum cost
- `videoUrl` (String, optional) - Video link
- `officialLink` (String, optional) - Official website link

### Statistics
- `views` (Number, default: 0) - View count
- `applicationsCount` (Number, default: 0) - Application count

---

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get All Loan Schemes
```http
GET /api/loans/schemes
```

**Query Parameters:**
- `category` (optional) - Filter by category: 'startup', 'msme', 'women', 'sc-st', 'agriculture'
- `search` (optional) - Search in name and description
- `featured` (optional) - Filter featured schemes (true/false)
- `popular` (optional) - Filter popular schemes (true/false)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "name": "Pradhan Mantri MUDRA Yojana",
      "shortName": "MUDRA",
      "description": "Loans up to ₹10 lakh...",
      "minAmount": 50000,
      "maxAmount": 1000000,
      "interestRate": "8-12% p.a.",
      "category": "msme",
      "featured": true,
      "popular": true,
      ...
    }
  ]
}
```

#### Get Loan Scheme by ID
```http
GET /api/loans/schemes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Pradhan Mantri MUDRA Yojana",
    ...
  }
}
```

---

### Admin Endpoints (Authentication Required)

#### Create Loan Scheme
```http
POST /api/admin/loans/schemes
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Loan Scheme",
  "shortName": "NLS",
  "description": "Description of the scheme",
  "provider": "Ministry of Finance",
  "category": "msme",
  "minAmount": 50000,
  "maxAmount": 500000,
  "interestRate": "10% p.a.",
  "tenure": "Up to 5 years",
  "benefits": [
    "No collateral required",
    "Flexible repayment"
  ],
  "eligibility": [
    "Indian citizen",
    "Minimum 18 years"
  ],
  "documents": [
    "Aadhaar Card",
    "PAN Card"
  ],
  "applicationSteps": [
    "Visit bank",
    "Submit documents"
  ],
  "featured": true,
  "popular": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Loan scheme created successfully",
  "data": { ... }
}
```

#### Update Loan Scheme
```http
PUT /api/admin/loans/schemes/:id
Authorization: Bearer <admin-token>
```

**Request Body:** (Same as create, but only include fields to update)

**Response:**
```json
{
  "success": true,
  "message": "Loan scheme updated successfully",
  "data": { ... }
}
```

#### Delete Loan Scheme
```http
DELETE /api/admin/loans/schemes/:id
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Loan scheme deleted successfully"
}
```

#### Toggle Scheme Status
```http
PATCH /api/admin/loans/schemes/:id/status
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Loan scheme activated successfully",
  "data": { ... }
}
```

#### Get Loan Scheme Statistics
```http
GET /api/admin/loans/schemes/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "featured": 10,
    "popular": 15,
    "totalViews": 15234,
    "totalApplications": 890
  }
}
```

---

## Usage Examples

### Example 1: Get all MSME loans
```bash
curl http://localhost:5000/api/loans/schemes?category=msme
```

### Example 2: Search for loans
```bash
curl http://localhost:5000/api/loans/schemes?search=MUDRA
```

### Example 3: Create a new loan scheme (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/loans/schemes \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Scheme",
    "description": "Description",
    "minAmount": 50000,
    "maxAmount": 500000
  }'
```

---

## Database Indexes

The following indexes are automatically created:
- Text search on `name`, `description`, and `category`
- Individual indexes on `category`, `featured`, `popular`, `isActive`
- Index on `createdAt` for sorting

---

## Notes

1. Only active loan schemes (`isActive: true`) are returned in public endpoints
2. Views are automatically incremented when a scheme is viewed
3. All admin routes require JWT authentication with admin privileges
4. The `lastUpdated` field is automatically updated when admin modifies a scheme
5. Pagination is implemented for public listings (default: 10 per page)

