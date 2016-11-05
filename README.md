# drawing :art:
Simple multi-user whiteboard-as-a-service using websockets and bookmarklets.

#### Drawing server
Install
```sh
npm i drawing -g
```
Run
```sh
drawing
```

To run on a port other than 3000, set the `PORT` environment variable to your preferred port

#### Drawing API
> **TODO**: Document how to integrate this into an existing app as a quick and dirty multi-user
whiteboard - essentially, the export from this library is a socket.io middleware and you would also
need to pull in the client files on your target page to create and run the whiteboard
