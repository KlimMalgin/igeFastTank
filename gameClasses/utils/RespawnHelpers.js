/**
 * Вспомогательные методы для работы с респаунами
 */
var RespawnHelpers = {

    /**
     * Переберет все существующие респауны и для каждого вызовет callback
     * @param  {Function} callback Коллбек для работы с текущим респауном
     *                             - respawn - сущность респауна как параметр для коллбека
     * @param  {Object}   ctx      Контекст коллбека
     */
    each: function (callback, ctx) {
        var respawns = ige.server.respawns;
        ctx = ctx || {};

        for (var key in respawns) {
            if (!respawns.hasOwnProperty(key)) continue;
            if (!callback.call(ctx, respawns[key])) { break; }
        }
    },

    /**
     * Найдет респаун к которому прикреплен клиент с clientId и освободит его от клиента
     * @param  {String} clientId Идентификатор клиента, которого нкжно убрать с респауна
     */
    releaseRespawn: function (clientId) {
        if (ige.server.players[clientId]) {
            RespawnHelpers.each(function (respawn) {
                if (respawn.getClientId() == clientId) {
                    respawn.removeClient();
                    return false;
                }
                return true;
            });

            // Remove the reference to the player entity
            // so that we don't leak memory
            delete ige.server.players[clientId];
        }
    }

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = RespawnHelpers; }

