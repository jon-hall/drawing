exports.io = function() {
    var sockets = {},
        existing;

    return function(socket, next) {
        var draw_event = 'draw:' + socket.id,
            move_event = 'move:' + socket.id;

        socket.on(draw_event, function(pos) {
            socket.to('drawing').emit(draw_event, pos);
        });

        socket.on(move_event, function(pos) {
            socket.to('drawing').emit(move_event, pos);
        });

        socket.on('disconnect', function() {
            socket.to('drawing').emit('leave', socket.id);
            delete sockets[socket.id];
        });

        socket.on('ready_to_draw', function() {
            // Tell the client about everyone else, when they're ready
            for(existing in sockets) {
                if(sockets.hasOwnProperty(existing)) {
                    socket.emit('join', existing);
                }
            }
            sockets[socket.id] = socket;
        });

        socket.join('drawing');
        socket.to('drawing').emit('join', socket.id);
        socket.emit('ready', socket.id);
        
        return next();
    };
};
