# Finding & Killing Localhost Servers Guide

A quick reference guide for finding active localhost web servers (Next.js, Vite, Express, React, etc.) and terminating them on **Windows**, with quick alternatives for **macOS / Linux** and **npm CLI tools**.

---

## ⚡ The Fastest Way (Zero Setup)

If you have Node.js installed, you can kill any port without memorizing PIDs:

```bash
# Kill a single port
npx kill-port 3000

# Kill multiple ports at once
npx kill-port 3000 3001 8080 5000
```

---

## 🪟 Windows (PowerShell & CMD)

### 1. Find & Kill by Specific Port

#### Option A: PowerShell (Recommended)
**Step 1: Check what is listening on a port (e.g., 3000)**
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess, LocalAddress, LocalPort, State
```

**Step 2: Check process details (to verify what it is)**
```powershell
Get-Process -Id <PID> | Select-Object Id, ProcessName, Path
```

**Step 3: Kill the process and all its child processes**
```powershell
taskkill /F /PID <PID> /T
# or in native PowerShell:
Stop-Process -Id <PID> -Force
```

---

#### Option B: One-Liner in PowerShell (Auto-Kill by Port)
Kill whatever is listening on port 3000 in one command:
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess -Force
```

---

#### Option C: Command Prompt (CMD)
```cmd
:: 1. Find the PID listening on port 3000
netstat -ano | findstr :3000 | findstr LISTENING

:: 2. Kill the process by PID (/F = force, /T = terminate child tree)
taskkill /F /PID <PID> /T
```

---

### 2. View ALL Active Localhost Ports

To see every server currently listening on your machine:

#### PowerShell:
```powershell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalAddress -in @('127.0.0.1', '::1', '0.0.0.0', '::') } | Select-Object LocalAddress, LocalPort, OwningProcess | Sort-Object LocalPort
```

#### CMD:
```cmd
netstat -ano | findstr LISTENING
```

---

### 3. Kill ALL Node.js Dev Servers at Once

If you have orphaned Node dev servers running in the background and want to wipe them all clean:

```cmd
taskkill /F /IM node.exe /T
```
*(In PowerShell)*:
```powershell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
```

---

## 🛠️ Handy PowerShell Profile Shortcut (Optional)

You can add this snippet to your PowerShell profile (`$PROFILE`) so you can run `killport 3000` anytime:

```powershell
function killport ($port) {
    $processes = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($proc in $processes) {
            Write-Host "Killing PID $($proc.OwningProcess) listening on port $port..." -ForegroundColor Yellow
            Stop-Process -Id $proc.OwningProcess -Force
        }
        Write-Host "Port $port is now free." -ForegroundColor Green
    } else {
        Write-Host "No process is listening on port $port." -ForegroundColor Cyan
    }
}
```
**Usage:**
```powershell
killport 3000
```

---

## 🐧 macOS / Linux Quick Reference

```bash
# 1. Find process listening on port 3000
lsof -i :3000

# 2. Kill the PID
kill -9 <PID>

# Or single one-liner:
kill -9 $(lsof -t -i:3000)

# Or using fuser:
fuser -k 3000/tcp
```
