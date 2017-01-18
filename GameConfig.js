var GameConfig = {
    tileSize: 84,
    scaleRate: 0.6,

    setting: {

        setTileSize: function (tileSize) {
            GameConfig.tileSize = tileSize;
        }

    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameConfig; }
