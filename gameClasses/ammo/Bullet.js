// Define our player character classes
var Bullet = IgeEntityBox2d.extend({
    classId: 'Bullet',

    init: function () {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);

        if (ige.isServer) {
            this.addComponent(IgeVelocityComponent);
        }

        this._type = 'bullet';
        this._parentId = '';

        // Load the character texture file
        if (ige.isClient) {
            self.addComponent(IgeAnimationComponent)
                .depth(5);

            //this._characterTexture = new IgeCellSheet('./assets/vx_chara02_c.png', 12, 8);

            // TODO: Тут происходит загрузка спрайта? Каждый раз при инициализации Патрона?
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
     * Задает направление движения патрона
     * @param {String} direction Направление движения {'up'|'down'|'left'|'right'}
     */
    setDirection: function (direction) {
        var BULLET_SPEED = 0.7;

        switch (direction) {

            case 'up':
                this.velocity.x(0);
                this.velocity.y(-BULLET_SPEED);
                break;

            case 'down':
                this.velocity.x(0);
                this.velocity.y(BULLET_SPEED);
                break;

            case 'left':
                this.velocity.x(-BULLET_SPEED);
                this.velocity.y(0);
                break;

            case 'right':
                this.velocity.x(BULLET_SPEED);
                this.velocity.y(0);
                break;

            case 'stop':
                this.velocity.x(0);
                this.velocity.y(0);
                break;

        }

        return this;
    },

    setParentId: function (parentId) {
        //console.log('setParentId: ', parentId);
        this._parentId = parentId;
        return this;
    },

    getParentId: function () {
        return this._parentId;
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
            onLoop: function () {
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
    onCollision: function (entity) {
        if (ige.isServer) {
            entity.setDirection('stop');
            ige.network.send('bulletDestroyProcess', entity.id());
        }
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
