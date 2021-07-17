import {EventPayload} from "./EventPayload";

export class DistancePayload extends EventPayload {
    /**
     * DistancePayload constructor.
     *
     * @param root
     * @param entity
     * @param distance
     */
    constructor(root, entity, distance) {
        super();

        this.root = root;
        this.entity = entity;
        this.distance = distance;
    }


    /**
     * Returns the root entity.
     *
     * @returns {Sprite}
     */
    getRoot() {
        return this.root;
    }


    /**
     * Returns the linked sprite.
     *
     * @returns Sprite
     */
    getEntity() {
        return this.entity;
    }


    /**
     * Returns the distance value.
     *
     * @returns {*}
     */
    getDistance() {
        return this.distance;
    }
}