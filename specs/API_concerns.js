describe( 'Given I have a SCORM compliant interface', function () {
    var expect = require( 'expect.js' ),
        sinon = require( 'sinon' ),
        onCommit = sinon.stub(),
        Barnacle = require( '../build/barnacle.js' ).Barnacle,
        barnacle = new Barnacle(),
        API = barnacle.API;

    beforeEach( function () {
        onCommit.reset();
    } );

    describe( 'when I initialise it', function () {
        it( 'should return a confirmation', function () {
            expect( API.LMSInitialize( '' ) ).to.eql( 'true' );
        } );
    } );

    describe( 'when I suspend data', function () {
        it( 'I should be able to recover it', function () {
            var state = 'viewed=1,2,3,4,5,6,7,8,9,10';
            expect( API.LMSSetValue( 'cmi.suspend_data', state ) ).to.eql( 'true' );
            expect( API.LMSGetValue( 'cmi.suspend_data' ) ).to.eql( state );
        } );
    } );

    describe( 'when I set the lesson status', function () {
        it( 'should provide me the correct lesson status', function () {
            var lesson_status = 'passed';
            API.LMSInitialize( '' );
            expect( API.LMSSetValue( 'cmi.core.lesson_status', lesson_status ) ).to.eql( 'true' );
            expect( API.LMSGetValue( 'cmi.core.lesson_status' ) ).to.eql( lesson_status );
        } );
    } );

    describe( 'when committing with a configured setup', function () {
        it( 'should callback', function () {
            barnacle.setup( { onCommit } );
            API.LMSInitialize( '' );
            API.LMSSetValue( 'cmi.core.lesson_status', 'passed' );
            API.LMSSetValue( 'cmi.core.score.raw', '81' );
            API.LMSCommit( '' );
            expect( onCommit.called ).to.be( true );
        } );
    } );

    describe( 'when commiting twice when nothing has changed', function () {
        it( 'should not post', function () {
            API.LMSInitialize( '' );
            API.LMSSetValue( 'cmi.core.lesson_status', 'passed' );
            API.LMSSetValue( 'cmi.core.score.raw', '81' );
            API.LMSCommit( '' );

            onCommit.reset();
            API.LMSCommit( '' );
            expect( onCommit.called ).to.be( false );
        } );
    } );

    describe( 'given I have no current interactions', function () {
        describe( 'when I get the interaction count', function () {
            it( 'should be zero', function () {
                API.LMSInitialize( '' );

                expect( API.LMSGetValue( 'cmi.interactions._count' ) ).to.be( '0' );
            } )
        } )
    } );

    describe( 'given I have interactions', function () {
        describe( 'when I get the interaction count', function () {
            it( 'should be return the correct count', function () {
                API.LMSInitialize( '' );
                API.LMSSetValue( 'cmi.interactions.0.id', "id 1" );
                API.LMSSetValue( 'cmi.interactions.0.value', "Answer" );
                API.LMSSetValue( 'cmi.interactions.1.id', "id 2" );
                API.LMSSetValue( 'cmi.interactions.1.value', "Answer 2" );

                expect( API.LMSGetValue( 'cmi.interactions._count' ) ).to.be( '2' );
            } )
        } );

        describe( 'when I get the interaction children', function () {
            it( 'should be return an array of items', function () {
                API.LMSInitialize( '' );
                API.LMSSetValue( 'cmi.interactions.0.id', "id 1" );
                API.LMSSetValue( 'cmi.interactions.0.value', "Answer" );
                API.LMSSetValue( 'cmi.interactions.1.id', "id 2" );
                API.LMSSetValue( 'cmi.interactions.1.value', "Answer 2" );

                expect( API.LMSGetValue( 'cmi.interactions._children' ) ).to.eql( [
                    {
                        id: "id 1",
                        value: "Answer"
                    },
                    {
                        id: "id 2",
                        value: "Answer 2"
                    }
                ] );
            } )
        } );

        describe( 'when I get the interaction children', function () {
            it( 'should be return an array of items', function () {
                API.LMSInitialize( '' );
                API.LMSSetValue( 'cmi.interactions.1.id', "id 2" );
                API.LMSSetValue( 'cmi.interactions.1.type', "true-false" );

                expect( API.LMSGetValue( 'cmi.interactions._children' ) ).to.eql( [
                    {
                        id: "id 2",
                        type: "true-false"
                    }
                ] );
            } )
        } )
    } );

} );