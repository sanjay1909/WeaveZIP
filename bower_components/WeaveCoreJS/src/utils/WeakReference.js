if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

(function () {

    /**
     * This class is a wrapper for a weak reference to an object.
     * See the documentation for the Dictionary class for more info about weak references.
     *
     * @author adufilie
     * @author sanjay1909
     */
    function WeakReference(value) {
        value = (value === undefined) ? null : value;

        this.value = value;

    }

    var p = WeakReference.prototype;

    /**
     * The reference is stored as a key in this Dictionary, which uses the weakKeys option.
     */
    p.dictionary = new Map();
    //this._keyObj = {};

    /**
     * A weak reference to an object.
     */
    Object.defineProperty(p, 'value', {
        get: function () {
            var keys = this.dictionary.keys();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                return key;
            }

            return null;
        },
        set: function (newValue) {
            var keys = this.dictionary.keys();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                if (key === newValue)
                    return;
                this.dictionary.delete(key);
            }

            if (newValue !== null) {
                this.dictionary.set(newValue, null);
            }
        }

    });

    p.value;

    weavecore.WeakReference = WeakReference;

    p.CLASS_INFO = {
        names: [{
            name: 'WeakReference',
            qName: 'weavecore.WeakReference'
        }]
    };

}());
