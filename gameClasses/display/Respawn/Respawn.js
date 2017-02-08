
/**
 * Класс Respawn реализует точку появления и перерождения юнита
 */

var Respawn = IgeEntity.extend({
    classId: 'Respawn',

    init: function (data) {
        var self = this;

        IgeEntity.prototype.init.call(this);

        this._createUnitInfo();

        /**
         * Данные инициализации респауна
         * @type {Object}
         */
        this._respawnInitData = data;

        /**
         * Тип создаваемой сущности
         * @type {String}
         */
        this._type = 'respawn';

        /**
         * Ссылка на юнита, который будет рождаться на текущем респауне
         * @type {Object}
         */
        this._refUnit = null;

        /**
         * Идентификатор клиента, юнит которого рождается на текущем респауне
         * @type {String}
         */
        this._clientId = null;


        if (ige.isServer) {
            console.log('Данные для респауна: ', data);

            this.streamMode(1)
                .scale()
                .x(GameConfig.scaleRate)
                .y(GameConfig.scaleRate)
                .mount(ige.server.renderer.gameScene)
                .translateTo(data.x, data.y, 0);

            this._respawnUnit(data);
        }

        // Load the character texture file
        if (ige.isClient) {
            this.addComponent(IgeAnimationComponent)
                .drawBounds(false)
                .depth(5);

            // TODO: Грузить спрайт единожды при старте клиента!
            this._characterTexture = new IgeCellSheet('./assets/tanks.transparent.png', 8, 4);

            // Wait for the texture to load
            this._characterTexture.on('loaded', function () {
                self.texture(self._characterTexture)
                    .dimensionsFromCell();

                self.setSprite();
            }, false, true);
        }

    },

    setSprite: function () {
        var respawnAnimationName = 'respawn';
        this.animation.define(respawnAnimationName, [29], 0, 0)
            .cell(29);

        this.animation.select(respawnAnimationName);
    },

    /**
     * Создает объект с данными о достижениях юнита
     * @private
     */
    _createUnitInfo: function () {
        this.unitInfo = {
            killed: 0
        };
    },

    /**
     * Инициирует процесс перерождения юнитов на респауне
     * @private
     * @param  {Object} data Набор данных, необходимый для создания юнита.
     * @param  {String} clientId (опционально) Идентификатор подключенного клиента
     */
    _respawnUnit: function (data, clientId) {
        var self = this,
            createdUnit = null;

        createdUnit = this._createUnit(data, clientId);
        createdUnit.on('destroy', function () {
                self.unitInfo.killed++;
                console.log('Respawn ' + self.id() + ' DESTROY EVENT ', self.unitInfo.killed);
                self._respawnUnit(data, clientId);
            });
    },

    /**
     * Создает юнита
     * @private
     * @param  {Object} data Набор данных, необходимый для создания юнита. Обычно это входные данные респауна
     * @param  {String} clientId (опционально) Идентификатор подключенного клиента
     * @return {Object}      Объект юнита
     */
    _createUnit: function (data, clientId) {
        if (ige.isServer) {

            // Если танк создается для игрока
            if (clientId) {
                //if (!ige.server.players[clientId]) {
                    data = data || {};
                    data.clientId = clientId;

                    this._refUnit = new Tank(data);

                    ige.server.players[clientId] = this._refUnit;

                    //console.log('CREATE PLAYER ', clientId, ige.server.players[clientId].id());

                    // Tell the client to track their player entity
                    ige.network.send('playerEntity', {
                        entityId: ige.server.players[clientId].id(),
                        clientId: clientId
                    }, clientId);
                //}

            } else {
                this._refUnit = new Tank(data);
            }

        }

        if (ige.isClient) {}

        return this._refUnit;
    },

    /**
     * Установит id клиента текущему респауну
     * @param {String} clientId Идентификатор
     */
    setClientId: function (clientId) {
        var data = this._respawnInitData,
            listener = null;

        this._clientId = clientId;

        console.log('\nsetClientId: ', clientId);

        if (this._refUnit) {
            console.log('clear this._refUnit\n\n');

            console.log(this._refUnit.eventList()['destroy'][0]);

            // WARN: Лютый хак. Вместо него должен быть сохраненный объект из on (но on ничего не возвращает)
            listener = this._refUnit.eventList()['destroy'][0];

            this._refUnit.off('destroy', listener);
            this._createUnitInfo();
            this._refUnit.destroy();
            delete this._refUnit;
        }

        this._respawnUnit(data, clientId);

        // После связывания клиента с респауном - нужно переродить танк с возможностью управления для игрока
    },

    /**
     * Вернет идентификатор клиента, связанного с респауном
     * @return {String} Идентификатор
     */
    getClientId: function () {
        return this._clientId;
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Respawn; }

