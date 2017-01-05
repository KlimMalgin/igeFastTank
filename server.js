var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);

		// Define an object to hold references to our player entities
		this.players = {};

		this.buildings = {};

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

						ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
						ige.network.define('playerControlRightDown', self._onPlayerRightDown);
						ige.network.define('playerControlUpDown', self._onPlayerUpDown);
						ige.network.define('playerControlDownDown', self._onPlayerDownDown);

						ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
						ige.network.define('playerControlRightUp', self._onPlayerRightUp);
						ige.network.define('playerControlUpUp', self._onPlayerUpUp);
						ige.network.define('playerControlDownUp', self._onPlayerDownUp);

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js


						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						// Create the scene
						self.scene1 = new IgeScene2d()
							.id('scene1');

						// Create the main viewport
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.scene1)
							.drawBounds(true)
							.mount(ige);


						var wall = new IgeEntityBox2d()
				            .translateTo(20, 50, 0)
				            .width(880)
				            .height(20)
				            .drawBounds(false)
				            .mount(self.scene1)
				            .box2dBody({
				                type: 'static',
				                allowSleep: true,
				                fixtures: [{
				                    shape: {
				                        type: 'rectangle'
				                    }
				                }]
				            })
				            .depth(10);

						/*ige.box2d.contactListener(
							// Listen for when contact's begin
							function (contact) {
								console.log('Contact begins between', contact.igeEntityA()._id, 'and', contact.igeEntityB()._id);
								//ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
							},
							// Listen for when contact's end
							function (contact) {
								console.log('Contact ends between', contact.igeEntityA()._id, 'and', contact.igeEntityB()._id);
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
						);*/


					}
				});
			});
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
