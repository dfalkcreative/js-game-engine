import {Sequence} from "./Sequence";

export class Timeline {
    /**
     * Timeline constructor.
     *
     * @param sequences
     */
    constructor(sequences) {
        this.sequences = [];

        this.addSequences(sequences);
    }


    /**
     * Creates a new timeline instance.
     *
     * @param sequences
     * @returns {Timeline}
     */
    static create(sequences) {
        return new Timeline(sequences);
    }


    /**
     * Calculates the duration in seconds.
     *
     * @returns {number}
     */
    getDurationInSeconds() {
        let max = 0;

        this.getSequences().map((sequence) => {
            let duration = sequence.getDurationInSeconds();

            if (duration > max) {
                max = duration;
            }
        });

        return max;
    }


    /**
     * Returns the duration in milliseconds.
     *
     * @returns {number}
     */
    getDurationInMilliseconds() {
        return this.getDurationInSeconds() * 1000;
    }


    /**
     * Adds multiple sequences.
     *
     * @param sequences
     * @returns {Timeline}
     */
    addSequences(sequences) {
        if (!sequences) {
            return this;
        }

        sequences.map((sequence) => {
            this.addSequence(sequence);
        });

        return this;
    }


    /**
     * Adds a new sequence.
     *
     * @param sequence
     * @returns {Timeline}
     */
    addSequence(sequence) {
        if (!sequence instanceof Sequence) {
            return this;
        }

        this.sequences.push(sequence);

        return this;
    }


    /**
     * Returns the sequences.
     *
     * @returns {Array}
     */
    getSequences() {
        return this.sequences;
    }


    /**
     * Executes each sequence.
     */
    update() {
        const sequences = this.getSequences();

        for (let i = 0; i < sequences.length; i++) {
            sequences[i].update();
        }
    }
}
