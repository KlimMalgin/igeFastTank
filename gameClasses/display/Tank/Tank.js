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

        this._type = 'tank';
        this._destroyed = false;
        this._lastDirection = 'up';
        this.__tempLastDirection = '';

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

                self.setType(0);
            }, false, true);
        }

        this.selectedAnimation = 'walkUp';

        this._lastTranslate = this._translate.clone();

    },

    /**
     * Sets the type of character which determines the character's
     * animation sequences and appearance.
     * @param {Number} type From 0 to 7, determines the character's
     * appearance.
     * @return {*}
     */
    setType: function (type) {
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

            /**
             * Анимация взрыва для танка
             */
            /*case 2:
                this.animation.define('bang', [18, 19, 20], 3, -1)
                    .cell(18);

                break;*/
        }

        this._characterType = type;

        return this;
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
        this.animation.select(type, {
            onLoop: function () {
                this.stop();
                ige.network.send('playerDestroy', {
                    entityId: self.id(),
                    clientId: self.clientId
                });
                //self.destroy();
            }
        });

        return this;
    },

    update: function (ctx, tickDelta) {
        if (ige.isClient) {
            // Set the current animation based on direction
            var self = this,
                oldX = this._lastTranslate.x,
                oldY = this._lastTranslate.y * 2,
                currX = this.translate().x(),
                currY = this.translate().y() * 2,
                distX = currX - oldX,
                distY = currY - oldY;

            this._lastTranslate = this._translate.clone();

            if (distX == 0 && distY == 0) {
                if (!this._destroyed) {
                    this.animation.stop();
                }
            } else {

                if (this._destroyed) {
                    this.selectedAnimation = 'bang';
                } else {

                    // Set the animation based on direction
                    if (Math.abs(distX) > Math.abs(distY)) {
                        // Moving horizontal
                        if (distX < 0) {
                            // Moving left
                            this.selectedAnimation = 'walkLeft';
                            this._lastDirection = 'left';
                        } else {
                            // Moving right
                            this.selectedAnimation = 'walkRight';
                            this._lastDirection = 'right';
                        }
                    } else {
                        // Moving vertical
                        if (distY < 0) {
                            // Moving up
                            this.selectedAnimation = 'walkUp';
                            this._lastDirection = 'up';
                        } else {
                            // Moving down
                            this.selectedAnimation = 'walkDown';
                            this._lastDirection = 'down';
                        }
                    }

                }

                if (this.animation.defined(this.selectedAnimation)) {
                    this.animation.select(this.selectedAnimation);
                }
            }
        }

        IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
    },

    customRotate: function function_name(direction) {
        switch (direction) {
            case 'up':
                this.rotate().z(0);
                break;
            case 'down':
                this.rotate().z((Math.PI / 2) * -2);
                break;
            case 'left':
                this.rotate().z((Math.PI / 2) * -1);
                break;
            case 'right':
                this.rotate().z((Math.PI / 2) * 1);
                break;
        }
    },

    tick: function (ctx) {
        this.customRotate(this._lastDirection);

        if (this._lastDirection != this.__tempLastDirection) {
            this.__tempLastDirection = this._lastDirection;
            console.log('_lastDirection: ', this._lastDirection);
        }

        IgeEntityBox2d.prototype.tick.call(this, ctx);
    },

    destroy: function () {
        this.emit('killed');

        // Destroy the texture object
        if (this._characterTexture) {
            this._characterTexture.destroy();
        }

        if (this.playerControl && this.playerControl._saveKeyUpListener) {
            ige.input.off('keyUp', this.playerControl._saveKeyUpListenerObject);
        }

        // Call the super class
        IgeEntityBox2d.prototype.destroy.call(this);
    }


    /**
     * Включает режим бота - перемещение в случайную сторону через промежуток времени
     */
    /*enableBotMode() {
            // Случайное направление движения
        let xyRand = () => Math.floor((Math.random() * 4) + 1),

            // Каждые 5 сек меняем направление движения
            changeDirectionMs = 1500;

        this.botModeIntervalId = setInterval(() => {
            this.stop();
            if (xyRand() == 1) this.go('up');
            else if (xyRand() == 2) this.go('right');
            else if (xyRand() == 3) this.go('down');
            else if (xyRand() == 4) this.go('left');
        }, changeDirectionMs);

    }*/



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Tank; }
