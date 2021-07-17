import {Sprite} from "../Entity/Sprite";

export class Particle {
    /**
     * Particle constructor.
     *
     * @param sprite
     * @param life
     */
    constructor(sprite, life) {
        this.setSprite(sprite);

        this.life = life || 0;
        this.alive = true;
        this.startTime = new Date();
    }


    /**
     * Assigns the sprite.
     *
     * @param sprite
     * @returns {Particle}
     */
    setSprite(sprite) {
        if (!sprite instanceof Sprite) {
            return this;
        }

        this.sprite = sprite;

        return this;
    }


    /**
     * Returns the configured sprite.
     *
     * @returns {*}
     */
    getSprite() {
        return this.sprite;
    }


    /**
     * Identifies whether or not the life has been exceeded.
     *
     * @returns {boolean}
     */
    isAlive() {
        return this.alive;
    }


    /**
     * Returns the amount of time a particle is alive for.
     *
     * @returns {number}
     */
    getLife() {
        return this.life;
    }


    /**
     * Returns the start time.
     *
     * @returns {Date}
     */
    getStartTime() {
        return this.startTime;
    }


    /**
     * Returns the elapsed time for the particle.
     *
     * @returns {number}
     */
    getElapsed() {
        return Date.now() - this.getStartTime();
    }


    /**
     * Assigns the alive state.
     *
     * @param flag
     * @returns {Particle}
     */
    setAlive(flag) {
        this.alive = flag;

        return this;
    }


    /**
     * Used to render the particle.
     */
    draw() {
        if (!this.getSprite().getVisible()) {
            this.setAlive(false);
        }

        if (this.getLife() && this.getElapsed() > this.getLife()) {
            this.setAlive(false);
        }

        this.getSprite().draw();
    }
}