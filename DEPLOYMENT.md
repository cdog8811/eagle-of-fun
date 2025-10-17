# 🚀 Deployment Guide - Eagle of Fun

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All assets are optimized (compressed images, audio)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Game runs smoothly in production build (`npm run build && npm run preview`)
- [ ] All features tested on desktop and mobile
- [ ] Environment variables configured (if using backend)
- [ ] Analytics/tracking set up (optional)
- [ ] Social sharing tested
- [ ] Easter eggs verified

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers fast deployment with CDN and automatic SSL.

#### Steps:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts to link your project

5. For production deployment:
```bash
vercel --prod
```

#### Configuration

Create `vercel.json` (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Netlify

Netlify is another great option with easy setup.

#### Steps:

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

#### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

Free hosting for public repositories.

#### Steps:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts` with your repo name:
```typescript
export default defineConfig({
  base: '/eagle-of-fun/', // Replace with your repo name
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in repo settings (use `gh-pages` branch)

### Option 4: Custom Server

If you have your own server:

#### Using nginx:

1. Build the project:
```bash
npm run build
```

2. Copy `dist/` contents to your web server:
```bash
scp -r dist/* user@yourserver.com:/var/www/eagle-of-fun/
```

3. Configure nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/eagle-of-fun;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caching for assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Using Apache:

Create `.htaccess` in your web root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

## Domain Configuration

### Custom Domain Setup

#### For Vercel:
1. Go to project settings
2. Add your domain
3. Update DNS records:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

#### For Netlify:
1. Go to Domain settings
2. Add custom domain
3. Update DNS:
   - Type: A, Name: @, Value: 75.2.60.5
   - Type: CNAME, Name: www, Value: [your-site].netlify.app

## Environment Variables

If using backend services (Firebase, Supabase):

### Vercel
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_SUPABASE_URL
```

### Netlify
Add in Netlify dashboard under Site settings → Environment variables

### .env Example
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

## Performance Optimization

### Image Optimization

```bash
# Install image optimization tools
npm install --save-dev vite-plugin-imagemin
```

Update `vite.config.ts`:
```typescript
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox' }] }
    })
  ]
});
```

### Bundle Size Analysis

```bash
npm run build -- --mode analyze
```

### Compression

Most hosting platforms enable gzip/brotli automatically. If using custom server:

**nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Analytics Setup (Optional)

### Google Analytics

1. Create GA4 property
2. Add tracking code to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Monitoring

### Error Tracking

Consider using:
- **Sentry**: Comprehensive error tracking
- **LogRocket**: Session replay
- **Rollbar**: Real-time error monitoring

Example Sentry setup:
```bash
npm install @sentry/browser
```

In `main.ts`:
```typescript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'your-dsn-here',
  environment: 'production'
});
```

## SSL Certificate

Most hosting platforms provide free SSL via Let's Encrypt automatically.

For custom servers, use Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## CDN Setup (Optional)

For faster global delivery:

### Cloudflare
1. Sign up at cloudflare.com
2. Add your site
3. Update nameservers
4. Enable CDN features

Benefits:
- DDoS protection
- Auto SSL
- Global CDN
- Caching
- Analytics

## Post-Deployment

### Testing

1. Test on multiple devices:
   - Desktop (Chrome, Firefox, Safari, Edge)
   - Mobile (iOS Safari, Chrome Mobile)
   - Tablet

2. Check performance:
   - Google PageSpeed Insights
   - WebPageTest
   - GTmetrix

3. Verify functionality:
   - All scenes load correctly
   - Game mechanics work
   - Social sharing functions
   - Leaderboard (if implemented)
   - Easter eggs work

### Monitoring

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor error rates
- Track user engagement
- Check load times

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy # or vercel deploy --prod
```

## Rollback Strategy

If issues occur:

### Vercel
```bash
vercel rollback [deployment-url]
```

### Netlify
Rollback via dashboard under Deploys

### GitHub Pages
Revert the commit that caused issues

## Support & Maintenance

- Monitor error logs regularly
- Update dependencies monthly
- Test after major browser updates
- Collect user feedback
- Plan feature updates

---

**Your game is ready to launch! 🚀🦅**

Share your deployment at america.fun and let the community play!
