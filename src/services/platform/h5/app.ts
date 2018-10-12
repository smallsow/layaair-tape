import { IApp } from "../interfaces";

class H5App implements IApp {

    public getUserInfo(callback: (userinfo) => void) {
        callback && callback(null);
    }

    public onLaunch(callback: (data: object) => void) {
    }

    public onPause(callback: () => void) {
    }

}

export const h5App = new H5App;