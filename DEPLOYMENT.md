# Deployment Guide - Ticktock Timesheet Application

## Quick Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform for Next.js applications.

### Steps:

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ticktock Timesheet App"
   git branch -M main
   git remote add origin https://github.com/yourusername/ticktock-timesheet.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Configure environment variables:
     - `NEXTAUTH_URL`: Your deployment URL (e.g., https://your-app.vercel.app)
     - `NEXTAUTH_SECRET`: Generate a secure secret (use `openssl rand -base64 32`)
   - Click "Deploy"

That's it! Your app will be live in minutes.

## Deploy to Netlify

### Steps:

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Environment variables**:
   - Add `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
4. Install the Next.js plugin for Netlify

## Deploy to AWS Amplify

### Steps:

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
3. Add environment variables in Amplify console
4. Deploy

## Deploy with Docker

### Dockerfile:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Build and run:

```bash
docker build -t ticktock-timesheet .
docker run -p 3000:3000 -e NEXTAUTH_URL=http://localhost:3000 -e NEXTAUTH_SECRET=your-secret ticktock-timesheet
```

## Environment Variables

Required for production:

- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`

## Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Test all CRUD operations
- [ ] Verify responsive design on mobile
- [ ] Check all API routes are working
- [ ] Test session persistence
- [ ] Verify error handling

## Troubleshooting

### "Invalid callback URL" error
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Include the protocol (http:// or https://)
- No trailing slash

### Build fails
- Check all environment variables are set
- Ensure Node.js version is 18.x or higher
- Clear `.next` folder and rebuild

### Session issues
- Verify `NEXTAUTH_SECRET` is set
- Check cookie settings if using custom domain
- Ensure HTTPS is enabled in production

## Performance Optimization

For production:

1. Enable ISR (Incremental Static Regeneration)
2. Add proper caching headers
3. Optimize images with next/image
4. Enable compression
5. Use CDN for static assets

## Security Recommendations

1. Rotate `NEXTAUTH_SECRET` regularly
2. Implement rate limiting on API routes
3. Add CORS headers
4. Enable Content Security Policy
5. Use HTTPS only in production
6. Implement proper password hashing (replace mock auth)

## Monitoring

Consider adding:

- Error tracking (Sentry, Bugsnag)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Vercel Analytics, New Relic)
- Uptime monitoring (UptimeRobot, Pingdom)

## Database Migration

When ready to move from mock data to real database:

1. Choose database (PostgreSQL, MongoDB, etc.)
2. Set up Prisma or your ORM of choice
3. Replace mock data imports with database queries
4. Add connection pooling
5. Implement proper migrations
6. Add database backups

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Next.js: https://nextjs.org/docs
