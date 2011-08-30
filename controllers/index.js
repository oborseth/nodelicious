exports.run = function(variables)
{
    if(!variables)
	variables = new Object;

    variables.MYTITLE = 'nodelicious';

    var data = '';
    data += view.load('header', variables);
    data += view.load('index', variables);
    data += view.load('footer', variables);
    return(data);
};
