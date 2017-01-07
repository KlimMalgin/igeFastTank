/**
 * Класс отвечает за специфические сценарии работы с клавиатурой
 *
 * В классе реализована работа с очередью действий. Логика работы с очередью такова:
 * Пользователь жмет стрелку право и движется вправо, затем не отпуская
 * стрелки вправо, жмет стрелку вниз и движется вниз. Затем стрелку вниз он
 * отпускает и т.к. стрелка в право еще зажата - танк не останавливается, а
 * продолжает движение вправо.
 */
var Keyboard = IgeClass.extend({
    classId: 'Keyboard',

    init: function () {
        /**
         * Список активных событий (нажатых клавиш)
         * @type {Array}
         */
        this.actions = [
            /*
            {
                type: 'up'
            }
            */
        ];
    },

    /**
     * Добавит событие указанного типа в список активных
     * @param  {String} type Тип события
     */
    press: function (type) {
        this.actions.push({
            type: type
        });
    },

    /**
     * Уберет событие указанного типа из списка активных
     * @param  {String} type Тип события
     */
    release: function (type) {
        var ln = this.actions.length,
            index = -1;

        for (var i = 0; i < ln; i++) {
            if (this.actions[i].type == type) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            this.actions.splice(index, 1);
        }
    },

    /**
     * Проверит, есть ли активное событие. Если есть - вернет его, если нет - вернет null.
     * @return {Object} Активное событие, либо null
     */
    hasAction: function () {
        return this.actions[0];
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Keyboard; }
