import {Resource} from "./Resource";

export class ImageResource extends Resource {
    /**
     * ImageResource constructor.
     *
     * @param src
     */
    constructor(src) {
        super(src);

        let element = new Image();

        if (src) {
            element.src = this.src;
            element.onload = () => {
                this.onLoad();
            };
        }

        this.setElement(element);
    }


    /**
     * Indicates whether or not the image is loaded.
     *
     * @returns {boolean}
     */
    isLoaded() {
        return this.getElement().loaded;
    }


    /**
     * Assigns the internal resource element.
     *
     * @param element
     * @returns {this}
     */
    setElement(element) {
        if (!element instanceof Image) {
            return this;
        }

        this.element = element;

        return this;
    }

    /**
     * Returns the assigned element.
     *
     * @returns {HTMLImageElement}
     */
    getElement() {
        if (!this.element || !this.element.complete) {
            return new Image();
        }

        return this.element;
    }
}