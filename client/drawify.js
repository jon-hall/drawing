// Bookmarklet helper to create a canvas to draw on within the next clicked element
// - assumes Drawing is already defined
function drawify(event) {
    window.removeEventListener('click', drawify);

    var canvas = document.createElement('canvas');

    canvas.width = window.DRAWING_WIDTH || 600;
    canvas.height = window.DRAWING_HEIGHT || 400;
    canvas.style.background = 'white';
    canvas.style.cursor = 'pointer';

    event.target.appendChild(canvas);

    // This goes nowhere...
    return new Drawing(canvas);
}
window.addEventListener('click', drawify);
