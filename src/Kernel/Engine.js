import {State} from "./State";
import {Scene} from "../Scene/Scene";
import {Sprite} from "../Entity/Sprite";
import {Vector2f} from "../Math/Vector2f";
import {Controller} from "../Input/Controller";

export class Engine {
    /**
     * Blank image data for refreshing.
     */
    static blank;


    /**
     * Engine constructor.
     */
    constructor(setup, gameplay) {
        // Assign the global instance.
        if (!Engine.getInstance()) {
            Engine.setInstance(this);
        }

        // Initialize any default values.
        this.fps = 60;
        this.setup = setup;
        this.scene = new Scene();
        this.gameplay = gameplay;
        this.isPaused = false;
        this.controller = new Controller();
        this.canvasLayer = 0;
        this.canvasLayers = {};
        this.canvasScale = 1.5;
        this.canvasWidth = 640;
        this.canvasHeight = 480;
        this.canvasOffset = new Vector2f(0,0);
        this.rootElement = null;

        // Execute the setup process.
        if (this.getSetup() instanceof Function) {
            this.getSetup()(this);
        }

        // Initialize the engine.
        this.setCanvasLayer(this.canvasLayer)
            .update();
    }


    /**
     * Assigns the gameplay loop.
     *
     * @param game
     * @returns this
     */
    setGameplay(game) {
        if (!game instanceof Function) {
            return this;
        }

        this.gameplay = game;

        return this;
    }


    /**
     * Returns the gameplay loop.
     *
     * @returns {Function|*}
     */
    getGameplay() {
        return this.gameplay;
    }


    /**
     * Assigns the setup process.
     *
     * @param setup
     * @returns this
     */
    setSetup(setup) {
        if (!setup instanceof Function) {
            return this;
        }

        this.setup = setup;

        return this;
    }


    /**
     * Returns the current setup process.
     *
     * @returns {*|Function}
     */
    getSetup() {
        return this.setup;
    }


    /**
     * Returns the width of the canvas.
     *
     * @returns number
     */
    getCanvasWidth() {
        return this.canvasWidth;
    }


    /**
     * Returns the height of the canvas.
     *
     * @returns number
     */
    getCanvasHeight() {
        return this.canvasHeight;
    }


    /**
     * Returns the canvas scale.
     *
     * @returns {number}
     */
    getCanvasScale() {
        return this.canvasScale;
    }


    /**
     * Returns the canvas offset position.
     *
     * @returns {Vector2f}
     */
    getCanvasOffset() {
        return this.canvasOffset;
    }


    /**
     * Returns the current scene.
     *
     * @returns Scene
     */
    getScene() {
        return this.scene;
    }


    /**
     * Assigns the scene.
     *
     * @param scene
     * @returns this
     */
    setScene(scene) {
        if (!scene instanceof Scene) {
            return this;
        }

        this.scene = scene;

        return this;
    }


    /**
     * Returns the camera zoom.
     *
     * @returns {number}
     */
    static getZoom() {
        return Engine.getInstance().getScene().getCamera().getZoom();
    }


    /**
     * Applies an async delay.
     *
     * @param time
     * @returns Promise<any>
     */
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }


    /**
     * Refreshes the canvas.
     *
     * @returns this
     */
    refresh() {
        if (!Engine.blank) {
            Engine.blank = this.getContext().createImageData(this.getCanvasWidth(), this.getCanvasHeight());
        }

        [...document.querySelectorAll('canvas[data-layer]')].map((c) => {
            c.getContext('2d').beginPath();
            c.getContext('2d').clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        });

        return this;
    }


    /**
     * Performs the engine update.
     */
    async update() {
        const timeStart = new Date();

        // Render the scene.
        this.refresh()
            .getScene()
            .draw();

        // Execute the gameplay logic.
        if (this.getGameplay() instanceof Function) {
            this.getGameplay()(this);
        }

        // Determine the delay period based on the elapsed time.
        const timeEnd = new Date();
        const timeElapsed = timeEnd - timeStart;
        const frameDelay = (1000 / this.getFps()) - timeElapsed;
        await this.sleep(frameDelay);

        // Execute the loop.
        if (!this.isPaused) {
            this.update();
        }

        // Engine.text((1000 / timeElapsed).toFixed(2), new Vector2f(5, 15), 8);
    }


    /**
     * Returns the frame rate.
     *
     * @returns number
     */
    getFps() {
        return this.fps;
    }


    /**
     * Returns the keyboard controller.
     *
     * @returns Controller
     */
    getController() {
        return this.controller;
    }


    /**
     * Returns the canvas instance.
     *
     * @returns Element
     */
    getCanvas() {
        return this.canvasLayers[this.canvasLayer];
    }


    /**
     * Returns the canvas context.
     *
     * @returns CanvasRenderingContext2D
     */
    getContext() {
        return this.getCanvas().getContext('2d');
    }


    /**
     * Assigns the canvas layer
     *
     * @param layer
     * @returns {Engine}
     */
    setCanvasLayer(layer) {
        this.canvasLayer = layer;

        if (!this.hasCanvasLayer(layer)) {
            this.canvasLayers[layer] = document.createElement('canvas');
            this.canvasLayers[layer].setAttribute('style', `transform: scale(${this.canvasScale}, ${this.canvasScale}) translate(${this.canvasOffset.getX()}px, ${this.canvasOffset.getY()}px);`);
            this.canvasLayers[layer].setAttribute('width', this.getCanvasWidth());
            this.canvasLayers[layer].setAttribute('height', this.getCanvasHeight());
            this.canvasLayers[layer].setAttribute('data-layer', layer);
            this.canvasLayers[layer].getContext('2d').imageSmoothingEnabled = false;

            // Sort the onscreen canvases.
            this.getRootElement().appendChild(this.canvasLayers[layer]);

            [...document.querySelectorAll('canvas[data-layer]')]
                .sort((a, b) => parseInt(a.getAttribute('data-layer')) - parseInt(b.getAttribute('data-layer')))
                .map((c) => this.getRootElement().appendChild(c));
        }

        return this;
    }


    /**
     * Returns an individual canvas layer.
     *
     * @param layer
     * @returns {*}
     */
    getCanvasLayer(layer) {
        return this.canvasLayers[layer];
    }

    /**
     * Returns the root game element.
     *
     * @returns {HTMLElement}
     */
    getRootElement() {
        if (!this.rootElement) {
            this.rootElement = document.getElementById('game');
        }

        return this.rootElement;
    }


    /**
     * Indicates whether or not a canvas layer exists.
     *
     * @param layer
     * @returns {boolean}
     */
    hasCanvasLayer(layer) {
        return this.getCanvasLayers().hasOwnProperty(layer);
    }


    /**
     * Returns all stored canvas layers.
     *
     * @returns {{}}
     */
    getCanvasLayers() {
        return this.canvasLayers;
    }


    /**
     * Renders text to the screen.
     *
     * @param value
     * @param position
     * @param size
     * @param color
     * @param opacity
     * @returns this
     */
    static text(value, position, size, color, opacity) {
        const context = Engine.getInstance().getContext();

        // Organize default values.
        size = size || 24;
        color = color || '#ffffff';
        position = position || new Vector2f(0, 0);

        context.font = `${size}px font`;
        context.fillStyle = color;

        // Only apply an opacity mask if we have a value provided.
        if (typeof opacity !== 'undefined') {
            context.globalAlpha = opacity;
        }

        // Render the text.
        context.fillText(value,
            position.getX(), position.getY()
        );

        // Refresh the opacity mask.
        if (context.globalAlpha !== 1) {
            context.globalAlpha = 1;
        }
    }


    /**
     * Draws a rectangle to the canvas.
     *
     * @param position
     * @param size
     * @param color
     * @param opacity
     * @param variant
     */
    static rectangle(position, size, color, opacity, variant) {
        const context = Engine.getInstance().getContext();

        // Organize default values.
        size = size || new Vector2f(0, 0);
        color = color || '#ffffff';
        position = position || new Vector2f(0, 0);

        // Only apply an opacity mask if we have a provided value.
        if (typeof opacity !== 'undefined') {
            context.globalAlpha = opacity;
        }

        // Render the shape.
        switch(variant){
            case 'Stroke':
                context.strokeStyle = color;
                context.strokeRect(
                    position.getX(), position.getY(),
                    size.getX(), size.getY()
                );
                break;

            case 'Fill':
            default:
                context.fillStyle = color;
                context.fillRect(
                    position.getX(), position.getY(),
                    size.getX(), size.getY()
                );
                break;
        }

        // Refresh the opacity mask.
        if (context.globalAlpha !== 1) {
            context.globalAlpha = 1;
        }
    }


    /**
     * Used to draw an arbitrary sprite graphic to the canvas.
     *
     * @param sprite
     */
    static drawSprite(sprite) {
        if (!sprite || !sprite instanceof Sprite) {
            return;
        }

        sprite.setOffset(new Vector2f(0, 0));

        let currentSize = sprite.getScaledSize();
        let currentFrame = sprite.getAnimation().getFrame();
        let currentPosition = sprite.getOffsetPosition();
        let canvasPosition = new Vector2f(
            currentPosition.getX() + (sprite.getFlipX() ? sprite.getScaledSize().getX() : 0),
            currentPosition.getY() + (sprite.getFlipY() ? sprite.getScaledSize().getY() : 0)
        );

        Engine.getInstance().getContext()
            .drawImage(
                sprite.getAnimation().getDomResource(),
                currentFrame.getX(),
                currentFrame.getY(),
                currentFrame.getW(),
                currentFrame.getH(),
                canvasPosition.getX(),
                canvasPosition.getY(),
                currentSize.getX(),
                currentSize.getY(),
            );
    }


    /**
     * Finds an entity by name.
     *
     * @param name
     * @returns Sprite
     */
    static getEntity(name) {
        if (!Engine.getInstance()) {
            return new Sprite();
        }

        return Engine.getInstance().getScene().getEntity(name);
    }


    /**
     * Returns a scaled value.
     *
     * @param value
     * @returns {Vector2f|number}
     */
    scale(value) {
        if (value instanceof Vector2f) {
            return new Vector2f(
                this.scale(value.getX()),
                this.scale(value.getY())
            );
        }

        return value * Engine.getInstance().getScene().getCamera().getZoom();
    }


    /**
     * Assigns the active engine instance.
     *
     * @param instance
     */
    static setInstance(instance) {
        State.setEngine(instance);
    }


    /**
     * Returns the active engine instance.
     *
     * @returns Engine
     */
    static getInstance() {
        return State.getEngine();
    }
}