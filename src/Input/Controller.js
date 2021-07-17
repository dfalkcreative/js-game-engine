import {State} from "../Kernel/State";
import {Vector2f} from "../Math/Vector2f";

export class Controller {
    /**
     * Controller constructor.
     */
    constructor() {
        this.keys = {};
        this.bindings = {
            '1Key': 49,
            '2Key': 50,
            '3Key': 51,
            'TildeKey': 192,
            'Space': 32,
            'UpArrow': 38,
            'DownArrow': 40,
            'LeftShift': 16,
            'LeftArrow': 37,
            'RightArrow': 39,
        };
        this.mousePosition = new Vector2f(0, 0);

        for (let i in this.bindings) {
            if (!this.bindings.hasOwnProperty(i)) {
                continue;
            }

            this.keys[this.bindings[i]] = false;
        }

        this.addEventHandlers();
    }


    /**
     * Refreshes all key states.
     */
    refresh() {
        for (let i in this.keys) {
            if (this.keys.hasOwnProperty(i)) {
                this.setState(i, false);
            }
        }
    }


    /**
     * Assigns the state of the code.
     *
     * @param code
     * @param state
     * @returns this
     */
    setState(code, state) {
        if (this.bindings.hasOwnProperty(code)) {
            code = this.bindings[code];
        }

        if (!code || !this.keys.hasOwnProperty(code)) {
            return this;
        }

        this.keys[code] = state;
    }


    /**
     * Returns the state of the specified code.
     *
     * @param code
     * @returns {*}
     */
    getState(code) {
        if (this.bindings.hasOwnProperty(code)) {
            code = this.bindings[code];
        }

        if (!code || !this.keys.hasOwnProperty(code)) {
            return false;
        }

        return this.keys[code];
    }


    /**
     * Returns the unscaled mouse position.
     *
     * @returns {Vector2f}
     */
    getMousePosition(){
        const scale = State.getEngine().getCanvasScale();
        const offset = State.getEngine().getCanvasOffset();

        return new Vector2f(
            (this.getRealMousePosition().getX() * (1 / scale)) - offset.getX(),
            (this.getRealMousePosition().getY() * (1 / scale)) - offset.getY(),
        );
    }


    /**
     * Returns the true mouse position.
     *
     * @returns {Vector2f}
     */
    getRealMousePosition(){
        return this.mousePosition;
    }


    /**
     * Binds any controller events.
     */
    addEventHandlers() {
        document.onmousemove = (e) => {
            this.mousePosition
                .setX(e.pageX)
                .setY(e.pageY);
        };

        document.onkeydown = (e) => {
            e = e || window.event;

            if (e.repeat) {
                return
            }

            this.setState(e.keyCode, true);
        };

        document.onkeyup = (e) => {
            e = e || window.event;

            if (e.repeat) {
                return
            }

            this.setState(e.keyCode, false);
        };
    }


    /**
     * Indicates whether or not an arrow key is being utilized.
     *
     * @returns boolean
     */
    hasArrowKeyDown() {
        return this.getState('UpArrow') || this.getState('DownArrow') || this.getState('LeftArrow') || this.getState('RightArrow')
    }
}