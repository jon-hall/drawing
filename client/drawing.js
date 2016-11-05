// Base class for objects which can draw
function Drawer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pos = null;
}

Drawer.prototype.draw = function (pos) {
    // Since the canvas may be a different size than specified, due to styling etc., we need to scale
    // Calculate scale every time we draw, in-case it changes for some reason
    var xScale = this.canvas.width / this.canvas.offsetWidth,
        yScale = this.canvas.height / this.canvas.offsetHeight;

    if(this.pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(xScale * this.pos.x, yScale * this.pos.y);
        this.ctx.lineTo(xScale * pos.x,  yScale * pos.y);
        this.ctx.stroke();
    }

    this.pos = pos;
};

// Mouse event-based drawer for local user
function event_point(event) {
    return {
        x: event.offsetX,
        y: event.offsetY
    };
}

function MouseDrawer(canvas, socket, id) {
    var _this = this;

    Drawer.call(this, canvas);
    this.socket = socket;
    this.id = id;

    canvas.addEventListener('mousedown', function(event) {
        _this.move(event_point(event));
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

MouseDrawer.prototype.draw = function(pos) {
    // Send new point up the socket
    this.socket.emit('draw:' + this.id, pos);

    // Call base draw method
    Drawer.prototype.draw.call(this, pos);
};

MouseDrawer.prototype.move = function(pos) {
    // Send reposition up the socket
    this.socket.emit('move:' + this.id, pos);
    this.pos = pos;
};

// Socket event based drawer for remote users
function SocketDrawer(canvas, id, socket) {
    var _this = this;

    Drawer.call(this, canvas);

    socket.on('move:' + id, function(pos) {
        _this.pos = pos;
    });

    socket.on('draw:' + id, function(pos) {
        _this.draw(pos);
        _this.pos = pos;
    });
}
SocketDrawer.prototype = Object.create(Drawer.prototype);

// Overall drawing app
function Drawing(canvas, socket, our_id) {
    var _this = this;
    // Add new socket clients to 'drawers'
    socket.on('join', function(id) {
        _this.drawers[id] = new SocketDrawer(canvas, id, socket);
    });

    // Remove disconnected clients
    socket.on('leave', function(id) {
        delete _this.drawers[id];
    });

    this.drawers = {};
    this.drawers[our_id] = new MouseDrawer(canvas, socket, our_id);

    socket.emit('ready_to_draw');
}
