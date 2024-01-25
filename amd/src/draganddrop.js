/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @param {boolean} ispreviewmode
 */
export const init = (ispreviewmode) => {
    if (ispreviewmode == 0) {
        // We do not need eventlisteners because we are not in editing mode where we need preview.
        return;
    }
    const imageids = document.querySelectorAll('[id^="imageid_"]');
    let i = 0;
    for (i=0; i<imageids.length; i++) {
        let imageid = imageids[i];
        // Eventlistener an das Inputfeld für die x-Koordinate anhängen
        const input_xposition = document.getElementById("id_unilabeltype_imageboard_xposition_" + (i));
        input_xposition.addEventListener("focusout", function() {
            const x = parseInt(input_xposition.value);
            imageid.style.left = x + "px";
        });
        const input_yposition = document.getElementById("id_unilabeltype_imageboard_yposition_" + (i));
        input_yposition.addEventListener("focusout", function() {
            const y = parseInt(input_yposition.value);
            imageid.style.top = y + "px";
        });
    }
};
