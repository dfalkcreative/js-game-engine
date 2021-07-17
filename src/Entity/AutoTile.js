import {Matrix} from "../Math/Matrix";
import {Vector2f} from "../Math/Vector2f";

export class AutoTile {
    /**
     * GroupedTile constructor.
     *
     * @param name
     * @param tiles
     */
    constructor(name, tiles) {
        this.name = name;
        this.tiles = new Matrix(new Vector2f(3, 4));

        if (tiles) {
            this.setTiles(tiles);
        }
    }


    /**
     * Creates a new auto tile instance.
     *
     * @param name
     * @param tiles
     * @returns {AutoTile}
     */
    static create(name, tiles) {
        return new AutoTile(name, tiles);
    }


    /**
     * Automatically generates the auto tile map from a specific index.
     *
     * @param index The root frame index.
     * @param area  The area of the tile map in tiles.
     * @returns this
     */
    getFromIndex(index, area) {
        for (let y = -2; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                this.setTile(new Vector2f(x + 1, y + 2), index + (y * area.getX()) + x);
            }
        }

        return this;
    }


    /**
     * Assigns the name.
     *
     * @param name
     * @returns {AutoTile}
     */
    setName(name) {
        this.name = name;

        return this;
    }


    /**
     * Returns the name.
     *
     * @returns {*}
     */
    getName() {
        return this.name;
    }


    /**
     * Assigns the tiles matrix.
     *
     * @param tiles
     * @returns {AutoTile}
     */
    setTiles(tiles) {
        if (!tiles instanceof Matrix) {
            return this;
        }

        this.tiles = tiles;

        return this;
    }


    /**
     * Returns the tiles matrix.
     *
     * @returns {Matrix}
     */
    getTiles() {
        return this.tiles;
    }


    /**
     * Returns a tile index at the specified position.
     *
     * @param position
     * @returns {number}
     */
    getTile(position) {
        return this.getTiles().getValue(position);
    }


    /**
     * Assigns a tile index to the position.
     *
     * @param position
     * @param tile
     * @returns {AutoTile}
     */
    setTile(position, tile) {
        this.getTiles().setValue(position, tile);

        return this;
    }


    /**
     * Returns whether or not the bitmasking value is valid based on this auto tile map.
     *
     * @param value
     * @returns {boolean}
     */
    static isBitmaskValid(value) {
        return ![1, 2, 4, 8, 6, 9].includes(value);
    }


    /**
     * Indicates whether or not the bitmasking value indicates a floor tile (bottom row).
     *
     * @param value
     * @returns {boolean}
     */
    static isBitmaskFloor(value) {
        return [3, 5, 7].includes(value);
    }


    /**
     * Indicates whether or not the bitmasking value indicates a ceiling tile (second row).
     *
     * @param value
     * @returns {boolean}
     */
    static isBitmaskCeiling(value) {
        return [10, 12, 14].includes(value);
    }


    /**
     * Returns the root tile index.
     *
     * @returns {number}
     */
    getRootTile() {
        return this.getTile(new Vector2f(1, 2));
    }


    /**
     * Indicates whether or not a tile exists.
     *
     * @param index
     * @returns {boolean}
     */
    hasTile(index) {
        for (let i = 0; i < this.getTiles().getData().length; i++) {
            for (let j = 0; j < this.getTiles().getData()[i].length; j++) {
                if (this.getTiles().getData()[i][j] === index) {
                    return true;
                }
            }
        }

        return false;
    }


    /**
     * Casts the tile series to an array.
     *
     * @returns {Array}
     */
    toArray(){
        let tiles = [];

        for (let i = 0; i < this.getTiles().getData().length; i++) {
            for (let j = 0; j < this.getTiles().getData()[i].length; j++) {
                tiles.push(this.getTiles().getData()[i][j]);
            }
        }

        return tiles;
    }


    /**
     * Returns the appropriate tile from a bitmasking value.
     *
     * @param value
     * @see https://gamedevelopment.tutsplus.com/tutorials/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673
     */
    getFromBitmask(value) {
        if (!AutoTile.isBitmaskValid(value)) {
            return this.getRootTile();
        }

        switch (value) {
            // No neighbors.
            case 0:
                return this.getTile(new Vector2f(0, 0));

            // Bottom right.
            case 3:
                return this.getTile(new Vector2f(2, 3));

            // Bottom left.
            case 5:
                return this.getTile(new Vector2f(0, 3));

            // Bottom.
            case 7:
                return this.getTile(new Vector2f(1, 3));

            // Top right.
            case 10:
                return this.getTile(new Vector2f(2, 1));

            // Right.
            case 11:
                return this.getTile(new Vector2f(2, 2));

            // Top left.
            case 12:
                return this.getTile(new Vector2f(0, 1));

            // Left.
            case 13:
                return this.getTile(new Vector2f(0, 2));

            // Top.
            case 14:
                return this.getTile(new Vector2f(1, 1));

            // All neighbors.
            case 15:
                return this.getRootTile();
        }
    }
}
