/**
 * Класс отвечает за построение игрового поля
 */
var Builder = IgeClass.extend({
    classId: 'Builder',

    init: function (levelData) {
        /**
         * Исходные данные для уровня
         * @type {[type]}
         */
        this.levelData = levelData;

        /**
         * Массив с данными о ландшафте
         * @type {Array}
         */
        this.surface = [];

        /**
         * Результат сборки уровня
         * @type {Object}
         */
        this.mapData = {

            data: [],

            //
            // TODO: Унести в конфиг
            //
            textures: ["new IgeCellSheet('./assets/tanks.transparent.png', 8, 4).id('3b9d569741e64a0');"]
        };

        this.defaults();
        this.build();
    },

    /**
     * Создает стандартные значения для разных типов покрытия
     */
    defaults: function () {
        this.default = {
            surface: [0, 1],
            build: null
        };
    },

    /**
     * Вернет параметры текущей карты
     * @return {Object} Объект с параметрами карты
     */
    params: function () {
        //return this.levelData;
        return {
            width: this.levelData.width * this.levelData.tileSize,
            height: this.levelData.height * this.levelData.tileSize
        };
    },

    build: function () {
        var levelData = this.levelData,
            width = levelData.width,
            height = levelData.height,
            tileSize = levelData.tileSize,
            spriteHash = levelData.spriteHash,
            map = levelData.map;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (!this.surface[y]) {
                    this.surface.push([]);
                }

                if (map[y] && map[y][x]) {
                    if (map[y][x].surface) {
                        this.surface[y].push(spriteHash[map[y][x].surface]);
                    }
                } else {
                    this.surface[y].push(this.default.surface);
                }
            }
        }
    },

    getSurface: function () {
        return {
            data: this.surface,
            textures: this.mapData.textures
        };
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Builder; }
