
/**
 * Класс Respawn реализует точку появления и перерождения юнита
 */

var Respawn = IgeEntity.extend({
    classId: 'Respawn',

    init: function (data) {
        IgeEntity.prototype.init.call(this);

        if (ige.isServer) {
            // На сервере создавать карту с данными о респаунах и
            // серверный экземпляр респауна (занимается фиксацией килла и перерождением юнита)
            //
            // Создание респаунов должно происходить подобно тому как происходит создание юнитов на данный момент
            // т.е. создается на сервере и транслируется на клиент

            console.log('Данные для респауна: ', data);
        }

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

        // Load the character texture file
        if (ige.isClient) {
            self.addComponent(IgeAnimationComponent)
                .depth(9);

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
        this.animation.define(respawnAnimationName, [29], 0, -1)
            .cell(29)
            .select(respawnAnimationName);
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Respawn; }

