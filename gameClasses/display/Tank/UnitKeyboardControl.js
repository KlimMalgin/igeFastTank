/**
 * Adds keyboard control to the entity this component is added to.
 * @type {IgeClass}
 */
var UnitKeyboardControl = IgeClass.extend({
    classId: 'UnitKeyboardControl',
    componentId: 'playerControl',

    init: function (entity, options) {
        var self = this;

        // Store the entity that this component has been added to
        this._entity = entity;

        // Store any options that were passed to us
        this._options = options;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.keyNetEvents = {
            left: {
                up: 'playerControlLeftUp',
                down: 'playerControlLeftDown'
            },
            right: {
                up: 'playerControlRightUp',
                down: 'playerControlRightDown'
            },
            up: {
                up: 'playerControlUpUp',
                down: 'playerControlUpDown'
            },
            down: {
                up: 'playerControlDownUp',
                down: 'playerControlDownDown'
            }
        };

        this._speed = 6;

        this.keyboard = new Keyboard();

        // Setup the control system
        ige.input.mapAction('left', ige.input.key.left);
        ige.input.mapAction('right', ige.input.key.right);
        ige.input.mapAction('up', ige.input.key.up);
        ige.input.mapAction('down', ige.input.key.down);

        /**
         * keyUp обработчик для выстрела. С привязанным контекстом UniKeyboardControl
         */
        this._saveKeyUpListener = this._keyUpListener.bind(this);

        /**
         * Объект с данными текущего обработчика. Требуется для удаления обработчика
         */
        this._saveKeyUpListenerObject = ige.input.on('keyUp', this._saveKeyUpListener);

        // Add the playerComponent behaviour to the entity
        this._entity.addBehaviour('playerComponent_behaviour', this._behaviour);
    },

    _keyUpListener: function (event, keyCode) {
        this._fire.call(this, event, keyCode, this._entity, this._bulletStartPosition(this._entity));
    },

    _fire: function (event, keyCode, entity, position) {
        if (ige.isClient) {
            if (keyCode === ige.input.key.space) {
                // Генерим Bullet
                //debugger;
                //console.log(entity.aabb(), entity.aabb(true));
                ige.network.send('playerFired', {
                    direction: entity._lastDirection,
                    position: position,
                    parentId: entity.id()
                });
            }
        }
    },

    _bulletStartPosition: function (entity) {
        //entity.bounds2d()
        //IgeClass {x: 84, y: 84, _floor: false, x2: 42, y2: 42}
        //--
        //entity.worldPosition()
        // _floor : false
        // x : 27.15
        // x2 : 13.575
        // y : 380.4
        // y2 : 190.2
        // z : 0
        // z2 : 0
        //
        var bounds = entity.bounds2d(),
            position = entity.worldPosition(),
            result = { x: 0, y: 0 };

        if (ige.isClient) {
            console.log('position: %o  bounds: %o', position, bounds);
        }

        switch(entity._lastDirection) {
            case 'up':
                result.x = position.x;
                result.y = position.y - (bounds.y2 - Math.round(bounds.y2 / 2));
                break;

            case 'down':
                result.x = position.x;
                result.y = position.y + (bounds.y2 - Math.round(bounds.y2 / 2));
                break;

            case 'left':
                result.x = position.x - (bounds.x2 - Math.round(bounds.x2 / 2));
                result.y = position.y;
                break;

            case 'right':
                result.x = position.x + (bounds.x2 - Math.round(bounds.x2 / 2));
                result.y = position.y;
                break;
        }

        return result;
    },

    /**
     * Called every frame by the engine when this entity is mounted to the
     * scenegraph.
     * @param ctx The canvas context to render to.
     */
    _behaviour: function (ctx) {
        var events = this.playerControl.keyNetEvents,
            speed = this.playerControl._speed;


        /* CEXCLUDE */
        if (ige.isServer) {

            if (this.playerControl.controls.left) {
                // this.velocity.x(-this.playerControl._speed);

                this._box2dBody.SetLinearVelocity(new IgePoint3d(-speed, 0, 0));
                this._box2dBody.SetAwake(true);

            } else if (this.playerControl.controls.right) {
                // this.velocity.x(this.playerControl._speed);

                this._box2dBody.SetLinearVelocity(new IgePoint3d(speed, 0, 0));
                this._box2dBody.SetAwake(true);

            } else if (this.playerControl.controls.up) {
                // this.velocity.y(-this.playerControl._speed);

                this._box2dBody.SetLinearVelocity(new IgePoint3d(0, -speed, 0));
                this._box2dBody.SetAwake(true);

            } else if (this.playerControl.controls.down) {
                // this.velocity.y(this.playerControl._speed);

                this._box2dBody.SetLinearVelocity(new IgePoint3d(0, speed, 0));
                this._box2dBody.SetAwake(true);

            } else {
                // this.velocity.y(0);

                this._box2dBody.SetLinearVelocity(new IgePoint3d(0, 0, 0));
                this._box2dBody.SetAwake(true);

            }
        }
        /* CEXCLUDE */

        if (ige.isClient) {
            /*
            if (actionEmitter('up')) {
                // ... go up
            }
            if (actionEmitter('down')) {
                // ... go down
            }

            // actionEmitter это обертка над источником, предписывающем действие танку
            // Таким источником может быть пользовательский ввод или рандомная генерация состояний и т.д.
            actionEmitter = function () {
                if (botMode) {
                    return botModeState; // "up" / "down" / "left" / "right"
                } else {
                    return ige.input.actionState('left')
                }
            }

            */

            if (ige.input.actionState('left')) {
                if (!this.playerControl.controls.left) {
                    // Record the new state
                    this.playerControl.controls.left = true;
                    this._lastDirection = 'left';
                    // Tell the server about our control change
                    ige.network.send(events.left.down);
                    this.playerControl.keyboard.press('left');
                }
            } else {
                if (this.playerControl.controls.left) {
                    // Record the new state
                    this.playerControl.controls.left = false;

                    // Tell the server about our control change
                    ige.network.send(events.left.up);
                    this.playerControl.keyboard.release('left');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                }
            }

            if (ige.input.actionState('right')) {
                if (!this.playerControl.controls.right) {
                    // Record the new state
                    this.playerControl.controls.right = true;
                    this._lastDirection = 'right';
                    // Tell the server about our control change
                    ige.network.send(events.right.down);
                    this.playerControl.keyboard.press('right');
                }
            } else {
                if (this.playerControl.controls.right) {
                    // Record the new state
                    this.playerControl.controls.right = false;

                    // Tell the server about our control change
                    ige.network.send(events.right.up);
                    this.playerControl.keyboard.release('right');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                }
            }

            if (ige.input.actionState('up')) {
                if (!this.playerControl.controls.up) {
                    // Record the new state
                    this.playerControl.controls.up = true;
                    this._lastDirection = 'up';
                    // Tell the server about our control change
                    ige.network.send(events.up.down);
                    this.playerControl.keyboard.press('up');
                }
            } else {
                if (this.playerControl.controls.up) {
                    // Record the new state
                    this.playerControl.controls.up = false;

                    // Tell the server about our control change
                    ige.network.send(events.up.up);
                    this.playerControl.keyboard.release('up');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                }
            }

            if (ige.input.actionState('down')) {
                if (!this.playerControl.controls.down) {
                    // Record the new state
                    this.playerControl.controls.down = true;
                    this._lastDirection = 'down';
                    // Tell the server about our control change
                    ige.network.send(events.down.down);
                    this.playerControl.keyboard.press('down');
                }
            } else {
                if (this.playerControl.controls.down) {
                    // Record the new state
                    this.playerControl.controls.down = false;

                    // Tell the server about our control change
                    ige.network.send(events.down.up);
                    this.playerControl.keyboard.release('down');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                }
            }
        }
    },

    /**
     * Если есть активное действие (нажатая клавиша) - зафиксируем это действие
     * как текущее и отправим соответствующую команду серверу
     * @param {Object} action Объект действия, содержащий тип этого действия
     */
    setActiveKeyboardAction: function (action) {
        if (action) {
            this._lastDirection = action.type;
            this.playerControl.controls[action.type] = true;
            ige.network.send(this.playerControl.keyNetEvents[action.type].down);
        }
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UnitKeyboardControl; }
