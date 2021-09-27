export const CspParams = {
  "default-src": ["'self'"],
  "connect-src": ["'self'"],
  "style-src": ["'self'", "https: 'unsafe-inline'"],
  "font-src": ["'self'", "https: data:"],
  "script-src": ["'self'"],
  "object-src": ["'none'"],
  "frame-src": ["'self'"],
  "img-src": [
    "'self'",
    'https://cdn.pixabay.com/photo/2019/08/22/15/21/modern-4423814_960_720.png'
  ]
}