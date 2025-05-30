# Archivo de salida
$OutputFile = "full-project-output.txt"

# Carpetas a incluir
$PathsToInclude = @( "backend")

# Rutas y archivos a excluir
$ExcludePaths = @("node_modules", ".git", "dist", "build", ".next", ".turbo", "coverage", "storybook-static")
$ExcludeExtensions = @(".lock", ".map", ".png", ".jpg", ".svg", ".webp", ".ico", ".ttf", ".woff", ".woff2", ".eot", ".exe")
$ExcludeFilenames = @("LICENSE", "README.md", "CHANGELOG.md", "package-lock.json")

# Codificación UTF8 sin BOM
$Utf8NoBom = New-Object System.Text.UTF8Encoding($False)

# 0. Limpiar archivo anterior si existe
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile -Force
}

# 1. Limpieza opcional de archivos temporales residuales
Get-ChildItem -Path $PathsToInclude -Recurse -Include *.tmp,*.~,*_old.*,*.bak -Force -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# 2. Escribir estructura de carpetas
[System.IO.File]::WriteAllText($OutputFile, "=== ESTRUCTURA DE CARPETAS (limpia) ===`r`n", $Utf8NoBom)

foreach ($path in $PathsToInclude) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse -Directory -Force |
        Where-Object {
            $keep = $true
            foreach ($excluded in $ExcludePaths) {
                if ($_.FullName -replace "\\","/" -like "*/$excluded/*") { $keep = $false }
            }
            return $keep
        } |
        ForEach-Object {
            Add-Content -Encoding UTF8 $OutputFile $_.FullName
        }
    }
}

# 3. Escribir contenido de archivos clave
Add-Content -Encoding UTF8 $OutputFile "`r`n=== CONTENIDO DE ARCHIVOS CLAVE ===`r`n"

foreach ($path in $PathsToInclude) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse -File -Force |
        Where-Object {
            $keep = $true

            foreach ($excluded in $ExcludePaths) {
                if ($_.FullName -replace "\\","/" -like "*/$excluded/*") { $keep = $false }
            }

            if ($ExcludeExtensions -contains $_.Extension) { $keep = $false }
            if ($ExcludeFilenames -contains $_.Name) { $keep = $false }

            return $keep
        } |
        ForEach-Object {
            try {
                Add-Content -Encoding UTF8 $OutputFile "`r`n----- FILE: $($_.FullName) -----`r`n"
                $content = Get-Content $_.FullName -Raw -Encoding UTF8
                Add-Content -Encoding UTF8 $OutputFile $content
            } catch {
                Add-Content -Encoding UTF8 $OutputFile "`r`n⚠️ ERROR AL LEER: $($_.FullName)`r`n"
            }
        }
    }
}

Write-Host "✅ Archivo generado correctamente: $OutputFile (UTF-8 limpio)"
