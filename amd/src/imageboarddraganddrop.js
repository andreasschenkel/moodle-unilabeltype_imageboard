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
        //event.preventDefault();
        console.log("drag");
        console.log("event", event);
        if (event.target.classList.contains('image') && activeItem) {
            var position = canvas.getBoundingClientRect();
            console.log("position", position);
            var offsetLeft = position.left;
            var offsetTop = position.top;
            //var xoffset = event.target.clientWidth / 2;
            //var yoffset = event.target.clientHeight / 2;
            var xposition = event.clientX - offsetLeft - xoffset;
            var yposition = event.clientY - offsetTop - yoffset;
            if (xposition < 0) {
                xposition = 0;
            }
            if (yposition < 0) {
                yposition = 0;
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

