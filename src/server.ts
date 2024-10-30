let total_requests = 0;

function long_operation() {
    if( total_requests === 2 ) {
        return new Promise( resolve => setTimeout( resolve, 100 ) );
    }

    return new Promise( resolve => setTimeout( resolve, 1000 ) );
}

// JavaScript is single-threaded;

// First request comes in
// Second request is BLOCKED

// id = 0
// total_requests = 1
// First request increments total_requests
// First request logs
// First request is delegated to the event loop

// Second request is UNBLOCKED
// id = 1
// total_requests = 2
// Second request logs
// Second request is delegated to the event loop

// Here another request can come in since we are not BLOCKING

// Second request finishes before the FIRST request
// id = 1
// Second request logs that it went through with id = 1
// total_requests = 2

// First request then finishes
// id = 0
// First request logs that it went through with id = 0
// total_requests = 2

// Q1: Why does the ID knows what it is? Does await somehow move the scope of consts?
// Q2: Is there a way to avoid incrementation issues that arise from async/await?

const server = Bun.serve( 
    {
        hostname: "localhost",
        port: 8080,
        async fetch( request: Request ) {
            const id = total_requests;
            // Doing this to avoid using total_requests++, for clarity
            total_requests = total_requests + 1;

            console.log( `req-${id} received`)
            
            await long_operation();

            console.log( `Made it through req-${id}` );

            console.log( `Total requests: ${total_requests}` );

            return new Response( "OK", { status: 200 } );
        }
    } 
);

console.log( `Server started @ http://${server.hostname}:${server.port}` );
