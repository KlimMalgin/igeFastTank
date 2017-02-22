var ClientTankNetworkEvents = {

    /**
     * Is called when a network packet with the "playerEntity" command
     * is received by the client from the server. This is the server telling
     * us which entity is our player entity so that we can track it with
     * the main camera!
     * @param data The data object that contains any data sent from the server.
     * @private
     */
    _onPlayerEntity: function (data) {
        var entityId = data.entityId,
            clientId = data.clientId,
            login = 'Bot';

        if (localStorage) {
            login = localStorage.getItem('tankigo::login') || login;
        }

        if (ige.$(entityId)) {
            // Add the player control component
            ige.$(entityId)
                .setUnitName(login)
                .addComponent(UnitKeyboardControl)
                .drawBounds(false);

            ige.$(entityId).clientId = clientId;

            console.log('CREATE PLAYER %o %o', entityId, ige.$(entityId));

            // Track our player with the camera
            ige.client.renderer.viewport.camera.trackTranslate(ige.$(entityId), 30);
        } else {
            // The client has not yet received the entity via the network
            // stream so lets ask the stream to tell us when it creates a
            // new entity and then check if that entity is the one we
            // should be tracking!
            var self = this;
            self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
                if (entity.id() === entityId) {
                    // Add the player control component
                    ige.$(entityId)
                        .setUnitName(login)
                        .addComponent(UnitKeyboardControl)
                        .drawBounds(false);

                    ige.$(entityId).clientId = clientId;

                    console.log('CREATE PLAYER %o %o', entityId, ige.$(entityId));

                    // Tell the camera to track out player entity
                    ige.client.renderer.viewport.camera.trackTranslate(ige.$(entityId), 30);

                    // Turn off the listener for this event now that we
                    // have found and started tracking our player entity
                    ige.network.stream.off('entityCreated', self._eventListener, function (result) {
                        if (!result) {
                            this.log('Could not disable event listener!', 'warning');
                        }
                    });
                }
            });
        }
    },

    _onPlayerFired: function (data, clientId) {
        if (ige.$(data)) {

            // Add the player control component
            //ige.$(data).addComponent(UnitKeyboardControl);

            console.log('[Патрон существует] ', data);
            ige.$(data).drawBounds(false);

            // Track our player with the camera
            //ige.client.renderer.viewport.camera.trackTranslate(ige.$(data), 50);
        } else {
            // The client has not yet received the entity via the network
            // stream so lets ask the stream to tell us when it creates a
            // new entity and then check if that entity is the one we
            // should be tracking!
            var self = this;


            self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
                if (entity.id() === data) {
                    // Add the player control component
                    //ige.$(data).addComponent(UnitKeyboardControl);
                    console.log('[Патрон создан] ', data);
                    ige.$(data).drawBounds(false);

                    // Tell the camera to track out player entity
                    //ige.client.renderer.viewport.camera.trackTranslate(ige.$(data), 50);

                    // Turn off the listener for this event now that we
                    // have found and started tracking our player entity
                    ige.network.stream.off('entityCreated', self._eventListener, function (result) {
                        if (!result) {
                            this.log('Could not disable event listener!', 'warning');
                        }
                    });
                }
            });
        }
    },

    _onPlayerDestroy: function () {

    },

    _onPlayerDestroyProcess: function (data) {
        var entityId = data.entityId,
            clientId = data.clientId;

        var player = ige.$(entityId);
        if (player) {
            player._destroyed = true;
            player.velocityTo(0, 0, 0);
            player.runAnimation('bang');
        }
    },

    _onBulletDestroyProcess: function (data) {
        var bullet = ige.$(data);
        if (bullet) {
            bullet.velocityTo(0, 0, 0);
            bullet.runAnimation('bang');
        } else {
            ige.client.bulletsForDestroy[data] = data;
        }
    }

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientTankNetworkEvents; }
