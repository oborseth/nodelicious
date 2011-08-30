exports.show404 = function(pathname)
{
    path.exists(appPath+'/404.html', function(exists)
    {
     	if(exists)
        {
            fs.readFile(appPath+'/404.html', function (err, data)
            {
                if (err)
                {
                    res.writeHead(500);
                    return res.end('Error loading '+pathname+'.');
                }
                res.writeHead(200);
         	res.end(data);
            });
        }
  	else
        {   
	    res.writeHead(404);
            res.end('404 File not found.');
        }
    });
};

