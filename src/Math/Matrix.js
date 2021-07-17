import {Vector2f} from "./Vector2f";
import {Vector3f} from "./Vector3f";

export class Matrix {
    /**
     * Matrix constructor.
     *
     * @param size
     */
    constructor(size) {
        this.data = [];

        if (!size || !size instanceof Vector2f) {
            return;
        }

        for (let y = 0; y < size.getY(); y++) {
            let row = [];

            for (let x = 0; x < size.getX(); x++) {
                row.push(0);
            }

            this.data.push(row);
        }
    }


    /**
     * Creates a new matrix instance.
     *
     * @param size
     * @returns {Matrix}
     */
    static create(size){
        return new Matrix(size);
    }


    /**
     * Assigns a value to the specified position.
     *
     * @param position
     * @param value
     * @returns {Matrix}
     */
    setValue(position, value) {
        if (!position instanceof Vector2f) {
            return this;
        }

        this.data[position.getY()][position.getX()] = value;

        return this;
    }


    /**
     * Returns the value at the specified position.
     *
     * @param position
     * @returns {*}
     */
    getValue(position) {
        if (!position instanceof Vector2f) {
            return this;
        }

        return this.getData()[position.getY()][position.getX()];
    }


    /**
     * Assigns the entire data map.
     *
     * @param data
     * @returns {Matrix}
     */
    setData(data) {
        this.data = data;

        return this;
    }


    /**
     * Returns the stored data.
     *
     * @returns {Array}
     */
    getData() {
        return this.data;
    }


    /**
     * Casts the matrix as an array.
     *
     * @returns {Array}
     */
    asArray() {
        let response = [];

        for (let i = 0; i < this.getData().length; i++) {
            for (let j = 0; j < this.getData()[i].length; j++) {
                response.push(this.getData()[i][j]);
            }
        }

        return response;
    }


    /**
     * Retrieves the details about a matrix.
     *
     * @returns {Array}
     */
    getDetails() {
        let response = [];

        for (let i = 0; i < this.getData().length; i++) {
            for (let j = 0; j < this.getData()[i].length; j++) {
                response.push(new Vector3f(
                    j, i, this.getData()[i][j]
                ));
            }
        }

        return response;
    }
}