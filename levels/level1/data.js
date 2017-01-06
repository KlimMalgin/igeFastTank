var level1Data = {

    width: 10,
    height: 6,
    tileSize: 60,
    spriteHash: {
        ground: [0, 1],
        wall: [0, 29]
    },
    map: [
        [
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'ground'
            },
        ],
        [
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'ground'
            },
        ],
        [
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall'
            },
            {
                surface: 'ground'
            },
        ]
    ]

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
    module.exports = level1Data;
}
