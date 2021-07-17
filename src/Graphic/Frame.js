import {Vector2f} from "../Math/Vector2f";
import {Vector4f} from "../Math/Vector4f";

export class Frame extends Vector4f {
    /**
     * Frame constructor.
     *
     * @param x
     * @param y
     * @param w
     * @param h
     * @param offset
     */
    constructor(x, y, w, h, offset) {
        super(x, y, w, h);

        this.offset = new Vector2f(0, 0);

        if (offset) {
            this.setOffset(offset);
        }
    }


    /**
     * Creates a new Frame instance.
     *
     * @param x
     * @param y
     * @param w
     * @param h
     * @param offset
     * @returns {Frame}
     */
    static create(x, y, w, h, offset) {
        return new Frame(x, y, w, h, offset);
    }


    /**
     * Assigns the offset.
     *
     * @param offset
     * @returns {this}
     */
    setOffset(offset) {
        if (!offset instanceof Vector2f) {
            return this;
        }

        this.offset = offset;

        return this;
    }


    /**
     * Returns the assigned offset.
     *
     * @returns {Vector2f}
     */
    getOffset() {
        return this.offset;
    }
}