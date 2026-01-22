const express = require('express');
const client = require('prom-client');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

client.collectDefaultMetrics({ prefix: 'my_app_' });

const httpRequestDurationMs = new client.Histogram({
  name: 'my_app_http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000]
});

app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown';
    end({ method: req.method, route, status_code: String(res.statusCode) });
    logger.info('http_request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode
    });
  });
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    logger.error('metrics_error', { message: err.message });
    res.status(500).json({ error: 'metrics_error' });
  }
});

app.listen(port, () => {
  logger.info('server_started', { port });
});
