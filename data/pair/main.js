var app	=	chrome.extension.getBackgroundPage();

function switch_tab(classname)
{
	var main	=	document.getElementById('main');
	if(!main) return false;

	main.className	=	classname;
}

function set_error(msg, code)
{
	var el_code	=	document.getElementById('errcode');
	var el_msg	=	document.getElementById('errmsg');
	if(el_code) el_code.innerHTML = code + '';
	if(el_msg) el_msg.innerHTML = msg;
}

function init()
{
	if(!app.ext.pairing.have_key())
	{
		app.ext.pairing.start();
	}
	else
	{
		switch_tab('load');
		app.ext.pairing.do_bookmark();
	}

	var form	=	document.getElementById('form_code');
	var inp		=	document.getElementById('inp_code');
	if(form && inp)
	{
		var val_set		=	false;
		var onchange	=	function(e)
		{
			setTimeout(function() {
				var val	=	inp.value;
				if(val_set || !val || val == '') return false;
				val_set	=	true;
				app.ext.pairing.set_key(val);
				app.ext.pairing.finish();
			}, 0);
		};

		form.addEventListener('submit', function(e) {
			e.preventDefault();
			e.stopPropagation();

			onchange();
		}, false);
		inp.addEventListener('change', onchange, false);
		inp.addEventListener('paste', onchange, false);
	}
}
init();

