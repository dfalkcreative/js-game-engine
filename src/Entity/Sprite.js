import {State} from "../Kernel/State";
import {Vector2f} from "../Math/Vector2f";
import {Vector4f} from "../Math/Vector4f";
import {Timeline} from "../Animation/Timeline";
import {Animation} from "../Animation/Animation";
import {DistancePayload} from "../Event/DistancePayload";
import {CollisionPayload} from "../Event/CollisionPayload";
import {RenderBeforePayload} from "../Event/RenderBeforePayload";

export class Sprite {
    /**
     * Various behavioral flags.
     *
     * @type {Object}
     */
    static flags = {
        ShowCollisions: false,
        DetectionWindow: 100
    };


    /**
     * The index boundaries.
     *
     * @type Vector2f
     */
    static zRange = new Vector2f(0, 0);


    /**
     * Indicates the current Z priority.
     *
     * @type {number}
     */
    static zCurrent = 0;


    /**
     * Sprite constructor.
     */
    constructor(src, frame) {
        // THe default attribute pool.
        this.attributes = {
            'Health': 100,
            'MaxHealth': 100
        };

        // The default event stack.
        this.events = {
            'Collide': [],
            'Distance': [],
            'RenderAfter': [],
            'RenderBefore': []
        };

        // The cache storage location.
        this.cache = {};

        // Behavioral flags.
        this.solid = false;
        this.static = false;
        this.visible = true;
        this.behavior = null;
        this.collisionRect = null;

        // Properties used for rendering.
        this.flipX = false;
        this.flipY = false;
        this.zIndex = 0;
        this.opacity = 1;

        // Properties used for animations.
        this.timeline = new Timeline();
        this.direction = 'Down';
        this.animations = {};
        this.currentAnimation = null;

        // Properties used for positioning.
        this.scale = new Vector2f(1, 1);
        this.offset = new Vector2f(0, 0);
        this.position = new Vector2f(0, 0);
        this.acceleration = new Vector2f(0.0, 0.0);
        this.maxAcceleration = new Vector2f(1.0, 1.0);

        if (src) {
            // Include a default animation to cover the whole frame for static entities that only include an image.
            this.addAnimation('Default', (new Animation(src)).addFrame(frame));
        }
    }


    /**
     * Returns a new Sprite instance.
     *
     * @param src
     * @param frame
     * @returns {Sprite}
     */
    static create(src, frame) {
        return new Sprite(src, frame);
    }


    /**
     * Returns all available flags.
     *
     * @returns {Object}
     */
    static getFlags() {
        return Sprite.flags;
    }


    /**
     * Indicates whether or not a flag exists.
     *
     * @param flag
     * @returns {boolean}
     */
    static hasFlag(flag) {
        return Sprite.getFlags().hasOwnProperty(flag);
    }


    /**
     * Returns the specified flag.
     *
     * @param flag
     * @returns {*}
     */
    static getFlag(flag) {
        if (!Sprite.hasFlag(flag)) {
            return false;
        }

        return Sprite.getFlags()[flag];
    }


    /**
     * Returns the current draw priority.
     *
     * @returns {number}
     */
    static getZCurrent() {
        return Sprite.zCurrent;
    }


    /**
     * Assigns the current draw priority.
     *
     * @param z
     */
    static setZCurrent(z) {
        Sprite.zCurrent = z;

        State.getEngine().setCanvasLayer(Math.floor(z / 10));
    }


    /**
     * Returns the Z index boundaries.
     *
     * @returns {Vector2f}
     */
    static getZRange() {
        return Sprite.zRange;
    }


    /**
     * Flushes the cache.
     *
     * @param keys
     * @returns this
     */
    flushCache(keys) {
        if (keys && keys.length) {
            for (let i = 0; i < keys.length; i++) {
                if (this.getCache().hasOwnProperty(keys[i])) {
                    delete this.cache[keys[i]];
                }
            }
            return this;
        }

        this.cache = {};

        return this;
    }


    /**
     * Returns the cache collection.
     *
     * @returns {{}}
     */
    getCache() {
        return this.cache;
    }


    /**
     * Assigns the cache key.
     *
     * @param key
     * @param value
     * @returns {Sprite}
     */
    setCacheKey(key, value) {
        this.cache[key] = value;

        return this;
    }


    /**
     * Indicates whether or not a cache key exists.
     *
     * @param key
     * @returns {boolean}
     */
    hasCacheKey(key) {
        return this.getCache().hasOwnProperty(key);
    }


    /**
     * Returns a cached element.
     *
     * @param key
     * @returns {*}
     */
    getCacheKey(key) {
        return this.hasCacheKey(key) ? this.getCache()[key] : null;
    }


    /**
     * Assigns a Z index to the sprite.
     *
     * @param zIndex
     * @returns {Sprite}
     */
    setZIndex(zIndex) {
        this.zIndex = zIndex;

        if (zIndex > Sprite.getZRange().getY()) {
            Sprite.getZRange().setY(zIndex);
        }

        if (zIndex < Sprite.getZRange().getX()) {
            Sprite.getZRange().setX(zIndex);
        }

        return this;
    }


    /**
     * Returns the Z index for the sprite.
     *
     * @returns {number}
     */
    getZIndex() {
        return this.zIndex;
    }


    /**
     * Returns whether or not the entity has health.
     *
     * @returns {boolean}
     */
    isAlive() {
        return this.getAttribute('Health') > 0;
    }


    /**
     * Used to flip the sprite horizontally.
     *
     * @param flag
     * @returns {Sprite}
     */
    setFlipX(flag) {
        if (this.flipX !== flag) {
            this.flipX = flag;
            this.flushCache();
        }

        return this;
    }


    /**
     * Indicates whether or not the sprite is being flipped horizontally.
     *
     * @returns {boolean}
     */
    getFlipX() {
        return this.flipX;
    }


    /**
     * Used to flip the sprite vertically.
     *
     * @param flag
     * @returns {Sprite}
     */
    setFlipY(flag) {
        if (this.flipY !== flag) {
            this.flipY = flag;
            this.flushCache();
        }

        return this;
    }


    /**
     * Indicates whether or not the sprite is being flipped vertically.
     *
     * @returns {boolean}
     */
    getFlipY() {
        return this.flipY;
    }


    /**
     * Indicates whether or not the sprite is being flipped in general.
     *
     * @returns {boolean}
     */
    isFlipped() {
        return this.getFlipX() || this.getFlipY();
    }


    /**
     * Assigns the opacity.
     *
     * @param opacity
     * @returns {Sprite}
     */
    setOpacity(opacity) {
        this.opacity = opacity;

        return this;
    }


    /**
     * Returns the opacity.
     *
     * @returns {number}
     */
    getOpacity() {
        return this.opacity;
    }


    /**
     * Assigns the static flag.
     *
     * @param flag
     * @returns {Sprite}
     */
    setStatic(flag) {
        this.static = flag;

        return this;
    }


    /**
     * Returns the static flag.
     *
     * @returns {boolean}
     */
    getStatic() {
        return this.static;
    }


    /**
     * Assigns the behavior for the sprite.
     *
     * @param behavior
     * @returns this
     */
    setBehavior(behavior) {
        if (!behavior instanceof Function) {
            return this;
        }

        this.behavior = behavior;

        return this;
    }


    /**
     * Returns the configured behavior.
     *
     * @returns {Function}
     */
    getBehavior() {
        return this.behavior;
    }


    /**
     * Executes the behavioral callback.
     *
     * @returns this
     */
    behave() {
        if (this.getBehavior()) {
            this.getBehavior()(this);
        }

        return this;
    }


    /**
     * Assigns a dynamic attribute.
     *
     * @param name
     * @param value
     * @returns this
     */
    setAttribute(name, value) {
        value = value || null;

        this.attributes[name] = value;

        return this;
    }


    /**
     * Returns all dynamic attributes.
     *
     * @returns {*}
     */
    getAttributes() {
        return this.attributes;
    }


    /**
     * Returns a dynamic attribute.
     *
     * @param name
     * @param fallback
     * @returns {*}
     */
    getAttribute(name, fallback) {
        fallback = fallback || 0;

        if (!this.getAttributes().hasOwnProperty(name)) {
            return fallback;
        }

        return this.attributes[name] || fallback;
    }


    /**
     * Assigns the solid flag to a tile.
     *
     * @param flag
     * @returns this
     */
    setSolid(flag) {
        this.solid = flag;

        return this;
    }


    /**
     * Indicates whether or not the tile is solid.
     *
     * @returns {boolean}
     */
    getSolid() {
        return this.solid;
    }


    /**
     * Identifies whether or not events exist.
     *
     * @returns {boolean}
     */
    hasEvents() {
        for (let i in this.getEvents()) {
            if (!this.getEvents().hasOwnProperty(i)) {
                continue;
            }

            if (this.getEvents()[i].length) {
                return true;
            }
        }

        return false;
    }


    /**
     * Executes the pre-render event.
     *
     * @param payload
     */
    onRenderBefore(payload) {
        this.callEvents('RenderBefore', payload);
    }


    /**
     * Executes the post-render event.
     *
     * @param payload
     */
    onRenderAfter(payload) {
        this.callEvents('RenderAfter', payload);
    }


    /**
     * Executes any distance events.
     *
     * @param payload
     */
    onDistance(payload) {
        this.callEvents('Distance', payload);
    }


    /**
     * Executes any collision events.
     *
     * @param payload
     */
    onCollide(payload) {
        this.callEvents('Collide', payload);
    }


    /**
     * Runs the target event stack.
     *
     * @param location
     * @param payload
     * @returns {Sprite}
     */
    callEvents(location, payload) {
        if (!this.events.hasOwnProperty(location)) {
            return this;
        }

        this.events[location].map((event) => {
            event(payload);
        });
    }


    /**
     * Returns all assigned events.
     *
     * @returns Object
     */
    getEvents() {
        return this.events;
    }


    /**
     * Binds a new event.
     *
     * @param location
     * @param callback
     * @returns {Sprite}
     */
    addEvent(location, callback) {
        if (!callback instanceof Function) {
            return this;
        }

        if (!this.events.hasOwnProperty(location)) {
            this.events[location] = [];
        }

        this.events[location].push(callback);

        return this;
    }


    /**
     * Returns the assigned direction.
     *
     * @returns {string}
     */
    getDirection() {
        return this.direction;
    }


    /**
     * Assigns the facing direction.
     *
     * @param direction
     * @returns {Sprite}
     */
    setDirection(direction) {
        this.direction = direction;

        return this;
    }


    /**
     * Returns the offset.
     *
     * @returns Vector2f
     */
    getOffset() {
        return this.offset;
    }


    /**
     * Assigns the offset.
     *
     * @param offset
     * @returns this
     */
    setOffset(offset) {
        if (!offset instanceof Vector2f) {
            return this;
        }

        this.flushCache();
        this.offset = offset;

        return this;
    }


    /**
     * Returns the scale.
     *
     * @returns Vector2f
     */
    getScale() {
        return this.scale;
    }


    /**
     * Assigns the scale.
     *
     * @param scale
     * @returns this
     */
    setScale(scale) {
        if (!scale instanceof Vector2f) {
            return this;
        }

        this.scale = scale;

        return this;
    }


    /**
     * Assigns the current position.
     *
     * @param position
     * @returns {Sprite}
     */
    setPosition(position) {
        if (!position instanceof Vector2f) {
            return this;
        }

        this.position = position;
        this.flushCache();

        return this;
    }


    /**
     * Returns the current position.
     *
     * @returns Vector2f
     */
    getPosition() {
        return this.position;
    }


    /**
     * Returns the acceleration.
     *
     * @returns Vector2f
     */
    getAcceleration() {
        return this.acceleration;
    }


    /**
     * Assigns the acceleration.
     *
     * @param acceleration
     * @returns this
     */
    setAcceleration(acceleration) {
        if (!acceleration instanceof Vector2f) {
            return this;
        }

        this.acceleration = acceleration;

        return this;
    }


    /**
     * Assigns the max acceleration.
     *
     * @param acceleration
     * @returns {Sprite}
     */
    setMaxAcceleration(acceleration) {
        this.maxAcceleration = acceleration;

        return this;
    }


    /**
     * Returns the max acceleration.
     *
     * @returns Vector2f
     */
    getMaxAcceleration() {
        return this.maxAcceleration;
    }


    /**
     * Registers a new animation.
     *
     * @param name
     * @param animation
     * @returns this
     */
    addAnimation(name, animation) {
        if (!animation instanceof Animation) {
            return this;
        }

        this.animations[name] = animation;

        if (!this.currentAnimation) {
            this.currentAnimation = name;
        }

        return this;
    }


    /**
     * Indicates whether or not animations have been assigned.
     *
     * @returns boolean
     */
    hasAnimations() {
        return !!Object.keys(this.getAnimations()).length;
    }


    /**
     * Indicates whether or not an animation exists.
     *
     * @param name
     */
    hasAnimation(name) {
        return this.getAnimations().hasOwnProperty(name);
    }


    /**
     * Assigns the current animation.
     *
     * @param name
     * @returns {Sprite}
     */
    setAnimation(name) {
        this.currentAnimation = name;
        this.getAnimation().play();

        return this;
    }


    /**
     * Returns all animations.
     *
     * @returns Object
     */
    getAnimations() {
        return this.animations;
    }


    /**
     * Returns the current animation name.
     *
     * @returns {null}
     */
    getAnimationName() {
        return this.currentAnimation;
    }


    /**
     * Returns the active animation.
     *
     * @returns Animation
     */
    getAnimation() {
        if (!this.getAnimationName()) {
            return new Animation();
        }

        if (!this.getAnimations().hasOwnProperty(this.getAnimationName())) {
            return new Animation();
        }

        return this.getAnimations()[this.getAnimationName()];
    }


    /**
     * Returns the scaled size.
     *
     * @returns {Vector2f}
     */
    getScaledSize() {
        return new Vector2f(
            this.getAnimation().getFrame().getW() * this.getScale().getX(),
            this.getAnimation().getFrame().getH() * this.getScale().getY()
        );
    }


    /**
     * Returns the final scaled sprite size.
     *
     * @returns {Vector2f}
     */
    getCalculatedSize() {
        if (!this.hasCacheKey('CalculatedSize')) {
            let scaledSize = this.getScaledSize();

            this.setCacheKey('CalculatedSize', new Vector2f(
                State.getEngine().scale(scaledSize.getX()),
                State.getEngine().scale(scaledSize.getY())
            ));
        }

        return this.getCacheKey('CalculatedSize');
    }


    /**
     * Returns the calculated origin point.
     *
     * @returns {Vector2f}
     */
    getCalculatedOrigin() {
        if (!this.hasCacheKey('CalculatedOrigin')) {
            this.setCacheKey('CalculatedOrigin', new Vector2f(
                State.getEngine().scale(this.getPosition().getX()),
                State.getEngine().scale(this.getPosition().getY())
            ));
        }

        return this.getCacheKey('CalculatedOrigin');
    }


    /**
     * Returns the offset position.
     *
     * @returns {Vector2f}
     */
    getOffsetPosition() {
        if (!this.hasCacheKey('OffsetPosition')) {
            this.setCacheKey('OffsetPosition', new Vector2f(
                this.getPosition().getX() + this.getOffset().getX() + this.getAnimation().getFrame().getOffset().getX(),
                this.getPosition().getY() + this.getOffset().getY() + this.getAnimation().getFrame().getOffset().getY()
            ));
        }

        return this.getCacheKey('OffsetPosition');
    }


    /**
     * Returns the calculated position for a sprite.
     *
     * @returns {Vector2f}
     */
    getCalculatedPosition() {
        if (!this.hasCacheKey('CalculatedPosition')) {
            let offsetPosition = this.getOffsetPosition();

            this.setCacheKey('CalculatedPosition', new Vector2f(
                State.getEngine().scale(offsetPosition.getX()),
                State.getEngine().scale(offsetPosition.getY())
            ));
        }

        return this.getCacheKey('CalculatedPosition');
    }


    /**
     * Returns the sprite center point, including scaling and offsets.
     *
     * @returns {Vector2f}
     */
    getCenter() {
        if (!this.hasCacheKey('Center')) {
            let scaledSize = this.getScaledSize();
            let offsetPosition = this.getOffsetPosition();

            this.setCacheKey('Center', new Vector2f(
                offsetPosition.getX() + scaledSize.getX() / 2,
                offsetPosition.getY() + scaledSize.getY() / 2
            ));
        }

        return this.getCacheKey('Center');
    }


    /**
     * Returns the calculated center point.
     *
     * @returns {Vector2f}
     */
    getCalculatedCenter() {
        if (!this.hasCacheKey('CalculatedCenter')) {
            let collisionRect = this.getCollisionRect();

            this.setCacheKey('CalculatedCenter', new Vector2f(
                collisionRect.getX() + (collisionRect.getW() / 2),
                collisionRect.getY() + (collisionRect.getH() / 2)
            ));
        }

        return this.getCacheKey('CalculatedCenter');
    }


    /**
     * Returns the appropriate canvas position with horizontal / vertical transformations.
     *
     * @returns {null}
     */
    getCanvasPosition() {
        if (!this.hasCacheKey('CanvasPosition')) {
            let currentPosition = this.getCalculatedPosition();

            this.setCacheKey('CanvasPosition', new Vector2f(
                currentPosition.getX() + (this.getFlipX() ? this.getCalculatedSize().getX() : 0),
                currentPosition.getY() + (this.getFlipY() ? this.getCalculatedSize().getY() : 0)
            ));
        }

        return this.getCacheKey('CanvasPosition');
    }


    /**
     * Assigns the visibility state.
     *
     * @param flag
     * @returns {Sprite}
     */
    setVisible(flag) {
        this.visible = flag;

        return this;
    }


    /**
     * Returns the visibility state.
     *
     * @returns {boolean}
     */
    getVisible() {
        return this.visible;
    }


    /**
     * Indicates whether or not the sprite is on screen.
     *
     * @returns {boolean}
     */
    isVisible() {
        if (!this.hasCacheKey('IsVisible')) {
            let visibility = this.getVisible();

            if (visibility && this.getPosition().getX() < State.getEngine().getScene().getCamera().getPosition().getX() - this.getScaledSize().getX()) {
                visibility = false;
            }

            if (visibility && this.getPosition().getY() < State.getEngine().getScene().getCamera().getPosition().getY() - this.getScaledSize().getY()) {
                visibility = false;
            }

            if (visibility) {
                let calculatedSize = this.getCalculatedSize();
                let calculatedPosition = this.getCalculatedPosition();

                visibility = calculatedPosition.getX() >= -calculatedSize.getX() && calculatedPosition.getX() <= State.getEngine().getCanvasWidth() &&
                    calculatedPosition.getY() >= -calculatedSize.getY() && calculatedPosition.getY() <= State.getEngine().getCanvasHeight();
            }

            return visibility;
        }

        return this.getCacheKey('IsVisible');
    }


    /**
     * Indicates whether or not the sprite is in motion.
     *
     * @returns {*}
     */
    inMotion() {
        return this.getAcceleration().getX() || this.getAcceleration().getY();
    }


    /**
     * Returns the calculated distance between two sprites.
     *
     * @param sprite
     * @returns {number}
     */
    getDistanceFrom(sprite) {
        if (!sprite instanceof Sprite) {
            return 0;
        }

        let centerA = this.getCenter();
        let centerB = sprite.getCenter();

        return Math.sqrt(
            Math.pow(centerB.getX() - centerA.getX(), 2) + Math.pow(centerB.getY() - centerA.getY(), 2)
        );
    }


    /**
     * Indicates whether or not the sprite is within a threshold amount to another.
     *
     * @param sprite
     * @param threshold
     * @returns {boolean}
     */
    isNearby(sprite, threshold) {
        if (!sprite instanceof Sprite) {
            return false;
        }

        threshold = threshold || 100;
        let centerA = this.getPosition();
        let centerB = sprite.getPosition();

        return Math.abs(centerB.getX() - centerA.getX()) < threshold && Math.abs(centerB.getY() - centerA.getY()) < threshold;
    }


    /**
     * Indicates whether or not a sprite is facing another.
     *
     * @param sprite
     * @returns {boolean}
     */
    isFacing(sprite) {
        if (!sprite instanceof Sprite) {
            return false;
        }

        let centerA = this.getCalculatedCenter();
        let centerB = sprite.getCalculatedCenter();

        switch (this.getDirection()) {
            case 'Up':
                return centerB.getY() < centerA.getY();

            case 'Down':
                return centerB.getY() > centerA.getY();

            case 'Left':
                return centerB.getX() < centerA.getX();

            case 'Right':
                return centerB.getX() > centerA.getX();
        }

        return false;
    }


    /**
     * Returns whether or not the value is in range.
     *
     * @param value
     * @param min
     * @param max
     * @param inclusive
     * @returns {boolean}
     */
    static inRange(value, min, max, inclusive) {
        if (inclusive) {
            return value >= min && value <= max;
        }

        return value > min && value < max;
    }


    /**
     * Returns the collision rectangle.
     *
     * @param x
     * @param y
     * @returns {Vector4f}
     */
    getCollisionRect(x, y) {
        x = x ? x : 0;
        y = y ? y : 0;

        return this.collisionRect ?
            new Vector4f(
                this.getPosition().getX() + this.collisionRect.getX() + x,
                this.getPosition().getY() + this.collisionRect.getY() + y,
                this.collisionRect.getW() * this.getScale().getX() + x,
                this.collisionRect.getH() * this.getScale().getY() + y
            ) : new Vector4f(
                this.getPosition().getX() + x,
                this.getPosition().getY() + y,
                this.getScaledSize().getX() + x,
                this.getScaledSize().getY() + y,
            );
    }


    /**
     * Assigns a collision rectangle.
     *
     * @param rect
     * @returns {Sprite}
     */
    setCollisionRect(rect) {
        if (!rect instanceof Vector4f) {
            return this;
        }

        this.collisionRect = rect;

        return this;
    }


    /**
     * Assigns all attributes.
     *
     * @param attributes
     * @returns {Sprite}
     */
    setAttributes(attributes) {
        if (!attributes instanceof Object) {
            return this;
        }

        for (let i in attributes) {
            if (attributes.hasOwnProperty(i)) {
                this.setAttribute(i, attributes[i]);
            }
        }

        return this;
    }


    /**
     * Assigns all events.
     *
     * @param events
     * @returns {Sprite}
     */
    setEvents(events) {
        if (!events instanceof Object) {
            return this;
        }

        for (let i in events) {
            if (!events.hasOwnProperty(i)) {
                continue;
            }

            events[i].map((event) => {
                this.addEvent(i, event);
            });
        }

        return this;
    }


    /**
     * Assigns all animations.
     *
     * @param animations
     * @returns {Sprite}
     */
    setAnimations(animations) {
        if (!animations instanceof Object) {
            return this;
        }

        for (let i in animations) {
            if (animations.hasOwnProperty(i)) {
                this.addAnimation(i, animations[i]);
            }
        }

        return this;
    }


    /**
     * Returns the timeline.
     *
     * @returns {Timeline}
     */
    getTimeline() {
        return this.timeline;
    }


    /**
     * Assigns the timeline.
     *
     * @param timeline
     * @returns {Sprite}
     */
    setTimeline(timeline) {
        if (!timeline instanceof Timeline) {
            return this;
        }

        this.timeline = timeline;

        return this;
    }


    /**
     * Returns a new instance.
     *
     * @returns {Sprite}
     */
    getInstance() {
        return new Sprite();
    }


    /**
     * Returns a fresh sprite instance.
     */
    clone() {
        // Return the cloned instance.
        return this.getInstance()
            .setAttributes(this.getAttributes())
            .setEvents(this.getEvents())
            .setSolid(this.getSolid())
            .setBehavior(this.getBehavior())
            .setAnimations(this.getAnimations())
            .setDirection(this.getDirection())
            .setMaxAcceleration(this.getMaxAcceleration())
            .setCollisionRect(this.collisionRect)
            .setScale(new Vector2f(
                this.getScale().getX(),
                this.getScale().getY()
            )).setOffset(new Vector2f(
                this.getOffset().getX(),
                this.getOffset().getY()
            )).setPosition(new Vector2f(
                this.getPosition().getX(),
                this.getPosition().getY()
            )).setAcceleration(new Vector2f(
                this.getAcceleration().getX(),
                this.getAcceleration().getY()
            ));
    }


    /**
     * Method to override collision detection.
     *
     * @returns {boolean}
     */
    getCollidable() {
        return true;
    }


    /**
     * Method to indicate that this entity emits others.
     *
     * @returns {boolean}
     */
    hasChildren() {
        return false;
    }


    /**
     * Indicates whether or not distance events are thrown against a sprite.
     *
     * @returns {boolean}
     */
    hasDistanceEvents() {
        return true;
    }


    /**
     * Renders the sprite based on its animation, and processes any events.
     */
    draw() {
        if (!this.isVisible()) {
            return;
        }

        let currentSize = this.getCalculatedSize();
        let currentFrame = this.getAnimation().getFrame();
        let canvasPosition = this.getCanvasPosition();

        // Render the current frame.
        this.onRenderBefore(
            new RenderBeforePayload(this)
        );

        State.getEngine().getContext().globalAlpha = this.getOpacity();

        if (this.isFlipped()) {
            State.getEngine().getContext().save();
            State.getEngine().getContext().translate(
                canvasPosition.getX(),
                canvasPosition.getY()
            );
            canvasPosition = new Vector2f(0, 0);
            State.getEngine().getContext().scale(this.getFlipX() ? -1 : 1, this.getFlipY() ? -1 : 1);
        }

        State.getEngine()
            .getContext()
            .drawImage(this.getAnimation().getDomResource(),
                currentFrame.getX(), currentFrame.getY(),
                Math.round(currentFrame.getW()), Math.round(currentFrame.getH()),
                Math.round(canvasPosition.getX()), Math.round(canvasPosition.getY()),
                Math.round(currentSize.getX()), Math.round(currentSize.getY()));

        State.getEngine().getContext().globalAlpha = 1;

        if (this.isFlipped()) {
            State.getEngine().getContext().restore();
        }

        this.onRenderAfter();

        // Update the animation.
        this.getAnimation().update();
        this.getTimeline().update();

        // Apply limiting to the acceleration.
        if (this.getAcceleration().getX() > this.getMaxAcceleration().getX()) {
            this.getAcceleration().setX(this.getMaxAcceleration().getX());
        }

        if (this.getAcceleration().getX() < -this.getMaxAcceleration().getX()) {
            this.getAcceleration().setX(-this.getMaxAcceleration().getX());
        }

        if (this.getAcceleration().getY() > this.getMaxAcceleration().getY()) {
            this.getAcceleration().setY(this.getMaxAcceleration().getY());
        }

        if (this.getAcceleration().getY() < -this.getMaxAcceleration().getY()) {
            this.getAcceleration().setY(-this.getMaxAcceleration().getY());
        }

        // Handle collision and other entity-based events.
        let isColliding = new Vector2f(0, 0);
        let isCollidable = this.getCollidable();

        if (isCollidable && !this.getSolid() && !this.hasEvents()) {
            isCollidable = false;
        }

        if (isCollidable && !this.inMotion()) {
            isCollidable = false;
        }

        if (isCollidable) {
            let neighbors = State.getEngine().getScene().getNearbyEntities(this);
            let entity = null;

            for (let i = 0; i < neighbors.length; i++) {
                entity = neighbors[i];

                // Determine whether or not we should even care about continuing.
                if (!entity instanceof Sprite) {
                    continue;
                }

                // Fire off a distance calculation event if the entity is within our defined threshold.
                if (entity.hasDistanceEvents()) {
                    this.onDistance(
                        new DistancePayload(this, entity, this.getDistanceFrom(entity))
                    );
                }

                // Handle acceleration adjustments.
                if (this.inMotion()) {
                    if (this.getCollisionRect(State.getEngine().scale(this.getAcceleration().getX()), 0.00).isColliding(entity.getCollisionRect())) {
                        isColliding.setX(this.getAcceleration().getX() > 0 ? 1 : -1)
                    }

                    if (this.getCollisionRect(0.00, State.getEngine().scale(this.getAcceleration().getY())).isColliding(entity.getCollisionRect())) {
                        isColliding.setY(this.getAcceleration().getY() > 0 ? 1 : -1);
                    }

                    if (Sprite.getFlag('ShowCollisions') && (isColliding.getX() || isColliding.getY())) {
                        State.getEngine().getContext().fillStyle = '#000000';
                        State.getEngine().getContext().fillRect(
                            this.getCalculatedPosition().getX(),
                            this.getCalculatedPosition().getY(), this.getCalculatedSize().getX(), this.getCalculatedSize().getY()
                        );

                        State.getEngine().getContext().fillStyle = '#ff0000';
                        State.getEngine().getContext().fillRect(
                            entity.getCalculatedPosition().getX(),
                            entity.getCalculatedPosition().getY(), entity.getCalculatedSize().getX(), entity.getCalculatedSize().getY()
                        );
                    }

                    if (isColliding.getX() || isColliding.getY()) {
                        this.onCollide(
                            new CollisionPayload(this, entity)
                        );

                        if(!entity.getSolid()){
                            isColliding = new Vector2f(0, 0);
                        }
                    }
                }
            }
        }

        // Handle deceleration if not moving.
        if (this.getAcceleration().getX()) {
            if (Math.abs(this.getAcceleration().getX()) < 0.01) {
                this.getAcceleration().setX(0.0);
            }
            else {
                this.getAcceleration().setX(
                    this.getAcceleration().getX() -
                    (this.getAcceleration().getX() * 0.1)
                );
            }
        }

        if (this.getAcceleration().getY()) {
            if (Math.abs(this.getAcceleration().getY()) < 0.01) {
                this.getAcceleration().setY(0.0);
            }
            else {
                this.getAcceleration().setY(
                    this.getAcceleration().getY() -
                    (this.getAcceleration().getY() * 0.1)
                );
            }
        }

        // Move position based on acceleration.
        if (this.inMotion()) {
            this.getPosition().add(new Vector2f(
                State.getEngine().scale((!isColliding.getX() || (isColliding.getX() > 0 && this.getAcceleration().getX() < 0) || (isColliding.getX() < 0 && this.getAcceleration().getX() > 0)) ? this.getAcceleration().getX() : 0),
                State.getEngine().scale((!isColliding.getY() || (isColliding.getY() > 0 && this.getAcceleration().getY() < 0) || (isColliding.getY() < 0 && this.getAcceleration().getY() > 0)) ? this.getAcceleration().getY() : 0),
            ));

            this.flushCache();
        }

        // Execute the behavior.
        this.behave();
    }
}
