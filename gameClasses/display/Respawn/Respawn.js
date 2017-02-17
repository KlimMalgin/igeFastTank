
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

        /**
         * Объект с информацией о destroy-обработчике
         * @type {Object}
         */
        this._destroyListenerData = null;

        /**
         * Идентификатор последнего таймаута на создание юнита
         * @type {Number}
         */
        this._respawnTimeoutId = null;


        if (ige.isServer) {
            console.log('Данные для респауна: ', data);

            this.streamMode(1)
                .scale()
                .x(GameConfig.scaleRate)
                .y(GameConfig.scaleRate)
                .mount(ige.server.renderer.gameScene)
                .translateTo(data.x, data.y, 0);

            //this._respawnUnit(data);
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

    startRespawn: function () {
        this._respawnUnit(this._respawnInitData);
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
            createdUnit = null,
            createTimeout = 3000,
            creator = function () {
                createdUnit = self._createUnit(data, clientId);
                self._destroyListenerData = createdUnit.on('destroy', function () {
                    self.unitInfo.killed++;
                    self._respawnUnit(data, clientId);
                });
            };

            this._respawnTimeoutId = setTimeout(creator, createTimeout);
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
                data = data || {};
                data.clientId = clientId;

                this._refUnit = new Tank(data);

                ige.server.players[clientId] = this._refUnit;

                // Tell the client to track their player entity
                ige.network.send('playerEntity', {
                    entityId: ige.server.players[clientId].id(),
                    clientId: clientId
                }, clientId);

            } else {
                this._refUnit = new Tank(data);
            }

            this._refUnit.setTeamId(data.respawnData.teamId);
        }

        if (ige.isClient) {}

        return this._refUnit;
    },

    /**
     * Установит id клиента текущему респауну
     * @param {String} clientId Идентификатор
     */
    setClient: function (clientId) {
        var data = this._respawnInitData;

        console.log('\nsetClientId: ', clientId);

        this._clientId = clientId;
        this.destroyClientOnRespawn();
        this._respawnUnit(data, clientId);
    },

    removeClient: function () {
        this.destroyClientOnRespawn(this._clientId);
        this._clientId = null;
    },

    /**
     * Вернет идентификатор клиента, связанного с респауном
     * @return {String} Идентификатор
     */
    getClientId: function () {
        return this._clientId;
    },

    destroyClientOnRespawn: function (clientId) {
        clearTimeout(this._respawnTimeoutId);

        if (this._refUnit) {
            this._refUnit.off('destroy', this._destroyListenerData);

            this._createUnitInfo();
            this._refUnit.destroy();
            delete this._refUnit;
            delete ige.server.players[clientId];
        }
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Respawn; }

