/**
 * Класс работает с коллизиями
 */
var CollisionManager = IgeClass.extend({
    classId: 'CollisionManager',

    init: function () {},

    listen: function () {
        var self = this;

        ige.box2d.contactListener(
            // Listen for when contact's begin
            function (contact) {
                var entityA = contact.igeEntityA(),
                    entityB = contact.igeEntityB();

                if (self.isDifferentTeamsFire(entityA, entityB) && !self.isTankSelfBulletContact(entityA, entityB)) {
                    entityA.onCollision && entityA.onCollision(entityA, entityB);
                    entityB.onCollision && entityB.onCollision(entityB, entityA);
                } else if (self.isDifferentTeamsFire(entityA, entityB) && self.isTankSomeBulletContact(entityA, entityB)) {
                    entityA.onCollision && entityA.onCollision(entityA, entityB);
                    entityB.onCollision && entityB.onCollision(entityB, entityA);
                }

            },
            // Listen for when contact's end
            function (contact) {
                //console.log('[[[ Contact ends between', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
            },
            // Handle pre-solver events
            function (contact) {
                var entityA = contact.igeEntityA(),
                    entityB = contact.igeEntityB();

                // TODO: Регистрировать категории bullet, tank и др.
                if (self.isTankSelfBulletContact(entityA, entityB)) {
                    contact.SetEnabled(false);
                }

                if (self.isTankSomeBulletContact(entityA, entityB) && self.isSameTeamsFire(entityA, entityB)) {
                    contact.SetEnabled(false);
                }

                // You can also check an entity by it's category using igeEitherCategory('categoryName')
            }
        );

    },

    /**
     * Проверяет кейс когда одна сущность это юнит, а вторая - патрон этого же юнита
     */
    isTankSelfBulletContact: function (entityA, entityB) {
        if (entityA._type == 'bullet' && entityB._type == 'tank') {
            if (entityA.getParentId() == entityB.id()) {
                return true;
            }
        }

        if (entityA._type == 'tank' && entityB._type == 'bullet') {
            if (entityA.id() == entityB.getParentId()) {
                return true;
            }
        }

        return false;
    },

    /**
     * Проверяет кейс когда одна сущность это юнит, а вторая любой патрон.
     */
    isTankSomeBulletContact: function (entityA, entityB) {
        if (entityA._type == 'bullet' && entityB._type == 'tank') {
            if (entityA.getParentId() !== entityB.id()) {
                return true;
            }
        }
        if (entityA._type == 'tank' && entityB._type == 'bullet') {
            if (entityA.id() !== entityB.getParentId()) {
                return true;
            }
        }

        return false;
    },

    /**
     * Обработка кейса с столкновением снаряда и юнита одной команды
     * @return {Boolean} Вернет true, когда столкнувшиеся патрон и юнит принадлежат разным командам
     */
    isSameTeamsFire: function (entityA, entityB) {
        if (this.isTankSomeBulletContact(entityA, entityB)) {
            if (entityA._teamId == entityB._teamId) {
                return true;
            } else {
                return false;
            }
        } else {
            // Если сталкиваются не юнит с патроном, а другая комбинация сущностей - по умолчанию возвращаем true
            // Такое поведение "отключает" проверку принадлежности к командам
            return true;
        }
    },

    /**
     * Обработка кейса с столкновением снаряда и юнита разных команд
     */
    isDifferentTeamsFire: function (entityA, entityB) {
        if (this.isTankSomeBulletContact(entityA, entityB)) {
            if (entityA._teamId != entityB._teamId) {
                return true;
            } else {
                return false;
            }
        } else {
            // Если сталкиваются не юнит с патроном, а другая комбинация сущностей - по умолчанию возвращаем true
            // Такое поведение "отключает" проверку принадлежности к командам
            return true;
        }
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CollisionManager; }
