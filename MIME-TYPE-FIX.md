# Fix for "video/mp2t" MIME Type Error

## The Problem
Your server is serving JavaScript files with the wrong MIME type:
```
main.ts:1 Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "video/mp2t"
```

## Why This Happens
The server is incorrectly identifying JavaScript files as video files (`video/mp2t`). This usually occurs when:
1. Server configuration is overriding MIME types
2. `.htaccess` file isn't being processed
3. Server has conflicting MIME type mappings

## Solutions

### Solution 1: Use the Enhanced .htaccess (Recommended)
The main `.htaccess` file in your `dist` folder now includes:
- `ForceType` directives to override server MIME types
- `X-Content-Type-Options: nosniff` to prevent MIME sniffing
- Comprehensive file type handling

### Solution 2: Use the Simple .htaccess
If the main one doesn't work, rename `.htaccess-simple` to `.htaccess`:
```bash
# On your server, rename the file
mv .htaccess-simple .htaccess
```

### Solution 3: Server-Level MIME Type Configuration

#### For Apache (in httpd.conf or virtual host):
```apache
<Directory "/var/www/html">
    AddType application/javascript .js
    AddType text/css .css
    AddType image/svg+xml .svg
</Directory>
```

#### For Nginx:
```nginx
location ~* \.js$ {
    add_header Content-Type "application/javascript";
    try_files $uri =404;
}
```

### Solution 4: Check Server Configuration
1. **Verify .htaccess is enabled:**
   ```apache
   <Directory "/var/www/html">
       AllowOverride All
   </Directory>
   ```

2. **Check for conflicting MIME type mappings:**
   - Look for `AddType` or `MimeType` directives
   - Remove any that map `.js` to video types

3. **Restart web server** after configuration changes

## Testing the Fix

### Step 1: Upload the New Files
Upload the entire `dist` folder to your server

### Step 2: Check MIME Types
In browser developer tools, check the Network tab:
- JavaScript files should show `application/javascript`
- CSS files should show `text/css`
- SVG files should show `image/svg+xml`

### Step 3: Clear Browser Cache
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache completely

## Troubleshooting

### Still Getting video/mp2t Error?
1. **Check if .htaccess is working:**
   - Add a test line: `# TEST: .htaccess is working`
   - Upload and check if you see the comment

2. **Verify server supports .htaccess:**
   - Some shared hosting doesn't support all directives
   - Contact your hosting provider

3. **Check server error logs:**
   - Look for `.htaccess` related errors
   - Check for syntax errors

### Alternative: Contact Hosting Provider
If nothing works, ask your hosting provider to:
1. Enable `.htaccess` processing
2. Set correct MIME types for JavaScript files
3. Configure the server to serve `.js` files as `application/javascript`

## Quick Fix Commands

### On Your Local Machine:
```bash
npm run build
# Upload the entire dist folder to your server
```

### On Your Server (if you have SSH access):
```bash
# Check current MIME types
file --mime-type your-file.js

# Test .htaccess processing
apache2ctl -M | grep rewrite
```

## Expected Result
After applying the fix:
- ✅ JavaScript files load with `application/javascript` MIME type
- ✅ CSS files load with `text/css` MIME type
- ✅ No more "video/mp2t" errors
- ✅ Your Vue.js app loads correctly 