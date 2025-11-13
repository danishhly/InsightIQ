# Test File Upload Endpoint
# Make sure server is running: npm run start:dev

Write-Host "🧪 Testing File Upload API" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register a test user (or use existing)
Write-Host "Step 1: Registering test user..." -ForegroundColor Yellow
$registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{
        email = "testupload@example.com"
        password = "test123"
        name = "Test User"
    } | ConvertTo-Json)

$accessToken = $registerResponse.data.accessToken
Write-Host "✅ User registered. Token received." -ForegroundColor Green
Write-Host ""

# Step 2: Upload CSV file
Write-Host "Step 2: Uploading CSV file..." -ForegroundColor Yellow
$filePath = "test-data.csv"

if (Test-Path $filePath) {
    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"test-data.csv`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBytes),
        "--$boundary--"
    )
    
    $body = $bodyLines -join $LF
    
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    try {
        $uploadResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/data/upload" `
            -Method POST `
            -Headers $headers `
            -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
        
        Write-Host "✅ File uploaded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Dataset ID: $($uploadResponse.data.id)" -ForegroundColor Cyan
        Write-Host "File Name: $($uploadResponse.data.fileName)" -ForegroundColor Cyan
        Write-Host "Rows: $($uploadResponse.data.rowCount)" -ForegroundColor Cyan
        Write-Host "Columns: $($uploadResponse.data.columnCount)" -ForegroundColor Cyan
        Write-Host ""
        
        $datasetId = $uploadResponse.data.id
        
        # Step 3: Get all datasets
        Write-Host "Step 3: Getting all datasets..." -ForegroundColor Yellow
        $datasetsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/data" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $accessToken" }
        
        Write-Host "✅ Found $($datasetsResponse.data.Count) dataset(s)" -ForegroundColor Green
        Write-Host ""
        
        # Step 4: Get dataset details
        Write-Host "Step 4: Getting dataset details..." -ForegroundColor Yellow
        $datasetResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/data/$datasetId" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $accessToken" }
        
        Write-Host "✅ Dataset details retrieved" -ForegroundColor Green
        Write-Host ""
        
        # Step 5: Get table data
        Write-Host "Step 5: Getting table data (first page)..." -ForegroundColor Yellow
        $tableResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/data/$datasetId/table?page=1&limit=10" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $accessToken" }
        
        Write-Host "✅ Table data retrieved" -ForegroundColor Green
        Write-Host "Columns: $($tableResponse.data.columns -join ', ')" -ForegroundColor Cyan
        Write-Host "Total rows: $($tableResponse.data.pagination.total)" -ForegroundColor Cyan
        Write-Host "Showing page $($tableResponse.data.pagination.page) of $($tableResponse.data.pagination.totalPages)" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "🎉 All tests passed!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ test-data.csv not found!" -ForegroundColor Red
}

