import {Tile} from "../Entity/Tile";
import {Frame} from "./Frame";
import {Vector2f} from "../Math/Vector2f";
import {Animation} from "../Animation/Animation";
import {SpriteSheet} from "./SpriteSheet";

export class Layer extends SpriteSheet {
    /**
     * Layer constructor.
     *
     * @param src
     * @param layout
     */
    constructor(src, layout) {
        super(src);

        this.zIndex = 0;

        this.setTiles([])
            .setScale(new Vector2f(1, 1))
            .setOffset(new Vector2f(0, 0));

        if (layout) {
            this.slice(layout);
        }
    }


    /**
     * Create a new Layer instance.
     *
     * @param src
     * @param layout
     * @returns {Layer}
     */
    static create(src, layout) {
        return new Layer(src, layout);
    }


    /**
     * Assigns the Z index.
     *
     * @param index
     * @returns {Layer}
     */
    setZIndex(index) {
        this.zIndex = index;

        return this;
    }


    /**
     * Returns the Z index.
     *
     * @returns {number}
     */
    getZIndex() {
        return this.zIndex;
    }


    /**
     * Finds a tile at the specified position.
     *
     * @param position
     * @param threshold
     */
    find(position, threshold) {
        threshold = threshold || 0;

        if (!position instanceof Vector2f) {
            return false;
        }

        for (let i = 0; i < this.getTiles().length; i++) {
            if (this.getTiles()[i].getPosition().getX() >= position.getX() - threshold && this.getTiles()[i].getPosition().getX() <= position.getX() + threshold &&
                this.getTiles()[i].getPosition().getY() >= position.getY() - threshold && this.getTiles()[i].getPosition().getY() <= position.getY() + threshold
            ) {
                return this.getTiles()[i];
            }
        }

        return false;
    }


    /**
     * Used to sequentially cut frames based on the input layout.
     *
     * @param layout
     * @returns {Layer}
     */
    slice(layout) {
        if (!layout instanceof Vector2f) {
            return this;
        }

        this.getResource().addEvent(() => {
            let frameWidth = this.getDomSize().getX() / layout.getX();
            let frameHeight = this.getDomSize().getY() / layout.getY();

            for (let y = 0; y < layout.getY(); y++) {
                for (let x = 0; x < layout.getX(); x++) {
                    this.addFrame(new Frame(x * frameWidth, y * frameHeight, frameWidth, frameHeight))
                }
            }
        });

        return this;
    }


    /**
     * Used to assign a global offset to all tiles under the layer.
     *
     * @param offset
     * @returns {Layer}
     */
    setOffset(offset) {
        if (!offset instanceof Vector2f) {
            return this;
        }

        this.offset = offset;

        return this;
    }


    /**
     * Returns the assigned offset.
     *
     * @returns {Vector2f}
     */
    getOffset() {
        return this.offset;
    }


    /**
     * Assigns the layer scale.
     *
     * @param scale
     * @returns {Layer}
     */
    setScale(scale) {
        if (!scale instanceof Vector2f) {
            return this;
        }

        this.scale = scale;

        return this;
    }


    /**
     * Returns the layer scale.
     *
     * @returns Vector2f
     */
    getScale() {
        return this.scale;
    }


    /**
     * Registers a new tile.
     *
     * @param tile
     * @returns {Layer}
     */
    addTile(tile) {
        if (!tile instanceof Tile) {
            return this;
        }

        // As an optimization step, we'll register the assigned layer graphic to
        // the tile to avoid a need to reload & recreate the underlying resource.
        //
        this.getResource().addEvent(() => {
            if (tile.hasAnimations() || !this.getFrames().hasOwnProperty(tile.index)) {
                return;
            }

            tile.addAnimation('Default', (new Animation())
                .addFrame(this.frames[tile.index])
                .setResource(this.getResource())
            );
        });

        this.tiles.push(tile.setScale(new Vector2f(
            tile.getScale().getX() + this.getScale().getX() - 1,
            tile.getScale().getY() + this.getScale().getY() - 1
        )));

        return this;
    }


    /**
     * Returns all assigned tiles.
     *
     * @returns {Array}
     */
    getTiles() {
        return this.tiles;
    }


    /**
     * Assigns all tiles.
     *
     * @param tiles
     * @returns {Layer}
     */
    setTiles(tiles) {
        this.tiles = tiles;

        return this;
    }


    /**
     * Renders the layer.
     */
    draw() {
        const tiles = this.getTiles();

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].setZIndex(this.getZIndex())
                .setOffset(new Vector2f(
                    this.getOffset().getX() + tiles[i].getPosition().getX() * (this.getScale().getX() - 1),
                    this.getOffset().getY() + tiles[i].getPosition().getY() * (this.getScale().getY() - 1)
                )).draw()
        }
    }
}
