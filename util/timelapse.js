const request = require('request')
const { exec } = require('child_process');
var fs = require('fs');
var path = require('path');

//const ffmpegPath = 'C:\\Users\\ijakk_000\\Downloads\\ffmpeg-4.3.1-2021-01-01-essentials_build\\ffmpeg-4.3.1-2021-01-01-essentials_build\\bin\\ffmpeg.exe';
const ffmpegPath = 'ffmpeg';

const homedir = require('os').homedir();
var timelapseDir = homedir + '/timelapse';

let imageCountNumber = 0;

if (!fs.existsSync(timelapseDir)){
    fs.mkdirSync(timelapseDir);
}

fs.readdir(timelapseDir, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    const fileNames = []
    files.forEach(function (file) {
        const splitName = file.split('.');
        if (splitName[1] === 'jpg') {
            console.log(file);
            fileNames.push(splitName[0]);
        }
    });

    fileNames.sort(function(a, b){return a-b});
    console.log(fileNames);
    if (fileNames.length > 0) {
        imageCountNumber = parseInt(fileNames[fileNames.length - 1]) + 1;
    }

    console.log('First timelapse number will be ' + imageCountNumber)

    takeScreenshot();
});

// Take screenshot every 20 min
setInterval(function () {
    takeScreenshot();
}, 20 * 60 * 1000);

// Render a timelapse every 12h since it takes a while
setInterval(function () {
    renderTimelapse(50, (path) => console.log('Rendered timelapse ' + path));
}, 12 * 60 * 60 * 1000);

module.exports = {
    createTimelapse: function(length, callback) {
        renderTimelapse(length, callback);
    },
    getTimelapsePath: function() {
        return path.join(timelapseDir, 'done.mp4');
    }
};

function renderTimelapse(length, callback) {
    const frameRate = imageCountNumber / length;
    const cmd = `${ffmpegPath} -y  -framerate ${frameRate} -i ${path.join(timelapseDir, '%04d.jpg')} -s:v 1440x1080 -c:v libx264 -crf 17 -pix_fmt yuv420p  ${path.join(timelapseDir, 'done.mp4')}`;
    console.log(cmd)
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            callback('')
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            callback(path.join(timelapseDir, 'done.mp4'));
        }
    });
}

function takeScreenshot() {
    const cmd = `${ffmpegPath} -y -i rtsp://rtsp:12345678@192.168.1.169:554/av_stream/ch0 -vframes 1 -strftime 1  ${path.join(timelapseDir, String(parseInt(imageCountNumber)).padStart(4, '0') + '.jpg')}`;
    console.log(cmd)
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            imageCountNumber ++;
        }
    });
}

