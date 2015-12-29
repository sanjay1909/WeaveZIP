(function () {
    "use strict";



    /**
     * @static
     * @public
     * @property ARCHIVE_HISTORY
     * @readOnly
     * @type String
     */
    Object.defineProperty(Archive, 'ARCHIVE_HISTORY', {
        value: 'history.amf'
    });

    /**
     * @static
     * @public
     * @property ARCHIVE_SCREENSHOT_PNG
     * @readOnly
     * @type String
     */
    Object.defineProperty(Archive, 'ARCHIVE_SCREENSHOT_PNG', {
        value: 'screenshot.png'
    });
    /**
     * @static
     * @public
     * @property HISTORY_SYNC_DELAY
     * @readOnly
     * @type Number
     */
    Object.defineProperty(Archive, 'HISTORY_SYNC_DELAY', {
        value: 100
    });
    /**
     * @static
     * @public
     * @property THUMBNAIL_SIZE
     * @readOnly
     * @type Number
     */
    Object.defineProperty(Archive, 'THUMBNAIL_SIZE', {
        value: 200
    });
    /**
     * @static
     * @public
     * @property ARCHIVE_THUMBNAIL_PNG
     * @readOnly
     * @type String
     */
    Object.defineProperty(Archive, 'ARCHIVE_THUMBNAIL_PNG', {
        value: 'thumbnail.png'
    });

    /**
     * @static
     * @public
     * @property ARCHIVE_COLUMN_CACHE_AMF
     * @readOnly
     * @type String
     */
    Object.defineProperty(Archive, 'ARCHIVE_COLUMN_CACHE_AMF', {
        value: 'column-cache.amf'
    });


    Object.defineProperties(Archive, {
        'FOLDER_AMF': {
            value: 'weave-amf' // folder used for amf-encoded objects
        },
        'FOLDER_JSON': {
            value: 'weave-json' // folder used for json-encoded objects
        },
        'FOLDER_FILES': {
            value: 'weave-files' // folder used for raw files
        }

    });









    // constructor:
    /**
     * An object that implements this empty interface has an associated CallbackCollection and session state,
     * accessible through the global functions in the WeaveAPI Object. In order for an ILinkableObject to
     * be created dynamically at runtime, it must not require any constructor parameters.
     * @class Archive
     * @constructor
     */
    function Archive(bytes) {

        bytes = typeof bytes !== 'undefined' ? bytes : null;


        /**
         * This is a dynamic object containing all the amf objects stored in the archive.
         * The property names used in this object must be valid filenames or serialize() will fail.
         * @public
         * @property zip
         * @readOnly
         * @type JSZip
         */
        Object.defineProperty(this, 'objects', {
            value: {}
        });

        /**
         * This is a dynamic object containing all the files (ByteArray objects) in the archive.
         * The property names used in this object must be valid filenames or serialize() will fail.
         */
        Object.defineProperty(this, 'files', {
            value: {}
        });

        if (bytes) {
            this._readArchive(bytes)
        }

    }

    Archive.createScreenshot = function (thumbnailSize) {


    }

    Archive.updateLocalThumbnailAndScreenshot = function (saveScreenshot) {


    }


    /**
     * This function will create an object that can be saved to a file and recalled later with loadWeaveFileContent().
     */
    Archive.createFileContent = function (weave, saveScreenshot, pluginList) {

        saveScreenshot = typeof saveScreenshot !== 'undefined' ? saveScreenshot : false;
        pluginList = typeof pluginList !== 'undefined' ? pluginList : null;
        var output = new Archive();
        var _history = weave.history.getSessionState();

        //thumbnail should go first in the stream because we will often just want to extract the thumbnail and nothing
        //Archive.updateLocalThumbnailAndScreenshot(saveScreenshot);


        output.objects[Archive.ARCHIVE_HISTORY] = _history;

        if (WeaveAPI.AttributeColumnCache['saveCache'])
            output.objects[Archive.ARCHIVE_COLUMN_CACHE_AMF] = WeaveAPI.AttributeColumnCache['saveCache'];



        return output.serialize();
    }

    Archive.string2binary = function (str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) & 0xff);
        }
        return result;
    }

    Archive.binary2string = function (buff) {
        return String.fromCharCode.apply(null, new Uint16Array(buff));
    }

    Archive.openFile = function (files) {
        const selectedfile = files[0];


        // Build Promise List, each promise resolved by FileReader.onload.

        new Promise(function (resolve, reject) {
                let reader = new FileReader();

                reader.onload = function (event) {
                    // Resolve both the FileReader result and its original file.
                    resolve([event, selectedfile]);
                };

                // Read the file.
                reader.readAsArrayBuffer(selectedfile);
            })
            .then(function (zippedResults) {
                // Run the callback after all files have been read.

                var e = zippedResults[0];
                var result = e.target.result;

                // read the content of the file with JSZip
                var zip = new JSZip(result);
                var zipObject = zip.files[Archive.FOLDER_AMF + '/' + 'history.amf'];
                var jsonContent = Archive.deserializeAMF3(zipObject.asBinary());
                console.log(jsonContent);

            });
    }

    Archive.deserializeAMF3 = function (data) {
        var bytes = new a3d.ByteArray(data, a3d.Endian.BIG);
        return bytes.readObject();
    }





    var p = Archive.prototype;

    p.serialize = function () {

        var zip = new JSZip();
        var name;
        var folder;
        folder = zip.folder(Archive.FOLDER_FILES);
        for (name in this.files)
            folder.file(name, this.files[name]);
        folder = zip.folder(Archive.FOLDER_JSON);
        for (name in this.objects)
            folder.file(name, JSON.stringify(this.objects[name]));
        return zip.generate({
            type: 'blob'
        });
    }

    p._readArchive = function (bytes) {
        var zip = new JSZip(bytes);
        for (var filePath in zip.files) {
            var fileName = filePath.substr(filePath.indexOf('/') + 1);
            var /** @type {Object} */ file = zip.files[filePath];
            if (filePath.indexOf(Archive.FOLDER_JSON + '/') == 0) {
                this.objects[fileName] = JSON.parse(file.asText());
            } else if (filePath.indexOf(Archive.FOLDER_AMF + '/') == 0) {

                var bytes = new a3d.ByteArray(file.asBinary(), a3d.Endian.BIG);
                this.objects[fileName] = bytes.readObject();
            } else {
                this.files[fileName] = file.asBinary();
            }
        }
    }

    if (typeof exports !== 'undefined') {
        module.exports = Archive;
    } else {
        window.Archive = Archive;
    }

}());
