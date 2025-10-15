# Webhook System Documentation

## Overview

The Moveo AI Crypto Advisor webhook system allows external services to receive real-time notifications about events occurring within the platform. Webhooks are delivered via HTTP POST requests to configured endpoints.

## Subscription

### Setting Up Webhooks

1. **Register Endpoint**: Provide your webhook URL during integration setup
2. **Configure Events**: Select which events you want to receive
3. **Verify Signature**: Implement signature verification for security
4. **Handle Retries**: Implement idempotency for reliable processing

### Webhook URL Requirements

- Must be HTTPS (except for localhost during development)
- Must respond with 2xx status code within 30 seconds
- Should implement idempotency using the `id` field

## Security

### Signature Verification

All webhook payloads include a signature in the `X-Webhook-Signature` header for verification:

```
X-Webhook-Signature: sha256=abc123def456...
```

**Verification Process:**
1. Extract the signature from the header
2. Create HMAC SHA-256 hash of the payload body using your webhook secret
3. Compare the signatures using constant-time comparison

**Example (Node.js):**
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const providedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(providedSignature, 'hex')
  );
}
```

### Replay Attack Prevention

- Each webhook includes a `created_at` timestamp
- Reject webhooks older than 5 minutes
- Use the `id` field for idempotency to prevent duplicate processing

## Retry Policy

### Automatic Retries

- **Initial Delivery**: Immediate
- **Retry Schedule**: 1m, 5m, 15m, 1h, 4h, 24h
- **Max Retries**: 6 attempts
- **Timeout**: 30 seconds per attempt

### Retry Conditions

Webhooks are retried for:
- Network timeouts
- 5xx server errors
- Connection failures

Webhooks are NOT retried for:
- 4xx client errors (except 429 rate limiting)
- Invalid signatures
- Malformed payloads

### Idempotency

- Use the `id` field to detect duplicate webhooks
- Store processed webhook IDs to prevent reprocessing
- Implement idempotent handlers for all webhook events

## Event Types

### User Events
- `user.created` - New user registration
- `user.updated` - User profile changes
- `user.deleted` - User account deletion

### Preference Events
- `preference.updated` - User preferences changed (assets, content types, investor profile)

### Content Events
- `news.ingested` - New news article added
- `meme.ingested` - New meme content added
- `price.snapshot` - Price data updated
- `ai.insight.generated` - New AI insight created

### Interaction Events
- `vote.created` - User voted on content
- `interaction.logged` - User interaction tracked

### Recommendation Events
- `recommendation.profile.updated` - User recommendation profile changed
- `recommendation.served` - Recommendation delivered to user
- `recommendation.outcome` - User interacted with recommendation

## Payload Structure

All webhook payloads follow this structure:

```json
{
  "id": "webhook_event_uuid",
  "type": "event.type",
  "version": "1.0",
  "created_at": "2024-01-15T14:30:00Z",
  "attempt": 1,
  "data": {
    // Event-specific data (references JSON schemas)
  }
}
```

### Payload Fields

- `id`: Unique identifier for this webhook delivery
- `type`: Event type identifier
- `version`: Webhook payload version
- `created_at`: When the event occurred
- `attempt`: Retry attempt number (1 for initial delivery)
- `data`: Event-specific payload data

## Testing

### Test Endpoint

Use the test endpoint to simulate webhook events:

```bash
POST /webhooks/test
{
  "eventType": "user.created",
  "data": { /* test data */ }
}
```

### Local Development

For local development, use tools like:
- [ngrok](https://ngrok.com/) - Expose local server
- [webhook.site](https://webhook.site/) - Temporary webhook URLs
- [RequestBin](https://requestbin.com/) - Webhook testing service

## Error Handling

### Common Issues

**Signature Verification Failed**
- Check webhook secret configuration
- Verify HMAC calculation
- Ensure payload hasn't been modified

**Timeout Errors**
- Optimize webhook handler performance
- Implement async processing for heavy operations
- Return 2xx immediately, process asynchronously

**Duplicate Processing**
- Implement idempotency using webhook `id`
- Store processed webhook IDs
- Use database constraints to prevent duplicates

### Monitoring

Monitor webhook delivery:
- Track success/failure rates
- Monitor response times
- Alert on high failure rates
- Log all webhook attempts

## Best Practices

1. **Always verify signatures** - Never trust unverified webhooks
2. **Implement idempotency** - Handle duplicate deliveries gracefully
3. **Process asynchronously** - Return quickly, process in background
4. **Log everything** - Maintain audit trail of webhook processing
5. **Handle failures gracefully** - Don't crash on webhook processing errors
6. **Test thoroughly** - Use test endpoints and staging environments
7. **Monitor performance** - Track webhook processing metrics
