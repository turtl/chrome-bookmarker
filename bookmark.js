ext.bookmarker	=	{
	get_content_type: function(url, finishcb)
	{
		if(url.match(/^https?:/))
		{
			var xhr	=	new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange	=	function()
			{
				if(xhr.readyState == 4)
				{
					var content_type = xhr.getResponseHeader('Content-Type');
					finishcb(content_type);
				}
			}
			xhr.send();
		}
		else if(url.match(/^file:/))
		{
			var type	=	'text/html';
			if(url.match(/\.(jpe?g|gif|png|bmp)$/))
			{
				type	=	'image/'+url.replace(/^.*\.(jpe?g|gif|png|bmp)$/, '$1');
			}
			(function() { finishcb(type); }).delay(0, this);
		}
		else
		{
			(function() { finishcb('text/html'); }).delay(0, this);
		}
	},

	scrape: function(options)
	{
		options || (options = {});

		var tab		=	null;
		var type	=	'';
		var do_bookmark	=	function(data)
		{
			var text	=	'';
			if(data.image && data.image != '')
			{
				text	+=	'![image]('+data.image+')  \n';
			}
			else if(data.desc)
			{
				text	+=	data.desc;
			}
			var linkdata	=	{
				title: type == 'image' ? '' : tab.title,
				url: tab.url,
				type: type,
				text: text
			};

			if(options.complete) options.complete(linkdata);
		};

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			tab	=	tabs[0];
			if(tab.url.match(/^chrome/))
			{
				type	=	'link';
				do_bookmark({image: false});
			}
			else
			{
				ext.bookmarker.get_content_type(tab.url, function(content_type) {
					type	=	content_type.match(/^image/) ? 'image' : 'link';
					if(type == 'image')
					{
						do_bookmark({});
					}
					else
					{
						console.log('port: send');
						var port	=	chrome.tabs.connect(tabs[0].id, {name: 'bookmarker'});
						port.postMessage({cmd: 'bookmark'})
						port.onMessage.addListener(function(response) {
							console.log('port: recv');
							if(response.type != 'bookmark-scrape') return false;
							setTimeout(function() { do_bookmark(response.data); }, 0);
						});
					}
				});
			}
		});
	}
};

