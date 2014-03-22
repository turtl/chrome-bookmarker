ext.comm	=	{
	send: function(cmd, data, options)
	{
		options || (options = {});
		console.log('comm: sending: ', data);
		var req		=	new XMLHttpRequest();
		req.onload	=	function()
		{
			var res	=	this.responseText;
			if(res.error)
			{
				if(options.error) options.error(res.error);
			}
			else
			{
				if(options.success) options.success(res);
			}
		};
		req.open('get', 'http://127.0.0.1:7471/'+cmd+'?data='+JSON.stringify(data), true);
		req.send();
	}
};
