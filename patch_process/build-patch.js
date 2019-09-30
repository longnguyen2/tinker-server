const fs = require('fs');
const fse = require('fs-extra');
const uuidv4 = require('uuid/v4');
const path = require('path');
const { execSync } = require('child_process');
const _ = require('lodash');

function buildPatch(androidProjectPath, sourceApk) {
    if (!fs.existsSync(path.join(androidProjectPath, 'gradlew'))) {
        console.error(`${androidProjectPath} is not the project root`);
        return false;
    }
    const originalBuildDir = path.join(androidProjectPath, '/originalBuild');
    const tempDir = path.join(androidProjectPath, `/${uuidv4()}`);

    if (sourceApk) {
        if (fs.existsSync(sourceApk) && fs.lstatSync(sourceApk).isFile()) {
            if (!fs.existsSync(originalBuildDir)) {
                fse.mkdirSync(originalBuildDir);
            }
            // Copy originalBuild to temporary directory first
            fse.copySync(originalBuildDir, tempDir);
            fse.emptyDirSync(originalBuildDir);

            // Copy source files to originalBuild dir
            const sourcePath = sourceApk.substr(0, sourceApk.lastIndexOf('/'));
            const apkName = _.last(sourceApk.split('/')).split('.')[0];
            const sourceFiles = fs.readdirSync(sourcePath, {encoding: 'utf8', withFileTypes: true});
            sourceFiles.forEach(file => {
                if (file.isFile() && file.name.includes(apkName)) {
                    const src = path.join(sourcePath, file.name);
                    let dest;
                    if (file.name.endsWith(".apk")) {
                        dest = path.join(originalBuildDir, 'original-app.apk')
                    } else if (file.name.endsWith("-mapping.txt")) {
                        dest = path.join(originalBuildDir, 'original-app-mapping.txt');
                    } else if (file.name.endsWith("-R.txt")) {
                        dest = path.join(originalBuildDir, 'original-app-R.txt');
                    } else if (file.name.split('.').length === 1) {
                        dest = path.join(originalBuildDir, 'original-app');
                    }

                    if (dest) {
                        fs.copyFileSync(src, dest);
                        console.log(`Copied ${src} to ${dest}`);
                    }
                }
            });

            let buildSuccess = runBuildPatchCommand(androidProjectPath);
            fse.emptyDirSync(originalBuildDir);
            fse.copySync(tempDir, originalBuildDir);
            fse.removeSync(tempDir);
            return buildSuccess;
        } else {
            console.error(`${sourceApk} is either not exist or not a file`);
            return false;
        }
    } else {
        return runBuildPatchCommand(androidProjectPath);
    }
}

function runBuildPatchCommand(projectPath) {
    console.log('Start building patch');
    fse.removeSync(path.join(projectPath, '/app/build/outputs/apk/tinkerPatch'));
    try {
        const buildLog = execSync(`./gradlew tinkerPatchDebug`, {cwd: projectPath, encoding: 'utf8'});
        console.log(buildLog);
    } catch (e) {
    }
    const pathApkPath = path.join(projectPath, '/app/build/outputs/apk/tinkerPatch/debug/patch_signed_7zip.apk');
    if (fs.existsSync(pathApkPath)) {
        console.log('Build patch success');
        if (!fs.existsSync('../public')) {
            fs.mkdirSync('../public');
        }
        fs.copyFileSync(pathApkPath, '../public/patch_signed_7zip.apk');
        return true;
    } else {
        console.error('Build patch failed');
        return false;
    }
}

exports.buildPatch = buildPatch;