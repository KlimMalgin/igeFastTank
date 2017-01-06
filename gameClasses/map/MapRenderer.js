/**
 * Класс отвечает за создание box2d-сущностей на карте и рендер игрового поля
 */
var MapRenderer = IgeClass.extend({
    classId: 'MapRenderer',

    //init: function () {},

    /**
     * TODO: Создание сцен и viewport'a имеет смысл вынести в класс Viewport
     */

    createScenes: function () {
        // Create the scene
        this.gameScene = new IgeScene2d()
            .id('gameScene');

        return this;
    },

    createViewport: function () {
        // Create the main viewport
        this.viewport = new IgeViewport()
            .id('viewport')
            .autoSize(true)
            .scene(this.gameScene)
            .drawBounds(true)
            .mount(ige);

        return this;
    },

    // only client
    renderSurface: function () {
        if (ige.isClient) {
            this.surface = new IgeTextureMap()
                .depth(0)
                .tileWidth(60)
                .tileHeight(60)
                .translateTo(0, 0, 0)
                .drawBounds(false)
                .autoSection(20)
                .mount(this.gameScene);
        }

        return this;
    },

    createMapBorders: function () {

    }


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MapRenderer; }
