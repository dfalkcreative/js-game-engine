import {EventPayload} from "./EventPayload";

export class RenderBeforePayload extends EventPayload {
    /**
     * RenderBeforePayload constructor.
     *
     * @param sprite
     */
    constructor(sprite) {
        super();

        this.sprite = sprite;
    }


    /**
     * Returns the event initiator.
     *
     * @returns Sprite
     */
    getSprite() {
        return this.sprite;
    }
}