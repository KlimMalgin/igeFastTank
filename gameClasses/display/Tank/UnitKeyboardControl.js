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

    /**
     * Метод отвечает за стрельбу юнита
     * @param  {Object} event    Объект события клавиатуры
     * @param  {String} keyCode  Код нажатой клавиши
     * @param  {Object} entity   Объект сущности юнита
     * @param  {Object} position Объект с координатами стартовой позиции снаряда
     */
    _fire: function (event, keyCode, entity, position) {
        if (ige.isClient) {
            if (keyCode === ige.input.key.space) {
                // Генерим Bullet
                ige.network.send('playerFired', {
                    direction: entity._lastDirection,
                    position: position,
                    parentId: entity.id()
                });
            }
        }
    },

    /**
     * Вычисляет координаты стартовой позиции снаряда - точки, где
     * в момент выстрела впервые будет отрисован снаряд
     * @param  {Object} entity Сущность юнита, который произвел выстрел
     * @return {Object}        Объект с координатами для снаряда
     */
    _bulletStartPosition: function (entity) {
        var bounds = entity.bounds2d(),
            position = entity.worldPosition(),
            result = { x: 0, y: 0 };

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
        var self = this.playerControl,
            events = self.keyNetEvents,
            speed = self._speed,
            ctrls = self.controls;

        /* CEXCLUDE */
        if (ige.isServer) {

            switch (true) {
                case ctrls.left:  self._move(-speed, 0); break;
                case ctrls.right: self._move(speed, 0);  break;
                case ctrls.up:    self._move(0, -speed); break;
                case ctrls.down:  self._move(0, speed);  break;
                default:          self._move(0, 0);      break;
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

            self._checkInputAction('left');
            self._checkInputAction('right');
            self._checkInputAction('up');
            self._checkInputAction('down');

        }
    },

    /**
     * Придает ускорение юниту в указанных координатах
     * @server
     * @param  {Number} x Ускорение по x
     * @param  {Number} y Ускорение по y
     */
    _move: function (x, y) {
        this._entity._box2dBody.SetLinearVelocity(new IgePoint3d(x, y, 0));
        this._entity._box2dBody.SetAwake(true);
    },

    /**
     * Проверяет наличие действия на указанной клавише.
     * @client
     * @param  {String} direction Обозначение действия
     */
    _checkInputAction: function (direction) {
        if (ige.input.actionState(direction)) {
            if (!this.controls[direction]) {
                this._go(direction);
            }
        } else {
            if (this.controls[direction]) {
                this._release(direction);
            }
        }
    },

    /**
     * Предписывает юниту двигаться в заданную сторону
     * @client
     * @param  {String} direction Направление в котором нужно двигаться юниту
     */
    _go: function (direction) {
        var events = this.keyNetEvents;

        // Record the new state
        this.controls[direction] = true;
        this._lastDirection = direction;
        // Tell the server about our control change
        ige.network.send(events[direction].down);
        this.keyboard.press(direction);
    },

    /**
     * Предписывает юниту прекратить движение в указанном направлении
     * @client
     * @param  {String} direction Направление, движение в котором нужно прекратить
     */
    _release: function (direction) {
        var events = this.keyNetEvents;

        // Record the new state
        this.controls[direction] = false;

        // Tell the server about our control change
        ige.network.send(events[direction].up);
        this.keyboard.release(direction);
        this.setActiveKeyboardAction.call(this, this.keyboard.hasAction());
    },

    /**
     * Если есть активное действие (нажатая клавиша) - зафиксируем это действие
     * как текущее и отправим соответствующую команду серверу
     * @client
     * @param {Object} action Объект действия, содержащий тип этого действия
     */
    setActiveKeyboardAction: function (action) {
        if (action) {
            this._lastDirection = action.type;
            this.controls[action.type] = true;
            ige.network.send(this.keyNetEvents[action.type].down);
        }
    },

    /**
     * actionEmitter это обертка над источником, предписывающем действие танку
     * Таким источником может быть пользовательский ввод или рандомная генерация состояний и т.д.
     */
    actionEmitter: function () {
        var botMode = true;

        // ige.input.actionState('down')
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UnitKeyboardControl; }
