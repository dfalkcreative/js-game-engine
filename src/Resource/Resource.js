export class Resource {
    /**
     * Resource constructor.
     *
     * @param src
     */
    constructor(src) {
        this.src = src;
        this.events = [];
    }


    /**
     * Indicates whether or not the resource is loaded.
     *
     * @returns {boolean}
     */
    isLoaded() {
        return true;
    }


    /**
     * Binds a new load event.
     *
     * @param event
     * @returns {Resource}
     */
    addEvent(event) {
        if (this.isLoaded()) {
            event();
        }

        if (!event instanceof Function) {
            return this;
        }

        this.events.push(event);

        return this;
    }


    /**
     * Returns the configured events.
     *
     * @returns {Array}
     */
    getEvents() {
        return this.events;
    }


    /**
     * Executes the on load procedure.
     */
    onLoad() {
        const events = this.getEvents();

        for (let i = 0; i < events.length; i++) {
            events[i]();
        }
    }
}