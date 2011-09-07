global.viewPath = '/views';
global.modulePath = '/modules';
global.controllerPath = '/controllers';
global.appPath = __dirname;

var defaultPathName = '/index.js';
var nonControllerPaths = {'/images':1,'/css':1,'/js':1,'/js/libs':1,'/js/mylibs':1};
var nonControllerFiles = {'/favicon.ico':1};

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var url = require('url');
var querystring = require('querystring');
var vm = require('vm');
var clients = [];
var clientCount = 0;

global.fs = require('fs');
global.path = require('path');
global.getMimeType = require('simple-mime')('txt/html');
global.view = require(appPath+modulePath+'/view.js');
global.errorEvents = require(appPath+modulePath+'/errorEvents.js');

app.listen(80);

function handler (req, res) 
{
    var parsedUrl = url.parse(req.url);
    var pathname = parsedUrl.pathname;
    var dirName = path.dirname(pathname);
    var query = parsedUrl.query;
    var queryArray = querystring.parse(query);
    var servicePath = controllerPath;

    global.res = res;

    if(pathname == '/')
    {
	pathname = defaultPathName;
    }

    var nonController = false;
    if(nonControllerPaths[dirName] || nonControllerFiles[pathname])
    {
	nonController = true;
	servicePath = '';
    }

    var controllerServerPath = appPath+servicePath+pathname;
    path.exists(controllerServerPath, function(exists)
    {
	if(exists)
	{
	    if(!nonController)
	    {
		var controller = require(controllerServerPath);
		data = controller.run();
		res.writeHead(200, {'Content-Type':'text/html', 'server':'nodealicious'});
		res.end(data);
	    }
	    else
	    {
                fs.readFile(controllerServerPath, function (err, data) 
                {
                    if(err)
	            {
      	                res.writeHead(500);
      	                return res.end('Error loading '+pathname+'.');
    	            }

		    var mimeType = getMimeType(controllerServerPath);
		    var myNowDate = new Date();

                    res.writeHead(200, {'Content-Type': mimeType, 'server':'nodealicious', 'Date':myNowDate.toUTCString()});
    	            res.end(data);
                });
	    }
	}
	else
	{
	    errorEvents.show404(pathname);
	}
    });
}

io.sockets.on('connection', function (socket)
{
    var clientId = socket.id;
    var connectTime = new Date().getTime();

    clients[clientId] = {socket: socket, connectTime: connectTime};
    clientCount++;
    io.sockets.emit('commandResponse', { response: clientId+' has connected.', error: '' });
    socket.emit('news', { content: 'This is your daily news.' });
    console.log('clientCount: '+clientCount);

    socket.on('command', function (data)
    {
     	console.log(data);
        var command = data['command'];

        io.sockets.emit('commandResponse', { response: clientId+' -> '+command, error: '' });
    });

    socket.on('disconnect', function (data)
    {
        var clientId = socket.id;
        delete clients[clientId];
        clientCount--;
        io.sockets.emit('commandResponse', { response: clientId+' has disconnected.', error: '' });
        console.log('clientCount: '+clientCount);
    });
});
