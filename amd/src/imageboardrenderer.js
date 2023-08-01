/**
 * @param {string} cmid
 */
export const init = (cmid) => {
    docReady(createimageboard(cmid));
};

const docReady = (callback) => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(callback, 1);
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

/**
 * This is the function that do all the stuff after document.readyState === "complete" || document.readyState === "interactive"
 * @param {string} cmid
 */
const createimageboard = (cmid) => {
    // First draw the canvas
    drawCanvas(cmid);
    // Second add the backgroundimage
    drawBackgroundimage(cmid);
    // Third add the images (this also draws the borders and adds click-eventlistener)
    drawAllImages(cmid);
    window.addEventListener("resize", function() {
        // First draw the canvas
        drawCanvas(cmid);
        // Second add the backgroundimage
        drawBackgroundimage(cmid);
        // Third add the images (this also draws the borders and adds click-eventlistener)
        drawAllImages(cmid);
        // ToDo: Check if it is better to now create the clickable areas instead of adding them in
        // the drawAllImages espaccaly in drawOneImage function
    });
};


/**
 * This function draws the canvas for the unilabel subplugin.
 * There can be more than one canvas on a page so the id {{cmid}} is needed.
 * An eventlistener listens to resize of the page and if width is not enought
 * then the canvas is rezised to 90%.
 *
 * @param {string} cmid
 */
function drawCanvas(cmid) {
    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-" + cmid);
    const myContext = myCanvas.getContext("2d");
    // Read the desired width and hight of the canvas
    const canvaswidth = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvaswidth');
    const canvasheight = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvasheight');
    // Initialize variables
    let newcanvaswidth = 1;
    let widthfactor = 1;
    let newcanvasheight = 1;

    // Check if the browser width is big enough for the canvaswidth or if not then calculate 90% as "newcanvaswidth"
    if (canvaswidth > getWidth()) {
        newcanvaswidth = getWidth() * 0.90;
        widthfactor = newcanvaswidth / canvaswidth;
        newcanvasheight = canvasheight * widthfactor ;
        myContext.canvas.width = newcanvaswidth;
        myContext.canvas.height = newcanvasheight;
    } else {
        myContext.canvas.width = canvaswidth;
        myContext.canvas.height = canvasheight;
    }
    /*
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
    */
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
 */
function drawAllImages(cmid) {
    // Read all values that are the same for all images in order to not need this calls for every image
    const canvaswidth = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvaswidth');
    const canvasheight = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvasheight');
    const showborders = document.querySelector('.imageboard-'+cmid).getAttribute('data-showborders');
    const bordercolor = document.querySelector('.imageboard-'+cmid).getAttribute('data-bordercolor');
    // loop all images and also pass the above values
    document.querySelectorAll('.imageboardimage-'+cmid).forEach(image => {
        drawOneImage(cmid,
            canvaswidth,
            canvasheight,
            showborders,
            bordercolor,
            image.dataset);
    });
}

/**
 * @param {string} cmid
 * @param {string} canvaswidth
 * @param {string} canvasheight
 * @param {bool} showborders
 * @param {string} bordercolor
 * @param {img} image
 */
function drawOneImage(cmid,
                      canvaswidth,
                      canvasheight,
                      showborders,
                      bordercolor,
                      image) {
    let title = image.title;
    let url = image.url;
    let imageurl = image.imageurl;
    let targetwidth = image.targetwidth;
    let targetheight = image.targetheight;
    let xposition = image.xposition;
    let yposition = image.yposition;

    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-"+cmid);
    const myContext = myCanvas.getContext("2d");
    const img = new Image();
    let font = "20px Arial";
    const fillstylebackground = '#f50';
    img.src = imageurl;
    let widthfactor = 1;
    let titleheight = 0;

        // Calculate a resize faktor if not enough width exists to display the canvas
        if (canvaswidth > getWidth()) {
            // Calculate a factor the width has to be scaled in order to let the canvas fit on the screen
            widthfactor =  getWidth() * 0.90 / canvaswidth;
        }

        if (targetwidth != 0 && targetheight != 0) {
        } else {
            if (targetheight == 0) {
                if (targetwidth == 0) {
                    targetwidth = img.width;
                    targetheight = img.height;
                } else {
                    let faktor = targetwidth / img.width;
                    targetheight = img.height * faktor;
                }
            } else {
                if (targetheight == 0) {
                    targetwidth = img.width;
                    targetheight = img.height;
                } else {
                    let faktor = targetheight / img.height;
                    targetwidth = img.width * faktor;
                }
            }
        }
    img.onload = function() {
        myContext.drawImage(img,
            xposition * widthfactor,
            yposition * widthfactor,
            targetwidth * widthfactor,
            targetheight * widthfactor);


        if (showborders) {
            let fill = false;
            drawBorder(myContext,
                xposition * widthfactor,
                yposition * widthfactor,
                targetwidth * widthfactor,
                targetheight * widthfactor,
                fill,
                bordercolor,
                1);
        }

        // Title
        if (title != '') {
            titleheight = 30;
            myContext.fillStyle = fillstylebackground;
            myContext.fillRect(xposition * widthfactor - 1,
                yposition * widthfactor - (titleheight+1),
                (targetwidth * widthfactor) + 1,
                titleheight);
            myContext.fillStyle = '#fff';
            myContext.font = font;
            myContext.fillText(title, xposition * widthfactor, yposition * widthfactor - 10);
        }

        // Add event listener for `click` events.
        myCanvas.addEventListener('click', function(event) {
            const rect = myCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if ((x > xposition * widthfactor && (x < xposition * widthfactor + targetwidth * widthfactor))
                && (y > yposition * widthfactor - titleheight && (y < yposition * widthfactor + targetheight * widthfactor))) {
                if (url){
                    //window.open(url); // Use this to open in new tab
                    window.location = url; // Use this to open in current window
                }
            } else {
                const capababilityforgrid = document.querySelector('.imageboard-'+cmid).getAttribute('data-capababilityforgrid');
                if (capababilityforgrid == '1') {
                    drawGrid(cmid);
                }
            }
        }, false);
    };

        // Now add eventlistener to resize canvas and images when needed.
        /*
        window.addEventListener("resize", function() {
            if (canvaswidth > getWidth()) {
                widthfactor = getWidth() * 0.90 / canvaswidth;
                myContext.drawImage(img,
                    xposition * widthfactor,
                    yposition * widthfactor,
                    targetwidth * widthfactor,
                    targetheight * widthfactor
                );
                if (showborders) {
                    var fill = false;
                    drawBorder(myContext, xposition * widthfactor,
                        yposition * widthfactor,
                        targetwidth * widthfactor,
                        targetheight * widthfactor,
                        fill, bordercolor,
                        1
                    );
                }
                // Title
                if (title != '') {
                    myContext.fillStyle = fillstylebackground;
                    myContext.fillRect(xposition * widthfactor - 1,
                        yposition * widthfactor - (titleheight+1),
                        (targetwidth * widthfactor) + 1,
                        titleheight);
                    myContext.fillStyle = '#fff';
                    myContext.font = font;
                    myContext.fillText(title, xposition * widthfactor, yposition * widthfactor - 10);
                }
            }
        }, false);

         */
}

/**
 *
 * @param {string} ctx
 * @param {string} x x-position of the upper left corner
 * @param {string} y y-position of the upper left corner
 * @param {string} width
 * @param {string} height
 * @param {string} fill
 * @param {string} strokeStyle Color of the stroke to be drawn
 * @param {string} strokeWidth
 */
function drawBorder(ctx, x, y, width, height, fill, strokeStyle, strokeWidth) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.shadowColor = '#f00';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (strokeStyle) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
}

/**
 * Draw a grid on the canvas to support a better positioning of images.
 * myContext.canvas.width
 * @param {string} cmid
 */
function drawGrid(cmid) {
    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-"+cmid);
    const ctx = myCanvas.getContext("2d");
    let strokeStyle = "#841ba1";
    let strokeWidth = 1;
    const canvaswidth = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvaswidth');
    let widthfactor = ctx.canvas.width / canvaswidth;
    ctx.beginPath();
    let x = 1;
    let y = 1;
    for (let a = 1; a<15; a++) {
        for (let i = 1; i<23; i++) {
            ctx.rect(x, y, 50*widthfactor, 50*widthfactor);
            x=x+50*widthfactor;
        }
        x = 1;
        y = y+50*widthfactor;
    }
    if (strokeStyle) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
}

/**
 * @param {string} cmid
 */
function drawBackgroundimage(cmid) {
    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-"+cmid);
    const myContext = myCanvas.getContext("2d");
    var backgroundImage = new Image();
    backgroundImage.src = document.querySelector('.imageboard-'+cmid).getAttribute('data-backgroundimage');
    backgroundImage.onload = function() {
        var canvaswidth = document.querySelector('.imageboard-'+cmid).getAttribute('data-canvaswidth');
        var newcanvaswidth = 0;
        if (canvaswidth > getWidth()) {
            newcanvaswidth = getWidth() * 0.90;
        } else {
            newcanvaswidth = canvaswidth;
        }
        myContext.drawImage(backgroundImage, 0, 0, newcanvaswidth, backgroundImage.height * newcanvaswidth / backgroundImage.width);
/*
        window.addEventListener("resize", function() {
            if (canvaswidth > getWidth()) {
                newcanvaswidth = getWidth() * 0.90;
                myContext.drawImage(backgroundImage,
                    0,
                    0,
                    newcanvaswidth,
                    backgroundImage.height * newcanvaswidth / backgroundImage.width);
            }
        });
 */
    };
}
