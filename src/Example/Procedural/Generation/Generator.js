import {Path} from "./Path";
import {Tile} from "../../../Entity/Tile";
import {Scene} from "../../../Scene/Scene";
import {Layer} from "../../../Graphic/Layer";
import {Frame} from "../../../Graphic/Frame";
import {Matrix} from "../../../Math/Matrix";
import {ISprite} from "../Entity/ISprite";
import {Vector2f} from "../../../Math/Vector2f";
import {Vector4f} from "../../../Math/Vector4f";
import {AutoTile} from "../../../Entity/AutoTile";

export class Generator {
    /**
     * Generator constructor.
     *
     * @param area
     * @param src
     * @param layout
     */
    constructor(area, src, layout) {
        // Controls various generational aspects.
        this.maxHeight = 1;
        this.pathBreak = 0.1;
        this.pathWidth = 2;
        this.pathChance = 0.1;
        this.totalDecorations = 20;
        this.totalRegions = 10;
        this.totalAccessories = 20;
        this.totalRegionTiles = 500;

        // Organize various defaults.
        this.src = src;
        this.area = new Vector2f(50, 50);
        this.paths = [];
        this.scene = Scene.create();
        this.height = Matrix.create(this.getArea());
        this.layout = layout;
        this.regions = [];
        this.textures = {
            'Variants': [
                AutoTile.create('Weeds').getFromIndex(427, new Vector2f(30, 16)),
                AutoTile.create('Flowers').getFromIndex(310, new Vector2f(30, 16)),
            ],
            'Dirt': AutoTile.create('Dirt').getFromIndex(307, new Vector2f(30, 16)),
            'Grass': AutoTile.create('Grass', Matrix.create().setData([
                [240, 241, 242],
                [270, 271, 272],
                [300, 301, 302],
                [330, 331, 332],
            ])),
            'Cliff': AutoTile.create('Cliff', Matrix.create().setData([
                [271, 271, 271],
                [288, 289, 290],
                [222, 271, 226],
                [252, 253, 225],
                [192, 193, 194, 195],
            ])),
            'Accessories': AutoTile.create('Accessories', new Matrix().setData([
                [42, 42, 42],
                [72, 102, 103],
                [104, 75, 78]
            ]))
        };

        this.decorations = [];

        this.setArea(area)
            .getAssignedScene()
            .setArea(new Vector2f(
                this.getArea().getX() * 16,
                this.getArea().getY() * 16
            ));

        // Various set combinations.
        this.sets = {
            'Grassland': () => {
                this.maxHeight = 1;
                this.pathBreak = 0.1;
                this.pathWidth = 3;
                this.pathChance = 0.1;
                this.totalRegions = 20;
                this.totalDecorations = 25;
                this.totalAccessories = 45;
                this.totalRegionTiles = 800;
                this.decorations = [
                    // Tree (lg)
                    ISprite.create('resources/pack_som/tiles_1.png', Frame.create(400, 0, 80, 96))
                        .setSolid(true)
                        .setCollisionRect(new Vector4f(20, 64, 40, 32))
                        .setZIndex(5),

                    // Weeds
                    ISprite.create('resources/pack_som/tiles_1.png', Frame.create(304, 192, 32, 32))
                        .setSolid(false)
                        .setZIndex(5),
                ];
                this.textures['Variants'] = [
                    AutoTile.create('Weeds').getFromIndex(427, new Vector2f(30, 16)),
                    AutoTile.create('Flowers').getFromIndex(310, new Vector2f(30, 16)),
                ];
            },
            'Mountains': () => {
                this.maxHeight = 4;
                this.pathBreak = 0.2;
                this.pathWidth = 2;
                this.pathChance = 0.25;
                this.totalRegions = 12;
                this.totalDecorations = 35;
                this.totalAccessories = 20;
                this.totalRegionTiles = 400;
                this.decorations = [
                    // Bush 1
                    ISprite.create('resources/pack_som/tiles_1.png', Frame.create(336, 112, 48, 48))
                        .setSolid(true)
                        .setZIndex(5),

                    // Rock 1
                    ISprite.create('resources/pack_som/tiles_1.png', Frame.create(400, 160, 32, 32))
                        .setSolid(true)
                        .setZIndex(5),

                    // Rock 2
                    ISprite.create('resources/pack_som/tiles_1.png', Frame.create(400, 96, 32, 32))
                        .setSolid(true)
                        .setZIndex(5)
                ];
                this.textures['Variants'] = [
                    // AutoTile.create('Weeds').getFromIndex(427, new Vector2f(30, 16)),
                    AutoTile.create('Flowers').getFromIndex(310, new Vector2f(30, 16)),
                ];
            }
        };

        this.sets[Object.keys(this.sets)[Math.floor(Math.random() * Object.keys(this.sets).length)]]();
    }


    /**
     * Returns the assigned scene.
     *
     * @returns {Scene|*}
     */
    getAssignedScene(){
        return this.scene;
    }


    /**
     * Returns a random element from an array.
     *
     * @param arr
     * @returns {*}
     */
    static getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }


    /**
     * Returns the tile map source.
     *
     * @returns {string}
     */
    getSource() {
        return this.src;
    }


    /**
     * Returns the tile map layout.
     *
     * @returns {Vector2f}
     */
    getLayout() {
        return this.layout;
    }


    /**
     * Returns the map area.
     *
     * @returns {Vector2f}
     */
    getArea() {
        return this.area;
    }


    /**
     * Assigns the area.
     *
     * @param area
     * @returns {Generator}
     */
    setArea(area) {
        if (!area || !area instanceof Vector2f) {
            return this;
        }

        this.area = area;
        this.height = Matrix.create(this.getArea());

        return this;
    }


    /**
     * Assigns a base tile to cover the entire layer.
     *
     * @param layer
     * @returns {Generator}
     */
    addBaseTileToLayer(layer) {
        for (let y = 0; y < this.getArea().getY(); y++) {
            for (let x = 0; x < this.getArea().getX(); x++) {
                layer.addTile(Tile.create(
                    Generator.getRandomElement(this.getTexture('Grass').toArray()), new Vector2f(x * 16, y * 16)
                ))
            }
        }

        return this;
    }


    /**
     * Adds a new region.
     *
     * @param region
     * @returns {Generator}
     */
    addRegion(region) {
        if (!region instanceof Vector4f) {
            return this;
        }

        this.regions.push(region);

        return this;
    }


    /**
     * Returns all available regions.
     *
     * @returns {Array}
     */
    getRegions() {
        return this.regions;
    }


    /**
     * Adds a new path to storage.
     *
     * @param path
     * @returns {Generator}
     */
    addPath(path) {
        if (!path instanceof Path) {
            return this;
        }

        this.paths.push(path);

        return this;
    }


    /**
     * Returns all available paths.
     *
     * @returns {Array}
     */
    getPaths() {
        return this.paths;
    }


    /**
     * Appends unique texture variation regions throughout the map.
     *
     * @param layer
     * @param totalRegions
     * @param totalTiles
     * @returns {Generator}
     */
    addRegionsToLayer(layer, totalRegions, totalTiles) {
        let total = 0.00;

        // Each region has a randomized position within the map area, as well as a weighted probability of being
        // selected for placement while iterating through the input total tile count. Additionally, we store ahead
        // of time which texture variant will actually be used for the region.
        //
        for (let i = 0; i < totalRegions; i++) {
            let value = Math.random();
            total += value;

            this.addRegion(new Vector4f(
                Math.floor(Math.random() * this.getArea().getX()),
                Math.floor(Math.random() * this.getArea().getY()),
                total + value,
                Generator.getRandomElement(this.getTexture('Variants'))
            ));
        }

        // Place tiles within our regions. Using the weighted probability, we can randomly select a region. Regions
        // with a higher probability will be more likely to actually have a tile placed within it somewhere. The size
        // of the selected region is also randomized.
        //
        for (let i = 0; i < totalTiles; i++) {
            let value = Math.random() * total;

            for (let j = 0; j < this.getRegions().length; j++) {
                if (value > this.getRegions()[j].getW()) {
                    continue;
                }

                let scalar = new Vector2f(
                    (Math.random() * 20) + 5,
                    (Math.random() * 20) + 5
                );

                let position = new Vector2f(
                    (this.getRegions()[j].getX() + Math.floor((Math.random() - 0.5) * scalar.getX())) * 16,
                    (this.getRegions()[j].getY() + Math.floor((Math.random() - 0.5) * scalar.getY())) * 16
                );

                let tile = this.getRegions()[j].getH().getRootTile();
                let existing = layer.find(position);
                let passes = 0;
                let maxPasses = 10;

                // Ensure that each placement is unique. We can iterate against a loop here with a pre-
                // defined max pass value to avoid endless loops in an attempt to find an open spot.
                //
                while (existing && existing.getIndex() === tile && passes < maxPasses) {
                    position = new Vector2f(
                        (this.getRegions()[j].getX() + Math.floor((Math.random() - 0.5) * scalar.getX())) * 16,
                        (this.getRegions()[j].getY() + Math.floor((Math.random() - 0.5) * scalar.getX())) * 16
                    );

                    existing = layer.find(position);
                    passes++;
                }

                if (existing) {
                    existing.setIndex(tile);
                }
                break;
            }
        }

        return this;
    }


    /**
     * Used to carve paths within the scene.
     *
     * @param layer
     * @param layerAbove
     * @returns {this}
     */
    addPathsToScene(layer, layerAbove) {
        if (!this.getPaths().length) {
            this.addPath(new Path(this.getArea()));
        }

        for (let j = 0; j < this.getPaths().length; j++) {
            let path = this.getPaths()[j];

            for (let i = 0; i < path.length; i++) {
                let tile = layer.find(new Vector2f(
                    path.getStart().getX() * 16,
                    path.getStart().getY() * 16
                ));

                // Handle path collision. If a path collides with another path, we'll basically just terminate
                // the current procedure and act as if both paths join since that is the more realistic behavior.
                //
                if (tile && tile.getAttribute('Paths/Related') && tile.getAttribute('Paths/Related') !== path) {
                    continue;
                }

                // Add some width to the path. Additionally, each path tile has a chance of just being a normal base
                // tile for some added variation. In the future, we can add more diversity at this point.
                //
                for (let k = 0; k < this.pathWidth; k++) {
                    for (let l = 0; l < this.pathWidth; l++) {
                        let neighbor = layer.find(new Vector2f(
                            (path.getStart().getX() + l) * 16,
                            (path.getStart().getY() + k) * 16
                        ));

                        if (neighbor) {
                            neighbor.setIndex(Math.random() <= (1.0 - this.pathBreak) ?
                                this.getTexture('Dirt').getRootTile() : Generator.getRandomElement(this.getTexture('Grass').toArray())
                            ).setAttribute('Paths/Related', path);
                        }

                        // Since we are also handling multiple layers across the scene, we'll also verify that the
                        // path generation isn't being blocked by an overhead tile from one of the wall / cliff maps.
                        //
                        neighbor = layerAbove.find(new Vector2f(
                            (path.getStart().getX() + l) * 16,
                            (path.getStart().getY() + k) * 16
                        ));

                        if (neighbor) {
                            neighbor.setVisible(false);
                        }
                    }
                }

                // Choose a random direction to move in based on the current path direction and the generated
                // weighted probability "walking" matrix (favors a shift in the current path direction).
                //
                let shift = Path.getWeightedRandom(path.getWalk().getDetails(), path.getWalk().asArray());
                path.getStart().setX(path.getStart().getX() + (shift.getX() - 1));
                path.getStart().setY(path.getStart().getY() + (shift.getY() - 1));

                // Only generate a new path if we haven't exceeded the max paths and we're within an appropriate
                // drawing window (to prevent paths that border the edge of the scene). To account for this, we'll
                // shift our boundary in by 10 tiles on all directions before even having an opportunity to spawn
                // a new path.
                //
                let chance = Math.random();

                if (chance < this.pathChance && this.getPaths().length < 10 && path.getStart().getX() > 10 && path.getStart().getX() < this.getArea().getX() - 10 && path.getStart().getY() > 10 && path.getStart().getY() < this.getArea().getY() - 10) {
                    let spawn = new Path(this.getArea());

                    if (spawn.getDirection() === path.getDirection()) {
                        while (spawn.getDirection() === path.getDirection() || spawn.getDirection() === path.getDirection() - 1 || spawn.getDirection() === path.getDirection() + 1) {
                            spawn.getRandomDirection();
                        }
                    }

                    spawn.setStart(new Vector2f(
                        path.getStart().getX() + Math.floor((Math.random() - 0.5) * 3),
                        path.getStart().getY() + Math.floor((Math.random() - 0.5) * 3)
                    ));

                    this.addPath(spawn);
                }
            }
        }

        return this;
    }


    /**
     * Used to generate hills on the scene.
     *
     * @param layer
     * @param layerAbove
     * @param maxHeight
     * @returns {this}
     */
    addHeightToScene(layer, layerAbove, maxHeight) {
        noise.seed(Math.random());
        let minimumHeight = 0;

        for (let y = 0; y < this.getArea().getY(); y++) {
            for (let x = 0; x < this.getArea().getX(); x++) {
                let tile = layer.find(new Vector2f(x * 16, y * 16));

                let nx = (x / this.getArea().getX()) - 0.5;
                let ny = (y / this.getArea().getY()) - 0.5;
                this.getHeightMap().setValue(new Vector2f(x, y), Math.floor(noise.simplex2(nx, ny) * maxHeight));

                if (this.getHeightMap().getValue(new Vector2f(x, y)) < minimumHeight) {
                    minimumHeight = this.getHeightMap().getValue(new Vector2f(x, y));
                }

                if (tile && tile.getIndex() === this.getTexture('Dirt').getRootTile()) {
                    this.getHeightMap().setValue(
                        new Vector2f(x, y),
                        this.getHeightMap().getValue(new Vector2f(x, y)) - 1
                    );
                }
            }
        }

        for (let i = maxHeight; i >= minimumHeight; i--) {
            for (let y = 0; y < this.getArea().getY(); y++) {
                for (let x = 0; x < this.getArea().getX(); x++) {
                    let sum = 0;
                    let index = this.getHeightMap().getValue(new Vector2f(x, y));

                    let tile = layer.find(
                        new Vector2f(x * 16, y * 16)
                    );

                    if (!tile) {
                        continue;
                    }

                    if (tile.getIndex() === this.getTexture('Dirt').getRootTile()) {
                        continue;
                    }

                    if (index !== i) {
                        continue;
                    }

                    sum += (!y || this.getHeightMap().getValue(new Vector2f(x, y - 1)) <= index) ? 1 : 0;
                    sum += (x === this.getArea().getX() - 1 || this.getHeightMap().getValue(new Vector2f(x + 1, y)) <= index) ? 4 : 0;
                    sum += (y === this.getArea().getY() - 1 || this.getHeightMap().getValue(new Vector2f(x, y + 1)) <= index) ? 8 : 0;
                    sum += (!x || this.getHeightMap().getValue(new Vector2f(x - 1, y)) <= index) ? 2 : 0;

                    if (sum === 0 || sum === 15) {
                        continue;
                    }

                    if (AutoTile.isBitmaskCeiling(sum)) {
                        layerAbove.addTile(
                            new Tile(this.getTexture('Cliff').getFromBitmask(sum), new Vector2f(x * 16, y * 16))
                        );

                        let tile = layer.find(
                            new Vector2f(x * 16, (y + 1) * 16)
                        );

                        if (tile) {
                            tile.setSolid(true);
                        }
                    }
                    else {
                        tile.setIndex(this.getTexture('Cliff').getFromBitmask(sum)).setSolid(true);
                    }

                    if (AutoTile.isBitmaskFloor(sum)) {
                        let tile = layer.find(
                            new Vector2f(x * 16, (y + 1) * 16)
                        );

                        if (!tile) {
                            continue;
                        }

                        switch (sum) {
                            case 3:
                                tile.setIndex(195).setSolid(true);
                                break;

                            case 5:
                                tile.setIndex(192 + (Math.floor(Math.random() * 2))).setSolid(true);
                                break;

                            case 7:
                                tile.setIndex(193).setSolid(true);
                                break;
                        }
                    }
                }
            }
        }

        return this;
    }


    /**
     * Updates the auto tile regions on the map.
     *
     * @param layer
     * @param layerAbove
     */
    addAutoTiling(layer, layerAbove) {
        let changes = [];
        let matrix = Matrix.create(new Vector2f(3, 3));
        let variants = this.getTexture('Variants');
        variants.push(this.getTexture('Dirt'));

        // Place accessory elements.
        for (let i = 0; i < this.totalAccessories; i++) {
            let position = new Vector2f(
                Math.floor(Math.random() * this.getArea().getX()) * 16,
                Math.floor(Math.random() * this.getArea().getY()) * 16
            );

            let existing = layer.find(position);

            // Verify that we're not placing the accessory in the middle of a cliff.
            if (existing && !this.getTexture('Cliff').hasTile(existing.getIndex())) {
                existing.setIndex(
                    Generator.getRandomElement(this.getTexture('Accessories').toArray())
                );
            }
        }

        // Calculate our auto tile updates.
        for (let i = 0; i < variants.length; i++) {
            let variant = variants[i];

            for (let y = 0; y < this.getArea().getY(); y++) {
                for (let x = 0; x < this.getArea().getX(); x++) {
                    let tile = layerAbove.find(
                        new Vector2f(x * 16, y * 16)
                    );

                    if (!tile) {
                        tile = layer.find(
                            new Vector2f(x * 16, y * 16)
                        );
                    }

                    if (!tile || tile.getIndex() !== variant.getRootTile()) {
                        continue;
                    }

                    for (let iy = -1; iy <= 1; iy++) {
                        for (let ix = -1; ix <= 1; ix++) {
                            let neighbor = layer.find(new Vector2f(
                                (x + ix) * 16, (y + iy) * 16
                            ));

                            matrix.setValue(new Vector2f(ix + 1, iy + 1),
                                neighbor ? neighbor.getIndex() === variant.getRootTile() : true
                            );
                        }
                    }

                    let sum = 0;
                    sum += matrix.getValue(new Vector2f(1, 0)) ? 1 : 0;
                    sum += matrix.getValue(new Vector2f(2, 1)) ? 4 : 0;
                    sum += matrix.getValue(new Vector2f(1, 2)) ? 8 : 0;
                    sum += matrix.getValue(new Vector2f(0, 1)) ? 2 : 0;

                    // Handle invalid tiles.
                    if (!AutoTile.isBitmaskValid(sum)) {
                        tile.setIndex(Generator.getRandomElement(this.getTexture('Grass').toArray()));
                        y--;
                        continue;
                    }

                    // Register the update if we're actually modifying something.
                    if (variant.getFromBitmask(sum) !== variant.getRootTile()) {
                        changes.push({
                            tile: tile,
                            index: variant.getFromBitmask(sum)
                        });
                    }
                }
            }
        }

        // Perform the calculated auto tile updates.
        for (let i = 0; i < changes.length; i++) {
            changes[i].tile.setIndex(changes[i].index);
        }

        return this;
    }


    /**
     * Removes any byproduct cliff tiles caused from path generation.
     *
     * @param layerCurrent
     * @param layerAbove
     * @returns {Generator}
     */
    cleanHeightTiles(layerCurrent, layerAbove) {
        let cliff = this.getTexture('Cliff');

        for (let y = 1; y < this.getArea().getY() - 1; y++) {
            for (let x = 1; x < this.getArea().getX() - 1; x++) {
                let tile = layerAbove.find(new Vector2f(x * 16, y * 16));
                let neighbors = 0;
                let isAbove = true;
                let isWall = false;

                if (!tile) {
                    tile = layerCurrent.find(new Vector2f(x * 16, y * 16));
                    isAbove = false;
                }

                if (!tile || !cliff.toArray().includes(tile.getIndex())) {
                    continue;
                }

                for (let iy = -1; iy <= 1; iy++) {
                    for (let ix = -1; ix <= 1; ix++) {
                        let neighbor = layerCurrent.find(new Vector2f(
                            (x + ix) * 16, (y + iy) * 16
                        ));

                        let above = layerAbove.find(new Vector2f(
                            (x + ix) * 16, (y + iy) * 16
                        ));

                        if(neighbor ? [192, 193, 194, 195].includes(neighbor.getIndex()) : false){
                            isWall = true;
                        }

                        if (neighbor ? cliff.toArray().includes(neighbor.getIndex()) : false) {
                            neighbors++;
                        }

                        if (above ? cliff.toArray().includes(above.getIndex()) : false) {
                            neighbors++;
                        }
                    }
                }

                if (neighbors === 1 || (isWall && neighbors === 2)) {
                    if (isAbove) {
                        tile.setVisible(false);
                    }

                    tile.setIndex(
                        Generator.getRandomElement(this.getTexture('Grass').toArray())
                    ).setSolid(false);
                }
            }
        }

        return this;
    }


    /**
     * Returns all available textures.
     *
     * @returns {Object}
     */
    getTextures() {
        return this.textures;
    }


    /**
     * Indicates whether or not a texture is defined.
     *
     * @param key
     * @returns {boolean}
     */
    hasTexture(key) {
        return this.getTextures().hasOwnProperty(key);
    }


    /**
     * Returns a configured texture value.
     *
     * @param key
     * @returns {Array}
     */
    getTexture(key) {
        return this.hasTexture(key) ? this.getTextures()[key] : []
    }


    /**
     * Returns the height map for the scene.
     *
     * @returns {Matrix}
     */
    getHeightMap() {
        return this.height;
    }


    /**
     * Returns a new scene instance.
     *
     * @returns {Scene}
     */
    getScene() {
        let scene = this.scene;
        let layerAbove = Layer.create(this.getSource(), this.getLayout());

        return scene.addLayer(() => {
            let layerCurrent = Layer.create(this.getSource(), this.getLayout());

            this.addBaseTileToLayer(layerCurrent)
                .addRegionsToLayer(layerCurrent, this.totalRegions, this.totalRegionTiles)
                .addPathsToScene(layerCurrent, layerAbove)
                .addHeightToScene(layerCurrent, layerAbove, this.maxHeight)
                .addAutoTiling(layerCurrent, layerAbove)
                .cleanHeightTiles(layerCurrent, layerAbove);

            for(let i = 0; i < this.totalDecorations; i++){
                const scale = 0.8 + (Math.random() * 0.5);

                scene.addEntity(ISprite.getUniqueName('Decoration'),
                    Generator.getRandomElement(this.decorations).clone()
                        .setScale(new Vector2f(scale, scale))
                        .setPosition(new Vector2f(
                            Math.floor(Math.random() * 50) * 16,
                            Math.floor(Math.random() * 50) * 16,
                        ))
                );
            }

            return layerCurrent;
        }).addLayer(layerAbove);
    }
}