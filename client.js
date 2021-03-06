var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		ige.timeScale(1);
		//ige.showStats(1);
		ige.globalSmoothing(true);

		//ige.debugEnabled(true);

		localStorage.setItem('tankigo::login', 'klim');

		// Load our textures
		var self = this;

		// TODO: Костыль. Был такой баг: когда юнит стоит вплотную к стене и
		// стреляет - патрон останавливается на месте старта, не двигается и не уничтожается.
		// Это происходит из-за того, что на сервере создан снаряд, сразу после создания происходит коллизия со стеной.
		// Отправляется событие destroyProcess на клиент. Но на клиенте в момент прихода destroyProcess еще не создан
		// снаряд, который нужно уничтожить. Он создается после прихода destroyProcess и подвисает.
		// -----------------
		// Этот объект хранит id сущностей, которые отсутствовали в момент прихода destroyProcess
		// и при создании эти сущности сразу уничтожаются
		this.bulletsForDestroy = {};

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);
		this.implement(ClientTankNetworkEvents);

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
						ige.network.define('playerEntity', self._onPlayerEntity);
						ige.network.define('playerFired', self._onPlayerFired);
						ige.network.define('bulletDestroyProcess', self._onBulletDestroyProcess);

						ige.network.define('playerDestroy', self._onPlayerDestroy);
						ige.network.define('playerDestroyProcess', self._onPlayerDestroyProcess);

						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(100) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								if (entity._type == 'tank') {
									self.log('Stream entity created with ID: ' + entity.id() + ' type: ' + entity._type + ' ' + entity.teamId);
								}

								entity.drawBounds(false);
							});

						self.renderer = new MapRenderer()
							.createScenes()
							.createViewport()
							.renderSurface();

						// Ask the server to send us the level data
						ige.network.request('levelData', {}, function (commandName, data) {
							console.log(' >>> levelData response :: ', data);

							self.renderer.surface.loadMap(data.level);
							self.renderer.createMapBorders(data.params.width, data.params.height);
							self.renderer.createStaticItems(data.staticItems);

							console.log('Respawns data: ', data.respawnsData);

							// Now set the texture map's cache data to dirty so it will
							// be redrawn
							self.renderer.surface.cacheDirty(true);
						});

						// We don't create any entities here because in this example the entities
						// are created server-side and then streamed to the clients. If an entity
						// is streamed to a client and the client doesn't have the entity in
						// memory, the entity is automatically created. Woohoo!

						// Ask the server to create an entity for us
						ige.network.send('playerEntity');

						// Add the box2d debug painter entity to the
						// scene to show the box2d body outlines
						ige.box2d.enableDebug(self.renderer.gameScene);

					});

				}
			});
		//});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
