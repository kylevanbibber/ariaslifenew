const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/google-app-script', // This is the path that will be proxied
        createProxyMiddleware({
            target: 'https://script.google.com', // The target host
            changeOrigin: true,
            pathRewrite: {
                '^/google-app-script': '', // Rewrite the path
            },
            onProxyRes: function (proxyRes) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            }
        })
    );
};
