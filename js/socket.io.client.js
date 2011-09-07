    var socket = io.connect('http://www.owbo.com');

    socket.on('news', function (data) 
    {
        console.log(data);
	var content = data['content'];
	$('#newsContainer').append(content);
    });

    socket.on('commandResponse', function (data) 
    {
        console.log(data);

	var response = data['response'];
	var error = data['error'];

	if(error)
	    alert(error);
	else
	    $('#respopnseContainer').prepend(response+'<br><br>');
    });

    function sendCommand()
    {
	var command = $('#commandText').val();
	var data = new Object;
	data.command = command;
        socket.emit('command', data);
    }
