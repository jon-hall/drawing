// Base class for objects which can draw
function Drawer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pos = null;
}

Drawer.prototype.draw = function (pos) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.pos.x, this.pos.y);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.pos = pos;
};

// Mouse event-based drawer for local user
function MouseDrawer(canvas) {
    var _this = this;

    Drawer.call(this, canvas);

    function event_point(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    // TODO: Need to send this info up the socket..
    canvas.addEventListener('mousedown', function(event) {
        _this.pos = event_point(event);
    });

    canvas.addEventListener('mouseup', function(event) {
        _this.draw(event_point(event));
        _this.pos = null;
    });

    canvas.addEventListener('mousemove', function(event) {
        if(_this.pos) {
            _this.draw(event_point(event));
        }
    });
}
MouseDrawer.prototype = Object.create(Drawer.prototype);

// Socket event based drawer for remote users
function SocketDrawer(canvas, id, socket) {
    Drawer.call(this, canvas);

    socket.on('move:' + id, function(pos) {
        _this.pos = pos;
    });

    socket.on('draw:' + id, function(pos) {
        _this.draw(pos);
    });
}
SocketDrawer.prototype = Object.create(Drawer.prototype);

// Overall drawing app
function Drawing(canvas, socket, our_id) {
    var _this = this;

    // Add new socket clients to 'drawers'
    socket.on('client', function(id) {
        _this.drawers[id] = new SocketDrawer(id, socket);
    });

    // Remove disconnected clients
    socket.on('leave', function(id) {
        delete _this.drawers[id];
    });

    this.drawers = {};
    this.drawers[our_id] = new MouseDrawer(canvas);
}
