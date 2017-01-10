/**
 * Класс работает с коллизиями
 */
var CollisionManager = IgeClass.extend({
    classId: 'CollisionManager',

    init: function () {},

    listen: function () {

        console.log('[[[ ЗАПУСКАЕМ СЛУШАТЕЛЯ КОЛЛИЗИЙ ]]]');

        ige.box2d.contactListener(
            // Listen for when contact's begin
            function (contact) {
                console.log('[[[ Contact begins between ', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
                var entityA = contact.igeEntityA(),
                    entityB = contact.igeEntityB();

                entityA.onCollision && entityA.onCollision(entityA);
                entityB.onCollision && entityB.onCollision(entityB);

                //ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
            },
            // Listen for when contact's end
            function (contact) {
                console.log('[[[ Contact ends between', contact.igeEntityA()._type, ' ', contact.igeEntityA()._id, 'and', contact.igeEntityB()._type, ' ', contact.igeEntityB()._id);
            },
            // Handle pre-solver events
            function (contact) {
                // For fun, lets allow ball1 and square2 to pass through each other
                if (contact.igeEitherId('ball1') && contact.igeEitherId('square2')) {
                    // Cancel the contact
                    contact.SetEnabled(false);
                }

                // You can also check an entity by it's category using igeEitherCategory('categoryName')
            }
        );

    }

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CollisionManager; }
