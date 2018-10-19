import { setFocus } from "../navigator/stack";
import NavLoader from "../navigator/loader";

let _inited = false;
let _mainUILayer;
let _topUILayer;
let _offsetX = 0;
let _offsetY = 0;

export function initUI(offsetX, offsetY) {
    _offsetX = offsetX;
    _offsetY = offsetY;
    _checkInit();
}

function _checkInit() {
    if (_inited) {
        return;
    }
    let uiManager = new Laya.Sprite();
    _mainUILayer = new Laya.Sprite();
    _mainUILayer.x = _offsetX;
    _mainUILayer.y = _offsetY;
    _mainUILayer.name = '_tape_main_layer';

    _topUILayer = new Laya.Sprite();
    _topUILayer.name = '_tape_top_layer';
    _topUILayer.x = _offsetX;
    _topUILayer.y = _offsetY;
    uiManager.addChild(_mainUILayer);
    uiManager.addChild(_topUILayer);
    Laya.stage.addChild(uiManager);
    _inited = true;
}

function checkFocus() {
    if (_mainUILayer.numChildren > 0) {
        let last = _mainUILayer.getChildAt(_mainUILayer.numChildren - 1);
        if (last instanceof NavLoader) {
            setFocus(true);
            return;
        }
    }
    setFocus(false);
}

function addMainLayer(view) {
    _checkInit();
    view && _mainUILayer.addChild(view);
    checkFocus();
}

function addTopLayer(view) {
    _checkInit();
    view && _topUILayer.addChild(view);
    checkFocus();
}

export default {
    checkFocus,
    addMainLayer,
    addTopLayer
}