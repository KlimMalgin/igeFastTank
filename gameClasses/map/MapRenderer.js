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

        // Сцена для статических box2d-объектов
        this.staticScene = new IgeScene2d()
            .id('staticScene');

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
                // TODO: magic numbers
                .tileWidth(84)
                .tileHeight(84)
                .translateTo(0, 0, 0)
                .drawBounds(false)
                .autoSection(20)
                .mount(this.gameScene);
        }

        return this;
    },

    createStaticItems: function (staticItems) {
        var ln = staticItems.length,
            // TODO: magic numbers
            tileSize = 84;

        for (var i = 0; i < ln; i++) {
            _wallCreator(tileSize, tileSize, staticItems[i].x, staticItems[i].y).mount(this.staticScene);
        }

        return this;
    },

    createMapBorders: function (width, height) {
        console.log('width, height : ', width, height);
        // TODO: magic numbers

        // top border
        _wallCreator(width, 84, width / 2, -30).mount(this.gameScene);
        // bottom border
        _wallCreator(width, 84, width / 2, height + 30).mount(this.gameScene);
        // left border
        _wallCreator(84, height, -30, height / 2).mount(this.gameScene);
        // right border
        _wallCreator(84, height, width + 30, height / 2).mount(this.gameScene);


        return this;
    }

});

function _wallCreator(width, height, x, y) {
    return new IgeEntityBox2d()
        .translateTo(x, y, 0)
        //.width(width)
        //.height(height)
        .bounds2d(width, height)
        .drawBounds(true)
        .box2dBody({
            type: 'static',
            allowSleep: true,
            density: 1.0,
            friction: 1.0,
            restitution: 1.0,
            fixtures: [{
                density: 1.0,
                friction: 1.0,
                restitution: 1.0,
                shape: {
                    type: 'rectangle'
                }
            }]
        })
        .depth(10);
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MapRenderer; }
