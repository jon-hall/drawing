function drawify(anchor, width, height) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        pos;

    canvas.width = width || 600;
    canvas.height = height || 400;
    canvas.style.background = 'white';
    canvas.style.cursor = 'pointer';

    // TODO: Connect socket
    // TODO: Send points up socket
    // TODO: Receive points from socket for known lines + continue drawing them

    function point(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    function draw(next) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        pos = next;
    }

    canvas.addEventListener('mousedown', function(event) {
        pos = point(event);
    });

    canvas.addEventListener('mouseup', function(event) {
        draw(point(event));
        pos = null;
    });

    canvas.addEventListener('mousemove', function(event) {
        if(pos) {
            draw(point(event));
        }
    });

    if(anchor && anchor.appendChild) {
        anchor.appendChild(canvas);
    } else {
        document.body.appendChild(canvas);
    }

    return canvas;
}

// Run drawify on target of next click event
function applyDrawify(event) {
    drawify(event.target);
    window.removeEventListener('click', applyDrawify);
}
window.addEventListener('click', applyDrawify);
