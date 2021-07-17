import {Vector2f} from "../Math/Vector2f";

export class KeyFrame {
    /**
     * KeyFrame constructor.
     *
     * @param value
     * @param duration
     */
    constructor(value, duration) {
        this.value = new Vector2f(0, 0);
        this.duration = 1;
        this.interpolation = 'Linear';

        this.setDuration(duration)
            .setValue(value);
    }


    /**
     * Creates a new keyframe.
     *
     * @param value
     * @param duration
     * @returns {KeyFrame}
     */
    static create(value, duration) {
        return new KeyFrame(value, duration);
    }


    /**
     * Assigns the duration.
     *
     * @param duration
     * @returns {KeyFrame}
     */
    setDuration(duration) {
        this.duration = duration;

        return this;
    }


    /**
     * Assigns the value.
     *
     * @param value
     * @returns {KeyFrame}
     */
    setValue(value) {
        if (!value instanceof Vector2f) {
            return this;
        }

        this.value = value;

        return this;
    }


    /**
     * Returns the duration.
     *
     * @returns {number}
     */
    getDuration() {
        return this.duration;
    }


    /**
     * Returns the value Vector.
     *
     * @returns {Vector2f}
     */
    getValue() {
        return this.value;
    }


    /**
     * Returns the interpolation method.
     *
     * @returns {string}
     */
    getInterpolation() {
        return this.interpolation;
    }
}