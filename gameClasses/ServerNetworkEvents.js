var ServerNetworkEvents = {

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
        if (!ige.server.players[clientId]) {
            ige.server.players[clientId] = new Character(clientId)

            ige.server.players[clientId]
                .scale().x(0.6).y(0.6)
                .translateTo(150, 150, 0)
                .box2dBody({
                    type: 'dynamic',
                    linearDamping: 1.0,
                    angularDamping: 1.0,
                    allowSleep: false,
                    bullet: false,
                    gravitic: false,
                    fixedRotation: false,
                    fixtures: [{
                        density: 1.0,
                        friction: 0,
                        restitution: 1.0,
                        //shape: 'polygon',
                        shape: {
                            type: 'polygon',
                            data: new IgePoly2d()
                                .addPoint(-0.9, -0.9)
                                .addPoint(0.9, -0.9)
                                .addPoint(0.9, 0.9)
                                .addPoint(-0.9, 0.9)
                        }
                    }]
                });

            ige.server.players[clientId]
                .addComponent(PlayerComponent)
                .streamMode(1)
                .mount(ige.server.renderer.gameScene);

            // Tell the client to track their player entity
            ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
