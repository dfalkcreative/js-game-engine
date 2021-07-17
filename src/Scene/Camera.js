import {Sprite} from "../Entity/Sprite";
import {Vector2f} from "../Math/Vector2f";
import {Timeline} from "../Animation/Timeline";

export class Camera {
    /**
     * Camera constructor.
     */
    constructor() {
        this.zoom = 2;
        this.shake = 0;
        this.sprite = new Sprite();
        this.timeline = new Timeline();
        this.position = new Vector2f(0, 0);
    }


    /**
     * Returns a new Camera instance.
     *
     * @returns {Camera}
     */
    static create() {
        return new Camera();
    }


    /**
     * Assigns the timeline.
     *
     * @param timeline
     * @returns {Camera}
     */
    setTimeline(timeline) {
        if (!timeline instanceof Timeline) {
            return this;
        }

        this.timeline = timeline;

        return this;
    }


    /**
     * Returns the timeline.
     *
     * @returns {Timeline}
     */
    getTimeline() {
        return this.timeline;
    }


    /**
     * Assigns a camera shake.
     *
     * @param shake
     * @returns {Camera}
     */
    setShake(shake) {
        this.shake = shake;

        return this;
    }


    /**
     * Returns the shake amount.
     *
     * @returns {number}
     */
    getShake() {
        return this.shake;
    }


    /**
     * Returns the shake offset.
     *
     * @returns {number}
     */
    getShakeOffset() {
        if (!this.getShake()) {
            return 0;
        }

        return (Math.random() - 0.5) * this.getShake();
    }


    /**
     * Assigns a linked sprite to the camera.
     *
     * @param sprite
     * @returns {Camera}
     */
    setSprite(sprite) {
        if (!sprite instanceof Sprite) {
            return this;
        }

        this.sprite = sprite;

        return this;
    }


    /**
     * Returns the linked sprite.
     *
     * @returns {Sprite}
     */
    getSprite() {
        return this.sprite;
    }


    /**
     * Used to zoom in the camera.
     *
     * @param zoom
     * @returns {Camera}
     */
    setZoom(zoom) {
        this.zoom = zoom;

        return this;
    }


    /**
     * Returns the zoom value.
     *
     * @returns {number}
     */
    getZoom() {
        return this.zoom;
    }


    /**
     * Assigns the camera position.
     *
     * @param position
     * @returns {Camera}
     */
    setPosition(position) {
        if (!position instanceof Vector2f) {
            return this;
        }

        this.position = position;

        return this;
    }


    /**
     * Returns the camera position.
     *
     * @returns {Vector2f}
     */
    getPosition() {
        return this.position;
    }
}
