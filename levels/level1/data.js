var level1Data = {

    width: 15,
    height: 15,
    // Перенесен в config
    // tileSize: 84,
    spriteHash: {
        ground: [0, 1],
        wall: [0, 32]
    },
    teams: [
        {
            teamId: 0,
            teamName: 'Some one'
        },
        {
            teamId: 1,
            teamName: 'Some two'
        },
    ],
    map: [
        [
            {
                surface: 'ground',
                respawn: {
                    teamId: 0
                }
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
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
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
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
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
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
            },
        ],
        [
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
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
                surface: 'wall',
                static: true
            },
        ],
        [
            {
                surface: 'ground',
                respawn: {
                    teamId: 0
                }
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground'
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'wall',
                static: true
            },
            {
                surface: 'ground',
                respawn: {
                    teamId: 0
                }
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
                surface: 'wall',
                static: true
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
                surface: 'ground'
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
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground',
                respawn: {
                    teamId: 1
                }
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
                surface: 'ground',
                respawn: {
                    teamId: 1
                }
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
                surface: 'ground'
            },
            {
                surface: 'ground',
                respawn: {
                    teamId: 1
                }
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground',
                respawn: {
                    teamId: 1
                }
            },
            {
                surface: 'ground'
            },
            {
                surface: 'ground',
                respawn: {
                    teamId: 1
                }
            },
        ]
    ]

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
    module.exports = level1Data;
}
