declare module Tape {

    function initApp(routes, initName, options?: Object): void;

    ///////////////////////////////////////////////
    ////// Component
    ///////////////////////////////////////////////

    class Activity {

        constructor(props?: Object);

        protected onCreate();

        protected onResume();

        protected onPause();

        protected onDestroy();

        ///////////////////////
        /// Navigator
        ///////////////////////

        protected navigate(name, params?);

        protected link(url);

        protected finish(n?);

        protected finishByName(name);

        protected pop(n?);

        protected popByName(name);

        protected popToTop();

        ///////////////////////
        /// Logger
        ///////////////////////

        protected log(message?: any, ...optionalParams: any[]): void;

        protected error(message?: any, ...optionalParams: any[]): void;

        protected info(message?: any, ...optionalParams: any[]): void;

        protected warn(message?: any, ...optionalParams: any[]): void;

        protected debug(message?: any, ...optionalParams: any[]): void;

    }

    ///////////////////////////////////////////////
    ////// Utils
    ///////////////////////////////////////////////

    class Logger {

        static log(message?: any, ...optionalParams: any[]): void;

        static error(message?: any, ...optionalParams: any[]): void;

        static info(message?: any, ...optionalParams: any[]): void;

        static warn(message?: any, ...optionalParams: any[]): void;

        static debug(message?: any, ...optionalParams: any[]): void;

    }

    class Toast {
        static show(type: string, view, duration?: number, widthRatio?: number, heightRatio?: number): void
    }

    ///////////////////////////////////////////////
    ////// Socket
    ///////////////////////////////////////////////

    class WebSocket {
        onConnecting: Function;
        onConnected: Function;
        onClosed: Function;
        onError: Function;
        onMessageReveived: Function;

        connect(socketUrl: String): void;
        disconnect(): void;
        isConnected(): Boolean;
        isConnecting(): Boolean;
        publishMessage(message: any): void;
    }

    class MQTTSocket {
        onConnecting: Function;
        onConnected: Function;
        onClosed: Function;
        onError: Function;
        onMessageReveived: Function;
        onMessageDelivered: Function;

        connect(host: string, port: number, clientId: string, username: string, password: string, options?: Object): void;
        disconnect(): void;
        isConnected(): Boolean;
        isConnecting(): Boolean;
        publishMessage(topic: string, message: any, qos?: number, retained?: boolean): void;
    }

}