var ServerRespawnMethods = {

    _createRespawns: function () {
        var respawnsData = ige.server.builderData.respawnsData,
            itemSize = GameConfig.tileSize * GameConfig.scaleRate,
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

                // Сохраняем id респайна в данных билдера для отправки клиенту
                respawnsData[i].id = id;
            }
        }

    }

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerRespawnMethods; }
