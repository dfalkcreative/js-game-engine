export class State {
    /**
     * Returns the engine instance.
     *
     * @returns {Engine}
     */
    static getEngine(){
        return window.Engine;
    }


    /**
     * Assigns the engine.
     *
     * @param engine
     */
    static setEngine(engine){
        window.Engine = engine;
    }
}