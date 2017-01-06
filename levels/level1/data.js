var levelData = {

    width: 15,
    height: 10,
    tileSize: 60,
    spriteHash: {
        ground: [0, 1],
        wall: [0, 7]
    },
    map: [
        [
            {
                surface: ''
            }
        ]
    ]

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
    module.exports = levelData;
}
