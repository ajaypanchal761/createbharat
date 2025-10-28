# Loan Scheme Image Upload API

## Overview
This document describes the image upload functionality for loan schemes using Multer (local storage) and Cloudinary (cloud storage).

## Setup

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can get these credentials from [Cloudinary Dashboard](https://cloudinary.com/console).

### 2. Dependencies
All dependencies are already installed:
- `cloudinary` - Cloud image storage
- `multer` - File upload middleware

## Endpoints

### Create Loan Scheme with Image Upload
- **Method:** `POST`
- **URL:** `/api/admin/loans/schemes`
- **Auth:** Bearer token (Admin)
- **Content-Type:** `multipart/form-data`

**Request Body:**
```
- image: (file) - Image file (max 5MB)
- name: (string, required)
- description: (string, required)
- minAmount: (number, required)
- maxAmount: (number, required)
- category: (string)
- provider: (string)
- ... other fields
```

**Response:**
```json
{
  "success": true,
  "message": "Loan scheme created successfully",
  "data": {
    "_id": "...",
    "name": "Startup Loan",
    "imageUrl": "https://res.cloudinary.com/...",
    ...
  }
}
```

### Update Loan Scheme with Image
- **Method:** `PUT`
- **URL:** `/api/admin/loans/schemes/:id`
- **Auth:** Bearer token (Admin)
- **Content-Type:** `multipart/form-data`

**Request Body:**
Same as create, but all fields are optional except those you want to update.

## How It Works

1. **User selects image** in frontend form
2. **Frontend sends FormData** with image file + form fields to backend
3. **Multer saves file** temporarily in `Backend/uploads/` directory
4. **Cloudinary uploads** the image to cloud storage
5. **Local file is deleted** after upload
6. **Database stores** the Cloudinary URL in `imageUrl` field

## Frontend Implementation

The frontend now supports both:
1. **File upload** - Users can select and upload image files
2. **Image preview** - Shows selected image before submission
3. **Backward compatible** - Still works with existing schemes that have `imageUrl`

### Example Usage

```javascript
// Create scheme with image
const fileInput = document.querySelector('input[type="file"]');
const imageFile = fileInput.files[0];

const token = localStorage.getItem('adminToken');
const payload = {
  name: "Startup Loan",
  description: "...",
  minAmount: 50000,
  maxAmount: 500000
};

await adminLoansAPI.createScheme(token, payload, imageFile);
```

## File Structure

```
Backend/
├── utils/
│   ├── cloudinary.js      # Cloudinary upload/delete utilities
│   └── multer.js          # Multer configuration
├── controllers/
│   └── loanSchemeController.js  # Updated with image upload logic
├── routes/
│   └── loanSchemeRoutes.js      # Multer middleware added
└── uploads/                # Temporary storage (auto-created)
```

## Notes

- **Image size limit:** 5MB per file
- **Accepted formats:** All image types (jpg, png, gif, webp, etc.)
- **Cloudinary folder:** `createbharat/loan-schemes/`
- **Automatic cleanup:** Local files are deleted after Cloudinary upload
- **Image transformations:** Images are auto-optimized and resized (max 800x600)

