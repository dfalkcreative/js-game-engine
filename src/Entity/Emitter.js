import {Sprite} from "./Sprite";
import {Vector2f} from "../Math/Vector2f";
import {Particle} from "../Graphic/Particle";

export class Emitter extends Sprite {
    /**
     * Emitter constructor.
     *
     * @param init
     * @param rate
     * @param max
     */
    constructor(init, rate, max) {
        super();

        // Organize emitter defaults.
        this.init = init;
        this.rate = rate || 1;
        this.particles = [];
        this.maxParticles = max || 5;

        // Frame-specific values.
        this.loop = true;
        this.isPlaying = false;
        this.lastUpdate = new Date();

        this.static = true;
        this.solid = false;
    }


    /**
     * Create a new emitter instance.
     *
     * @param init
     * @param rate
     * @param max
     * @returns {Emitter}
     */
    static create(init, rate, max) {
        return new Emitter(init, rate, max);
    }


    /**
     * Returns the initializer.
     *
     * @returns {Function}
     */
    getInit() {
        return this.init;
    }


    /**
     * Returns the rate.
     *
     * @returns {number}
     */
    getRate() {
        return this.rate;
    }


    /**
     * Used to generate a new particle.
     *
     * @returns {Emitter}
     */
    addParticle() {
        if (!this.init instanceof Function) {
            return this;
        }

        let result = this.getInit()(this);

        switch (true) {
            case result instanceof Sprite:
                this.particles.push(new Particle(
                    this.getInit()(this), 5000)
                );
                break;

            case result instanceof Particle:
                this.particles.push(result);
                break;
        }


        return this;
    }


    /**
     * Returns all particles.
     *
     * @returns {Array}
     */
    getParticles() {
        return this.particles;
    }


    /**
     * Returns the max particle limit.
     *
     * @returns {number}
     */
    getMaxParticles() {
        return this.maxParticles;
    }


    /**
     * Returns the count of live particles.
     *
     * @returns {*}
     */
    getCount() {
        return this.getParticles().length;
    }


    /**
     * Assigns the playing status.
     *
     * @param flag
     * @returns {Emitter}
     */
    setPlaying(flag) {
        this.isPlaying = flag;

        return this;
    }


    /**
     * Returns a new instance for cloning.
     *
     * @returns {Emitter}
     */
    getInstance(){
        return new Emitter(this.getInit(), this.getRate(), this.getMaxParticles());
    }


    /**
     * Indicate that we have child elements.
     *
     * @returns {boolean}
     */
    hasChildren() {
        return true;
    }


    /**
     * Used to identify whether or not the emitter is set to loop.
     *
     * @returns {boolean}
     */
    getLoop() {
        return this.loop;
    }


    /**
     * Starts playing the emitter.
     *
     * @returns {Emitter}
     */
    play() {
        return this.setPlaying(true);
    }


    /**
     * Stops playback.
     *
     * @returns {Emitter}
     */
    stop() {
        return this.setPlaying(false);
    }


    /**
     * Renders each particle.
     */
    draw() {
        this.getParticles().map((particle, index) => {
            const entity = particle.getSprite();

            if (entity.getZIndex() !== Sprite.getZCurrent()) {
                return;
            }

            if (!particle.isAlive()) {
                this.particles.splice(index, 1);
                return;
            }

            entity.setOffset(new Vector2f(
                this.getOffset().getX() + entity.getPosition().getX() * (this.getScale().getX() - 1),
                this.getOffset().getY() + entity.getPosition().getY() * (this.getScale().getY() - 1)
            ));

            particle.draw();
        });

        // Since emitters are run through each step of the Z index priority range, we'll only process the timeline and
        // frame updates once in that series. To do so, we can just check that the current index is the start value.
        //
        if (Sprite.getZCurrent() !== Sprite.getZRange().getX()) {
            return;
        }

        this.getTimeline().update();
        let frameNow = new Date();

        if (this.getCount() >= this.getMaxParticles()) {
            return;
        }

        if (frameNow - this.lastUpdate > (1000 / this.getRate())) {
            this.lastUpdate = frameNow;

            if (this.isPlaying) {
                this.addParticle()
            }
        }
    }
}
