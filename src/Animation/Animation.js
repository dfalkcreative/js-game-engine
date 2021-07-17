import {Frame} from "../Graphic/Frame";
import {SpriteSheet} from "../Graphic/SpriteSheet";

export class Animation extends SpriteSheet {
    /**
     * Animation constructor.
     *
     * @param src
     */
    constructor(src) {
        super(src);

        // Organize default values.
        this.rate = 2;
        this.loop = true;
        this.isPlaying = false;
        this.lastUpdate = new Date();
        this.currentFrame = 0;
    }


    /**
     * Creates a new Animation instance.
     *
     * @param src
     * @returns {Animation}
     */
    static create(src) {
        return new Animation(src);
    }


    /**
     * Stops the animation.
     */
    stop() {
        this.isPlaying = false;
    }


    /**
     * Begin animation playback.
     *
     * @return this
     */
    play() {
        if (!this.isPlaying) {
            this.lastUpdate = new Date();
            this.setFrame(0);
        }

        this.isPlaying = true;

        return this;
    }


    /**
     * Assigns the current frame.
     *
     * @param frame
     * @returns {Animation}
     */
    setFrame(frame) {
        this.currentFrame = frame;

        return this;
    }


    /**
     * Assigns whether or not the animation should loop.
     *
     * @param loop
     * @returns {Animation}
     */
    setLoop(loop) {
        this.loop = loop;

        return this;
    }


    /**
     * Returns whether or not the animation should loop.
     *
     * @returns {boolean}
     */
    getLoop() {
        return this.loop;
    }


    /**
     * Assigns the playback rate.
     *
     * @param rate
     * @returns {Animation}
     */
    setRate(rate) {
        this.rate = rate;

        return this;
    }


    /**
     * Returns the identifier for the current frame.
     *
     * @returns {number}
     */
    getCurrentFrame() {
        return this.currentFrame;
    }


    /**
     * Returns the current frame.
     *
     * @returns Frame
     */
    getFrame() {
        if (this.currentFrame >= this.frames.length) {
            return new Frame(0, 0, this.getDomResource().width, this.getDomResource().height);
        }

        return this.frames[this.currentFrame];
    }


    /**
     * Indicates whether or not we're on the last frame.
     *
     * @returns {boolean}
     */
    isLastFrame() {
        return this.currentFrame === this.frames.length - 1;
    }


    /**
     * Updates the animation.
     */
    update() {
        let frameNow = new Date();

        if (!this.isPlaying) {
            return this;
        }

        if (!this.frames.length) {
            return this;
        }

        if (!this.getLoop() && this.isLastFrame()) {
            this.isPlaying = false;
            return this;
        }

        if (frameNow - this.lastUpdate > (1000 / this.rate)) {
            this.lastUpdate = frameNow;
            this.currentFrame++;
        }

        if (this.currentFrame >= this.frames.length) {
            this.currentFrame = 0;
        }

        return this;
    }
}