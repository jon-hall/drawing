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

    function eventPoint(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    canvas.addEventListener('mousedown', function(event) {
        _this.pos = eventPoint(event);
    });

    canvas.addEventListener('mouseup', function(event) {
        _this.draw(eventPoint(event));
        _this.pos = null;
    });

    canvas.addEventListener('mousemove', function(event) {
        if(_this.pos) {
            _this.draw(eventPoint(event));
        }
    });
}
MouseDrawer.prototype = Object.create(Drawer.prototype);

// TODO: Socket event based drawer for remote users

// Overall drawing app
function Drawing(canvas) {
    // TODO: Open a socket connection
    // TODO: Add new clients to 'drawers'
    // TODO: Remove disconnected clients
    this.drawers = [new MouseDrawer(canvas)];
}
