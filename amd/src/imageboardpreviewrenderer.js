/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const init = () => {
    // Timeout notwendig, damit das Bild in der Draftarea "vorhanden" ist.
    // document.querySelector('#id_unilabeltype_imageboard_backgroundimage_fieldset .filemanager-container .realpreview');
    setTimeout(refreshBackgroundImage, 2000);
    setTimeout(registerAllEventlistener, 2500);
    // To show all images on pageload.
    setTimeout(refreshAllImages, 2500);
    /**
     *
     * @param {event} event
     */
    function oneListenerForAllPositionInput(event) {
        console.log("oneListenerForAllPositionInput", event);
        // Check if event is focus out.
        if (event.type === 'focusout') {
            console.log("event.target", event.target);

            var dummyAttribute = event.target.getAttribute('id');
            var titleInput = dummyAttribute.split('id_unilabeltype_imageboard_title_')[1];
            if (titleInput) {
                // Target ist inputfeld xposition so we have tu update the image
                refreshImage(xPositionInput);
            }

            var xPositionInput = dummyAttribute.split('id_unilabeltype_imageboard_xposition_')[1];
            if (xPositionInput) {
                // Target ist inputfeld xposition so we have tu update the image
                refreshImage(xPositionInput);
            }
            var yPositionInput = dummyAttribute.split('id_unilabeltype_imageboard_yposition_')[1];
            if (yPositionInput) {
                // Target ist inputfeld xposition so we have tu update the image
                refreshImage(yPositionInput);
            }




        }
    }
    /**
     * Register eventlistener to the all input fields of the form to register
     * focus-out events from input fields in order to trigger a fresh of the preview.
     */
    function registerAllEventlistener() {

        //var region = document.getElementById('region');
        var mform = document.querySelectorAll('[id^="mform"]')[0];
        // We register a listener to the mform and use the bubble-event-feature.
        mform.addEventListener("focusout", oneListenerForAllPositionInput, false);

        // First: When uploading a backgroundimage the backgroundimage of the backgroundimagediv must be updated.
        let backgroundfileNode = document.getElementById('id_unilabeltype_imageboard_backgroundimage_fieldset');
        if (backgroundfileNode) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(backgroundfileNode, {attributes: true, childList: true, subtree: true});
        }
        // Also add listener for canvas size
        let canvasx = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
        if (canvasx) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(canvasx, {attributes: true, childList: true, subtree: true});
        }
        let canvasy = document.getElementById('id_unilabeltype_imageboard_canvasheight');
        if (canvasy) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(canvasy, {attributes: true, childList: true, subtree: true});
        }

        // Second add listener to the add image button for new added images.
        let add_element_button = document.querySelectorAll('[id^="button-mform1"]')[0];
        add_element_button.addEventListener("click", function() {
            // No we can get the new form input fields and register a focusout listener
            // and in case of focus out we update the rendered image.
            // Thus we have to add a new div without any content and whenever there is a focusout event we will update this.
            // Then register listener for all images already exists
            setTimeout(function() {
                // An element was added so we have to add a div for the image
                // to the dom and wie need to register listener to the ne inputfieds of the element
                const singleElements = document.querySelectorAll('[id^="fitem_id_unilabeltype_imageboard_title_"]');
                let number = singleElements.length;
                addImageToDom(number - 1);
                setTimeout(function() {
                    registerAllListenersForAllElements();
                }, 1000);
            }, 1000);
        });

        // Third register listener for all images already exists
        setTimeout(function() {
            registerAllListenersForAllElements();
        }, 1000);
    }

    /**
     *
     */
    function registerAllListenersForAllElements() {
        // Third register listener for all images already exists
        const singleElements = document.querySelectorAll('[id^="fitem_id_unilabeltype_imageboard_title_"]');
        for (let i = 0; i < singleElements.length; i++) {
            let number = singleElements[i].getAttribute('id').split('fitem_id_unilabeltype_imageboard_title_')[1];
            registerAllListenersForSingleElement(number);
        }
    }

    /**
     * Registers to every input field a listener do find focusout events andthen call refreshimage().
     * @param {int} number
     */
    function registerAllListenersForSingleElement(number) {
        // Eventlistener an das Inputfeld für die width anhängen
        const input_targetwidth = document.getElementById('id_unilabeltype_imageboard_targetwidth_' + (number));
        input_targetwidth.addEventListener("focusout", function() {
            refreshImage(number);
        });

        const input_targetheight = document.getElementById('id_unilabeltype_imageboard_targetheight_' + (number));
        input_targetheight.addEventListener("focusout", function() {
            refreshImage(number);
        });

        const input_border = document.getElementById('id_unilabeltype_imageboard_border_' + (number));
        input_border.addEventListener("focusout", function() {
            refreshImage(number);
        });

        let imagefileNode = document.getElementById('fitem_id_unilabeltype_imageboard_image_' + (number));
        if (imagefileNode) {
            let observer = new MutationObserver(refreshImage);
            observer.observe(imagefileNode, {attributes: true, childList: true, subtree: true});
        }
    }

    /**
     * Sets the background image of the SVG to the current image in filemanager.
     */
    function refreshBackgroundImage() {
        // previewimage vom filemanager id_unilabeltype_imageboard_backgroundimage_fieldset erhalten
        let filemanagerbackgroundimagefieldset = document.getElementById('id_unilabeltype_imageboard_backgroundimage_fieldset');
        let previewimage = filemanagerbackgroundimagefieldset.getElementsByClassName('realpreview');
        let backgrounddiv = document.getElementById('unilabel-imageboard-background-area');
        if (previewimage.length > 0) {
            let backgroundurl = previewimage[0].getAttribute('src').split('?')[0];
            // If the uploaded file reuses the filename of a previously uploaded image, they differ
            // only in the oid. So one has to append the oid to the url.
            if (previewimage[0].getAttribute('src').split('?')[1].includes('&oid=')) {
                backgroundurl += '?oid=' + previewimage[0].getAttribute('src').split('&oid=')[1];
            }
            backgrounddiv.style.background = 'red'; // just to indicate changes during development.
            backgrounddiv.style.backgroundSize = 'cover';
            backgrounddiv.style.backgroundImage = "url('" + backgroundurl + "')";

            const canvaswidthinput = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
            let canvaswidthselected = canvaswidthinput.selectedOptions;
            let canvaswidth = canvaswidthselected[0].value;
            backgrounddiv.style.width = canvaswidth + "px";

            const canvasheightinput = document.getElementById('id_unilabeltype_imageboard_canvasheight');
            let canvasheightselected = canvasheightinput.selectedOptions;
            let canvasheight = canvasheightselected[0].value;
            backgrounddiv.style.height = canvasheight + "px";
        } else {
            // Image might be deleted so update the backroundidv and remove backgroundimage in preview;
            // ToDo    if (previewimage.length > 0) does not recognize when an image is deleted so we need a different condition!
            backgrounddiv.style.background = 'green'; // just to indicate changes during development.
            backgrounddiv.style.backgroundImage = "url('')";
            const canvaswidthinput = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
            let canvaswidthselected = canvaswidthinput.selectedOptions;
            let canvaswidth = canvaswidthselected[0].value;
            backgrounddiv.style.width = canvaswidth + "px";

            const canvasheightinput = document.getElementById('id_unilabeltype_imageboard_canvasheight');
            let canvasheightselected = canvasheightinput.selectedOptions;
            let canvasheight = canvasheightselected[0].value;
            backgrounddiv.style.height = canvasheight + "px";
        }
    }

    /**
     * Gets the number of ALL elements in the form and then adds a div for each element to the dom if not already exists.
     * We need a timeout
     */
    function refreshAllImages() {
        const singleElements = document.querySelectorAll('[id^="fitem_id_unilabeltype_imageboard_image_"]');
        for (let i = 0; i < singleElements.length; i++) {
            // Todo: Skip removed elements that are still in the dom but hidden.
            let singleElement = singleElements[i].getAttribute('id');
            let number = singleElement.split('fitem_id_unilabeltype_imageboard_image_')[1];
            // Check if there exists already a div for this image.
            const imageid = document.getElementById('unilabel-imageboard-imageid_' + number);
            if (imageid === null) {
                // Div does not exist so we need do add it do dom.
                addImageToDom(number);
                // ToDo: Do we need a timeout to wait until the dic was added so that refresh can work correctly?
                // see also refreshImage ... there is already a timeout
                refreshImage(number);
            } else {
                refreshImage(number);
            }
        }
    }

    /**
     *
     * @param {int} number
     */
    function addImageToDom(number) {
        let backgroundArea = document.getElementById('unilabel-imageboard-background-area');
        const imageid = document.getElementById('unilabel-imageboard-imageid_' + number);
        if (imageid === null) {
            // This div does not exist so we need do add it do dom.
            backgroundArea.innerHTML = backgroundArea.innerHTML + renderFromTemplate(number);
            refreshImage(number);
        } else {
            // Div already exists so we need only to refresh the image.
            refreshImage(number);
        }
    }

    /**
     * Renders the div for the image in preview.
     *
     * @param {int} number
     * @returns {string}
     */
    function renderFromTemplate(number) {
        const imagedivashtml =
            "<div id='unilabel_imageboard_imagediv_" + number + "' style='z-index: 5; position: absolute;'>" +
            "<div id='imageidtitle_" + number + "' class='unilabel-imageboard-title rounded' " +
            " style='position: relative;'>Überschrift" +
            "</div>" +
            "<div id='imageidimage_" + number + "'>" +
            "<img class='image' src='' id='unilabel-imageboard-imageid_" + number + "' style='position: relative;'>" +
            "</div>" +
            "</div>";
        return imagedivashtml;
    }

    /**
     * If an image was uploaded or inputfields in the form changed then we need to refrech
     * this image.
     * @param {int} number
     */
    function refreshImage(number) {
        // When there was an upload, then the number is NOT a number.
        // ToDo: Do not yet know the best way how I will get the number in his case.
        // For now if it is a number the normal refresh can be used and only ONE image will be refreshed.
        // In the else code ther will be a refresh of ALL images until I can refactor this.
        if (!Array.isArray(number)) {
            let imageid = document.getElementById('unilabel-imageboard-imageid_' + number);
            // Werte für das image setzen
            let imagedata = getAllImagedataFromForm(number);
            imageid.style.background = 'blue';
            imageid.src = imagedata['src'];
            const imagediv = document.getElementById('unilabel_imageboard_imagediv_' + number);
            imagediv.style.left = parseInt(imagedata['xposition']) + "px";
            imagediv.style.top = parseInt(imagedata['yposition']) + "px";

            // Breite und Höhe
            if (imagedata['targetwidth'] != 0) {
                imageid.style.width = imagedata['targetwidth'] + "px";
            } else {
                imageid.style.width = "auto";
            }
            if (imagedata['targetheight'] != 0) {
                imageid.style.height = imagedata['targetheight'] + "px";
            } else {
                imageid.style.height = "auto";
            }
            if (imagedata['title'] != "") {
                imageid.title = imagedata['title'];
            } else {
                imageid.title = '';
            }
            let colourpicker = document.getElementById('id_unilabeltype_imageboard_titlebackgroundcolor_colourpicker');
            let color = '';
            if (colourpicker.value == '') {
                color = '#000000';
            } else {
                color = colourpicker.value;
            }
            if (imagedata['border'] != 0) {
                imageid.style.border = imagedata['border'] + "px solid";
                imageid.style.borderColor = color;
            } else {
                imageid.style.border = "0";
            }

            // ToDo: add title if not empty
            let title = imagedata['title'];
            const imageidtitle = document.getElementById('imageidtitle_' + number);
            imageidtitle.innerHTML = title;
        } else {
            //console.log("number ist ein array" , number);
            //console.log("number[0] ist ein array" , number[0]);
            //console.log("number[0].attributeName ist ein array" , number[0].attributeName);
            //////console.log("number[0].target ist ein array", number[0].target);
            // ToDo: nur genau den einen enuen listener hinzufügen ...
            // hier schonaml ALLE
            setTimeout(function() {
                registerAllListenersForAllElements();
            }, 300);
            setTimeout(function() {
                refreshAllImages();
            }, 600);
        }
    }


    /**
     * The form has inputfields with date. This function gets the value from the inputfield with the given idselector
     *
     * @param {string} idselector 'id_unilabeltype_imageboard_yposition_' + number
     * @returns {string}
     */
   /// function getValueFromForm(idselector) {
   ///     return document.getElementById(idselector).getAttribute('value');
   /// }


    /**
     * Get all data from image that is stored in the form and collects them in one array.
     *
     * @param {int} number of the image
     * @returns {*[]} Array with the collected information that are set in the form for the image.
     */
    function getAllImagedataFromForm(number) {
        let imageids = {
            title: 'id_unilabeltype_imageboard_title_' + number,
            xposition: 'id_unilabeltype_imageboard_xposition_' + number,
            yposition: 'id_unilabeltype_imageboard_yposition_' + number,
            targetwidth: 'id_unilabeltype_imageboard_targetwidth_' + number,
            targetheight: 'id_unilabeltype_imageboard_targetheight_' + number,
            src: '',
            border: 'id_unilabeltype_imageboard_border_' + number,
        };

        let imagedata = [];
        imagedata['title'] = document.getElementById(imageids.title).value;
        imagedata['xposition'] = document.getElementById(imageids.xposition).value;
        imagedata['yposition'] = document.getElementById(imageids.yposition).value;
        imagedata['targetwidth'] = document.getElementById(imageids.targetwidth).value;
        imagedata['targetheight'] = document.getElementById(imageids.targetheight).value;

        // Src der Draftfile ermitteln
        const element = document.getElementById('id_unilabeltype_imageboard_image_' + number + '_fieldset');
        const imagetag = element.getElementsByTagName('img');
        let src = '';
        if (imagetag.length && imagetag.length != 0) {
            src = imagetag[0].src;
            src = src.split('?')[0];
        }
        imagedata['src'] = src;
        imagedata['border'] = document.getElementById(imageids.border).value;

        return imagedata;
    }
};

