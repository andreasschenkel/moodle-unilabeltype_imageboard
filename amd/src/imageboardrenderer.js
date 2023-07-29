/**
 *
 * @param {string} cmid
 * @param {string} canvaswidth
 * @param {string} canvasheight
 * @param {array} images
 */
export const init = (cmid, canvaswidth, canvasheight, images) => {
    docReady(createimageboard(cmid, canvaswidth, canvasheight, images));
};

const docReady = (callback) => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(callback, 1);
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};


const createimageboard = (cmid, canvaswidth, canvasheight, images) => {
    drawthecanvas(cmid, canvaswidth, canvasheight);
    drawAllImages(cmid, images);
};


/**
 * This function draws the canvas for the unilabel subplugin.
 * There can be more than one canvas on a page so the id {{cmid}} is needed.
 * An eventlistener listens to resize of the page and if width is not enought
 * then the canvas is rezised to 90%.
 *
 * @param {string} cmid
 * @param {string} canvaswidth
 * @param {string} canvasheight
 */
function drawthecanvas(cmid, canvaswidth, canvasheight) {
    ////alert("drawthecanvas     cmid=" + cmid + "    canvaswidth="+canvaswidth + "    canvasheight="+canvasheight);
    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-" + cmid);
    const myContext = myCanvas.getContext("2d");
    var newcanvaswidth = 500;
    var widthfactor = 1;
    var newcanvasheight = 500;
    if ( canvaswidth > getWidth() ) {
        newcanvaswidth = getWidth() * 0.90;
        widthfactor = newcanvaswidth / canvaswidth;
        newcanvasheight = canvasheight * widthfactor ;
        myContext.canvas.width = newcanvaswidth;
        myContext.canvas.height = newcanvasheight;
    } else {
        myContext.canvas.width = canvaswidth;
        myContext.canvas.height = canvasheight;
    }
    window.addEventListener("resize", function() {
        if (canvaswidth > getWidth()) {
            newcanvaswidth = getWidth() * 0.90;
            widthfactor =  newcanvaswidth / canvaswidth;
            newcanvasheight = canvasheight * widthfactor ;
            myContext.canvas.width = newcanvaswidth;
            myContext.canvas.height = newcanvasheight;
        } else {
        }
    }, false);
}


/**
 * Helper function to get the width of the usable browserarea.
 *
 * @returns {*|number}
 */
function getWidth() {
    if (self.innerWidth) {
        return self.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }
    if (document.body) {
        return document.body.clientWidth;
    }
}

/**
 * @param {string} cmid
 * @param {array} images
 */
function drawAllImages(cmid, images) {
    alert("1. drawAllImages images=" +images);
    Array.prototype.forEach(images, image => {
        drawOneImage(cmid,image);
    });

}

/**
 * @param {string} cmid
 * @param {img} image
 */
function drawOneImage(cmid, image) {
    alert('1. drawOneImage');
    let dummy = image['id'];
    alert('dummy=' + dummy);
    alert("xxxxxdrawOneimage       cmid=" + cmid + " image=" + image);

}