// Define our player character classes
var Tank = IgeEntityBox2d.extend({
    classId: 'Tank',

    init: function (data) {
        data = data || {};
        var self = this,
            unitSize = GameConfig.tileSize * GameConfig.scaleRate,
            coordX = data.x || unitSize / 2,
            coordY = data.y || unitSize / 2;

        IgeEntityBox2d.prototype.init.call(this);

        this.clientId = data.clientId || null;
        this._run = 0;
        this._type = 'tank';
        this._destroyed = false;
        this._lastDirection = 'up';
        this.__tempLastDirection = '';

        if (ige.isServer) {
            this.addComponent(IgeVelocityComponent)
                .addComponent(UnitKeyboardControl)
                .streamMode(1)
                .scale()
                .x(GameConfig.scaleRate)
                .y(GameConfig.scaleRate)
                .translateTo(coordX, coordY, 0)
                .drawBounds(false)
                .box2dBody({
                    type: 'dynamic',
                    linearDamping: 0.0,
                    angularDamping: 0.1,
                    allowSleep: true,
                    bullet: true,
                    gravitic: true,
                    fixedRotation: true,
                    fixtures: [{
                        density: 0.3,
                        friction: 0.0,
                        restitution: 0.2,
                        shape: {
                            type: 'polygon',
                            data: new IgePoly2d()
                                .addPoint(-1.1 * GameConfig.scaleRate, -1.3 * GameConfig.scaleRate)
                                .addPoint(1.1 * GameConfig.scaleRate, -1.3 * GameConfig.scaleRate)
                                .addPoint(1.1 * GameConfig.scaleRate, 1.2 * GameConfig.scaleRate)
                                .addPoint(-1.1 * GameConfig.scaleRate, 1.2 * GameConfig.scaleRate)
                        }
                    }]
                })
                .mount(ige.server.renderer.gameScene);

        }

        // Load the character texture file
        if (ige.isClient) {
            this.addComponent(IgeAnimationComponent)
                .depth(10);

            //this._characterTexture = new IgeCellSheet('./assets/vx_chara02_c.png', 12, 8);
            this._characterTexture = new IgeCellSheet('./assets/tanks.transparent.png', 8, 4);

            // Wait for the texture to load
            this._characterTexture.on('loaded', function () {
                self.texture(self._characterTexture)
                    .dimensionsFromCell();

                //self.setType(0);
            }, false, true);

            this.setUnitName('Bot');
        }

        this.selectedAnimation = 'walkUp';

        // Define the data sections that will be included in the stream
        // this.streamSections(['transform', 'score']);
        this.streamSections(['transform', 'teamId', 'lastDirection', 'run']);
    },

    /**
     * Override the default IgeEntity class streamSectionData() method
     * so that we can check for the custom1 section and handle how we deal
     * with it.
     * @param {String} sectionId A string identifying the section to
     * handle data get / set for.
     * @param {*=} data If present, this is the data that has been sent
     * from the server to the client for this entity.
     * @return {*}
     */
    streamSectionData: function (sectionId, data) {
        // Check if the section is one that we are handling
        if (sectionId === 'teamId') {
            // Check if the server sent us data, if not we are supposed
            // to return the data instead of set it
            if (data) {
                // We have been given new data!
                this._teamId = data;
                if (ige.isClient) {
                    this.setType(this._teamId);
                }
            } else {
                // Return current data
                return this._teamId;
            }
        } else if (sectionId === 'lastDirection') {
            if (data) {
                this._lastDirection = data;
            } else {
                return this._lastDirection;
            }
        } else if (sectionId === 'run') {
            if (data) {
                this._run = data;
            } else {
                return this._run;
            }
        } else {
            // The section was not one that we handle here, so pass this
            // to the super-class streamSectionData() method - it handles
            // the "transform" section by itself
            return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
        }
    },

    setUnitName: function (text) {
        this.destroyUnitName();
        this.name = new IgeFontEntity()
            .depth(10)
            .width(85)
            .height(25)
            .textAlignX(1)
            .textAlignY(1)
            .colorOverlay('#ffffff')
            .nativeFont('17px Arial')
            .nativeStroke(6)
            .nativeStrokeColor('#666666')
            .textLineSpacing(0)
            .drawBounds(false)
            //.translateTo(0, 40, 0)
            .text(text)
            .mount(this);

        return this;
    },

    destroyUnitName: function () {
        if (this.name) {
            this.name.destroy();
        }
    },

    /**
     * @server
     */
    setTeamId: function (teamId) {
        this._teamId = teamId;

        return this;
    },

    /**
     * Sets the type of character which determines the character's
     * animation sequences and appearance.
     * @param {Number} type From 0 to 7, determines the character's
     * appearance.
     * @return {*}
     */
    setType: function (type) {
        type = parseInt(type, 10);

        switch (type) {
            /**
             * Анимация зеленого танка
             */
            case 0:
                this.animation.define('walkDown', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkLeft', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkRight', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkUp', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('bang', [18, 19, 20], 12, 1)
                    .cell(9);

                //this._restCell = 9;
                break;

            /**
             * Анимация синего танка
             */
            case 1:
                this.animation.define('walkDown', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkLeft', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkRight', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkUp', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('bang', [18, 19, 20], 12, 1)
                    .cell(17);

                //this._restCell = 17;
                break;

        }

        this._characterType = type;

        return this;
    },

    defineBangAnimation: function () {
        this.animation.define('bang', [18, 19, 20], 12, 1)
            .cell(18);
    },

    onCollision: function (me, subject) {
        var self = this;

        if (ige.isServer) {
            if (subject._type == 'bullet') {
                this._destroyed = true;
                ige.network.send('playerDestroyProcess', {
                    entityId: me.id(),
                    clientId: me.clientId
                });
            } else {

                if (!me.clientId) {
                    // Если произошло столкновение с любым объектом,
                    // кроме снаряда - нужно сменить направление
                    me.playerControl.changeDirection();
                }

            }
        }
    },

    /**
     * Запускает указанную анимацию
     * @chainable
     * @param  {String} type Тип анимации
     */
    runAnimation: function (type) {
        var self = this;

        type = type ? type : 'default';
        if (type == 'bang') {
            this.destroyUnitName();
        }
        this.animation.select(type, {
            onLoop: function () {
                this.stop();
                ige.network.send('playerDestroy', {
                    entityId: self.id(),
                    clientId: self.clientId
                });
            }
        });

        return this;
    },

    update: function (ctx, tickDelta) {

        this.customRotate(this._lastDirection);

        if (ige.isClient) {

            if (this._destroyed) {
                this.defineBangAnimation();
                this.selectedAnimation = 'bang';
            } else {
                if (this._run == 1) {

                    if (this._lastDirection == 'up') {
                        this.selectedAnimation = 'walkUp';
                    }
                    else if (this._lastDirection == 'down') {
                        this.selectedAnimation = 'walkDown';
                    }
                    else if (this._lastDirection == 'left') {
                        this.selectedAnimation = 'walkLeft';
                    }
                    else if (this._lastDirection == 'right') {
                        this.selectedAnimation = 'walkRight';
                    }

                    if (this.animation.defined(this.selectedAnimation)) {
                        this.animation.select(this.selectedAnimation);
                    }

                } else if (this._run == 0) {
                    this.animation.stop();
                }
            }

        }

        IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
    },

    // Хак на время, пока спрайт юнита поворачивается вручную
    rotateUserName: function (val, translate) {
        if (ige.isClient) {
            this.name.rotate().z(val);
            this.name.translateTo.apply(this.name, translate);

        }
    },

    customRotate: function (direction) {
        switch (direction) {
            case 'up':
                this.rotate().z(0);
                this.rotateUserName(0, [0, 50, 0]);
                break;
            case 'down':
                this.rotate().z((Math.PI / 2) * -2);
                this.rotateUserName((Math.PI / 2) * -2, [0, -50, 0]);
                break;
            case 'left':
                this.rotate().z((Math.PI / 2) * -1);
                this.rotateUserName((Math.PI / 2) * 1, [-50, 0, 0]);
                break;
            case 'right':
                this.rotate().z((Math.PI / 2) * 1);
                this.rotateUserName((Math.PI / 2) * -1, [50, 0, 0]);
                break;
        }
    },

    destroy: function () {
        // Destroy the texture object
        if (this._characterTexture) {
            this._characterTexture.destroy();
        }

        if (this.playerControl && this.playerControl._saveKeyUpListener) {
            clearInterval(this.playerControl.directionInterval);
            clearInterval(this.playerControl.fireInterval);

            ige.input.off('keyUp', this.playerControl._saveKeyUpListenerObject);
        }

        this.emit('destroy');

        // Call the super class
        IgeEntityBox2d.prototype.destroy.call(this);
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Tank; }
