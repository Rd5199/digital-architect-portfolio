# Deployment Guide for Digital Architect Portfolio

## Current Issue
Your live site is getting 404 errors because it's looking for old build files:
- `index-4eddf796.css` (404)
- `index-ef15bf3c.js` (404)
- `favicon-a996781e.svg` (404)

## Solution: Deploy the Latest Build

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Upload the `dist` Folder
Upload the entire `dist` folder to your web server. This folder contains:
- `index.html` - Main HTML file
- `assets/` - All CSS, JS, and image files with correct hashes

### Step 3: Server Configuration

#### Option A: Static File Hosting (Recommended)
- Upload the `dist` folder contents to your web root directory
- Ensure the server serves `index.html` for all routes
- The app now uses hash routing (`#/`) so no server-side routing needed

#### Option B: Apache (.htaccess)
If using Apache, create a `.htaccess` file in your web root:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Option C: Nginx
If using Nginx, add this to your server block:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Step 4: Verify Deployment
After uploading, your site should load without 404 errors. The new files are:
- CSS: `index-aaa5464a.css`
- JS: `index-6c23a9fa.js`
- Favicon: `favicon-a996781e.svg`

## Important Notes

1. **Hash Routing**: The app now uses hash routing (`#/`) instead of history mode, which is more reliable for static hosting.

2. **Base Path**: The build is configured with `base: './'` so it works in any subdirectory.

3. **File Updates**: Every time you rebuild, the file hashes will change. Always upload the entire `dist` folder.

4. **Cache Issues**: If you still see 404s after uploading, clear your browser cache or do a hard refresh (Ctrl+F5).

## Troubleshooting

### Still Getting 404s?
1. Check that all files from `dist/assets/` were uploaded
2. Verify the server is serving static files correctly
3. Check browser developer tools Network tab to see which files are failing
4. Ensure the server isn't blocking `.js` or `.css` files

### Build Errors?
1. Run `npm install` to ensure all dependencies are installed
2. Check for TypeScript errors: `npm run type-check`
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Quick Deploy Command
```bash
npm run build && echo "Build complete! Upload the 'dist' folder to your server."
``` 