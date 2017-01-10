var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);

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

						ige.box2d.contactListener(
							// Listen for when contact's begin
							function (contact) {
								console.log('Contact begins between ', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
								var entityA = contact.igeEntityA(),
									entityB = contact.igeEntityB();

								entityA.onCollision && entityA.onCollision.call(entityA);
								entityB.onCollision && entityB.onCollision.call(entityB);

								//ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
							},
							// Listen for when contact's end
							function (contact) {
								console.log('Contact ends between', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
							},
							// Handle pre-solver events
							function (contact) {
								// For fun, lets allow ball1 and square2 to pass through each other
								if (contact.igeEitherId('ball1') && contact.igeEitherId('square2')) {
									// Cancel the contact
									contact.SetEnabled(false);
								}

								// You can also check an entity by it's category using igeEitherCategory('categoryName')
							}
						);


					}
				});
			});
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
