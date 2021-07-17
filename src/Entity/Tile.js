import {Sprite} from "./Sprite";

export class Tile extends Sprite {
    /**
     * Tile constructor.
     *
     * @param index
     * @param position
     * @param solid
     */
    constructor(index, position, solid) {
        super();

        this.setIndex(index)
            .setSolid(solid || false)
            .setStatic(true)
            .setPosition(position);
    }


    /**
     * Creates a new tile index.
     *
     * @param index
     * @param position
     * @param solid
     * @returns {Tile}
     */
    static create(index, position, solid) {
        return new Tile(index, position, solid);
    }


    /**
     * Assigns the index.
     *
     * @param index
     * @returns {this}
     */
    setIndex(index) {
        this.index = index;

        return this;
    }


    /**
     * Returns the index.
     *
     * @returns {number}
     */
    getIndex() {
        return this.index;
    }


    /**
     * Tiles should not throw distance events as an optimization step.
     *
     * @returns {boolean}
     */
    hasDistanceEvents() {
        return false;
    }


    /**
     * Prevent collision detection among tiles.
     *
     * @returns {boolean}
     */
    getCollidable() {
        return false;
    }
}
