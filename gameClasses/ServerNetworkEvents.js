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
        ige.server.connections[socket.id] = socket;
        ige.server.connectionsCount++;

        console.log("Подключился клиент ", socket.id, " соединений: ", ige.server.connectionsCount);

        if (ige.server.connectionsCount == 1) {
            RespawnHelpers.startAllRespawns();
        }

        // Don't reject the client connection
        return false;
    },

    _onPlayerDisconnect: function (clientId) {
        RespawnHelpers.releaseRespawn(clientId);

        if (ige.server.connections[clientId]) {
            delete ige.server.connections[clientId];
            ige.server.connectionsCount--;
            console.log("Отключился клиент ", clientId, " соединений: ", ige.server.connectionsCount);
        }

        if (ige.server.connectionsCount == 0) {
            RespawnHelpers.stopAllRespawns();
        }
    },

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
