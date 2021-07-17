import {Layer} from "../Graphic/Layer";
import {State} from "../Kernel/State";
import {Camera} from "./Camera";
import {Sprite} from "../Entity/Sprite";
import {Vector2f} from "../Math/Vector2f";
import {Vector4f} from "../Math/Vector4f";

export class Scene {
    /**
     * Scene constructor.
     */
    constructor() {
        this.area = new Vector2f(1000, 1000);
        this.layers = [];
        this.sprites = {};
        this.cameras = {};
        this.currentCamera = null;
    }


    /**
     * Create a new Scene instance.
     *
     * @returns {Scene}
     */
    static create() {
        return new Scene();
    }


    /**
     * Returns all entities.
     *
     * @returns {Array}
     */
    getEntities() {
        let entities = [];

        this.getLayers().map((layer) => {
            layer.getTiles().map((tile) => {
                entities.push(tile);
            });
        });

        for (let i in this.sprites) {
            if (!this.sprites.hasOwnProperty(i)) {
                continue;
            }

            if (!this.sprites[i].getVisible()) {
                continue;
            }

            switch (true) {
                case this.sprites[i].hasChildren():
                    this.sprites[i].getParticles().map((particle) => {
                        entities.push(particle.getSprite());
                    });
                    break;

                default:
                    entities.push(this.sprites[i]);
                    break;
            }
        }

        return entities;
    }


    /**
     * Returns all entities capable of collision events.
     *
     * @param root
     * @returns {Array}
     */
    getNearbyEntities(root) {
        let entities = [];

        if (!root.getSolid()) {
            return [];
        }

        let layer = null;
        let layers = this.getLayers();

        for (let i = 0; i < layers.length; i++) {
            layer = layers[i];
            let tiles = layer.getTiles();
            let tile = null;

            for (let j = 0; j < tiles.length; j++) {
                tile = tiles[j];

                if (tile === root) {
                    continue;
                }

                if (!tile.getSolid() && !tile.hasEvents()) {
                    continue;
                }

                if(!tile.getVisible()){
                    continue;
                }

                if (!tile.isNearby(root, Sprite.getFlag('DetectionWindow'))) {
                    continue;
                }

                entities.push(tile);
            }
        }

        for (let i in this.sprites) {
            if (!this.sprites.hasOwnProperty(i)) {
                continue;
            }

            if (this.sprites[i] === root) {
                continue;
            }

            if (!this.sprites[i].getSolid() && !this.sprites[i].hasEvents()) {
                continue;
            }

            if(!this.sprites[i].getVisible()){
                continue;
            }

            if (!this.sprites[i].isNearby(root, Sprite.getFlag('DetectionWindow'))) {
                continue;
            }

            switch (true) {
                case this.sprites[i].hasChildren():
                    this.sprites[i].getParticles().map((particle) => {
                        entities.push(particle.getSprite());
                    });
                    break;

                default:
                    entities.push(this.sprites[i]);
                    break;
            }
        }

        return entities;
    }


    /**
     * Indicates whether or not a camera exists.
     *
     * @param name
     * @returns {boolean}
     */
    hasCamera(name) {
        return this.getCameras().hasOwnProperty(name);
    }


    /**
     * Returns the current camera name.
     *
     * @returns {string}
     */
    getCurrentCamera() {
        return this.currentCamera;
    }


    /**
     * Assigns the current camera.
     *
     * @param name
     * @returns {Scene}
     */
    setCurrentCamera(name) {
        this.currentCamera = name;

        return this;
    }


    /**
     * Returns all cameras.
     *
     * @returns {{}}
     */
    getCameras() {
        return this.cameras;
    }


    /**
     * Assigns all cameras.
     *
     * @param cameras
     * @returns {Scene}
     */
    setCameras(cameras){
        if(!cameras instanceof Object){
            return this;
        }

        this.cameras = cameras;

        return this;
    }


    /**
     * Returns the assigned camera.
     *
     * @returns {Camera}
     */
    getCamera() {
        if (!this.getCurrentCamera()) {
            return new Camera();
        }

        if (!this.hasCamera(this.getCurrentCamera())) {
            return new Camera();
        }

        return this.getCameras()[this.getCurrentCamera()];
    }


    /**
     * Assigns the camera.
     *
     * @param name
     * @param camera
     * @returns this
     */
    addCamera(name, camera) {
        if (!camera instanceof Camera) {
            return this;
        }

        this.cameras[name] = camera;

        if (!this.getCurrentCamera()) {
            this.setCurrentCamera(name);
        }

        return this;
    }


    /**
     * Returns a sprite by identifier.
     *
     * @param name
     * @returns Sprite
     * @deprecated
     */
    getSprite(name) {
        if (!this.hasSprite(name)) {
            return new Sprite();
        }

        return this.getSprites()[name];
    }


    /**
     * Indicates whether or not a sprite exists.
     *
     * @param name
     * @returns {boolean}
     */
    hasSprite(name) {
        return this.getSprites().hasOwnProperty(name);
    }


    /**
     * Returns the internal sprite collector.
     *
     * @returns {{}}
     */
    getSprites() {
        return this.sprites;
    }


    /**
     * Assigns all scene sprites.
     *
     * @param sprites
     * @returns {Scene}
     */
    setSprites(sprites){
        if(!sprites instanceof Object){
            return this;
        }

        this.sprites = sprites;

        return this;
    }


    /**
     * Returns an entity by name.
     *
     * @param name
     * @returns {Sprite}
     */
    getEntity(name) {
        return this.getSprite(name);
    }


    /**
     * Registers a new sprite entity.
     *
     * @param name
     * @param sprite
     * @returns this
     */
    addEntity(name, sprite) {
        if (sprite instanceof Function) {
            sprite = sprite();
        }

        if (!sprite instanceof Sprite) {
            return this;
        }

        this.sprites[name] = sprite;

        return this;
    }


    /**
     * Assigns the scene boundaries.
     *
     * @param area
     * @returns {Scene}
     */
    setArea(area) {
        if (!area instanceof Vector2f) {
            return this;
        }

        this.area = area;

        return this;
    }


    /**
     * Returns the scene boundaries.
     *
     * @returns {Vector2f}
     */
    getArea() {
        return this.area;
    }


    /**
     * Registers a new layer.
     *
     * @param layer
     * @returns {Scene}
     */
    addLayer(layer) {
        if (layer instanceof Function) {
            layer = layer();
        }

        if (!layer instanceof Layer) {
            return this;
        }

        this.layers.push(layer);

        return this;
    }


    /**
     * Returns all layers assigned to the scene.
     *
     * @returns {Array}
     */
    getLayers() {
        return this.layers;
    }


    /**
     * Returns the camera boundaries.
     *
     * @returns {Vector4f}
     */
    getCameraBoundary(){
        const engine = State.getEngine();

        return new Vector4f(0, 0,
            engine.getScene().getArea().getX() - (engine.getCanvasWidth() / this.getCamera().getZoom()),
            engine.getScene().getArea().getY() - (engine.getCanvasHeight() / this.getCamera().getZoom())
        );
    }


    /**
     * Renders the scene.
     */
    draw() {
        const engine = State.getEngine();
        const camera = this.getCamera();
        const layers = this.getLayers();
        const boundary = this.getCameraBoundary();

        camera.getTimeline().update();
        camera.getPosition().add(
            new Vector2f(
                (camera.getSprite().getCalculatedPosition().getX() - (engine.getCanvasWidth() / 2)) * 0.02,
                (camera.getSprite().getCalculatedPosition().getY() - (engine.getCanvasHeight() / 2)) * 0.02,
            )
        );

        // Handle map boundaries.
        if (camera.getPosition().getX() < boundary.getX()) {
            camera.getPosition().setX(boundary.getX());
        }

        if (camera.getPosition().getY() < boundary.getY()) {
            camera.getPosition().setY(boundary.getY());
        }

        if (camera.getPosition().getX() > boundary.getW()) {
            camera.getPosition().setX(boundary.getW());
        }

        if (camera.getPosition().getY() > boundary.getH()) {
            camera.getPosition().setY(boundary.getH());
        }

        // Handle camera shake.
        camera.getPosition().add(new Vector2f(
            camera.getShakeOffset(),
            camera.getShakeOffset()
        ));

        camera.getSprite().setOffset(
            new Vector2f(
                -camera.getPosition().getX(),
                -camera.getPosition().getY()
            )
        );

        let temperature = 10;

        // Update the current frame.
        for (let z = Sprite.getZRange().getX(); z < layers.length * 10; z++) {
            Sprite.setZCurrent(z);

            for (let i = 0; i < layers.length; i++) {
                if (i * 10 !== z) {
                    continue;
                }

                layers[i].setZIndex(i)
                    .setOffset(new Vector2f(
                        -camera.getPosition().getX(),
                        -camera.getPosition().getY()
                    )).draw();
            }

            for (let i in this.sprites) {
                if (!this.sprites.hasOwnProperty(i)) {
                    continue;
                }

                if (this.sprites[i].getZIndex() === Sprite.getZCurrent() || this.sprites[i].hasChildren()) {
                    this.sprites[i].setOffset(new Vector2f(
                        -camera.getPosition().getX(),
                        -camera.getPosition().getY()
                    )).draw();
                }
            }

            // Apply any pixel transformations.
            // let composite = engine.getCanvasLayer(Math.floor(z / 10)).getContext('2d').getImageData(0, 0, engine.getCanvasWidth(), engine.getCanvasHeight());
            //
            // for(let i = 0; i < composite.data.length; i += 4){
            //     // Ignore any pixels without an opacity.
            //     if(!composite.data[i + 3]){
            //         continue;
            //     }
            //
            //     // Apply temperature updates.
            //     composite.data[i] = Math.min(composite.data[i] + temperature, 255);
            //     composite.data[i + 1] = Math.min(composite.data[i + 1], 255);
            //     composite.data[i + 2] = Math.min(composite.data[i + 2] + temperature, 255);
            //
            //     // Limit the color palette.
            //     composite.data[i] = Math.min(Math.round(composite.data[i] / 20) * 20, 255);
            //     composite.data[i + 1] = Math.min(Math.round(composite.data[i + 1] / 20) * 20, 255);
            //     composite.data[i + 2] = Math.min(Math.round(composite.data[i + 2] / 20) * 20, 255);
            // }
            //
            // engine.getCanvasLayer(z).getContext('2d').putImageData(composite, 0, 0);
        }
    }
}
