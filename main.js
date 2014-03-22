/**
 * This is the main extension object. Not only does it hold a number of function
 * and data to make the addon work, it's also the scope the other pieces of the
 * addon load themselves into. This gives the extension a single namespace for
 * all its libraries.
 */
var ext	=	{
	// holds "install" "upgrade" "downgrade" "open"
	load_reason: false,

	/**
	 * Called on extension init. Initializes any listeners for the "clean slate"
	 * addon state.
	 */
	setup: function()
	{
		// if we're not paired with the desktop app, the default panel will be
		// for pairing, otherwise show the "connecting to app" panel
	}
};

ext.setup();

// listen for commands!
chrome.browserAction.onClicked.addListener(function() {
	console.log('SHIIIT');
});

// determine what kind of run we're doing
var cur_version		=	chrome.app.getDetails().version;
if(!localStorage.version)
{
	ext.load_reason	=	'install';
}
else
{
	var last_version	=	localStorage.version;
	var comp			=	compare_versions(cur_version, last_version);
	if(comp > 0) ext.load_reason = 'upgrade';
	if(comp < 0) ext.load_reason = 'downgrade';
	if(comp == 0) ext.load_reason = 'open';
}
console.log('load reason: ', ext.load_reason);
localStorage.version	=	cur_version;

