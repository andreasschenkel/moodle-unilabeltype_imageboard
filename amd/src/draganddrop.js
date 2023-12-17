
export const init = () => {
    const imageid_1 = document.getElementById("imageid_1");
    const unilabel_imageboard_image_1 = document.getElementById("unilabel-imageboard-image-1");

    //var width = imageid_1.clientWidth;
    // Eventlistener an das Inputfeld für die x-Koordinate anhängen
    var input_xposition_0 = document.getElementById("id_unilabeltype_imageboard_xposition_0");
    input_xposition_0.addEventListener("focusout", function() {
        imageid_1.style.left = input_xposition_0.value + "px";
    });
    var input_yposition_0 = document.getElementById("id_unilabeltype_imageboard_yposition_0");
    input_yposition_0.addEventListener("focusout", function() {
        imageid_1.style.top = input_yposition_0.value + "px";
    });

    var input_targetwidth_0 = document.getElementById("id_unilabeltype_imageboard_targetwidth_0");
    input_targetwidth_0.addEventListener("focusout", function() {
        alert("input_targetwidth_0 " + input_targetwidth_0.value );
        unilabel_imageboard_image_1.style.width = input_targetwidth_0.value + "px";
    });

    var input_targetheight_0 = document.getElementById("id_unilabeltype_imageboard_targetheight_0");
    input_targetheight_0.addEventListener("focusout", function() {
        alert("input_targetheight_0 " + input_targetheight_0.value );
        unilabel_imageboard_image_1.style.height = "50px";
    });


};