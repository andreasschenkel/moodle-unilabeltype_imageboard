/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const init = () => {
    // Store some data about the selected image that is moved.
    var activeItem = null;
    var activeNumber = null;
    // itemToMove is the div that the selected image is inside. We do NOT move the image we move the div.
    var itemToMove = null;
    var xoffset = 0;
    var yoffset = 0;
    var canvas = null;
    var activewidth = null;
    var activeheight = null;

    var canvaswidth = 950;
    var canvasheight = 400;


    listener();

    /**
     *
     */
    function listener() {
        ////console.log("listener");
        setTimeout(function() {
            canvas = document.getElementById("unilabel-imageboard-background-area");
            canvas.addEventListener("mousedown", dragStart, false);
            canvas.addEventListener("mousemove", drag, false);
            canvas.addEventListener("mouseup", dragEnd, false);
        }, 1000);
    }

    /**
     *
     * @param {event} event
     */
    function dragStart(event) {
        console.log("dragStart");
        console.log("event", event);
        if (event.target.classList.contains('image')) {
            event.preventDefault();
            activeItem = event.target;
            activeNumber = event.target.getAttribute('id').split('unilabel-imageboard-imageid_')[1];
            activewidth = event.target.style.width.split('px')[0];
            // ToDo: height auto needs different code
            activewidth = event.target.style.width.split('px')[0];
            activeheight = event.target.style.height.split('px')[0];
            itemToMove = document.getElementById('unilabel_imageboard_imagediv_' + activeNumber);
            var position = canvas.getBoundingClientRect();
            var offsetLeft = position.left;
            var offsetTop = position.top;
            xoffset = event.layerX;
            yoffset = event.layerY;
            console.log("event.clientX - offsetLeft - xoffset", event.clientX, offsetLeft, xoffset);
            console.log("event.clientY - offsetTop - yoffset", event.clientY, offsetTop, yoffset);
            var xposition = event.clientX - offsetLeft - xoffset;
            var yposition = event.clientY - offsetTop - yoffset;
            if (activeItem) {
                itemToMove.style.left = Math.round(xposition) + "px";
                itemToMove.style.top = Math.round(yposition) + "px";
            }
        } else {
            ///console.log("no image selected");
        }
    }

    /**
     *
     * @param {event} event
     */
    function drag(event) {
        //event.preventDefault();;
        console.log("event", event);
        if (event.target.classList.contains('image') && activeItem) {
            var position = canvas.getBoundingClientRect();
            var offsetLeft = position.left;
            var offsetTop = position.top;
            var xposition = event.clientX - offsetLeft - xoffset;
            var yposition = event.clientY - offsetTop - yoffset;
            if (xposition < 0) {
                xposition = 0;
            }
            if (yposition < 0) {
                yposition = 0;
            }

            if (xposition >= canvaswidth - activewidth) {
                xposition = canvaswidth - activewidth;
            }
            if (yposition >= canvasheight - activeheight) {
                yposition = canvasheight - activeheight;
            }
            itemToMove.style.left = Math.round(xposition) + "px";
            itemToMove.style.top = Math.round(yposition) + "px";
            // Change the inputfield
            const inputPositionX = document.getElementById('id_unilabeltype_imageboard_xposition_' + (activeNumber));
            const inputPositionY = document.getElementById('id_unilabeltype_imageboard_yposition_' + (activeNumber));
            inputPositionX.value = Math.round(xposition);
            inputPositionY.value = Math.round(yposition);
        }
    }

    /**
     *
     * @param {event} event
     */
    function dragEnd(event) {
        //event.preventDefault();
        console.log("----dragEnd");
        console.log("event", event);
        if (activeItem) {
            var position = canvas.getBoundingClientRect();
            var offsetLeft = position.left;
            var offsetTop = position.top;
            var xposition = event.clientX - offsetLeft - xoffset;
            var yposition = event.clientY - offsetTop - yoffset;
            if (xposition < 0) {
                xposition = 0;
            }
            if (yposition < 0) {
                yposition = 0;
            }
            if (xposition >= canvaswidth - activewidth) {
                xposition = canvaswidth - activewidth;
            }
            if (yposition >= canvasheight - activeheight) {
                yposition = canvasheight - activeheight;
            }
            itemToMove.style.left = Math.round(xposition) + "px";
            itemToMove.style.top = Math.round(yposition) + "px";

            // Change the inputfield
            const inputPositionX = document.getElementById('id_unilabeltype_imageboard_xposition_' + (activeNumber));
            const inputPositionY = document.getElementById('id_unilabeltype_imageboard_yposition_' + (activeNumber));
            inputPositionX.value = Math.round(xposition);
            inputPositionY.value = Math.round(yposition);
            activeItem = null;
            activeNumber = null;
        }
    }
};
