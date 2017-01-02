var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		//'./gameClasses/MyClassFile.js',

        './gameClasses/ClientNetworkEvents.js',
        './gameClasses/ExampleEntity.js',
        './maps/level1/background.js',

        /* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
