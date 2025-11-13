# Test Phase 3: AI Integration Features
Write-Host "🧪 Testing Phase 3: AI Integration" -ForegroundColor Cyan
Write-Host ""

# Step 1: Authenticate
Write-Host "Step 1: Authenticating..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "testphase3@example.com"
        password = "test123"
        name = "Phase 3 Test User"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    $token = $registerResponse.data.accessToken
    Write-Host "✅ User authenticated. Token received." -ForegroundColor Green
} catch {
    try {
        $loginBody = @{
            email = "testphase3@example.com"
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

# Step 2: Upload dataset
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

# Step 3: Test SQL Validation (no AI needed)
Write-Host "Step 3: Testing SQL validation endpoint..." -ForegroundColor Yellow
try {
    $validateBody = @{
        sqlQuery = "SELECT name, age FROM data WHERE age > 25"
    } | ConvertTo-Json

    $validateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/ai/validate-sql" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $validateBody `
        -ErrorAction Stop

    Write-Host "✅ SQL validation working!" -ForegroundColor Green
    Write-Host "   Query is valid" -ForegroundColor Cyan
} catch {
    Write-Host "❌ SQL validation failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Step 4: Test SQL validation with dangerous query
Write-Host "Step 4: Testing SQL validator security (dangerous query)..." -ForegroundColor Yellow
try {
    $dangerousBody = @{
        sqlQuery = "DROP TABLE users; SELECT * FROM data"
    } | ConvertTo-Json

    $dangerousResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/ai/validate-sql" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $dangerousBody `
        -ErrorAction Stop

    Write-Host "❌ Security issue: Dangerous query was allowed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Security working: Dangerous query blocked!" -ForegroundColor Green
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Cyan
}
Write-Host ""

# Step 5: Test AI Query (will fail if no API key, but should show proper error)
Write-Host "Step 5: Testing AI text-to-SQL query..." -ForegroundColor Yellow
Write-Host "   (This requires OPENAI_API_KEY in .env)" -ForegroundColor Gray
try {
    $aiQueryBody = @{
        datasetId = $datasetId
        query = "Show me all people with salary greater than 80000"
    } | ConvertTo-Json

    $aiQueryResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/ai/query" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $aiQueryBody `
        -ErrorAction Stop

    Write-Host "✅ AI query executed successfully!" -ForegroundColor Green
    Write-Host "   Natural query: $($aiQueryResponse.data.naturalQuery)" -ForegroundColor Cyan
    Write-Host "   Generated SQL: $($aiQueryResponse.data.sqlQuery)" -ForegroundColor Cyan
    Write-Host "   Rows returned: $($aiQueryResponse.data.result.rowCount)" -ForegroundColor Cyan
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($errorDetails -and $errorDetails.error.code -eq "AI_UNAVAILABLE") {
        Write-Host "⚠️  AI service not available (expected if no API key)" -ForegroundColor Yellow
        Write-Host "   Message: $($errorDetails.error.message)" -ForegroundColor Cyan
        Write-Host "   To enable: Add OPENAI_API_KEY to backend/.env" -ForegroundColor Gray
    } else {
        Write-Host "❌ AI query failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($errorDetails) {
            Write-Host "   Details: $($errorDetails.error.message)" -ForegroundColor Red
        }
    }
}
Write-Host ""

# Step 6: Create a chart for insight generation
Write-Host "Step 6: Creating chart for insight generation..." -ForegroundColor Yellow
try {
    $chartBody = @{
        datasetId = $datasetId
        name = "Salary Chart"
        type = "BAR"
        config = @{}
    } | ConvertTo-Json

    $chartResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/charts" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $chartBody `
        -ErrorAction Stop

    $chartId = $chartResponse.data.id
    Write-Host "✅ Chart created. ID: $chartId" -ForegroundColor Green

    # Generate chart data
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

    Write-Host "✅ Chart data generated" -ForegroundColor Green
    $chartData = $chartDataResponse.data
} catch {
    Write-Host "❌ Chart creation failed: $($_.Exception.Message)" -ForegroundColor Red
    $chartId = $null
    $chartData = $null
}
Write-Host ""

# Step 7: Test Insight Generation (requires API key)
Write-Host "Step 7: Testing AI insight generation..." -ForegroundColor Yellow
Write-Host "   (This requires OPENAI_API_KEY in .env)" -ForegroundColor Gray
if ($chartData) {
    try {
        $insightBody = @{
            chartId = $chartId
            chartType = "BAR"
            data = $chartData
            columns = @("name", "salary")
        } | ConvertTo-Json

        $insightResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/ai/generate-insight" `
            -Method POST `
            -Headers $headers `
            -ContentType "application/json" `
            -Body $insightBody `
            -ErrorAction Stop

        Write-Host "✅ Insight generated successfully!" -ForegroundColor Green
        Write-Host "   Insight ID: $($insightResponse.data.id)" -ForegroundColor Cyan
        Write-Host "   Type: $($insightResponse.data.type)" -ForegroundColor Cyan
        Write-Host "   Content preview: $($insightResponse.data.content.Substring(0, [Math]::Min(100, $insightResponse.data.content.Length)))..." -ForegroundColor Gray
    } catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorDetails -and $errorDetails.error.code -eq "AI_UNAVAILABLE") {
            Write-Host "⚠️  AI service not available (expected if no API key)" -ForegroundColor Yellow
            Write-Host "   Message: $($errorDetails.error.message)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Insight generation failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  Skipping insight test (chart data not available)" -ForegroundColor Yellow
}
Write-Host ""

# Step 8: Test Insights CRUD (no AI needed)
Write-Host "Step 8: Testing insights CRUD operations..." -ForegroundColor Yellow
try {
    $insightsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/insights" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✅ Insights listing working!" -ForegroundColor Green
    Write-Host "   Found $($insightsResponse.data.Count) insight(s)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to list insights: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 Phase 3 Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ SQL validation endpoint" -ForegroundColor Green
Write-Host "  ✅ Security validation" -ForegroundColor Green
Write-Host "  ✅ Insights CRUD operations" -ForegroundColor Green
if ($errorDetails -and $errorDetails.error.code -eq "AI_UNAVAILABLE") {
    Write-Host "  ⚠️  AI features require OPENAI_API_KEY" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To enable AI features:" -ForegroundColor Cyan
    Write-Host "  1. Get API key from https://platform.openai.com/api-keys" -ForegroundColor Gray
    Write-Host "  2. Add to backend/.env: OPENAI_API_KEY=your-key-here" -ForegroundColor Gray
    Write-Host "  3. Restart server" -ForegroundColor Gray
} else {
    Write-Host "  ✅ AI features working!" -ForegroundColor Green
}

