exports.load = function(pathname, variables)
{
    var serverPath = appPath+viewPath+'/'+pathname;

    if(path.existsSync(serverPath))
    {
	var data = '';
        if(data = fs.readFileSync(serverPath, 'utf8'))
        {
	    for(var key in variables)
	    {
		var value = variables[key];
		var regex = new RegExp('\\?'+key+'\\?', 'g');
		data = data.replace(regex, value);
	    }

            return(data);
        }
	else
	{
            res.writeHead(500);
            return res.end('Error loading '+pathname+'.');
	}
    }
    else
    {
        errorEvents.show404(pathname);
    }
};
