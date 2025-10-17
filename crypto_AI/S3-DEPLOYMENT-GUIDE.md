# 🚀 S3 Frontend Deployment Guide

## Prerequisites

### 1. Install AWS CLI
```bash
# Windows (using Chocolatey)
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

### 2. Configure AWS CLI
```bash
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: `us-east-1`
- Default output format: `json`

## Deployment Methods

### Method 1: NPM Script (Easiest)
```bash
# Simple deployment
npm run deploy:s3

# Production deployment with proper headers
npm run deploy:s3:prod
```

### Method 2: Windows Batch Script
```bash
# Run the batch file
deploy-s3.bat
```

### Method 3: Manual AWS CLI
```bash
# Build first
npm run build

# Upload to S3
aws s3 sync dist/ s3://crypto-ai-advisore --delete --region us-east-1

# Set proper content type for HTML
aws s3 cp s3://crypto-ai-advisore/index.html s3://crypto-ai-advisore/index.html --content-type "text/html" --region us-east-1
```

## S3 Bucket Configuration

### 1. Enable Static Website Hosting
```bash
aws s3 website s3://crypto-ai-advisore --index-document index.html --error-document index.html --region us-east-1
```

### 2. Set Bucket Policy (for public access)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::crypto-ai-advisore/*"
        }
    ]
}
```

### 3. Configure CORS (if needed)
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Your Site URLs

After deployment, your site will be available at:
- **S3 Website URL**: `https://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com`
- **S3 Object URL**: `http://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com`

## Environment Variables

Make sure your production environment variables are set correctly in `env.production`:
```bash
VITE_API_BASE_URL=https://ai-crypto-advisor-2oxd.onrender.com
VITE_CRYPTOPANIC_TOKEN=your_token_here
```

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check bucket policy and public access settings
2. **404 on refresh**: Ensure error document is set to `index.html` (for SPA routing)
3. **CORS errors**: Configure CORS policy on the S3 bucket
4. **Build fails**: Run `npm install` first, then `npm run build`

### Quick Fixes:

```bash
# Make bucket public
aws s3api put-bucket-policy --bucket crypto-ai-advisore --policy file://bucket-policy.json

# Enable website hosting
aws s3 website s3://crypto-ai-advisore --index-document index.html --error-document index.html
```

## Automated Deployment

For continuous deployment, you can:
1. Use GitHub Actions
2. Set up AWS CodePipeline
3. Use Vercel/Netlify (alternative to S3)

## Cost Optimization

- Enable S3 Transfer Acceleration for faster uploads
- Use CloudFront CDN for better performance
- Set up lifecycle policies for cost savings
