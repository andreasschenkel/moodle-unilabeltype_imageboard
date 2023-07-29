/**
 * An event listener is added so if the window is resized an the width is not enought the canvas is resized and so
 * the images have to be redrawn with resized width.
 *
 * @param imageid
 * @param imageurl
 * @param targetwidth
 * @param targetheight
 * @param xposition
 * @param yposition
 * @param url
 * @param border
 */
function drawImage{{cmid}}(imageid, title, imageurl, targetwidth, targetheight, xposition, yposition, url, showborders) {
    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-{{cmid}}");
    const myContext = myCanvas.getContext("2d");
    const img = new Image();
    font = "20px Arial";
    const fillstylebackground = '#f50';
    img.src = imageurl;
    widthfactor = 1;
    let titleheight = 0;
    img.onload = () => {
        // Calculate a resize faktor if not enough width exists to display the canvas
        if ({{{canvaswidth}}} > getWidth()) {
            newcanvaswidth = getWidth() * 0.90;
            widthfactor =  newcanvaswidth / {{{canvaswidth}}};
            newcanvasheight = {{{canvasheight}}} * widthfactor ;
        }

        if (targetwidth != 0 && targetheight != 0) {
        } else {
            if (targetheight == 0) {
                if (targetwidth == 0) {
                    targetwidth = img.width;
                    targetheight = img.height;
                } else {
                    faktor = targetwidth / img.width;
                    targetheight = img.height * faktor;
                }
            } else {
                if (targetheight == 0) {
                    targetwidth = img.width;
                    targetheight = img.height;
                } else {
                    faktor = targetheight / img.height;
                    targetwidth = img.width * faktor;
                }
            }
        }

        myContext.drawImage(img, xposition * widthfactor, yposition * widthfactor, targetwidth * widthfactor, targetheight * widthfactor );
        if (showborders) {
            var fill = false;
            drawBorder(myContext, xposition * widthfactor, yposition * widthfactor, targetwidth * widthfactor, targetheight * widthfactor, fill, '{{{bordercolor}}}', 0);
        }
        // Title
        if (title != '') {
            titleheight = 30
            myContext.fillStyle = fillstylebackground;
            myContext.fillRect(xposition * widthfactor - 1, yposition * widthfactor - (titleheight+1), (targetwidth * widthfactor) + 1, titleheight);
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
                && (y > yposition * widthfactor - titleheight && (y < yposition * widthfactor + targetheight * widthfactor))
            ) {
                if (url){
                    //window.open(url); // Use this to open in new tab
                    window.location = url; // Use this to open in current window
                }
            } else {
                {{#capababilityforgrid}}
                drawGrid{{cmid}}('{{{gridcolor}}}', 1);
                {{/capababilityforgrid}}
                }
                }, false);
            };

            window.addEventListener("resize", function(event) {
                if ({{{canvaswidth}}} > getWidth()) {
                    newcanvaswidth = getWidth() * 0.90;
                    widthfactor =  newcanvaswidth / {{{canvaswidth}}};
                    newcanvasheight = {{{canvasheight}}} * widthfactor ;
                    myContext.drawImage(img, xposition * widthfactor, yposition * widthfactor, targetwidth * widthfactor, targetheight * widthfactor );
                    if (showborders) {
                        var fill = false;
                        drawBorder(myContext, xposition * widthfactor, yposition * widthfactor, targetwidth * widthfactor, targetheight * widthfactor , fill, '{{{bordercolor}}}', 0);
                    }
                    // Title
                    if (title != '') {
                        myContext.fillStyle = fillstylebackground;
                        myContext.fillRect(xposition * widthfactor - 1, yposition * widthfactor - (titleheight+1), (targetwidth * widthfactor) + 1, titleheight);
                        myContext.fillStyle = '#fff';
                        myContext.font = font;
                        myContext.fillText(title, xposition * widthfactor, yposition * widthfactor - 10);
                    }
                }
            }, false);
        }

        /**
         *
         * @param title
         * @param xposition
         * @param yposition
         * @param url
         */
        function drawText{{cmid}}(title, xposition, yposition, url) {
            setTimeout(function() {
                //alert(title);
                const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-{{cmid}}");
                const myContext = myCanvas.getContext("2d");

                font = "20px Arial";
                const titleheight = 30;
                const titlewidth = 150;
                const fillstylebackground = '#3399ff';

                if ({{{canvaswidth}}} > getWidth())
                {
                    newcanvaswidth = getWidth() * 0.90;
                    widthfactor = newcanvaswidth / {{{canvaswidth}}};
                    newcanvasheight = {{{canvasheight}}} * widthfactor;
                }

                myContext.fillStyle = fillstylebackground;
                myContext.fillRect(xposition * widthfactor, yposition * widthfactor, titlewidth * widthfactor, titleheight );
                myContext.fillStyle = '#fff';
                myContext.font = font;
                myContext.fillText(title, xposition*widthfactor + 3, yposition*widthfactor+20);


                // Add event listener for `click` events.
                myCanvas.addEventListener('click', function(event) {
                    const rect = myCanvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    if ((x > xposition * widthfactor && (x < xposition * widthfactor + titlewidth * widthfactor))
                        && (y > yposition * widthfactor && (y < yposition * widthfactor + titleheight))
                    ) {
                        if (url != ''){
                            //window.open(url); // Use this to open in new tab
                            window.location = url; // Use this to open in current window
                        } else {
                        }
                    } else {
                        //alert("keine Text angeklickt");
                        {{#capababilityforgrid}}
                        drawGrid{{cmid}}('{{{gridcolor}}}', 1);
                        {{/capababilityforgrid}}
                        }
                        }, false);

                        window.addEventListener("resize", function(event) {
                            if ({{{canvaswidth}}} > getWidth()) {
                                newcanvaswidth = getWidth() * 0.90;
                                widthfactor =  newcanvaswidth / {{{canvaswidth}}};
                                // Title
                                myContext.fillStyle = fillstylebackground;
                                myContext.fillRect(xposition * widthfactor, yposition * widthfactor, titlewidth*widthfactor, titleheight );
                                myContext.fillStyle = '#fff';
                                myContext.font = font;
                                myContext.fillText(title, xposition*widthfactor + 3, yposition*widthfactor+20);
                            }
                        }, false);
                    }, 200, title, xposition, yposition, url);
                }

                /**
                 *
                 * @param ctx
                 * @param x x-position of the upper left corner
                 * @param y y-position of the upper left corner
                 * @param width
                 * @param height
                 * @param fill
                 * @param strokeStyle Color of the stroke to be drawn
                 * @param strokeWidth
                 */
                function drawBorder(ctx, x, y, width, height, fill, strokeStyle, strokeWidth) {
                    ctx.beginPath()
                    ctx.rect(x, y, width, height);
                    ctx.shadowColor = '#000';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    if (fill) {
                        ctx.fillStyle = fill
                        ctx.fill()
                    }
                    if (strokeStyle) {
                        ctx.lineWidth = strokeWidth
                        ctx.strokeStyle = strokeStyle
                        ctx.stroke()
                    }
                }



                /**
                 * Draw a grid on the canvas to support a better positioning of images.
                 * myContext.canvas.width
                 * @param strokeStyle
                 * @param strokeWidth
                 */
                function drawGrid{{cmid}}(strokeStyle, strokeWidth) {
                    const myCanvas = document.getElementById("unilabeltype-imageboard-canvas-{{cmid}}");
                    const ctx = myCanvas.getContext("2d");
                    widthfactor = ctx.canvas.width / {{{canvaswidth}}};
                    ctx.beginPath();
                    x = 1;
                    y = 1;
                    for (a = 1; a<15; a++) {
                        for (i = 1; i<23; i++) {
                            ctx.rect(x, y, 50*widthfactor, 50*widthfactor);
                            x=x+50*widthfactor;
                        }
                        x = 1;
                        y = y+50*widthfactor;
                    }
                    if (strokeStyle) {
                        ctx.lineWidth = strokeWidth
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke()
                    }
                }