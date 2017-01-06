var config = {
	include: [
		//{name: 'MyClassName', path: './gameClasses/MyClassFileName'},
        //{name: 'ExampleEntity', path: './gameClasses/ExampleEntity'},
        {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
        {name: 'Character', path: './gameClasses/Character'},
        {name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},

        // --
        {name: 'level1Data', path: './levels/level1/data'},
        {name: 'Builder', path: './levels/Builder/Builder'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
