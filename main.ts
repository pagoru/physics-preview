
// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection individually
    // without awaiting the function
    serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
        // The native HTTP server uses the web standard `Request` and `Response`
        // objects.
        const { pathname } = new URLPattern(requestEvent.request.url)
        
        let body;
        switch (pathname) {
            case '/':
                body = Deno.readFileSync('./bundle/index.html')
                break;
            case '/bundle.js':
                body = Deno.readFileSync('./bundle/bundle.js')
                break;
        }
        
        if(!body)
            return await requestEvent.respondWith(new Response('404', { status: 404 }))
        
        await requestEvent.respondWith(new Response(body));
    }
}