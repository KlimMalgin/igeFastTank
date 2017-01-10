/**
 * Adds keyboard control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerComponent = IgeClass.extend({
    classId: 'PlayerComponent',
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

        this._speed = 0.2;

        this.keyboard = new Keyboard();

        // Setup the control system
        ige.input.mapAction('left', ige.input.key.left);
        ige.input.mapAction('right', ige.input.key.right);
        ige.input.mapAction('up', ige.input.key.up);
        ige.input.mapAction('down', ige.input.key.down);

        // Listen for the key up event
        ige.input.on('keyUp', function (event, keyCode) {
            //self._keyUp(event, keyCode);
            self._fire(event, keyCode, self._entity);
        });

        // Add the playerComponent behaviour to the entity
        this._entity.addBehaviour('playerComponent_behaviour', this._behaviour);
    },

    /*_keyUp: function (event, keyCode) {
        if (ige.isClient) {
            if (keyCode === ige.input.key.space) {
                ige.network.send('playerFired');
            }
        }
    },*/

    _fire: function (event, keyCode, entity) {
        if (ige.isClient) {
            if (keyCode === ige.input.key.space) {
                // Генерим Bullet
                ige.network.send('playerFired', entity._lastDirection);
            }
        }
    },

    /**
     * Called every frame by the engine when this entity is mounted to the
     * scenegraph.
     * @param ctx The canvas context to render to.
     */
    _behaviour: function (ctx) {
        var events = this.playerControl.keyNetEvents;

        /* CEXCLUDE */
        if (ige.isServer) {
            if (this.playerControl.controls.left) {
                this.velocity.x(-this.playerControl._speed);
            } else if (this.playerControl.controls.right) {
                this.velocity.x(this.playerControl._speed);
            } else {
                this.velocity.x(0);
            }

            if (this.playerControl.controls.up) {
                this.velocity.y(-this.playerControl._speed);
            } else if (this.playerControl.controls.down) {
                this.velocity.y(this.playerControl._speed);
            } else {
                this.velocity.y(0);
            }
        }
        /* CEXCLUDE */

        if (ige.isClient) {
            if (ige.input.actionState('left')) {
                if (!this.playerControl.controls.left) {
                    // Record the new state
                    this.playerControl.controls.left = true;
                    this._lastDirection = 'left';
                    // Tell the server about our control change
                    ige.network.send(events.left.down);
                    this.playerControl.keyboard.press('left');
                    console.log('left Press');
                }
            } else {
                if (this.playerControl.controls.left) {
                    // Record the new state
                    this.playerControl.controls.left = false;

                    // Tell the server about our control change
                    ige.network.send(events.left.up);
                    this.playerControl.keyboard.release('left');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                    console.log('left Release');
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
                    console.log('right Press');
                }
            } else {
                if (this.playerControl.controls.right) {
                    // Record the new state
                    this.playerControl.controls.right = false;

                    // Tell the server about our control change
                    ige.network.send(events.right.up);
                    this.playerControl.keyboard.release('right');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                    console.log('right Release');
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
                    console.log('up Press');
                }
            } else {
                if (this.playerControl.controls.up) {
                    // Record the new state
                    this.playerControl.controls.up = false;

                    // Tell the server about our control change
                    ige.network.send(events.up.up);
                    this.playerControl.keyboard.release('up');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                    console.log('up Release');
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
                    console.log('down Press');
                }
            } else {
                if (this.playerControl.controls.down) {
                    // Record the new state
                    this.playerControl.controls.down = false;

                    // Tell the server about our control change
                    ige.network.send(events.down.up);
                    this.playerControl.keyboard.release('down');
                    this.playerControl.setActiveKeyboardAction.call(this, this.playerControl.keyboard.hasAction());
                    console.log('down Release');
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerComponent; }
