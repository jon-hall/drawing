// Bookmarklet helper to create a canvas to draw on within the next clicked element
// - assumes Drawing is already defined
function drawify(socket, our_id) {
    function make_drawing(event) {
        window.removeEventListener('click', make_drawing);

        var canvas = document.createElement('canvas');

        canvas.width = window.DRAWING_WIDTH || 600;
        canvas.height = window.DRAWING_HEIGHT || 400;
        canvas.style.background = 'white';
        canvas.style.cursor = 'pointer';

        event.target.appendChild(canvas);

        // This goes nowhere...
        return new Drawing(canvas, socket, our_id);
    }
    window.addEventListener('click', make_drawing);
}
