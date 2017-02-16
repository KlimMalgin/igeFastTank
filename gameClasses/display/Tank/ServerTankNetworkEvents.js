var ServerTankNetworkEvents = {

    _onPlayerEntity: function (data, clientId) {
        var respawns = ige.server.respawns;

        // Обходим респауны в поисках свободного и на свободном размещаем клиента
        for (var key in respawns) {
            if (!respawns.hasOwnProperty(key)) continue;

            if (!respawns[key].getClientId()) {
                respawns[key].setClient(clientId);
                break;
            }

            console.log('Нужна обработка случая, когда свободных респаунов не оказалось.');
        }
    },

    _onPlayerFired: function (data, clientId) {
        var bullet = new Bullet(),
            bulletId = bullet.id();

        bullet.setParentId(data.parentId);
        bullet.setTeamId(data.teamId);

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
        //ige.network.send('playerFired', bulletId, clientId);
    },

    _onPlayerDestroy: function (data, sClientId) {
        var entityId = data.entityId,
            clientId = data.clientId,
            entity = ige.$(entityId);

        // Возможно этот destroy не актуален, т.к. уничтожение происходит на респауне
        if (entity && entity.id() == entityId) {
            entity.destroy();
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
        if (ige.server.bullets[bulletId]) {
            ige.server.bullets[bulletId].destroy();
            delete ige.server.bullets[bulletId];
        }
    },

    _onBulletDestroyProcess: function () {
        if (ige.server.bullets[bulletId]) {
            ige.server.bullets[bulletId].setDirection('stop');
        }
    },

    _onPlayerLeftDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.left = true;
        ige.server.players[clientId]._lastDirection = 'left';
    },

    _onPlayerLeftUp: function (data, clientId) {
        disableBotMode(clientId);
        ige.server.players[clientId].playerControl.controls.left = false;
    },

    _onPlayerRightDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.right = true;
        ige.server.players[clientId]._lastDirection = 'right';
    },

    _onPlayerRightUp: function (data, clientId) {
        disableBotMode(clientId);
        ige.server.players[clientId].playerControl.controls.right = false;
    },

    _onPlayerUpDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.up = true;
        ige.server.players[clientId]._lastDirection = 'up';
    },

    _onPlayerUpUp: function (data, clientId) {
        disableBotMode(clientId);
        ige.server.players[clientId].playerControl.controls.up = false;
    },

    _onPlayerDownDown: function (data, clientId) {
        _allArrowsUp(clientId);
        ige.server.players[clientId].playerControl.controls.down = true;
        ige.server.players[clientId]._lastDirection = 'down';
    },

    _onPlayerDownUp: function (data, clientId) {
        disableBotMode(clientId);
        ige.server.players[clientId].playerControl.controls.down = false;
    }

};

    function _allArrowsUp (clientId) {
        ige.server.players[clientId].playerControl.controls.left = false;
        ige.server.players[clientId].playerControl.controls.right = false;
        ige.server.players[clientId].playerControl.controls.up = false;
        ige.server.players[clientId].playerControl.controls.down = false;
    }

    function disableBotMode (clientId) {
        clearInterval(ige.server.players[clientId].playerControl.directionInterval);
        clearInterval(ige.server.players[clientId].playerControl.fireInterval);
    }


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerTankNetworkEvents; }
