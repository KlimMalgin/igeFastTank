// Define our player character classes
var Character = IgeEntityBox2d.extend({
    classId: 'Character',

    init: function () {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);

        if (ige.isServer) {
            this.addComponent(IgeVelocityComponent);
        }

        this._type = 'tank';
        this._lastDirection = 'up';
        this.__tempLastDirection = '';

        // Load the character texture file
        if (ige.isClient) {
            self.addComponent(IgeAnimationComponent)
                .depth(1);

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
            case 0:
                this.animation.define('walkDown', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkLeft', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkRight', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .animation.define('walkUp', [9, 8, 7, 6, 5, 4, 3, 2], 14, -1)
                    .cell(9);

                this._restCell = 9;
                break;

            case 1:
                this.animation.define('walkDown', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkLeft', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkRight', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .animation.define('walkUp', [17, 16, 15, 14, 13, 12, 11, 10], 14, -1)
                    .cell(17);

                this._restCell = 17;
                break;
        }

        this._characterType = type;

        return this;
    },

    onCollision: function () {

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
                distY = currY - oldY,
                distance = Math.distance(
                    oldX,
                    oldY,
                    currX,
                    currY
                ),
                speed = 0.2,
                time = (distance / speed),
                rotateAngle = Math.PI / 2;

            this._lastTranslate = this._translate.clone();

            if (distX == 0 && distY == 0) {
                this.animation.stop();
            } else {
                // Set the animation based on direction
                if (Math.abs(distX) > Math.abs(distY)) {
                    // Moving horizontal
                    if (distX < 0) {
                        // Moving left
                        this.selectedAnimation = 'walkLeft';
                    } else {
                        // Moving right
                        this.selectedAnimation = 'walkRight';
                    }
                } else {
                    // Moving vertical
                    if (distY < 0) {
                        // Moving up
                        this.selectedAnimation = 'walkUp';
                    } else {
                        // Moving down
                        this.selectedAnimation = 'walkDown';
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

        //if (ige.isServer) {
            if (this._lastDirection != this.__tempLastDirection) {
                this.__tempLastDirection = this._lastDirection;
                console.log('_lastDirection: ', this._lastDirection);
            }
        //}

        IgeEntityBox2d.prototype.tick.call(this, ctx);
    },

    destroy: function () {
        // Destroy the texture object
        if (this._characterTexture) {
            this._characterTexture.destroy();
        }

        // Call the super class
        IgeEntityBox2d.prototype.destroy.call(this);
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }
