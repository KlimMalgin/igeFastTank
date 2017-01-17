var config = {
	include: [
		//{name: 'MyClassName', path: './gameClasses/MyClassFileName'},
        //{name: 'ExampleEntity', path: './gameClasses/ExampleEntity'},
        {name: 'GameConfig', path: './GameConfig'},
        {name: 'Keyboard', path: './gameClasses/utils/Keyboard'},
        {name: 'CollisionManager', path: './gameClasses/utils/CollisionManager'},
        {name: 'Bullet', path: './gameClasses/ammo/Bullet'},
        {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
        {name: 'Character', path: './gameClasses/Character'},
        {name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},

        // --
        {name: 'level1Data', path: './levels/level1/data'},
        {name: 'Builder', path: './gameClasses/map/Builder'},
        {name: 'MapRenderer', path: './gameClasses/map/MapRenderer'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
