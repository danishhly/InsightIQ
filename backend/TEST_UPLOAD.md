# 🧪 Testing File Upload Endpoint

## Prerequisites
1. Server must be running: `npm run start:dev`
2. Test CSV file created: `test-data.csv`

## Quick Test Steps

### Option 1: Using PowerShell Script (Easiest)
```powershell
.\test-upload.ps1
```

### Option 2: Manual Testing with curl

#### Step 1: Register/Login to get token
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"

# Or Login (if already registered)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Save the `accessToken` from the response!**

#### Step 2: Upload CSV file
```bash
curl -X POST http://localhost:3001/api/data/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@test-data.csv"
```

#### Step 3: Get all datasets
```bash
curl -X GET http://localhost:3001/api/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 4: Get dataset details
```bash
curl -X GET http://localhost:3001/api/data/DATASET_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 5: Get table data
```bash
curl -X GET "http://localhost:3001/api/data/DATASET_ID/table?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Using Postman/Thunder Client

### 1. Upload File
- **Method:** POST
- **URL:** `http://localhost:3001/api/data/upload`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN`
- **Body:** form-data
  - Key: `file` (type: File)
  - Value: Select `test-data.csv`

### 2. Get Datasets
- **Method:** GET
- **URL:** `http://localhost:3001/api/data`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN`

### 3. Get Table Data
- **Method:** GET
- **URL:** `http://localhost:3001/api/data/{datasetId}/table?page=1&limit=10`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN`

---

## Expected Responses

### Upload Success (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "test-data",
    "fileName": "test-data.csv",
    "fileType": "csv",
    "rowCount": 5,
    "columnCount": 5,
    "schema": [...],
    "createdAt": "...",
    "tables": [...]
  },
  "message": "File uploaded and parsed successfully"
}
```

### Get Datasets (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "test-data",
      "fileName": "test-data.csv",
      ...
    }
  ]
}
```

### Get Table Data (200)
```json
{
  "success": true,
  "data": {
    "data": [[...], [...]],
    "columns": ["name", "age", "city", "salary", "join_date"],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## Troubleshooting

### "No file uploaded" error
- Make sure you're using `form-data` (multipart/form-data)
- Check the field name is `file`

### "Unauthorized" error
- Make sure you have a valid access token
- Token might be expired, try logging in again

### "Unsupported file type" error
- Only CSV and Excel files are supported
- Check file extension (.csv, .xlsx, .xls)

### File too large
- Maximum file size is 10MB
- Try a smaller file

