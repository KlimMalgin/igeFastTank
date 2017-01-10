// Define our player character classes
var Bullet = IgeEntityBox2d.extend({
    classId: 'Bullet',

    init: function () {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);

        if (ige.isServer) {
            this.addComponent(IgeVelocityComponent);
            this.velocity.x(-0.2);
        }

        this._type = 'bullet';

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

                self.defineAnimations();
                //self.runAnimation();
            }, false, true);
        }

    },

    /**
     * Создает набор анимаций для патрона
     */
    defineAnimations: function () {
        this.animation.define('default', [22], 1, -1)
            .animation.define('bang', [18, 19, 20], 12, -1)
            .cell(22);

        return this;
    },

    /**
     * Запускает указанную анимацию
     * @chainable
     * @param  {String} type Тип анимации
     */
    runAnimation: function (type) {
        var self = this;
        type = type ? type : 'default';
        //this.animation.select(type);
        this.animation.start(type, {
            onLoop: function (anim) {
                this.stop();
                ige.network.send('bulletDestroy', self.id());
                //self.destroy();
            }
        });

        return this;
    },

    /**
     * Логика коллизии для данной сущности
     */
    onCollision: function () {
        this.velocity.x(0);
        this.velocity.y(0);
        this.runAnimation('bang');
    },

    /*update: function (ctx, tickDelta) {
        IgeEntityBox2d.prototype.update.call(this, ctx, tickDelta);
    },*/


    /*tick: function (ctx) {
        IgeEntityBox2d.prototype.tick.call(this, ctx);
    },*/

    destroy: function () {
        // Destroy the texture object
        if (this._characterTexture) {
            this._characterTexture.destroy();
        }

        // Call the super class
        IgeEntityBox2d.prototype.destroy.call(this);
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bullet; }
