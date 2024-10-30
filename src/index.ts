async function bootstrap() {
    try {
        await import( "./server" );
        await import( "./client" );
    }

    catch( e ) {
        console.error( e );
    }
}

bootstrap();
