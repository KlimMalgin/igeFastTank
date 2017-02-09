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
        var respawns = ige.server.respawns;

        if (ige.server.players[clientId]) {
            // Remove the player from the game
            ige.server.players[clientId].destroy();

            // Обходим респауны в поисках свободного и на свободном размещаем клиента
            for (var key in respawns) {
                if (!respawns.hasOwnProperty(key)) continue;

                if (respawns[key].getClientId() == clientId) {
                    respawns[key].removeClient();
                    break;
                }
            }

            // Remove the reference to the player entity
            // so that we don't leak memory
            delete ige.server.players[clientId];
        }
    },

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
