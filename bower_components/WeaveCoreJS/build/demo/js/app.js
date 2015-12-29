/**
 * @sanjaykrishna
 * @shwetapurushe
 */


if (typeof window === 'undefined') {
    this.weavecore = this.weavecore || {};
} else {
    window.weavecore = window.weavecore || {};
}

/**
 * This is an interface to a composite object with dynamic state, meaning child objects can be dynamically added or removed.
 * The session state for this type of object is defined as an Array of DynamicState objects.
 * DynamicState objects are defined as having exactly three properties: objectName, className, and sessionState.
 * @see DynamicState
 *
 * @author adufilie
 * @author sanjay1909
 */
(function () {




    function CompositeObject() {
        weavecore.ILinkableObject.call(this);

        Object.defineProperties(this, {
            'sessionString': {
                value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString())
            },
            'sessionNumber': {
                value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableNumber())
            }
        });
    }




    // Prototypes
    var p = CompositeObject.prototype;



    weavecore.CompositeObject = CompositeObject;
    /**
     * Metadata
     *
     * @type {Object.<string, Array.<Object>>}
     */
    p.CLASS_INFO = {
        names: [{
            name: 'CompositeObject',
            qName: 'weavecore.CompositeObject'
        }],
        interfaces: [weavecore.ILinkableObject]
    };

}());

var bind = function (obj, m) {
    return function () {
        obj[m].apply(obj, Array.prototype.slice.call(arguments));
    };
};

(function () {
    function ClosureFn(xx) {
        this.prop = xx;
        this.__proto__.method = bind(this, 'method');
    }
    ClosureFn.prototype.method = function () {
        console.log(this.method.name);
    };
    this.ClosureFn = ClosureFn;
}());

var test = {};
(function () {
    angular.module('sliderDemoApp', ['ui.slider']);

    angular.module('sliderDemoApp').controller('sliderDemoCtrl', demoController);

    demoController.$inject = ['$scope', '$log', '$timeout'];

    function demoController($scope, $log, $timeout) {
        var dC = this;

        dC.handleSliderValueChange = handleSliderValueChange;
        dC.updateSessionNavigator = updateSessionNavigator;
        dC.updateSliderValues = updateSliderValues;
        dC.TestItem = TestItem;
        dC.createNewSession = createNewSession;

        test.hashMap = WeaveAPI.globalHashMap.requestObject("hashMap", weavecore.LinkableHashMap, false);
        test.hashMap.addImmediateCallback(this, function () {
            console.log("hashMap callback", test.hashMap)
        });



        dC.labeledslider = {
            'options': {
                start: function (event, ui) {
                    $log.info('Event: Slider start');
                },
                stop: function (event, ui) {
                    $log.info('Event: Slider stop');
                    dC.handleSliderValueChange(ui);
                }
            }
        }

        test.log = dC.log = new weavecore.SessionStateLog(WeaveAPI.globalHashMap);
        test.ln = dC.ln = dC.createNewSession("testNum", weavecore.LinkableNumber);
        test.ln2 = dC.ln = dC.createNewSession("testNum2", weavecore.LinkableNumber);
        test.lnPath = WeaveAPI.SessionManager.getPath(WeaveAPI.globalHashMap, test.ln);
        test.lnPath2 = WeaveAPI.SessionManager.getPath(WeaveAPI.globalHashMap, test.ln2);
        test.ldo = dC.ldo = dC.createNewSession("testDO", weavecore.LinkableDynamicObject);

        test.ldo.addImmediateCallback(this, watcherCallback);

        function watcherCallback() {
            console.log("Linkable watcher callbacks");
        }

        test.changeTargetPath = function () {
            if (test.ldo.target) console.log("Callbacks count(Before):", test.ldo.target._callbackEntries.length);
            test.ldo.targetPath = test.ldo.targetPath === test.lnPath ? test.lnPath2 : test.lnPath;
            console.log("Callbacks count(after):", test.ldo.target._callbackEntries.length);
        }

        test.changeTarget = function () {
            if (test.ldo.target) console.log("Callbacks count(Before):", test.ldo.target._callbackEntries.length);
            test.ldo.target = test.ldo.target === test.ln ? test.ln2 : test.ln;
            console.log("Callbacks count(after):", test.ldo.target._callbackEntries.length);
        }


        //********* Composite Object testing
        test.co = WeaveAPI.globalHashMap.requestObject("co", weavecore.CompositeObject, false);
        var cc = WeaveAPI.SessionManager.getCallbackCollection(test.co);
        cc.addImmediateCallback(this, testing);

        function testing() {
            if (WeaveAPI.detectLinkableObjectChange(testing, test.co.sessionNumber)) {
                console.log("num: ", test.co.sessionNumber.value);
            }

            if (WeaveAPI.detectLinkableObjectChange(testing, test.co.sessionString)) {
                console.log("string: ", test.co.sessionString.value);
            }

        }




        dC.log.clearHistory();

        var cc = WeaveAPI.SessionManager.getCallbackCollection(dC.log);
        cc.addGroupedCallback(this, dC.updateSliderValues, true);

        dC.increment = function () {
            dC.ln.value++;
        }
        dC.decrement = function () {
            dC.ln.value--;
        }

        function createNewSession(name, klass) {
            var oo = test.hashMap.requestObject(name, klass, false);
            oo.value = 0;

            return oo;
        }

        function handleSliderValueChange(ui) {
            var delta = ui.value - dC.log.undoHistory.length;
            if (delta < 0)
                dC.log.undo(-delta);
            else
                dC.log.redo(delta);

            $scope.$apply();
        }

        function updateSliderValues() {
            dC.sliderPosition = dC.log._undoHistory.length;
            // since this function is called programatically in next frame in next frame ,
            // and not called by UI event , we need to manually trigger digest cycle.
            //console.log('UpdateSliderValues called')
            $scope.$apply();
        }

        function updateSessionNavigator() {

            var tr = WeaveAPI.SessionManager.getSessionStateTree(WeaveAPI.globalHashMap, 'weave');
            console.log(tr);
            var newTr = {};
            dC.TestItem(tr, newTr);
            console.log(newTr);
            dC.my_data = [newTr];
            /* $scope.my_data = [{ label: 'hee', children: [{ label: 'inner', children: null }, { label: 'inner 2', children: null }] }]*/
            //$scope.$apply();
        }

        function TestItem(tree, newtree) {
            newtree.label = tree.label;
            if (tree.children && tree.children.constructor === Function) {
                newtree.children = tree.children = tree.children(tree);
            };
            if (tree.children && tree.children.constructor === Array) {
                newtree.children = []
                for (var i = 0; i < tree.children.length; i++) {
                    var newTr = {};
                    TestItem(tree.children[i], newTr);
                    newtree.children[i] = newTr;
                }
            };
        }
    }; //end of controller def
})();
