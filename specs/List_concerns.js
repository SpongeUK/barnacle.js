const expect = require( 'expect.js' );

const { ObjectStore } = require( "../build/Storage/ObjectStore" );
const { List } = require( '../build/List' );

describe( "Given I have a list of interactions in a store and I create list for that store", () => {

    function addItem( store, index = 0, item = { type: "true-false", result: "wrong" } ) {
        store.set( `cmi.interactions.${index}.id`, item.id || `ITEM_${index}` );
        store.set( `cmi.interactions.${index}.type`, item.type );
        store.set( `cmi.interactions.${index}.result`, item.result );
    }

    describe( "When I get the count of children in the list", () => {

        it( "Should return the number of items", () => {

            let store = new ObjectStore();
            addItem( store, 0 );
            addItem( store, 1 );

            let list = new List( "cmi.interactions", store );

            expect( list.count ).to.equal( 2 );

        } );

    } );

    describe( "When I get the children of the list", () => {

        it( "Should provide an array of the items", () => {

            let store = new ObjectStore();

            let item1 = { id: "ITEM_1", type: "true-false", result: "correct" };
            let item2 = { id: "ITEM_2", type: "choice", result: "correct" };
            let item3 = { id: "ITEM_3", type: "likert", result: "8" };
            let items = [ item1, item2, item3 ];

            for ( let i = 0; i < items.length; i++ ) {
                addItem( store, i, items[ i ] );
            }

            let list = new List( "cmi.interactions", store );

            expect( list.children ).to.be.an( Array );
            expect( list.children ).to.have.length( items.length );
            expect( list.children ).to.eql( items );

        } );

    } );

} );