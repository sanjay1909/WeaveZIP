module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                     'src/utils/ClassUtils.js',
                    'src/utils/ArraySortOn.js',
                    'src/utils/WeakReference.js',

                    'src/createjs/events/*.js', // All JS in the libs folder
                    'src/createjs/Ticker.js',

                    'src/compiler/StandardLib.js',
                    'src/compiler/ObjectUtil.js',
                    'src/compiler/ICompiledObject.js',
                    'src/compiler/CompiledConstant.js',
                    'src/compiler/CompiledFunctionCall.js',
                    'src/compiler/Compiler.js',

                    'src/WeaveAPI.js',

                    'src/core/DynamicState.js',
                    'src/core/ILinkableObject.js',
                    'src/core/CallbackCollection.js',
                    'src/primitive/WeaveTreeItem.js',
                    'src/primitive/Dictionary2D.js',
                    'src/core/SessionManager.js',
                    'src/core/ErrorManager.js',
                    'src/core/EditorManager.js',

                    'src/utils/URLUtil.js',
                    'src/utils/URLRequestUtils.js',
                    'src/utils/DebugUtils.js',
                    'src/utils/AsyncSort.js',
                    'src/utils/WeavePromise.js',

                    'src/api/debugId.js',
                    'src/api/detectLinkableObjectChange.js',

                    'src/core/LinkableVariable.js',
                    'src/core/LinkableNumber.js',
                    'src/core/LinkableBoolean.js',
                    'src/core/LinkableString.js',
                    'src/core/ChildListCallbackInterface.js',
                    'src/core/ProgressIndicator.js',
                    'src/core/LinkableWatcher.js',
                    'src/core/LinkableHashMap.js',
                    'src/core/LinkablePromise.js',
                    'src/core/LinkableFile.js',


                    'src/core/LinkableDynamicObject.js',
                    'src/core/StageUtils.js',
                    'src/core/ExternalSessionStateInterface',
                    'src/core/SessionStateLog.js',

                    'src/utils/URLRequestUtils.js',
                    'src/utils/AsyncSort.js',

                     'src/WeavePath.js'
               ],
                dest: 'weavecore.js',
            }
        },
        uglify: {
            build: {
                src: 'weavecore.js',
                dest: 'weavecore.min.js'
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat'); // to combine all files to a single file
    grunt.loadNpmTasks('grunt-contrib-uglify'); // to minify the combined file

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);

};
