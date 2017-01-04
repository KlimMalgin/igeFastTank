// Define our player character classes
var Character = IgeEntityBox2d.extend({
    classId: 'Character',

    init: function () {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);

        if (ige.isServer) {
            this.addComponent(IgeVelocityComponent);
        }

        // Setup the entity
        /*self.addComponent(IgeAnimationComponent)
            .addComponent(IgeVelocityComponent)
            .depth(1);*/

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

                this.animation.select(this.selectedAnimation);
            }

            // Set the depth to the y co-ordinate which basically
            // makes the entity appear further in the foreground
            // the closer they become to the bottom of the screen
            //this.depth(this._translate.y);
        }

        IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
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
