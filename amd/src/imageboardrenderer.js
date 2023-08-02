/**
 * @param {string} cmid
 * @param {string} canvaswidth
 */
export const init = (cmid, canvaswidth) => {
    window.addEventListener("resize", function() {
        if (canvaswidth > getWidth()) {
            let newcanvaswidth = getWidth() * 0.90;
            let widthfactor =  newcanvaswidth / canvaswidth;
            const mydiv = document.getElementById("module-" + cmid);
            mydiv.style.transform="scale("+widthfactor+")";
            mydiv.style.transformOrigin="0 0";
        }
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
