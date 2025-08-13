# Deployment Guide for Digital Architect Portfolio

## Current Issue
Your live site is getting 404 errors because it's looking for old build files:
- `index-4eddf796.css` (404)
- `index-ef15bf3c.js` (404)
- `favicon-a996781e.svg` (404)

## NEW: MIME Type Error Fix
If you're getting this error:
```
index-ef15bf3c.js:1 Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

**This means your server is serving HTML instead of JavaScript files.** The fix is in the server configuration files below.

## Solution: Deploy the Latest Build

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Upload the `dist` Folder
Upload the entire `dist` folder to your web server. This folder contains:
- `index.html` - Main HTML file
- `assets/` - All CSS, JS, and image files with correct hashes
- `.htaccess` - Apache configuration (if using Apache)
- `nginx.conf` - Nginx configuration (if using Nginx)

### Step 3: Server Configuration

#### Option A: Apache (.htaccess) - RECOMMENDED
The `dist/.htaccess` file is already configured to fix MIME type issues:
- Sets proper Content-Type headers for JS, CSS, and SVG files
- Handles static assets before SPA routing
- Enables caching and compression

**Just upload the entire `dist` folder - the .htaccess is included!**

#### Option B: Nginx
If using Nginx, copy the configuration from `dist/nginx.conf` to your server's nginx configuration.

#### Option C: Other Servers
For other servers, ensure:
1. Static files (`.js`, `.css`, `.svg`) are served with correct MIME types
2. JavaScript files get `application/javascript` MIME type
3. CSS files get `text/css` MIME type
4. SVG files get `image/svg+xml` MIME type

### Step 4: Verify Deployment
After uploading, your site should load without errors. The new files are:
- CSS: `index-aaa5464a.css`
- JS: `index-6c23a9fa.js`
- Favicon: `favicon-a996781e.svg`

## Important Notes

1. **Hash Routing**: The app now uses hash routing (`#/`) instead of history mode, which is more reliable for static hosting.

2. **Base Path**: The build is configured with `base: './'` so it works in any subdirectory.

3. **File Updates**: Every time you rebuild, the file hashes will change. Always upload the entire `dist` folder.

4. **Cache Issues**: If you still see errors after uploading, clear your browser cache or do a hard refresh (Ctrl+F5).

5. **MIME Types**: The server configuration files fix the "text/html" MIME type error for JavaScript files.

## Troubleshooting

### Still Getting 404s?
1. Check that all files from `dist/assets/` were uploaded
2. Verify the server is serving static files correctly
3. Check browser developer tools Network tab to see which files are failing
4. Ensure the server isn't blocking `.js` or `.css` files

### Getting MIME Type Errors?
1. **Make sure you uploaded the `.htaccess` file** (Apache) or `nginx.conf` (Nginx)
2. Check that your server supports `.htaccess` files (Apache) or has the Nginx config applied
3. Verify the server is serving JavaScript files with `application/javascript` MIME type
4. Clear browser cache and try again

### Build Errors?
1. Run `npm install` to ensure all dependencies are installed
2. Check for TypeScript errors: `npm run type-check`
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Quick Deploy Command
```bash
npm run build && echo "Build complete! Upload the 'dist' folder to your server."
```

## Server Configuration Files Included
- **`.htaccess`** - Apache configuration (automatically included in dist folder)
- **`nginx.conf`** - Nginx configuration (copy to your server config) 