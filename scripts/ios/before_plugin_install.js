
function installFlutterModule() {
    var process = require('child_process');
    var fs = require('fs');
    if (!fs.existsSync("flutter_module")) {
        console.info("\033[33m *** 安装Flutter模块 *** \033[0m");
        console.log("安装过程中可能需要几分钟的时间...");
        process.exec('flutter create -t module flutter_module',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                console.log(stdout);
                copyFlutterCordovaFile();
            }
        );
    }

    function copyFlutterCordovaFile() {
        try {
            var fs = require('fs');
            var targetPath = "flutter_module/lib";
            var path = "plugins/cordova-plugin-flutter/src/flutter/cordova.dart";
            if (fs.existsSync(targetPath)) {
                var data = fs.readFileSync(path);
                fs.writeFileSync(targetPath + "/cordova.dart", data);
            }
        } catch (error) {
            console.info("\033[33m 报错： \033[0m");
            console.log(error);
        }
    }



}

function checkRequireEnvironment(callback) {
    var process = require('child_process');
    process.exec('cordova --version',
        function (error, stdout, stderr) {
            try {
                console.log(stdout);
                var cordovaVersion = /\d\.\d\.\d/.exec(stdout)[0]
                if (parseInt(cordovaVersion.substr(0, 1)) < 9) {
                    console.error("\033[31m 不支持低于9.0.0版本的cordova \033[0m");
                }
            } catch (error) {
                console.error("\033[31m 检测必须的环境失败 \033[0m");
                console.error(error);
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            next1();
        }
    );
    function next1() {
        process.exec('cordova platform',
            function (error, stdout, stderr) {
                try {
                    console.log(stdout);
                    var iosVersion = /ios \d\.\d\.\d/.exec(stdout)[0];
                    if (parseInt(iosVersion.replace("ios ", "").sub(0, 1)) < 5) {
                        console.error("\033[31m 不支持低于5.1.1版本的cordova-ios \033[0m");
                    }
                } catch (error) {
                    console.error("***\033[31m 检测必须的环境失败 *** \033[0m");
                    console.error(error);
                }
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                next2();
            }
        );
    }

    function next2() {
        process.exec('flutter --version',
            function (error, stdout, stderr) {
                try {
                    console.log(stdout);
                    var flutterVersion = /Flutter \d/.exec(stdout)[0];
                    if (parseInt(flutterVersion.replace("Flutter ", "").sub(0, 1)) < 1) {
                        console.error("\033[31m 不支持低于1.12.13版本的flutter \033[0m");
                    }
                } catch (error) {
                    console.error("\033[31m 检测必须的环境失败 \033[0m");
                    console.error(error);
                }
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                callback();
            }
        );
    }


}

console.log("*** 检测必需的环境 ***");
checkRequireEnvironment(function () {
    installFlutterModule();
});