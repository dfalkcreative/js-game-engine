import {State} from "../../../Kernel/State";
import {Frame} from "../../../Graphic/Frame";
import {Sprite} from "../../../Entity/Sprite";
import {Engine} from "../../../Kernel/Engine";
import {Emitter} from "../../../Entity/Emitter";
import {Vector2f} from "../../../Math/Vector2f";
import {Particle} from "../../../Graphic/Particle";
import {Timeline} from "../../../Animation/Timeline";
import {Sequence} from "../../../Animation/Sequence";
import {KeyFrame} from "../../../Animation/KeyFrame";

export class ISprite extends Sprite {
    /**
     * The sprite constructor.
     *
     * @param src
     * @param frame
     */
    constructor(src, frame) {
        super(src, frame);

        this.setZIndex(5)
            .addEvent('Distance', ISprite.handleZShift)
            .addEvent('RenderAfter', ISprite.addShadowAfter)
            .addEvent('RenderBefore', ISprite.addShadowBefore)
            .addEvent('UpdateHealth', ISprite.handleHealthUpdate)
            .addLinkedSprites();
    }


    /**
     * Returns a new ISprite instance.
     *
     * @param src
     * @param frame
     * @returns {ISprite}
     */
    static create(src, frame) {
        return new ISprite(src, frame);
    }


    /**
     * Returns a new instance.
     *
     * @returns {ISprite}
     */
    getInstance(){
        return new ISprite();
    }


    /**
     * Registers all linked sprites.
     *
     * @returns this
     */
    addLinkedSprites() {
        const engine = State.getEngine();
        const scene = engine.getScene();

        // Assign a HP frame if one isn't already linked.
        if (!this.getAttribute('Linked/GUI/HealthFrame')) {
            this.setAttribute('Linked/GUI/HealthFrame',
                Sprite.create('resources/pack_rpg_ui/bars/bar_56.png')
                    .setOpacity(0)
                    .setPosition(this.getPosition())
                    .setBehavior((self) => {
                        self.setPosition(new Vector2f(
                            this.getPosition().getX() + (this.getScaledSize().getX() / 2) - (self.getScaledSize().getX() / 2),
                            this.getPosition().getY()
                        ));
                    })
            );

            scene.addEntity(ISprite.getUniqueName('GUI/HealthFrame'),
                this.getAttribute('Linked/GUI/HealthFrame')
            );
        }

        // Assign a HP bar if one isn't already linked.
        if (!this.getAttribute('Linked/GUI/HealthBar')) {
            this.setAttribute('Linked/GUI/HealthBar',
                Sprite.create('resources/pack_rpg_ui/bars/bar_76.png', Frame.create(2, 3, 20, 2))
                    .setOpacity(0)
                    .setPosition(this.getPosition())
                    .setBehavior((self) => {
                        self.setPosition(
                            new Vector2f(
                                this.getAttribute('Linked/GUI/HealthFrame').getPosition().getX() + 2,
                                this.getAttribute('Linked/GUI/HealthFrame').getPosition().getY() + 3
                            )
                        ).setScale(new Vector2f(
                            this.getAttribute('Health') / this.getAttribute('MaxHealth'), 1
                        ));
                    })
            );

            scene.addEntity(ISprite.getUniqueName('GUI/HealthBar'),
                this.getAttribute('Linked/GUI/HealthBar')
            );
        }

        // Link a new particle emitter.
        if (!this.getAttribute('Linked/Emitter/Effects')) {
            this.setAttribute('Linked/Emitter/Effects',
                Emitter.create((self) => {
                    const scale = Math.random() * 2;
                    const entity = self.getAttribute('Linked/Entity');
                    const cloned = Sprite.create().addEvent('RenderBefore', (payload) => {
                        const sprite = payload.getSprite();
                        const engine = State.getEngine();

                        // Render the particle onto the canvas.
                        Engine.rectangle(sprite.getCalculatedPosition(), new Vector2f(
                            engine.scale(sprite.getScale().getX()),
                            engine.scale(sprite.getScale().getY())
                        ), sprite.getAttribute('Color'), sprite.getOpacity());
                    });

                    switch (self.getAttribute('Variant')) {
                        case 'LevelUp':
                            cloned.setVisible(true)
                                .setAttribute('Color', '#ffdf54')
                                .setScale(new Vector2f(scale, scale))
                                .setOpacity(1)
                                .getPosition()
                                .setX(entity.getPosition().getX() + (entity.getScaledSize().getX() / 2))
                                .setY(entity.getPosition().getY() + entity.getScaledSize().getY());

                            cloned.setTimeline(
                                Timeline.create([
                                    Sequence.create((value) => {
                                        let output = Math.sin(value * Math.PI / 180.0);

                                        cloned.setZIndex(entity.getZIndex() + (output < 0 ? -1 : 1))
                                            .getAcceleration()
                                            .setX(output)
                                    }).addKeyFrame(new KeyFrame(new Vector2f(90, 720 + (Math.random() * 360)), 2)),

                                    Sequence.create((value) => cloned.getAcceleration().setY(-value))
                                        .addKeyFrame(new KeyFrame(new Vector2f(0, 0.4), 2)),

                                    Sequence.create((value) => cloned.setOpacity(value))
                                        .addKeyFrame(new KeyFrame(new Vector2f(1, 1), 1))
                                        .addKeyFrame(new KeyFrame(new Vector2f(1, 0), 1))
                                ])
                            );
                            break;

                        default:
                            cloned.setVisible(true)
                                .setAttribute('Color', '#ff0000')
                                .setScale(new Vector2f(scale, scale))
                                .setOpacity(0)
                                .setZIndex(entity.getZIndex() - 1)
                                .getPosition()
                                .setX(entity.getPosition().getX() + ((Math.random() - 0.5) * 12) + (entity.getScaledSize().getX() / 2))
                                .setY(entity.getPosition().getY() + ((Math.random() - 0.5) * 12) + (entity.getScaledSize().getY() / 4));

                            cloned.getAcceleration().setY(
                                -Math.random() / 4
                            );

                            cloned.setTimeline(
                                Timeline.create([
                                    Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(value, 0)))
                                        .addKeyFrame(new KeyFrame(new Vector2f((Math.random() - 0.5) / 8, 0), 0.6)),

                                    Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(0, value)))
                                        .addKeyFrame(new KeyFrame(new Vector2f(0, Math.random() / 6), 1)),

                                    Sequence.create((value) => cloned.setOpacity(value))
                                        .addKeyFrame(new KeyFrame(new Vector2f(1, 1), 0.5))
                                        .addKeyFrame(new KeyFrame(new Vector2f(1, 0), 0.5))
                                ])
                            );
                            break;
                    }

                    return new Particle(cloned,
                        cloned.getTimeline().getDurationInMilliseconds()
                    );
                }, 10, 50)
            );

            scene.addEntity(ISprite.getUniqueName('Emitter/Effects'),
                this.getAttribute('Linked/Emitter/Effects')
            );
        }

        // Link a separate damage emitter.
        if (!this.getAttribute('Linked/Emitter/Counter')) {
            this.setAttribute('Linked/Emitter/Counter',
                Emitter.create((self) => {
                    const scale = Math.random() * 3;
                    const entity = self.getAttribute('Linked/Entity');
                    const cloned = Sprite.create()
                        .addEvent('RenderBefore', (payload) => {
                            const entity = payload.getSprite();

                            // Display the text damage value.
                            State.getEngine().text(
                                entity.getAttribute('DamageValue'),
                                entity.getCalculatedPosition(), 12,
                                entity.getAttribute('Color'),
                                entity.getOpacity()
                            );
                        });

                    cloned.setVisible(true)
                        .setOpacity(0)
                        .setScale(new Vector2f(scale, scale))
                        .setAttribute('Color', self.getAttribute('DamageValue') > 0 ? '#ffffff' : '#04ff57')
                        .setAttribute('DamageValue', `${self.getAttribute('DamageValue') > 0 ? `-` : `+`}${self.getAttribute('DamageValue')}`)
                        .getPosition()
                        .setX(entity.getPosition().getX() + ((Math.random() - 0.5) * 12) + (entity.getScaledSize().getX() / 2))
                        .setY(entity.getPosition().getY() + ((Math.random() - 0.5) * 12) + (entity.getScaledSize().getY() / 4));

                    cloned.getAcceleration().setY(-Math.random() - 0.5);

                    cloned.setTimeline(
                        Timeline.create([
                            Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(value, 0)))
                                .addKeyFrame(new KeyFrame(new Vector2f((Math.random() - 0.5) / 10, 0), 2)),

                            Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(0, value)))
                                .addKeyFrame(new KeyFrame(new Vector2f(0, Math.random() / 6), 2)),

                            Sequence.create((value) => cloned.setOpacity(value))
                                .addKeyFrame(new KeyFrame(new Vector2f(1, 0), 2))
                        ])
                    );

                    return new Particle(cloned,
                        cloned.getTimeline().getDurationInMilliseconds()
                    );
                }, 2, 1)
            );

            scene.addEntity(ISprite.getUniqueName('Emitter/Counter'),
                this.getAttribute('Linked/Emitter/Counter')
            );
        }

        return this;
    }


    /**
     * Handles the drawing priority shift whenever sprites move around one another.
     *
     * @param payload
     */
    static handleZShift(payload) {
        const self = payload.getRoot();
        const entity = payload.getEntity();
        const beneath = self.getOffsetPosition().getY() + self.getScaledSize().getY() > entity.getOffsetPosition().getY() + entity.getScaledSize().getY();

        self.setZIndex(entity.getZIndex() + (beneath ? 1 : -1));
    }


    /**
     * Handles the damage effect.
     *
     * @param payload
     */
    static handleHealthUpdate(payload) {
        const root = payload.getRoot();
        const engine = State.getEngine();
        const entity = payload.getEntity();

        // Reduce the health counter by the payload damage.
        entity.setAttribute('Health',
            entity.getAttribute('Health') - payload.getDamage()
        );

        // Handle death.
        if (entity.getAttribute('Health') <= 0) {
            entity.setAttribute('Health', 0).setSolid(false);

            if (entity.hasAnimation('Death')) {
                entity.setAnimation('Death');
            }
        }

        // Emit blood from the entity.
        entity.getAttribute('Linked/Emitter/Effects')
            .setAttribute('Linked/Entity', entity)
            .setAttribute('Variant', 'Damage')
            .setTimeline(
                Timeline.create([
                    Sequence.create((value) => {
                        if (!value) {
                            entity.getAttribute('Linked/Emitter/Effects').stop();
                        }
                    }).addKeyFrame(new KeyFrame(new Vector2f(1, 0), 2))
                ])
            ).play();

        // Throw the damage amount.
        entity.getAttribute('Linked/Emitter/Counter')
            .setAttribute('Linked/Entity', entity)
            .setAttribute('DamageValue', payload.getDamage())
            .addParticle();

        // Push the entity back.
        entity.getAcceleration().add(new Vector2f(
            (entity.getCenter().getX() - root.getCenter().getX()) * 0.1,
            (entity.getCenter().getY() - root.getCenter().getY()) * 0.1
        ));

        if (!engine.getScene().getCamera().getShake()) {
            engine.getScene().getCamera().setTimeline(
                Timeline.create([
                    Sequence.create((value) => engine.getScene().getCamera().setShake(value))
                        .addKeyFrame(KeyFrame.create(new Vector2f(4, 0), 0.3))
                ])
            );
        }
    }


    /**
     * Casts a shadow to an entity.
     *
     * @param payload
     */
    static addShadowBefore(payload) {
        const context = State.getEngine().getContext();

        context.shadowOffsetX = 0;
        context.shadowOffsetY = State.getEngine().scale(1);
        context.shadowColor = 'rgba(0,0,0,0.2)';
        context.shadowBlur = State.getEngine().scale(1);
    }


    /**
     * Casts a shadow to an entity.
     *
     * @param payload
     */
    static addShadowAfter(payload) {
        const context = State.getEngine().getContext();

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = 'black';
        context.shadowBlur = 0;
    }


    /**
     * Returns a unique name.
     *
     * @param prefix
     * @returns {string}
     */
    static getUniqueName(prefix) {
        return (prefix ? `${prefix}/` : '') + Math.random().toString(36).substring(7);
    }
}