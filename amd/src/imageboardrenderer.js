/**
 * @param {string} cmid
 * @param {string} canvaswidth
 * @param {string} canvasheight
 */
export const init = (cmid, canvaswidth, canvasheight) => {
    //window.addEventListener("resize", function () {
    //if (canvaswidth > getWidth()) {


    const resizer = document.getElementById("unilabeltype-imageboard-resizer-"+cmid);
    resizer.addEventListener("click", function () {

            const dummy = document.getElementById("unilabeltype-imageboard-gridtoggler-"+cmid);
            let newcanvaswidth = 0;
            if (getWidth() < 750) {
                newcanvaswidth = (getWidth() - dummy.getBoundingClientRect().left)-10;
            } else if (getWidth() < 585) {
                newcanvaswidth = (getWidth() - dummy.getBoundingClientRect().left)-20;
            } else {
                newcanvaswidth = (getWidth() - dummy.getBoundingClientRect().left)-80;
            }

            if (newcanvaswidth > canvaswidth) {
                newcanvaswidth = canvaswidth ;
            }

            let widthfactor = newcanvaswidth / canvaswidth;
            //const mydiv = document.getElementById("module-"+cmid);
            const mydiv = document.getElementById("unilabeltype-imageboard-"+cmid);

            mydiv.style.transform = "scale("+widthfactor+")";
            mydiv.style.transformOrigin = "0 0";

            canvasheight = canvasheight + 1;
            /*
            // ToDo: Implement a way to reduce white space beloc imageboard when resizing/shrinking imageboard.
            const elementLi = document.querySelector("li#section-0");
            elementLi.style.border = "solid 2px";

            let offsetHeight = elementLi.offsetHeight;
            let difference = canvasheight * (1 - widthfactor);
            let newLiHeight = offsetHeight - difference;
            alert("offsetHeight=" + offsetHeight +
                "   difference=" + difference +
                "   newLiHeight=" + newLiHeight);

            elementLi.style.height = newLiHeight + "px";
*/
    });

    // Add eventlistener that toggles the 50x50px helpergrid on and off
    const gridtoggler = document.getElementById("unilabeltype-imageboard-gridtoggler-"+cmid);
    gridtoggler.addEventListener("click", function () {
        const helpergridsquares = document.getElementsByClassName("unilabeltype-imageboard-helpergrid-"+cmid);
        Array.prototype.forEach.call(helpergridsquares, function (helpergridsquare) {
            helpergridsquare.classList.toggle("hidden");
        });

    });
};


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
