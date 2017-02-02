var igeClientConfig = {
    include: [
        /* Your custom game JS scripts */
        //'./gameClasses/MyClassFile.js',

        './GameConfig.js',
        './gameClasses/utils/Keyboard.js',
        './gameClasses/utils/CollisionManager.js',
        './gameClasses/ammo/Bullet.js',
        './gameClasses/ClientNetworkEvents.js',

        // Unit Tank
        './gameClasses/display/Tank/Tank.js',
        './gameClasses/display/Tank/UnitKeyboardControl.js',
        './gameClasses/display/Tank/ClientTankNetworkEvents.js',

        // Respawn
        './gameClasses/display/Respawn/Respawn.js',

        './gameClasses/map/MapRenderer.js',
        //'./levels/level1/background.js',

        /* Standard game scripts */
        './client.js',
        './index.js'
    ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
