var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  // proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  var server = '';
  if(req.url.startsWith('/exp/')){
        req.url =req.url.substring(4);
	server = 'http://127.0.0.1:3001'
  }else{
	server = 'http://127.0.0.1:8080'
	console.log(req.url);
  }
  proxy.web(req, res, {
    target: server
  });
});

console.log("listening on port 3008")
server.listen(3008);
