var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// =========================== //
// tape navigation.js
// =========================== //
var Tape;
(function (Tape) {
    /**
     * NavigationLoader
     */
    var NavigationLoader = /** @class */ (function (_super) {
        __extends(NavigationLoader, _super);
        function NavigationLoader(activity, routeName, routeKey, props, res, loaded, onLoadProgress) {
            if (props === void 0) { props = {}; }
            if (res === void 0) { res = []; }
            if (loaded === void 0) { loaded = null; }
            if (onLoadProgress === void 0) { onLoadProgress = null; }
            var _this = _super.call(this) || this;
            _this.routeName = "";
            _this.routeKey = "";
            _this.routeActivity = null;
            _this.routeName = routeName;
            _this.routeKey = routeKey;
            if (res != null && res.length > 0) {
                Laya.loader.load(res, Laya.Handler.create(_this, function () {
                    var act = new activity(props);
                    _this.create(act);
                    if (loaded) {
                        loaded(_this);
                    }
                }), Laya.Handler.create(_this, function (progress) {
                    if (onLoadProgress) {
                        onLoadProgress(_this, progress);
                    }
                }, null, false));
            }
            else {
                var act = new activity(props);
                _this.create(act);
                if (loaded) {
                    loaded(_this);
                }
            }
            return _this;
        }
        NavigationLoader.prototype.create = function (routeActivity) {
            this.routeActivity = routeActivity;
            this.addChild(this.routeActivity);
            this.routeActivity.onCreate();
        };
        NavigationLoader.prototype.nextProgress = function (progress) {
            this.routeActivity.onNextProgress(progress);
        };
        NavigationLoader.prototype.exit = function () {
            this.removeSelf();
            this.routeActivity.onDestroy();
        };
        NavigationLoader.prototype.show = function () {
            this.visible = true;
            this.routeActivity.onResume();
        };
        NavigationLoader.prototype.hide = function () {
            this.visible = false;
            this.routeActivity.onPause();
        };
        return NavigationLoader;
    }(Tape.PropsComponent));
    /**
     * NavigationStack
     */
    var NavigationStack = /** @class */ (function () {
        function NavigationStack(navigator) {
            this.__navigator__ = null;
            this.__init_name__ = "";
            this.__routes__ = {};
            this.__static_res__ = [];
            this.__stacks__ = [];
            this.__loaded_handler__ = null;
            this.__load_progress_handler__ = null;
            this.__uri_prefix__ = "://";
            this.__file_version__ = null;
            this.__loading__ = false;
            this.__navigator__ = navigator;
            this.__loaded_handler__ = navigator.props['navigation']['onLoaded'];
            this.__load_progress_handler__ = navigator.props['navigation']['onLoadProgress'];
            this.__routes__ = navigator.props['navigation']['routes'];
            this.__init_name__ = navigator.props['navigation']['initName'];
            this.__static_res__ = navigator.props['navigation']['staticRes'] || [];
            this.__uri_prefix__ = navigator.props['navigation']['uriPrefix'] || "://";
            this.__file_version__ = navigator.props['navigation']['fileVersion'];
        }
        NavigationStack.prototype.init_page = function () {
            var _this = this;
            if (this.__file_version__) {
                Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
                Laya.ResourceVersion.enable(this.__file_version__, Laya.Handler.create(this, function () {
                    _this.navigate(_this.__init_name__);
                }));
            }
            else {
                this.navigate(this.__init_name__);
            }
        };
        /**
         * deeplink
         */
        NavigationStack.prototype.deeplink = function (url, action) {
            if (action === void 0) { action = null; }
            var params = {};
            var delimiter = this.__uri_prefix__ || '://';
            var urlSplit = url.split(delimiter);
            var path = '/';
            if (urlSplit.length > 1) {
                var pathSplit = urlSplit[1].split('?');
                path = pathSplit[0];
                if (pathSplit.length > 1) {
                    var paramsSplit = pathSplit[1].split('&');
                    paramsSplit.forEach(function (value) {
                        var param = value.split('=');
                        if (param.length === 2) {
                            Object.assign(params, (_a = {},
                                _a[param[0]] = param[1],
                                _a));
                        }
                        var _a;
                    });
                }
            }
            else {
                path = url;
            }
            return this.navigate(path, params, action);
        };
        /**
         * navigate
         */
        NavigationStack.prototype.navigate = function (name, params, action) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (action === void 0) { action = null; }
            if (this.__routes__
                && this.__routes__.hasOwnProperty(name)
                && this.__routes__[name].hasOwnProperty('activity')) {
                var route = this.__routes__[name];
                var activity = route['activity'];
                var resArray_1 = [];
                if (this.__static_res__) {
                    this.__static_res__.forEach(function (res) {
                        resArray_1.push(res);
                    });
                }
                if (route.hasOwnProperty('res')
                    && typeof route['res'] === 'object'
                    && route['res'].length > 0) {
                    route['res'].forEach(function (res) {
                        resArray_1.push(res);
                    });
                }
                var paramsObject = {};
                if (route.hasOwnProperty('res')
                    && route['res'].length > 0) {
                    route['res'].forEach(function (res) {
                        resArray_1.push(res);
                    });
                }
                if (route.hasOwnProperty('params')) {
                    Object.assign(paramsObject, route['params']);
                }
                Object.assign(paramsObject, params);
                this.__loading__ = true;
                var key = Tape.UUID.randUUID();
                new NavigationLoader(activity, name, key, {
                    navigation: this,
                    routeName: name,
                    routeKey: key,
                    params: paramsObject
                }, resArray_1, function (loader) {
                    _this.__loading__ = false;
                    _this.__navigator__.addChild(loader);
                    _this.putStack(loader);
                    action && action(true);
                    _this.__loaded_handler__ && _this.__loaded_handler__(loader);
                }, function (loader, progress) {
                    if (_this.__loading__) {
                        var stack = _this.lastStack();
                        stack && stack.nextProgress(progress);
                    }
                    _this.__load_progress_handler__ && _this.__load_progress_handler__(loader, progress);
                });
                return true;
            }
            else {
                action && action(false);
                return false;
            }
        };
        /**
         * finish
         */
        NavigationStack.prototype.finish = function (name, key) {
            if (key === void 0) { key = null; }
            this.finishStack(name, key);
        };
        /**
         * popToTop
         */
        NavigationStack.prototype.popToTop = function () {
            this.pop(this.__stacks__.length);
        };
        /**
         * pop
         */
        NavigationStack.prototype.pop = function (number) {
            if (number === void 0) { number = 1; }
            this.popStack(number);
        };
        NavigationStack.prototype.lenStack = function () {
            return this.__stacks__.length;
        };
        NavigationStack.prototype.lastStack = function () {
            var len = this.lenStack();
            if (len > 0) {
                return this.__stacks__[len - 1];
            }
            return null;
        };
        NavigationStack.prototype.putStack = function (stack) {
            this.hideStack();
            this.__stacks__.push(stack);
            this.showStack();
        };
        NavigationStack.prototype.popStack = function (count) {
            if (this.lenStack() > 1 && count > 0) {
                this.hideStack();
                for (var i = 0; i < count; i++) {
                    if (this.lenStack() > 1) {
                        this.__stacks__.pop().exit();
                    }
                }
                this.showStack();
            }
        };
        NavigationStack.prototype.finishStack = function (name, key) {
            if (key === void 0) { key = null; }
            var len = this.lenStack();
            if (len > 1) {
                var targetIndexs = [];
                for (var i = 0; i < len; i++) {
                    var stack = this.__stacks__[i];
                    if (stack.routeName === name) {
                        var flag = true;
                        if (key) {
                            flag = stack.routeKey === key;
                        }
                        if (flag && targetIndexs.length < len - 1) {
                            targetIndexs.push(i);
                        }
                    }
                }
                if (targetIndexs.length > 0) {
                    var first = targetIndexs.pop();
                    var flag_1 = first === len - 1;
                    if (flag_1) {
                        this.hideStack();
                    }
                    var slice = this.__stacks__.splice(first, 1);
                    slice.forEach(function (stack) {
                        stack.exit();
                    });
                    while (targetIndexs.length > 0) {
                        first = targetIndexs.pop();
                        var slice_1 = this.__stacks__.splice(first, 1);
                        slice_1.forEach(function (stack) {
                            stack.exit();
                        });
                    }
                    if (flag_1) {
                        this.showStack();
                    }
                }
            }
        };
        NavigationStack.prototype.hideStack = function () {
            var len = this.lenStack();
            if (len > 0) {
                this.__stacks__[len - 1].hide();
            }
        };
        NavigationStack.prototype.showStack = function () {
            var len = this.lenStack();
            if (len > 0) {
                this.__stacks__[len - 1].show();
            }
        };
        return NavigationStack;
    }());
    /**
     * StackNavigator
     */
    var StackNavigator = /** @class */ (function (_super) {
        __extends(StackNavigator, _super);
        function StackNavigator(props) {
            var _this = _super.call(this, props) || this;
            _this.__navigator__ = null;
            _this.__navigator__ = new NavigationStack(_this);
            _this.__navigator__.init_page();
            return _this;
        }
        return StackNavigator;
    }(Tape.PropsComponent));
    /**
     * createNavigator
     * @param routes routes
     * @param initName initName
     * @param options options
     */
    Tape.createNavigator = function (routes, initName, options) {
        if (options === void 0) { options = {}; }
        console.log('init Navigator, Env: ' + Tape.Build.getEnv());
        return new StackNavigator({
            navigation: {
                routes: routes,
                initName: initName,
                staticRes: options['res'],
                fileVersion: options['fileVersion'] || 'version.json',
                uriPrefix: options['uriPrefix'],
                onLoaded: options['onLoaded'],
                onLoadProgress: options['onLoadProgress']
            }
        });
    };
})(Tape || (Tape = {}));
