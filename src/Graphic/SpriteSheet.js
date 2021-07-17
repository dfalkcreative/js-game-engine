import {Frame} from "./Frame";
import {Vector2f} from "../Math/Vector2f";
import {ImageResource} from "../Resource/ImageResource";

export class SpriteSheet {
    /**
     * SpriteSheet constructor.
     *
     * @param src
     */
    constructor(src) {
        this.frames = [];

        this.setResource(
            new ImageResource(src)
        );
    }


    /**
     * Registers a new frame.
     *
     * @param frame
     * @returns this
     */
    addFrame(frame) {
        if (!frame || !frame instanceof Frame) {
            return this;
        }

        this.frames.push(frame);

        return this;
    }


    /**
     * Returns the assigned frames.
     *
     * @returns {Array}
     */
    getFrames() {
        return this.frames;
    }


    /**
     * Assigns the resource.
     *
     * @param resource
     * @returns this
     */
    setResource(resource) {
        if (!resource instanceof ImageResource) {
            return this;
        }

        this.resource = resource;

        return this;
    }


    /**
     * Returns the assigned resource.
     *
     * @returns ImageResource
     */
    getResource() {
        return this.resource;
    }


    /**
     * Returns the DOM resource.
     *
     * @returns HTMLImageElement
     */
    getDomResource() {
        return this.getResource().getElement();
    }


    /**
     * Returns the calculated DOM size.
     *
     * @returns {Vector2f}
     */
    getDomSize() {
        return new Vector2f(this.getDomResource().width, this.getDomResource().height);
    }
}