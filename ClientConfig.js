var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		//'./gameClasses/MyClassFile.js',

        './gameClasses/utils/Keyboard.js',
        './gameClasses/ammo/Bullet.js',
        './gameClasses/ClientNetworkEvents.js',
        './gameClasses/Character.js',
        './gameClasses/PlayerComponent.js',

        './gameClasses/map/MapRenderer.js',
        //'./levels/level1/background.js',

        /* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
