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

    createMapBorders: function (width, height) {
        console.log('width, height : ', width, height);

        // top border
        _wallCreator(width, 20, width / 2, -10).mount(this.gameScene);
        // bottom border
        _wallCreator(width, 20, width / 2, height + 10).mount(this.gameScene);
        // left border
        _wallCreator(20, height, -10, height / 2).mount(this.gameScene);
        // right border
        _wallCreator(20, height, width + 10, height / 2).mount(this.gameScene);


        return this;
    }

});

function _wallCreator(width, height, x, y) {
    return new IgeEntityBox2d()
        .translateTo(x, y, 0)
        .width(width)
        .height(height)
        .drawBounds(false)
        .box2dBody({
            type: 'static',
            allowSleep: true,
            fixtures: [{
                shape: {
                    type: 'rectangle'
                }
            }]
        })
        .depth(10);
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MapRenderer; }
