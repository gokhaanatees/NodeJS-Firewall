const http = require('http');
const ipfilter  = require('ipfilter');
const { IpDeniedError } = require('ipfilter');
const svgCaptcha = require('svg-captcha');

class Server {
  constructor(maxRequestsPerMinute, maxRequestsPerMinutePerIp, bannedIps, captchaThreshold) {
    this.maxRequestsPerMinute = maxRequestsPerMinute || 1000;
    this.maxRequestsPerMinutePerIp = maxRequestsPerMinutePerIp || 20;
    this.bannedIps = bannedIps || [];
    this.captchaThreshold = captchaThreshold || 50;

    // Initialize the request counter
    this.requestCount = 0;
    this.ipRequestCount = {};

    // Create the server
    this.server = http.createServer((req, res) => {
      // Check if the request should be blocked due to too many requests
      if (this.requestCount >= this.maxRequestsPerMinute) {
        res.statusCode = 429; // Too Many Requests
        return res.end('Too many requests, please try again later.');
      }

      // Check if the request should be blocked due to too many requests from the same IP address
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (this.ipRequestCount[clientIp] >= this.maxRequestsPerMinutePerIp) {
        res.statusCode = 429; // Too Many Requests
        return res.end('Too many requests from your IP address, please try again later.');
      }

      // Increment the request counters
      this.requestCount++;
      this.ipRequestCount[clientIp] = (this.ipRequestCount[clientIp] || 0) + 1;

      // Check if the request should show a CAPTCHA challenge
      if (this.requestCount >= this.captchaThreshold) {
        const captcha = svgCaptcha.create();
        req.session.captcha = captcha.text;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.end(captcha.data);
      }

      // Create a function to handle the request normally
      const handleRequest = () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello, world!\n');
      };

      // Check if the request is from a banned IP
      if (this.bannedIps.includes(clientIp)) {
        res.statusCode = 403; // Forbidden
        return res.end('Your IP address is banned from accessing this server.');
      }

      // Create the IP filter to block banned IPs
      const ipfilter = ipfilter(this.bannedIps, { mode: 'deny' });

      // Attach the IP filter to the server
      ipfilter.filter(req, res, (err) => {
        if (err) {
          if (err instanceof IpDeniedError) {
            console.log(`Blocked connection from banned IP address: ${clientIp}`);
            res.statusCode = 403;
            res.end('Your IP address is banned from accessing this server.');
          } else {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else {
          // Handle the request normally
          handleRequest();
        }
      });
    });
  }

  listen(port, callback) {
    this.server.listen(port, callback);
    console.log(`Server running on ${port} port`);
  }
}

const firewall = new Server();
firewall.listen(3000)