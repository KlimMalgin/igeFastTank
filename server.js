var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);
		ige.debugEnabled(false)

		this.collisions = new CollisionManager();

		// Define an object to hold references to our player entities
		this.players = {};

		// Объект со ссылками на сущьности снарядов
		this.bullets = {};

		this.buildings = {};

		this.builderData = new Builder(level1Data);

		// Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);

		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.gravity(0, 0)
			.box2d.createWorld()
			.box2d.start();

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {

						ige.network.define('playerEntity', self._onPlayerEntity);
						ige.network.define('playerFired', self._onPlayerFired);

						ige.network.define('bulletDestroy', self._onBulletDestroy);
						ige.network.define('bulletDestroyProcess', self._onBulletDestroyProcess);

						ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
						ige.network.define('playerControlRightDown', self._onPlayerRightDown);
						ige.network.define('playerControlUpDown', self._onPlayerUpDown);
						ige.network.define('playerControlDownDown', self._onPlayerDownDown);

						ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
						ige.network.define('playerControlRightUp', self._onPlayerRightUp);
						ige.network.define('playerControlUpUp', self._onPlayerUpUp);
						ige.network.define('playerControlDownUp', self._onPlayerDownUp);

						ige.network.define('levelData', function (data, clientId, requestId) {
							ige.network.response(requestId, {
								level: self.builderData.getSurface(),
								params: self.builderData.params(),
								staticItems: self.builderData.staticItems
							});
						});

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js


						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						self.renderer = new MapRenderer()
							.createScenes()
							.createViewport()
							.createMapBorders(self.builderData.params().width, self.builderData.params().height)
							.createStaticItems(self.builderData.staticItems);

						self.collisions.listen();

					}
				});
			});
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
