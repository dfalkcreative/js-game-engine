import {EventPayload} from "./EventPayload";

export class CollisionPayload extends EventPayload {
    /**
     * CollisionPayload constructor.
     *
     * @param root
     * @param entity
     */
    constructor(root, entity) {
        super();

        this.root = root;
        this.entity = entity;
    }


    /**
     * Returns the event root.
     *
     * @returns Sprite
     */
    getRoot() {
        return this.root;
    }


    /**
     * Returns the event initiator.
     *
     * @returns Sprite
     */
    getEntity() {
        return this.entity;
    }
}