# Deployment Guide

## Prerequisites
- Node.js 14.x or higher
- MongoDB 4.4 or higher
- npm or yarn

## Production Deployment

### 1. Environment Setup

Create a `.env` file with production values:

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas or self-hosted
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fruit-shop

# Generate secure JWT secret
JWT_SECRET=your-very-long-random-secure-key-generate-with-crypto

# Token expiry
JWT_EXPIRY=24h

# CORS for production
CORS_ORIGIN=https://yourdomain.com

# Optional: Email service
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_key

# Optional: Payment processor
STRIPE_SECRET_KEY=sk_live_your_production_key

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Database Setup

Ensure MongoDB is properly configured:
- Create database backups
- Set up authentication
- Enable encryption at rest
- Configure replication for HA

### 4. SSL/TLS Certificate

Use Let's Encrypt or your certificate provider:

```bash
# With nginx/Apache
certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

### 5. Nginx Configuration Example

```nginx
upstream fruit_api {
  server localhost:5000;
  keepalive 64;
}

server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  location /api {
    proxy_pass http://fruit_api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### 6. PM2 Process Manager

Install PM2:
```bash
npm install -g pm2
```

Create ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'fruit-api',
    script: './server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    restart_delay: 4000,
    max_restarts: 10
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Monitoring & Logging

Set up monitoring:
- Use PM2 Plus for monitoring
- Configure centralized logging (ELK stack, etc)
- Set up alerts for errors

```bash
# Enable PM2 monitoring
pm2 web
```

### 8. Database Backups

Set up automated backups:
```bash
# MongoDB backup
mongodump --uri mongodb://user:pass@host:27017/fruit-shop --out backup

# Or use MongoDB Atlas automated backups
```

### 9. Performance Optimization

- Enable compression in Nginx
- Set up Redis caching
- Use CDN for static files
- Implement rate limiting

### 10. Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS
- [ ] Set secure CORS headers
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Enable logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable API key authentication for third-party access

### 11. Scaling

For horizontal scaling:
- Use load balancer (nginx, HAProxy)
- Run multiple instances of the API
- Use shared MongoDB cluster
- Consider microservices architecture

### 12. Continuous Integration/Deployment

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - run: npm install
      - run: npm test
      
      - name: Deploy
        run: |
          # Deploy script here
```

### Troubleshooting

**Memory Leaks:**
```bash
# Monitor with PM2
pm2 monit
```

**Connection Issues:**
- Check MongoDB connection string
- Verify firewall rules
- Check network connectivity

**High CPU Usage:**
- Check for infinite loops
- Monitor database queries
- Use clustering with PM2

**Database Performance:**
- Add indexes to frequently queried fields
- Monitor slow queries
- Optimize aggregation pipelines

## Docker Deployment

Create Dockerfile:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t fruit-api:1.0 .
docker run -d -p 5000:5000 --env-file .env fruit-api:1.0
```

## Version Updates

Always follow semantic versioning:
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

Update dependencies regularly:
```bash
npm outdated
npm update
npm audit fix
```

## Rollback Procedure

Keep previous versions tagged:
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push --tags
```

Rollback if needed:
```bash
git checkout v1.0.0
npm install
pm2 restart all
```
