exports.run = function(variables)
{
    if(!variables)
	variables = new Object;

    variables.MYTITLE = 'nodelicious';

    var data = '';

    var mongoose = require('mongoose');
    var db = mongoose.connect('mongodb://localhost/test');

    data += view.load('header', variables);
    data += view.load('index', variables);
    data += view.load('footer', variables);
    return(data);
};
