var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);
		ige.globalSmoothing(true);

		// Load our textures
		var self = this;

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
			ship: new IgeTexture('./assets/PlayerTexture.js')
		};*/

		//ige.on('texturesLoaded', function () {
			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				debugger;
				if (success) {

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

					// Create the texture maps and load their map data
					self.backgroundLayer1 = new IgeTextureMap()
						.depth(0)
						.tileWidth(40)
						.tileHeight(40)
						.translateTo(0, 0, 0)
						//.drawGrid(10)
						.drawBounds(false)
						.autoSection(20)
						.loadMap(BackgroundLayer1)
						.mount(self.scene1);


					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					/*ige.network.start('http://localhost:2000', function () {
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());

							});

						// Load the base scene data
						ige.addGraph('IgeBaseScene');
					});*/
				}
			});
		//});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
