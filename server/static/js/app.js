Dropzone.autoDiscover = false;

function init(){
    let dz = new Dropzone("#dropzone", {
        url: "/classify_image",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });

    dz.on("addedfile",function() {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("sending", function(file, xhr, formData) {
        formData.append("image_data", file.dataURL); 
    });
    

    dz.on("complete",function(file) {
        let imageData = file.dataURL;

        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, {
            image_data: imageData
        },function(data, status){
          //  console.log("Respuesta recibida:", data);
            //console.log(data);
         //fetch(url, {
          //      method: "POST",
            //    headers: {
                //    "Content-Type": "application/x-www-form-urlencoded"
              //  },
                //body: new URLSearchParams({ image_data: imageData })
           // })
            //.then(response => response.json())
            //.then(data => {
   

            if(!data || data.length == 0){
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
                return;
            }

            let players = ["cristiano_ronaldo", "lionel_messi", "neymar", "kylian_mbappe", "erling_haalnd"];
            let match = null;
            let bestScore = -1

            for(let i =0;i<data.length;++i){
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore){
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }

            if (match){
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();

                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);

                }
            }

        })
    });

    $("#submitBtn").on('click',function(e){
        dz.processQueue();
    });

}

$(document).ready(function(){
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init()
});