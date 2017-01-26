var ClientNetworkEvents = {

    /**
     * Is called when a network packet with the "playerEntity" command
     * is received by the client from the server. This is the server telling
     * us which entity is our player entity so that we can track it with
     * the main camera!
     * @param data The data object that contains any data sent from the server.
     * @private
     */
    _onPlayerEntity: function (data) {
        if (ige.$(data)) {
            // Add the player control component
            ige.$(data)
                .addComponent(PlayerComponent)
                .drawBounds(false);

            console.log('CREATE PLAYER %o %o', data, ige.$(data));

            //console.log('Сущность с id %o СУЩЕСТВУЕТ // Направление %o', data, ige.$(data)._lastDirection);

            // Track our player with the camera
            ige.client.renderer.viewport.camera.trackTranslate(ige.$(data), 50);
        } else {
            // The client has not yet received the entity via the network
            // stream so lets ask the stream to tell us when it creates a
            // new entity and then check if that entity is the one we
            // should be tracking!
            var self = this;
            self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
                if (entity.id() === data) {
                    // Add the player control component
                    ige.$(data)
                        .addComponent(PlayerComponent)
                        .drawBounds(false);

                    console.log('CREATE PLAYER %o %o', data, ige.$(data));

                    //console.log('Сущность с id %o СОЗДАНА // Направление %o', data, ige.$(data)._lastDirection);

                    // Tell the camera to track out player entity
                    ige.client.renderer.viewport.camera.trackTranslate(ige.$(data), 50);

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
        //console.log('>>>> Создаем патрон!!! <<<< %o %o', data, clientId);
        if (ige.$(data)) {

            //console.log('>>>> Сущность получена ige.$(data) IS TRUE');
            // Add the player control component
            //ige.$(data).addComponent(PlayerComponent);

            ige.$(data).drawBounds(false);

            // Track our player with the camera
            //ige.client.renderer.viewport.camera.trackTranslate(ige.$(data), 50);
        } else {
            // The client has not yet received the entity via the network
            // stream so lets ask the stream to tell us when it creates a
            // new entity and then check if that entity is the one we
            // should be tracking!
            var self = this;

            ////console.log('>>>> Сущность НЕ получена. Создаем слушателя для отложенного создания');

            self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
                //console.log('>>>> Отработал слушатель отложенного создания');
                if (entity.id() === data) {
                    //console.log('>>>> Идентификаторы совпадают');
                    // Add the player control component
                    //ige.$(data).addComponent(PlayerComponent);

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
        var player = ige.$(data);
        if (player) {
            console.log('onPlayerDestroyProcess на Клиенте! ', arguments, player);
            player._destroyed = true;
            player.velocityTo(0, 0, 0);
            player.runAnimation('bang');
        }
    },

    _onBulletDestroyProcess: function (data) {
        console.log('onBulletDestroyProcess на Клиенте! ', arguments);
        var bullet = ige.$(data);
        if (bullet) {
            bullet.velocityTo(0, 0, 0);
            bullet.runAnimation('bang');
        }
    }

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
