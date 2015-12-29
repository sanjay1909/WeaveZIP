if (typeof window === 'undefined') {
    this.WeaveAPI = this.WeaveAPI || {};
    this.weavecore = this.weavecore || {};
} else {
    window.WeaveAPI = window.WeaveAPI || {};
    window.weavecore = window.weavecore || {};
}

(function () {

    function EditorManager() {
        weavecore.ILinkableObject.call(this);
        Object.defineProperties(this, {
            '_editorLookup': {
                value: new Map()
            },
            'labels': {
                value: new Map()
            }
        });


        var p = this;
        p.getEditorClass = weavecore.ClassUtils.bind(this, getEditorClass);
        p.getNewEditor = weavecore.ClassUtils.bind(this, getNewEditor);
        p.setLabel = weavecore.ClassUtils.bind(this, setLabel);
        p.getLabel = weavecore.ClassUtils.bind(this, getLabel);

    }

    EditorManager.prototype = new weavecore.ILinkableObject();
    EditorManager.prototype.constructor = EditorManager;
    //var p = EditorManager.prototype;



    /**
     * @inheritDoc
     */
    function getEditorClass(linkableObjectOrClass) {
        var editorClass = this._editorLookup.get(linkableObjectOrClass);
        editorClass = (editorClass && weavecore.Compiler.isClass(editorClass)) ? editorClass : null;
        if (editorClass)
            return editorClass;

        /*var classQName = linkableObjectOrClass as String || getQualifiedClassName(linkableObjectOrClass);
        var superClasses: Array = ClassUtils.getClassExtendsList(classQName);
        superClasses.unshift(classQName);
        for (var i: int = 0; i < superClasses.length; i++) {
            classQName = superClasses[i];
            var classDef: Class = ClassUtils.getClassDefinition(classQName);
            editorClass = _editorLookup[classDef] as Class
            if (editorClass)
                return editorClass;
        }*/
        return null;
    }



    /**
     * @inheritDoc
     */
    function getNewEditor(obj) {
        var Editor = this.getEditorClass(obj);
        if (Editor) {
            var editor = WeaveAPI.SessionManager.registerDisposableChild(obj, new Editor()); // when the object goes away, make the editor go away
            editor.setTarget(obj);
            return editor;
        }
        return null;
    }

    /**
     * @inheritDoc
     */
    function setLabel(object, label) {
        this._labels.set(object, label);
        WeaveAPI.SessionManager.getCallbackCollection(this).triggerCallbacks();
    }

    /**
     * @inheritDoc
     */
    function getLabel(object) {
        return this._labels.get(object);
    }


    weavecore.EditorManager = EditorManager;
    weavecore.ClassUtils.registerClass('weavecore.EditorManager', EditorManager);
    WeaveAPI.EditorManager = new EditorManager();

}());
