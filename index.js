var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

const calculatePortForHost = function(host) {
    return require('random-seed').create(host).intBetween(50000, 60000);
};

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end(''+calculatePortForHost(req.headers.host));
});

var server = http.createServer(function (req, res) {
    const port = calculatePortForHost(req.headers.host);
    if (req.url == '/??') {
        res.writeHeader(200, {
            "Content-Type": "text/plain"
        });
        res.end(''+port);
    }
    else {
        proxy.web(req, res, { target: 'http://127.0.0.1:'+port });
    }
});

console.log("listening on port 80")
server.listen(80);
