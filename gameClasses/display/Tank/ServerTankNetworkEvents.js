var ServerTankNetworkEvents = {

    /**
     * Is called when the network tells us a new client has connected
     * to the server. This is the point we can return true to reject
     * the client connection if we wanted to.
     * @param data The data object that contains any data sent from the client.
     * @param clientId The client id of the client that sent the message.
     * @private
     */
    _onPlayerConnect: function (socket) {
        // Don't reject the client connection
        return false;
    },

    _onPlayerDisconnect: function (clientId) {
        if (ige.server.players[clientId]) {
            // Remove the player from the game
            ige.server.players[clientId].destroy();

            // Remove the reference to the player entity
            // so that we don't leak memory
            delete ige.server.players[clientId];
        }
    },

    _onPlayerEntity: function (data, clientId) {

        console.log('_onPlayerEntity: ', data, clientId);

        if (!ige.server.players[clientId]) {
            var unitSize = GameConfig.tileSize * GameConfig.scaleRate;

            ige.server.players[clientId] = new Tank(clientId);

            console.log('CREATE PLAYER ', clientId, ige.server.players[clientId].id());

            //ige.server.players[clientId].box2dNoDebug(true);
            ige.server.players[clientId]
                .scale()
                .x(GameConfig.scaleRate)
                .y(GameConfig.scaleRate)
                .translateTo(unitSize / 2, unitSize / 2, 0)
                .drawBounds(false)
                //.bounds2d(84, 84)
                .box2dBody({
                    type: 'dynamic',
                    linearDamping: 0.0,
                    angularDamping: 0.1,
                    allowSleep: true,
                    bullet: true,
                    gravitic: true,
                    fixedRotation: true,
                    fixtures: [{
                        density: 0.3,
                        friction: 0.0,
                        restitution: 0.2,
                        shape: {
                            type: 'polygon',
                            data: new IgePoly2d()
                                .addPoint(-1.1 * GameConfig.scaleRate, -1.3 * GameConfig.scaleRate)
                                .addPoint(1.1 * GameConfig.scaleRate, -1.3 * GameConfig.scaleRate)
                                .addPoint(1.1 * GameConfig.scaleRate, 1.2 * GameConfig.scaleRate)
                                .addPoint(-1.1 * GameConfig.scaleRate, 1.2 * GameConfig.scaleRate)
                        }
                    }]
                });

            ige.server.players[clientId]
                .addComponent(UnitKeyboardControl)
                .streamMode(1)
                .mount(ige.server.renderer.gameScene);

            // Tell the client to track their player entity
            ige.network.send('playerEntity', {
                entityId: ige.server.players[clientId].id(),
                clientId: clientId
            }, clientId);
        }
    },

    _onPlayerFired: function (data, clientId) {
        var bullet = new Bullet(),
            bulletId = bullet.id();

        bullet.setParentId(data.parentId);
        ige.server.bullets[bulletId] = bullet;

        ige.server.bullets[bulletId].box2dNoDebug(true);
        ige.server.bullets[bulletId]
            .setDirection(data.direction)
            .scale()
            .x(GameConfig.scaleRate)
            .y(GameConfig.scaleRate)
            .translateTo(data.position.x, data.position.y, 0)
            .drawBounds(false)
            .box2dBody({
                type: 'dynamic',
                linearDamping: 0.0,
                angularDamping: 0.1,
                allowSleep: true,
                bullet: true,
                gravitic: true,
                fixedRotation: true,
                fixtures: [{
                    density: 0.5,
                    friction: 0,
                    restitution: 0.2,
                    shape: {
                        type: 'polygon',
                        data: new IgePoly2d()
                            .addPoint(-0.1 * GameConfig.scaleRate, -0.1 * GameConfig.scaleRate)
                            .addPoint(0.1 * GameConfig.scaleRate, -0.1 * GameConfig.scaleRate)
                            .addPoint(0.1 * GameConfig.scaleRate, 0.1 * GameConfig.scaleRate)
                            .addPoint(-0.1 * GameConfig.scaleRate, 0.1 * GameConfig.scaleRate)
                    }
                }]
            })
            .streamMode(1)
            .mount(ige.server.renderer.gameScene);

        // Tell the client to track bullet entity
        ige.network.send('playerFired', bulletId, clientId);
    },

    _onPlayerDestroy: function (data, sClientId) {
        var entityId = data.entityId,
            clientId = data.clientId,
            player = ige.server.players[clientId];

        console.log('>>>> Уничтожаем танк ', clientId);
        if (player && player.id() == entityId) {
            console.log('>>>> Танк существует. Вызываем destroy ', clientId);
            player.destroy();
            delete player;
        }
    },

    /**
     * Действия, реализующие визуальный процесс уничтожения юнита (остановка, визуализация взрыва и пр)
     * @param  {Object} data      Набор данных о юните
     *                            - entityId Идентификатор сущности юнита  игрока
     *                            - clientId Идентификатор клиента, уничтожаемого игрока
     * @param  {String} sClientId Идентификатор клиента
     */
    _onPlayerDestroyProcess: function (data, sClientId) {
        var entityId = data.entityId,
            clientId = data.clientId,
            player = ige.server.players[clientId];

        if (player && player.id() == entityId) {
            _allArrowsUp(clientId);
        }
    },

    _onBulletDestroy: function (bulletId) {
        console.log('>>>> Уничтожаем патрон ', bulletId);
        if (ige.server.bullets[bulletId]) {
            ige.server.bullets[bulletId].destroy();
            delete ige.server.bullets[bulletId];
        }
    },

    _onBulletDestroyProcess: function () {
        //console.log('onBulletDestroyProcess');
        if (ige.server.bullets[bulletId]) {
            //console.log('::STOP:: onBulletDestroyProcess');
            ige.server.bullets[bulletId].setDirection('stop');
        }
    },

    _onPlayerLeftDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.left = true;
        ige.server.players[clientId]._lastDirection = 'left';
    },

    _onPlayerLeftUp: function (data, clientId) {
        ige.server.players[clientId].playerControl.controls.left = false;
    },

    _onPlayerRightDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.right = true;
        ige.server.players[clientId]._lastDirection = 'right';
    },

    _onPlayerRightUp: function (data, clientId) {
        ige.server.players[clientId].playerControl.controls.right = false;
    },

    _onPlayerUpDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.up = true;
        ige.server.players[clientId]._lastDirection = 'up';
    },

    _onPlayerUpUp: function (data, clientId) {
        ige.server.players[clientId].playerControl.controls.up = false;
    },

    _onPlayerDownDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.down = true;
        ige.server.players[clientId]._lastDirection = 'down';
    },

    _onPlayerDownUp: function (data, clientId) {
        ige.server.players[clientId].playerControl.controls.down = false;
    }

};

    function _allArrowsUp (clientId) {
        ige.server.players[clientId].playerControl.controls.left = false;
        ige.server.players[clientId].playerControl.controls.right = false;
        ige.server.players[clientId].playerControl.controls.up = false;
        ige.server.players[clientId].playerControl.controls.down = false;
    }


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerTankNetworkEvents; }