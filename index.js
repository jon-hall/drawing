exports.io = function() {
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
        });

        socket.join('drawing');
        socket.to('drawing').emit('join', socket.id);

        return next();
    };
};
