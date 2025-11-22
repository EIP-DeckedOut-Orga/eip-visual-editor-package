# Server Deployment Setup Guide

This document explains how to set up the documentation deployment to your DeckedOut server.

## Server Configuration

### 1. Directory Setup

On your server, create the documentation directory:

```bash
# Create directory structure
sudo mkdir -p /var/www/dev/docs/editor

# Set ownership (replace with your user/group)
sudo chown -R $USER:$USER /var/www/dev/docs

# Set permissions
sudo chmod -R 755 /var/www/dev/docs
```

### 2. Nginx Configuration

Add the configuration from `nginx-docs.conf` to your nginx configuration:

```bash
# Edit your nginx site configuration
sudo nano /etc/nginx/sites-available/deckedout.fr

# Add the location block from nginx-docs.conf inside your server block
# Then test and reload
sudo nginx -t
sudo systemctl reload nginx
```

**Full nginx server block example:**

```nginx
server {
    listen 443 ssl http2;
    server_name deckedout.fr;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Existing locations...
    location /artifacts/ {
        alias /var/www/artifacts/;
        # ... your existing config
    }

    # Add this for documentation
    location /dev/docs/editor/ {
        alias /var/www/dev/docs/editor/;
        index index.html;
        try_files $uri $uri/ $uri.html /dev/docs/editor/index.html;
        
        # Cache static assets
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 3. Self-Hosted Runner Setup

The GitHub Actions workflow runs on your `self-hosted` runner. Ensure:

1. **Runner has access to the deployment directory:**
   ```bash
   # Test from runner user
   touch /var/www/dev/docs/editor/test.txt
   rm /var/www/dev/docs/editor/test.txt
   ```

2. **Runner user has proper permissions:**
   ```bash
   # Add runner user to www-data group (if needed)
   sudo usermod -a -G www-data <runner-user>
   
   # Or set directory ownership
   sudo chown -R <runner-user>:www-data /var/www/dev/docs
   ```

## Deployment Workflow

The workflow (`.github/workflows/deploy-docs.yml`) will:

1. **Trigger** on push to `main` branch
2. **Run** on your self-hosted runner
3. **Build** documentation with `npm run docs`
4. **Deploy** to `/var/www/dev/docs/editor/`
5. **Verify** deployment succeeded

## Testing Deployment

### Test Locally First

Before pushing to main, test the deployment process:

```bash
# On your server
cd /path/to/visual-editor-package
npm install
npm run docs

# Manually copy to test
sudo cp -r docs/* /var/www/dev/docs/editor/

# Test access
curl -I https://deckedout.fr/dev/docs/editor/
```

### Verify Production Deployment

After pushing to main:

1. Check GitHub Actions workflow status
2. Verify files deployed:
   ```bash
   ls -lh /var/www/dev/docs/editor/
   ```
3. Test in browser: https://deckedout.fr/dev/docs/editor/
4. Check nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/access.log | grep "/dev/docs/editor"
   ```

## Troubleshooting

### Issue: 403 Forbidden

**Solution:**
```bash
# Check permissions
ls -la /var/www/dev/docs/editor/

# Fix if needed
sudo chmod -R 755 /var/www/dev/docs/editor
sudo chown -R www-data:www-data /var/www/dev/docs/editor
```

### Issue: 404 Not Found

**Solutions:**
1. Verify nginx configuration is loaded:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. Check if files exist:
   ```bash
   ls /var/www/dev/docs/editor/index.html
   ```

3. Review nginx error log:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### Issue: Deployment Failed in GitHub Actions

**Solutions:**
1. Check runner status:
   ```bash
   # On server where runner is installed
   cd ~/actions-runner
   ./run.sh
   ```

2. Verify directory permissions for runner user:
   ```bash
   sudo -u <runner-user> touch /var/www/dev/docs/editor/test.txt
   ```

3. Check workflow logs in GitHub Actions tab

### Issue: Old Documentation Still Showing

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check if new files deployed:
   ```bash
   stat /var/www/dev/docs/editor/index.html
   ```
3. Force nginx cache clear (if caching enabled):
   ```bash
   sudo systemctl reload nginx
   ```

## Security Considerations

1. **Directory Permissions:**
   - Documentation directory: `755` (rwxr-xr-x)
   - Files: `644` (rw-r--r--)

2. **Nginx Security Headers:**
   Already configured in `nginx-docs.conf`:
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection enabled

3. **SSL/TLS:**
   Ensure HTTPS is properly configured for deckedout.fr

## Maintenance

### Updating Documentation

Documentation auto-updates on every push to main. No manual intervention needed.

### Manual Deployment (if needed)

```bash
# 1. Generate docs locally
npm run docs

# 2. Copy to server
scp -r docs/* user@deckedout.fr:/var/www/dev/docs/editor/

# 3. Fix permissions
ssh user@deckedout.fr "sudo chmod -R 755 /var/www/dev/docs/editor"
```

### Backup Old Documentation

```bash
# Before major updates
cd /var/www/dev/docs
tar -czf editor-backup-$(date +%Y%m%d).tar.gz editor/
```

## Monitoring

### Check Deployment Status

```bash
# Recent deployments
ls -lt /var/www/dev/docs/editor/ | head

# Check workflow history
# Go to: https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/actions
```

### Access Logs

```bash
# Watch documentation access in real-time
sudo tail -f /var/log/nginx/access.log | grep "/dev/docs/editor"

# Count requests today
sudo grep "$(date +%d/%b/%Y)" /var/log/nginx/access.log | grep "/dev/docs/editor" | wc -l
```

## Links

- **Documentation URL:** https://deckedout.fr/dev/docs/editor/
- **Repository:** https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package
- **Workflow:** `.github/workflows/deploy-docs.yml`
