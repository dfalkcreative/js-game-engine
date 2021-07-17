import {Matrix} from "../../../Math/Matrix";
import {Vector2f} from "../../../Math/Vector2f";

export class Path {
    /**
     * Path constructor.
     *
     * @param area
     */
    constructor(area){
        this.end = new Vector2f(0, 0);
        this.area = area;
        this.walk = new Matrix(new Vector2f(3, 3));
        this.root = new Vector2f(0, 0);
        this.start = new Vector2f(0, 0);
        this.offset = Math.floor(Math.random() * this.getArea().getX());
        this.length = Math.random() * (this.getArea().getY() * 2) + this.getArea().getY();
        this.direction = 0;

        this.getRandomDirection();
    }


    /**
     * Assigns the length.
     *
     * @param length
     * @returns {Path}
     */
    setLength(length){
        this.length = length;

        return this;
    }


    /**
     * Returns the length.
     *
     * @returns {number}
     */
    getLength(){
        return this.length;
    }


    /**
     * Assigns the map area.
     *
     * @param area
     * @returns {Path}
     */
    setArea(area){
        if(!area || !area instanceof Vector2f){
            return this;
        }

        this.area = area;

        return this;
    }


    /**
     * Returns the area.
     *
     * @returns {Vector2f}
     */
    getArea(){
        return this.area;
    }


    /**
     * Returns the root position.
     *
     * @returns {Vector2f}
     */
    getRoot(){
        return this.root;
    }


    /**
     * Assigns the starting point.
     *
     * @param start
     * @returns {Path}
     */
    setStart(start){
        if(!start instanceof Vector2f){
            return this;
        }

        this.start = start;
        this.root = new Vector2f(
            start.getX(), start.getY()
        );

        return this;
    }


    /**
     * Returns the starting point.
     *
     * @returns {Vector2f}
     */
    getStart(){
        return this.start;
    }


    /**
     * Assigns the ending point.
     *
     * @param end
     * @returns {Path}
     */
    setEnd(end){
        if(!end instanceof Vector2f){
            return this;
        }

        this.end = end;

        return this;
    }


    /**
     * Returns the ending point.
     *
     * @returns {Vector2f}
     */
    getEnd(){
        return this.end;
    }


    /**
     * Generates a random direction.
     */
    getRandomDirection(){
        this.setDirection(Math.floor(Math.random() * 4));
    }


    /**
     * Assigns a direction to the path.
     *
     * @param direction
     * @returns {this}
     */
    setDirection(direction){
        this.direction = direction;
        this.getWalkFromDirection();

        return this;
    }


    /**
     * Returns the current direction.
     *
     * @returns {number}
     */
    getDirection(){
        return this.direction;
    }


    /**
     * Returns the path / map offset.
     *
     * @returns {number}
     */
    getOffset(){
        return this.offset;
    }


    /**
     * Assigns the offset value.
     *
     * @param offset
     * @returns {Path}
     */
    setOffset(offset){
        this.offset = offset;

        return this;
    }


    /**
     * Returns the "walking" probability matrix.
     *
     * @returns {Matrix}
     */
    getWalk(){
        return this.walk;
    }


    /**
     * Returns the walk matrix based on the direction.
     */
    getWalkFromDirection(){
        switch(this.getDirection()){
            // Down
            case 0:
                this.getStart().setX(this.getOffset());
                this.getRoot().setX(this.getOffset());

                for(let y = 0; y < 3; y ++){
                    for(let x = -1; x < 2; x++){
                        this.getWalk().setValue(new Vector2f(x + 1, y), y - Math.abs(x) + 1 + ((Math.random() - 0.5) / 2))
                    }
                }
                break;

            // Up
            case 1:
                this.getStart().setY(this.getOffset());
                this.getRoot().setY(this.getOffset());

                for(let y = 0; y < 3; y ++){
                    for(let x = -1; x < 2; x++){
                        this.getWalk().setValue(new Vector2f(y, x + 1), y - Math.abs(x) + 1 + ((Math.random() - 0.5) / 2))
                    }
                }
                break;

            // Left
            case 2:
                this.getStart().setX(this.getArea().getX()).setY(this.getOffset());
                this.getRoot().setX(this.getArea().getX()).setY(this.getOffset());

                for(let y = 0; y < 3; y ++){
                    for(let x = -1; x < 2; x++){
                        this.getWalk().setValue(new Vector2f(2 - y, x + 1), y - Math.abs(x) + 1 + ((Math.random() - 0.5) / 2))
                    }
                }
                break;

            // Right
            case 3:
                this.getStart().setX(this.getOffset()).setY(this.getArea().getY());
                this.getRoot().setX(this.getOffset()).setY(this.getArea().getY());

                for(let y = 0; y < 3; y++){
                    for(let x = -1; x < 2; x++){
                        this.getWalk().setValue(new Vector2f(x + 1, 2 - y), y - Math.abs(x) + 1 + ((Math.random() - 0.5) / 2))
                    }
                }
                break;
        }
    }


    /**
     * Uses weighted probability to return a random item.
     *
     * @param items
     * @param weights
     * @returns {*}
     */
    static getWeightedRandom(items, weights){
        let i;

        for (i = 0; i < weights.length; i++)
            weights[i] += weights[i - 1] || 0;

        let random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;

        return items[i];
    }
}