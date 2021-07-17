import {EventPayload} from "../../../Event/EventPayload";

export class UpdateHealthPayload extends EventPayload {
    /**
     * EventPayload constructor.
     *
     * @param root
     * @param entity
     * @param damage
     */
    constructor(root, entity, damage) {
        super();

        this.root = root;
        this.entity = entity;
        this.damage = damage;
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
     * Returns the entity.
     *
     * @returns {Sprite}
     */
    getEntity() {
        return this.entity;
    }


    /**
     * Returns the damage.
     *
     * @returns {number}
     */
    getDamage() {
        return this.damage;
    }
}