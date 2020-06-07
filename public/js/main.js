// uncomment line below to register offline cache service worker 
// navigator.serviceWorker.register('../serviceworker.js');

if (typeof fin !== 'undefined') {
    init();
} else {
    document.querySelector('#of-version').innerText =
        'The fin API is not available - you are probably running in a browser.';
}

//once the DOM has loaded and the OpenFin API is ready
async function init() {
    //get a reference to the current Application.
    const app = await fin.Application.getCurrent();
    const win = await fin.Window.getCurrent();
    //check if browser supports file api and filereader features
    if (window.File && window.FileReader && window.FileList && window.Blob) {

        //this function is called when the input loads an image
        function renderImage(file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                the_url = event.target.result
                //of course using a template library like handlebars.js is a better solution than just inserting a string
                $('#preview').html("<img src='" + the_url + "' />")
                $('#name').html(file.name)
                $('#size').html(humanFileSize(file.size, "MB"))
                $('#type').html(file.type)
            }

            //when the file is read it triggers the onload event above.
            reader.readAsDataURL(file);
        }


        //this function is called when the input loads a video
        function renderVideo(file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                the_url = event.target.result
                //of course using a template library like handlebars.js is a better solution than just inserting a string
                $('#data-vid').html("<video width='400' controls><source id='vid-source' src='" + the_url + "' type='video/mp4'></video>")
                $('#name-vid').html(file.name)
                $('#size-vid').html(humanFileSize(file.size, "MB"))
                $('#type-vid').html(file.type)

            }

            //when the file is read it triggers the onload event above.
            reader.readAsDataURL(file);
        }



        //watch for change on the 
        $("#the-photo-file-field").change(function () {
            console.log("photo file has been chosen")
            //grab the first image in the fileList
            //in this example we are only loading one file.
            console.log(this.files[0].size)
            renderImage(this.files[0])

        });

        $("#the-video-file-field").change(function () {
            console.log("video file has been chosen")
            //grab the first image in the fileList
            //in this example we are only loading one file.
            console.log(this.files[0].size)
            renderVideo(this.files[0])

        });

    } else {

        alert('The File APIs are not fully supported in this browser.');

    }

    //Only launch new windows from the main window.
    if (win.identity.name === app.identity.uuid) {
        //subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
        //for this app we will  launch a child window the first the user clicks on the desktop.
        app.once('run-requested', async () => {
            await fin.Window.create({
                name: 'childWindow',
                url: location.href,
                defaultWidth: 320,
                defaultHeight: 320,
                autoShow: true
            });
        });
    }
}
