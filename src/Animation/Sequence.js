import {KeyFrame} from "./KeyFrame";

export class Sequence {
    /**
     * Sequence constructor.
     */
    constructor(mutator) {
        this.keyFrames = [];
        this.mutator = new Function();
        this.currentFrame = 0;
        this.lastFrame = new Date();

        this.setMutator(mutator);
    }


    /**
     * Creates a new Sequence instance.
     *
     * @param mutator
     * @returns {Sequence}
     */
    static create(mutator) {
        return new Sequence(mutator);
    }


    /**
     * Returns the duration.
     *
     * @returns {number}
     */
    getDurationInSeconds() {
        let sum = 0.00;

        this.getKeyFrames().map((keyframe) => {
            sum += keyframe.getDuration();
        });

        return sum;
    }


    /**
     * Assigns the mutator.
     *
     * @param mutator
     * @returns {Sequence}
     */
    setMutator(mutator) {
        if (!mutator instanceof Function()) {
            return this;
        }

        this.mutator = mutator;

        return this;
    }


    /**
     * Returns the mutator.
     *
     * @returns {Function}
     */
    getMutator() {
        return this.mutator;
    }


    /**
     * Returns all assigned frames.
     *
     * @returns {Array}
     */
    getKeyFrames() {
        return this.keyFrames;
    }


    /**
     * Returns the current frame.
     *
     * @returns {number}
     */
    getCurrentFrame() {
        return this.currentFrame;
    }


    /**
     * Returns the count of key frames.
     *
     * @returns {number}
     */
    getKeyFrameCount() {
        return this.getKeyFrames().length;
    }


    /**
     * Returns the current frame itself.
     *
     * @returns {KeyFrame}
     */
    getKeyFrame() {
        if (!this.hasCurrentFrame()) {
            return new KeyFrame();
        }

        return this.getKeyFrames()[this.getCurrentFrame()];
    }


    /**
     * Registers a new key frame.
     *
     * @param frame
     * @returns {Sequence}
     */
    addKeyFrame(frame) {
        if (!frame instanceof KeyFrame) {
            return this;
        }

        this.keyFrames.push(frame);

        return this;
    }


    /**
     * Returns the last frame time.
     *
     * @returns {Date}
     */
    getLastFrameTime() {
        return this.lastFrame;
    }


    /**
     * Returns elapsed time in seconds.
     *
     * @returns {number}
     */
    getElapsedInSeconds() {
        return (Date.now() - this.getLastFrameTime()) / 1000;
    }


    /**
     * Indicates whether or not the current frame exists.
     *
     * @returns {boolean}
     */
    hasCurrentFrame() {
        return this.getCurrentFrame() < this.getKeyFrameCount();
    }


    /**
     * Executes the timeline mutator.
     *
     * @param value
     */
    call(value) {
        if (this.getMutator() instanceof Function) {
            this.getMutator()(value);
        }
    }


    /**
     * Processes the timeline sequence.
     */
    update() {
        if (!this.getKeyFrame().getDuration()) {
            return;
        }

        if (!this.hasCurrentFrame()) {
            return;
        }

        // Determine what the current value should be.
        let percentage = this.getElapsedInSeconds() / this.getKeyFrame().getDuration();

        if (percentage > 1) {
            percentage = 1;
        }

        let offset = (this.getKeyFrame().getValue().getY() - this.getKeyFrame().getValue().getX()) * percentage;
        let value = this.getKeyFrame().getValue().getX() + offset;

        // Execute the keyframe mutator.
        this.call(value);

        // Increment the current frame.
        if (this.getElapsedInSeconds() > this.getKeyFrame().getDuration()) {
            this.currentFrame++;
            this.lastFrame = new Date();
        }
    }
}
