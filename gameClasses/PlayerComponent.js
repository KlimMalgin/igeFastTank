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

        this._speed = 0.2;

        // Setup the control system
        ige.input.mapAction('left', ige.input.key.left);
        ige.input.mapAction('right', ige.input.key.right);
        ige.input.mapAction('up', ige.input.key.up);
        ige.input.mapAction('down', ige.input.key.down);

        // Listen for the key up event
        ige.input.on('keyUp', function (event, keyCode) { self._keyUp(event, keyCode); });

        // Add the playerComponent behaviour to the entity
        this._entity.addBehaviour('playerComponent_behaviour', this._behaviour);
    },

    _keyUp: function (event, keyCode) {
        if (keyCode === ige.input.key.space) {
            // Change the character
            this._entity._characterType++;

            if (this._entity._characterType > 1) {
                this._entity._characterType = 0;
            }

            this._entity.setType(this._entity._characterType);
        }
    },

    /**
     * Called every frame by the engine when this entity is mounted to the
     * scenegraph.
     * @param ctx The canvas context to render to.
     */
    _behaviour: function (ctx) {
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

                    // Tell the server about our control change
                    ige.network.send('playerControlLeftDown');
                }
            } else {
                if (this.playerControl.controls.left) {
                    // Record the new state
                    this.playerControl.controls.left = false;

                    // Tell the server about our control change
                    ige.network.send('playerControlLeftUp');
                }
            }

            if (ige.input.actionState('right')) {
                if (!this.playerControl.controls.right) {
                    // Record the new state
                    this.playerControl.controls.right = true;

                    // Tell the server about our control change
                    ige.network.send('playerControlRightDown');
                }
            } else {
                if (this.playerControl.controls.right) {
                    // Record the new state
                    this.playerControl.controls.right = false;

                    // Tell the server about our control change
                    ige.network.send('playerControlRightUp');
                }
            }

            if (ige.input.actionState('up')) {
                if (!this.playerControl.controls.up) {
                    // Record the new state
                    this.playerControl.controls.up = true;

                    // Tell the server about our control change
                    ige.network.send('playerControlUpDown');
                }
            } else {
                if (this.playerControl.controls.up) {
                    // Record the new state
                    this.playerControl.controls.up = false;

                    // Tell the server about our control change
                    ige.network.send('playerControlUpUp');
                }
            }

            if (ige.input.actionState('down')) {
                if (!this.playerControl.controls.down) {
                    // Record the new state
                    this.playerControl.controls.down = true;

                    // Tell the server about our control change
                    ige.network.send('playerControlDownDown');
                }
            } else {
                if (this.playerControl.controls.down) {
                    // Record the new state
                    this.playerControl.controls.down = false;

                    // Tell the server about our control change
                    ige.network.send('playerControlDownUp');
                }
            }
        }
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerComponent; }