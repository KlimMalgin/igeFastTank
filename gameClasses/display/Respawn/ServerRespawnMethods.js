var ServerRespawnMethods = {

    _createRespawns: function () {
        var respawnsData = ige.server.builderData.respawnsData,
            ln = respawnsData.length,
            resp,
            id;

        console.log('Заданое количество респаунов: ', ln);

        for (var i = 0; i<ln; i++) {
            resp = new Respawn(respawnsData[i]);
            id = resp.id();

            // console.log('Resp id: ', id);

            if (!ige.server.respawns[id]) {
                // Сохраняем сущность респауна для последующей работы
                ige.server.respawns[id] = resp;

                resp.streamMode(1);

                // Сохраняем id респайна в данных билдера для отправки клиенту
                respawnsData[i].id = id;
            }
        }

    },

    _onPlayerEnt: function (data, clientId) {

        /*console.log('_onPlayerEntity: ', data, clientId);

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
        }*/
    },


};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerRespawnMethods; }
