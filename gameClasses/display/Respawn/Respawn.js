
/**
 * Класс Respawn реализует точку появления и перерождения юнита
 */

var Respawn = IgeEntity.extend({
    classId: 'Respawn',

    init: function (data) {
        var self = this;

        IgeEntity.prototype.init.call(this);

        if (ige.isServer) {
            console.log('Данные для респауна: ', data);

            this.streamMode(1)
                .scale()
                .x(GameConfig.scaleRate)
                .y(GameConfig.scaleRate)
                .mount(ige.server.renderer.gameScene)
                .translateTo(data.x, data.y, 0);

            this._createUnit(data);
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

    _createUnit: function (data) {
        if (ige.isServer) {
            this._refUnit = new Tank(data);
        }

        if (ige.isClient) {}
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Respawn; }

