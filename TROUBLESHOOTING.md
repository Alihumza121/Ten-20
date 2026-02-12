# Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Permission Error (EPERM)

**Symptom:**
```
Error: listen EPERM: operation not permitted 0.0.0.0:3000
```

**Cause:** macOS security restrictions on network ports

**Solutions:**

#### Option A: Use Different Port with Localhost
```bash
npx next dev -p 3002 -H localhost
```

#### Option B: Deploy to Vercel (Recommended)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main

# 2. Deploy on vercel.com
# - Import repository
# - Add environment variables
# - Deploy
```

#### Option C: Fix macOS Permissions
```bash
# Check firewall settings
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Allow Node through firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

---

### 2. Module Not Found Error

**Symptom:**
```
Module not found: Can't resolve '@/...'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

---

### 3. TypeScript Errors

**Symptom:**
```
Type error: Cannot find module 'next-auth'
```

**Solution:**
```bash
# Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom
```

---

### 4. Build Errors

**Symptom:**
Build fails with compilation errors

**Solution:**
```bash
# Clean build cache
rm -rf .next
npm run build
```

---

### 5. Authentication Not Working

**Symptoms:**
- Login redirects to error page
- Session not persisting
- "Invalid callback URL" error

**Solutions:**

1. Check environment variables:
```bash
# .env.local should have:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

2. Restart dev server after changing .env.local

3. Clear browser cookies and try again

---

### 6. Styling Not Applied

**Symptom:**
Page renders without styles

**Solutions:**

1. Check Tailwind configuration:
```bash
# Ensure postcss.config.js exists
# Ensure tailwind.config.ts includes correct paths
```

2. Restart dev server:
```bash
# Kill existing process
# Run npm run dev again
```

---

### 7. API Routes Return 404

**Symptom:**
```
404 - This page could not be found
```

**Solution:**
- Ensure file structure matches:
```
pages/
  api/
    auth/
      [...nextauth].ts
    timesheets/
      index.ts
      [id]/
        entries.ts
```

---

### 8. Cannot Start Development Server

**Symptoms:**
- Server won't start
- Port already in use

**Solutions:**

1. Kill process on port:
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 PID
```

2. Use different port:
```bash
PORT=3001 npm run dev
```

---

### 9. Environment Variables Not Loading

**Symptom:**
undefined values for process.env variables

**Solutions:**

1. Ensure .env.local exists in root directory

2. Restart development server

3. For client-side vars, prefix with NEXT_PUBLIC_

---

### 10. Session Provider Error

**Symptom:**
```
useSession must be wrapped in a <SessionProvider />
```

**Solution:**
Ensure _app.tsx wraps Component with SessionProvider:
```tsx
<SessionProvider session={session}>
  <Component {...pageProps} />
</SessionProvider>
```

---

## Still Having Issues?

### Check These:

1. **Node Version**
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **Dependencies Installed**
   ```bash
   ls node_modules  # Should contain packages
   ```

3. **File Permissions**
   ```bash
   ls -la  # Check file ownership
   ```

4. **Browser Console**
   - Open DevTools (F12)
   - Check Console and Network tabs for errors

5. **Server Logs**
   - Check terminal output for error messages
   - Look for stack traces

---

## Quick Fixes Checklist

- [ ] Run `npm install`
- [ ] Check .env.local exists and has correct values
- [ ] Restart development server
- [ ] Clear browser cache
- [ ] Try different browser
- [ ] Check Node.js version
- [ ] Clear .next folder
- [ ] Check file structure matches expected

---

## Alternative: Use Production Build

If dev server issues persist, use production build:

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## Get Help

If you're still experiencing issues:

1. Check [Next.js Documentation](https://nextjs.org/docs)
2. Check [NextAuth Documentation](https://next-auth.js.org)
3. Review error logs carefully
4. Search for specific error messages
5. Try deploying to Vercel (often resolves local issues)

---

## System Requirements

**Minimum Requirements:**
- Node.js 18.x or higher
- npm 9.x or higher
- 4GB RAM
- Modern browser (Chrome, Firefox, Safari, Edge)

**Recommended:**
- Node.js 20.x
- npm 10.x
- 8GB RAM
- Chrome or Firefox (latest)

---

## Known Limitations

1. **Port Permissions**: Some macOS systems restrict port access
   - **Workaround**: Use localhost or deploy to Vercel

2. **Mock Data**: Data resets on server restart
   - **Solution**: This is expected behavior for mock data

3. **Session Storage**: Sessions cleared on server restart
   - **Solution**: This is expected in development mode

---

## Debug Mode

Enable verbose logging:

```bash
# Enable Next.js debug mode
DEBUG=* npm run dev

# Enable specific module
DEBUG=next:* npm run dev
```

---

## Performance Tips

If the app is running slowly:

1. Clear .next folder
2. Disable browser extensions
3. Close unnecessary tabs
4. Check system resources
5. Use production build

---

## Need More Help?

Contact information or resources:
- Project documentation: See README.md
- Requirements: See REQUIREMENTS_CHECKLIST.md
- Verification: See VERIFICATION.md
- Deployment: See DEPLOYMENT.md
