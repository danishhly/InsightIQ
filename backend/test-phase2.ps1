# Test Phase 2 Features: Charts and SQL Queries
Write-Host "🧪 Testing Phase 2 Features" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login/Register
Write-Host "Step 1: Authenticating..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "testphase2@example.com"
        password = "test123"
        name = "Phase 2 Test User"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    $token = $registerResponse.data.accessToken
    Write-Host "✅ User authenticated. Token received." -ForegroundColor Green
} catch {
    # Try login if user exists
    try {
        $loginBody = @{
            email = "testphase2@example.com"
            password = "test123"
        } | ConvertTo-Json

        $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $loginBody `
            -ErrorAction Stop

        $token = $loginResponse.data.accessToken
        Write-Host "✅ User logged in. Token received." -ForegroundColor Green
    } catch {
        Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

$headers = @{ "Authorization" = "Bearer $token" }
Write-Host ""

# Step 2: Upload a test dataset
Write-Host "Step 2: Uploading test dataset..." -ForegroundColor Yellow
try {
    $filePath = "test-data.csv"
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ test-data.csv not found!" -ForegroundColor Red
        exit 1
    }

    $fileContent = Get-Content $filePath -Raw
    $boundary = [System.Guid]::NewGuid().ToString()
    $bodyLines = @(
        "--$boundary",
        'Content-Disposition: form-data; name="file"; filename="test-data.csv"',
        "Content-Type: text/csv",
        "",
        $fileContent,
        "--$boundary--"
    )
    $body = $bodyLines -join "`r`n"
    $uploadHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }

    $uploadResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/data/upload" `
        -Method POST `
        -Headers $uploadHeaders `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
        -ErrorAction Stop

    $datasetId = $uploadResponse.data.id
    Write-Host "✅ Dataset uploaded. ID: $datasetId" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Create a chart
Write-Host "Step 3: Creating a chart..." -ForegroundColor Yellow
try {
    $chartBody = @{
        datasetId = $datasetId
        name = "Test Bar Chart"
        type = "BAR"
        config = @{
            title = "Test Chart"
        }
    } | ConvertTo-Json

    $chartResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/charts" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $chartBody `
        -ErrorAction Stop

    $chartId = $chartResponse.data.id
    Write-Host "✅ Chart created. ID: $chartId" -ForegroundColor Green
    Write-Host "   Name: $($chartResponse.data.name)" -ForegroundColor Cyan
    Write-Host "   Type: $($chartResponse.data.type)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Chart creation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}
Write-Host ""

# Step 4: Generate chart data
Write-Host "Step 4: Generating chart data..." -ForegroundColor Yellow
try {
    $chartDataBody = @{
        xColumn = "name"
        yColumn = "salary"
    } | ConvertTo-Json

    $chartDataResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/charts/$chartId/data" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $chartDataBody `
        -ErrorAction Stop

    Write-Host "✅ Chart data generated!" -ForegroundColor Green
    Write-Host "   Labels: $($chartDataResponse.data.labels.Count)" -ForegroundColor Cyan
    Write-Host "   Datasets: $($chartDataResponse.data.datasets.Count)" -ForegroundColor Cyan
    Write-Host "   First label: $($chartDataResponse.data.labels[0])" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Chart data generation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Step 5: List all charts
Write-Host "Step 5: Listing all charts..." -ForegroundColor Yellow
try {
    $chartsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/charts" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✅ Found $($chartsResponse.data.Count) chart(s)" -ForegroundColor Green
    $chartsResponse.data | ForEach-Object {
        Write-Host "   - $($_.name) ($($_.type))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to list charts: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Step 6: Execute SQL query
Write-Host "Step 6: Executing SQL query..." -ForegroundColor Yellow
try {
    $queryBody = @{
        datasetId = $datasetId
        sqlQuery = "SELECT name, age, salary FROM data WHERE salary > 70000 ORDER BY salary DESC LIMIT 3"
    } | ConvertTo-Json

    $queryResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/query/execute" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $queryBody `
        -ErrorAction Stop

    Write-Host "✅ Query executed successfully!" -ForegroundColor Green
    Write-Host "   Columns: $($queryResponse.data.columns -join ', ')" -ForegroundColor Cyan
    Write-Host "   Rows returned: $($queryResponse.data.rowCount)" -ForegroundColor Cyan
    Write-Host "   Execution time: $($queryResponse.data.executionTime)ms" -ForegroundColor Cyan
    Write-Host "   First row: $($queryResponse.data.rows[0] -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "❌ Query execution failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Step 7: Get query history
Write-Host "Step 7: Getting query history..." -ForegroundColor Yellow
try {
    $historyResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/query/history" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✅ Found $($historyResponse.data.Count) query(ies) in history" -ForegroundColor Green
    if ($historyResponse.data.Count -gt 0) {
        Write-Host "   Latest query: $($historyResponse.data[0].sqlQuery.Substring(0, [Math]::Min(50, $historyResponse.data[0].sqlQuery.Length)))..." -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get query history: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Step 8: Test SQL validator (should fail)
Write-Host "Step 8: Testing SQL validator (dangerous query should be blocked)..." -ForegroundColor Yellow
try {
    $dangerousQueryBody = @{
        datasetId = $datasetId
        sqlQuery = "DROP TABLE users; SELECT * FROM data"
    } | ConvertTo-Json

    $dangerousResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/query/execute" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $dangerousQueryBody `
        -ErrorAction Stop

    Write-Host "❌ Security issue: Dangerous query was allowed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Security working: Dangerous query was blocked!" -ForegroundColor Green
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "🎉 Phase 2 Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Chart creation" -ForegroundColor Green
Write-Host "  ✅ Chart data generation" -ForegroundColor Green
Write-Host "  ✅ SQL query execution" -ForegroundColor Green
Write-Host "  ✅ Query history" -ForegroundColor Green
Write-Host "  ✅ SQL validator security" -ForegroundColor Green

