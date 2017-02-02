/**
 * Класс отвечает за подготовку данных об уровне к отправке клиенту.
 * Когда клиент подключается к серверу - сервер отправляет этому клиенту
 * параметры игрового поля и уровня, которые заранее были подготовлены классом Builder
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
         * Вычисляем недостающие данные
         */
        this.config();

        /**
         * Массив с данными о ландшафте
         * @type {Array}
         */
        this.surface = [];

        /**
         * Массив с данными о респаунах
         * @type {Array}
         */
        this.respawnsData = [];

        /**
         * Массив с координатами статических объектов на карте
         * @type {Array}
         */
        this.staticItems = [
            /*
             * Пример объекта с координатами
             *
            {
                x: 5,
                y: 8
            }*/
        ];

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
     * Некоторые поля в данных об уровне нужно вычислять.
     * Делаем это тут
     */
    config: function () {
        this.levelData.tileSize = GameConfig.tileSize;
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
            width: this.levelData.width * this.levelData.tileSize * GameConfig.scaleRate,
            height: this.levelData.height * this.levelData.tileSize * GameConfig.scaleRate
        };
    },

    build: function () {
        var levelData = this.levelData,
            width = levelData.width,
            height = levelData.height,
            tileSize = levelData.tileSize * GameConfig.scaleRate,
            spriteHash = levelData.spriteHash,
            map = levelData.map;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (!this.surface[y]) {
                    this.surface.push([]);
                }

                if (map[y] && map[y][x]) {
                    // Сохраняем информацию о поверхности карты для текущих координат
                    if (map[y][x].surface) {
                        this.surface[y].push(spriteHash[map[y][x].surface]);
                    }

                    // Сохраняем информацию о статическом объекте для текущих координат
                    if (map[y][x].static) {
                        this.staticItems.push({
                            x: x * tileSize + tileSize / 2,
                            y: y * tileSize + tileSize / 2
                        });
                    }

                    // Сохраняем информацию о респауне в текущей клетке
                    if (map[y][x].respawn) {
                        this.respawnsData.push({
                            x: x * tileSize + tileSize / 2,
                            y: y * tileSize + tileSize / 2,
                            respawnData: map[y][x].respawn
                        });
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
