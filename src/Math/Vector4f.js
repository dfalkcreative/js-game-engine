export class Vector4f {
    /**
     * Vector4f constructor.
     *
     * @param x
     * @param y
     * @param w
     * @param h
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }


    /**
     * Returns the assigned X value.
     *
     * @returns {*}
     */
    getX() {
        return this.x;
    }


    /**
     * Assigns the X value.
     *
     * @param x
     * @returns {Vector4f}
     */
    setX(x) {
        this.x = x;

        return this;
    }


    /**
     * Returns the assigned Y value.
     *
     * @returns {*}
     */
    getY() {
        return this.y;
    }


    /**
     * Assigns the Y value.
     *
     * @param y
     * @returns {Vector4f}
     */
    setY(y) {
        this.y = y;

        return this;
    }


    /**
     * Returns the assigned W value.
     *
     * @returns {*}
     */
    getW() {
        return this.w;
    }


    /**
     * Assigns the W value.
     *
     * @param w
     * @returns {Vector4f}
     */
    setW(w) {
        this.w = w;

        return this;
    }


    /**
     * Returns the assigned H value.
     *
     * @returns {*}
     */
    getH() {
        return this.h;
    }


    /**
     * Assigns the H value.
     *
     * @param h
     * @returns {Vector4f}
     */
    setH(h) {
        this.h = h;

        return this;
    }


    /**
     * Adds another Vector4f
     *
     * @param v
     * @returns {Vector4f}
     */
    add(v) {
        if (!v instanceof Vector4f) {
            return this;
        }

        this.x += v.getX();
        this.y += v.getY();
        this.w += v.getW();
        this.h += v.getH();

        return this;
    }


    /**
     * Used to determine whether or not two Vectors are colliding.
     *
     * @param rect
     * @returns {boolean}
     */
    isColliding(rect) {
        if (!rect instanceof Vector4f) {
            return false;
        }

        return this.getX() < rect.getX() + rect.getW() &&
            this.getX() + this.getW() > rect.getX() &&
            this.getY() < rect.getY() + rect.getH() &&
            this.getY() + this.getH() > rect.getY();
    }
}