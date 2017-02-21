var config = {
    include: [
        //{name: 'MyClassName', path: './gameClasses/MyClassFileName'},
        //{name: 'ExampleEntity', path: './gameClasses/ExampleEntity'},
        {name: 'GameConfig', path: './GameConfig'},
        {name: 'Keyboard', path: './gameClasses/utils/Keyboard'},
        {name: 'CollisionManager', path: './gameClasses/utils/CollisionManager'},
        {name: 'Bullet', path: './gameClasses/ammo/Bullet'},
        {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},

        // Unit Tank
        {name: 'Tank', path: './gameClasses/display/Tank/Tank'},
        {name: 'UnitKeyboardControl', path: './gameClasses/display/Tank/UnitKeyboardControl'},
        {name: 'ServerTankNetworkEvents', path: './gameClasses/display/Tank/ServerTankNetworkEvents'},

        // Respawn
        {name: 'RespawnHelpers', path: './gameClasses/utils/RespawnHelpers'},
        {name: 'Respawn', path: './gameClasses/display/Respawn/Respawn'},
        {name: 'ServerRespawnMethods', path: './gameClasses/display/Respawn/ServerRespawnMethods'},

        // --
        {name: 'level1Data', path: './levels/level1/generate'},
        {name: 'Builder', path: './gameClasses/map/Builder'},
        {name: 'MapRenderer', path: './gameClasses/map/MapRenderer'}
    ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
