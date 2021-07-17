export class Vector2f {
    /**
     * Vector2f constructor.
     *
     * @param x
     * @param y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
     * Assigns an X value.
     *
     * @param x
     * @returns {Vector2f}
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
     * @returns {Vector2f}
     */
    setY(y) {
        this.y = y;

        return this;
    }


    /**
     * Adds another vector.
     *
     * @param v
     * @returns {Vector2f}
     */
    add(v) {
        if (!v instanceof Vector2f) {
            return this;
        }

        this.x += Math.abs(v.getX()) <= 0.01 ? 0 : v.getX();
        this.y += Math.abs(v.getY()) <= 0.01 ? 0 : v.getY();
    }
}