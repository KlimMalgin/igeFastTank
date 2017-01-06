var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);
		ige.globalSmoothing(true);

		// Load our textures
		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Enable networking
		//ige.addComponent(IgeNetIoComponent);

		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.gravity(0, 0)
			.box2d.createWorld()
			.box2d.start();


		// Load the textures we want to use
		/*this.textures = {
			ship: new IgeTexture('./assets/PlayerTexture.js'),
			bg: new IgeCellSheet('./assets/tanks.transparent.png', 8, 4)
		};*/

		//ige.on('texturesLoaded', function () {
			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {

					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://localhost:2000', function () {
						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js

						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());
							});

						// Create the scene
						self.scene1 = new IgeScene2d()
							.id('scene1');

						// Create the main viewport
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.scene1)
							.drawBounds(false)
							.mount(ige);

						// Create the texture maps and load their map data
						self.surface = new IgeTextureMap()
							.depth(0)
							.tileWidth(60)
							.tileHeight(60)
							.translateTo(0, 0, 0)
							.drawBounds(false)
							.autoSection(20)
							//.loadMap(BackgroundLayer1)
							.mount(self.scene1);

						var wall = new IgeEntityBox2d()
				            .translateTo(20, 50, 0)
				            .width(880)
				            .height(20)
				            .drawBounds(true)
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


						// Ask the server to send us the tile data
						ige.network.request('levelData', {}, function (commandName, data) {
							console.log(' >>> levelData response :: ', data);

							// Paint the texture map based on the data sent from the server
							/*var x, y, tileData;
							for (x = 0; x < data.length; x++) {
								for (y = 0; y < data[x].length; y++) {
									tileData = data[x][y];
									self.surface.paintTile(x, y, tileData[0], tileData[1]);
								}
							}*/

							self.surface.loadMap(data);

							// Now set the texture map's cache data to dirty so it will
							// be redrawn
							self.surface.cacheDirty(true);
						});


						// We don't create any entities here because in this example the entities
						// are created server-side and then streamed to the clients. If an entity
						// is streamed to a client and the client doesn't have the entity in
						// memory, the entity is automatically created. Woohoo!

						// Ask the server to create an entity for us
						ige.network.send('playerEntity');

						// Add the box2d debug painter entity to the
						// scene to show the box2d body outlines
						ige.box2d.enableDebug(self.scene1);

					});

				}
			});
		//});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
