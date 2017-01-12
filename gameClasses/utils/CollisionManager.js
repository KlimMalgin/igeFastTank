/**
 * Класс работает с коллизиями
 */
var CollisionManager = IgeClass.extend({
    classId: 'CollisionManager',

    init: function () {},

    listen: function () {
        var self = this;

        console.log('[[[ ЗАПУСКАЕМ СЛУШАТЕЛЯ КОЛЛИЗИЙ ]]]');

        ige.box2d.contactListener(
            // Listen for when contact's begin
            function (contact) {
                //console.log('[[[ Contact begins between ', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
                var entityA = contact.igeEntityA(),
                    entityB = contact.igeEntityB();

                if (!self.isTankSelfBulletContact(entityA, entityB)) {
                    entityA.onCollision && entityA.onCollision(entityA);
                    entityB.onCollision && entityB.onCollision(entityB);
                }


                //ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
            },
            // Listen for when contact's end
            function (contact) {
                //console.log('[[[ Contact ends between', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
            },
            // Handle pre-solver events
            function (contact) {
                /*var entityA = contact.igeEntityA(),
                    entityB = contact.igeEntityB();*/

                // TODO: Регистрировать категории bullet, tank и др.
                if (self.isTankSelfBulletContact(contact.igeEntityA(), contact.igeEntityB())) {
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
                //console.log("entityA::bullet // entityB::tank", entityA.getParentId(), ' ', entityB.id());
                //contact.SetEnabled(false);
                return true;
            }
        }

        if (entityA._type == 'tank' && entityB._type == 'bullet') {
            if (entityA.id() == entityB.getParentId()) {
                //console.log("entityA::tank // entityB::bullet", entityA.id(), ' ', entityB.getParentId());
                //contact.SetEnabled(false);
                return true;
            }
        }

        return false;
    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CollisionManager; }
