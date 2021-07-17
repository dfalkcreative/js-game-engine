export class Vector3f {
    /**
     * Vector3f constructor.
     *
     * @param x
     * @param y
     * @param z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    /**
     * Returns the X value.
     *
     * @returns {*}
     */
    getX() {
        return this.x;
    }


    /**
     * Returns the Y value.
     *
     * @returns {*}
     */
    getY() {
        return this.y;
    }


    /**
     * Returns the Z element.
     *
     * @returns {*}
     */
    getZ() {
        return this.z;
    }
}