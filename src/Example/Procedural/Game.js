import {Path} from "./Generation/Path";
import {Frame} from "../../Graphic/Frame";
import {Camera} from "../../Scene/Camera";
import {Engine} from "../../Kernel/Engine";
import {Sprite} from "../../Entity/Sprite";
import {ISprite} from "./Entity/ISprite";
import {Vector2f} from "../../Math/Vector2f";
import {Vector4f} from "../../Math/Vector4f";
import {KeyFrame} from "../../Animation/KeyFrame";
import {Sequence} from "../../Animation/Sequence";
import {Timeline} from "../../Animation/Timeline";
import {Generator} from "./Generation/Generator";
import {Animation} from "../../Animation/Animation";
import {UpdateHealthPayload} from "./Event/UpdateHealthPayload";
import {Matrix} from "../../Math/Matrix";
import {Scene} from "../../Scene/Scene";

export class Game extends Engine {
    static sceneNodes = Matrix.create(new Vector2f(50, 50));
    static scenePosition = new Vector2f(25, 25);


    /**
     * Game constructor.
     */
    constructor() {
        super();
    }


    /**
     * Draws a GUI window to the screen
     *
     * @param rect
     */
    static getGUIFrame(rect) {
        if (!rect instanceof Vector4f) {
            return;
        }

        let scale = 2;

        Engine.getEntity('GUI/TopLeft').setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX(), rect.getY())
        );

        rect.setW(rect.getW() - Engine.getEntity('GUI/TopLeft').getScaledSize().getX());
        rect.setH(rect.getH() - Engine.getEntity('GUI/TopLeft').getScaledSize().getY());

        Engine.getEntity('GUI/TopRight').setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + rect.getW(), rect.getY())
        );

        Engine.getEntity('GUI/BottomRight').setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + rect.getW(), rect.getY() + rect.getH())
        );

        Engine.getEntity('GUI/BottomLeft').setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX(), rect.getY() + rect.getH())
        );

        let left = Engine.getEntity('GUI/Left').clone().setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX(), rect.getY() + Engine.getEntity('GUI/TopLeft').getScaledSize().getY())
        ).setScale(
            new Vector2f(scale, (rect.getH() / Engine.getEntity('GUI/Left').getScaledSize().getY()) - scale)
        );

        let right = Engine.getEntity('GUI/Right').clone().setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + rect.getW(), rect.getY() + Engine.getEntity('GUI/TopLeft').getScaledSize().getY())
        ).setScale(
            new Vector2f(scale, (rect.getH() / Engine.getEntity('GUI/Right').getScaledSize().getY()) - scale)
        );

        let bottom = Engine.getEntity('GUI/Bottom').clone().setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + Engine.getEntity('GUI/TopLeft').getScaledSize().getX(), rect.getY() + rect.getH())
        ).setScale(
            new Vector2f((rect.getW() / Engine.getEntity('GUI/Bottom').getScaledSize().getX()) - scale, scale)
        );

        let top = Engine.getEntity('GUI/Top').clone().setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + Engine.getEntity('GUI/TopLeft').getScaledSize().getX(), rect.getY())
        ).setScale(
            new Vector2f((rect.getW() / Engine.getEntity('GUI/Top').getScaledSize().getX()) - scale, scale)
        );

        let center = Engine.getEntity('GUI/Center').clone().setScale(new Vector2f(scale, scale)).setPosition(
            new Vector2f(rect.getX() + Engine.getEntity('GUI/TopLeft').getScaledSize().getX(), rect.getY() + Engine.getEntity('GUI/TopLeft').getScaledSize().getY())
        ).setScale(
            new Vector2f((rect.getW() / Engine.getEntity('GUI/Center').getScaledSize().getX()) - scale, (rect.getH() / Engine.getEntity('GUI/Center').getScaledSize().getY()) - scale)
        );

        Game.drawSprite(Engine.getEntity('GUI/TopLeft'));
        Game.drawSprite(Engine.getEntity('GUI/TopRight'));
        Game.drawSprite(Engine.getEntity('GUI/BottomRight'));
        Game.drawSprite(Engine.getEntity('GUI/BottomLeft'));
        Game.drawSprite(top);
        Game.drawSprite(left);
        Game.drawSprite(right);
        Game.drawSprite(bottom);
        Game.drawSprite(center);
    }


    /**
     * Returns the player instance.
     *
     * @returns {Sprite}
     */
    static getPlayer() {
        let engine = Engine.getInstance();

        return ISprite.create()
            .setSolid(true)
            .setScale(new Vector2f(1.5, 1.5))
            .setPosition(new Vector2f(250, 250))
            .setCollisionRect(new Vector4f(
                0, 10, 9, 10
            ))
            .addEvent('Distance', (payload) => {
                let self = payload.getRoot();
                let entity = payload.getEntity();
                let distance = payload.getDistance();

                // Display the health bar.
                let bar = entity.getAttribute('Linked/GUI/HealthBar');
                let frame = entity.getAttribute('Linked/GUI/HealthFrame');

                if(!bar || !frame){
                    return;
                }

                bar.setTimeline(
                    Timeline.create([
                        Sequence.create((value) => {
                            bar.setOpacity(value);
                        }).addKeyFrame(new KeyFrame(new Vector2f(entity.isAlive() ? 1 : 0, 0), 0.5))
                    ])
                );

                frame.setTimeline(
                    Timeline.create([
                        Sequence.create((value) => {
                            frame.setOpacity(value);
                        }).addKeyFrame(new KeyFrame(new Vector2f(entity.isAlive() ? 1 : 0, 0), 0.5))
                    ])
                );

                // Remove the health bar for entities that aren't alive.
                if (!entity.isAlive()) {
                    return;
                }

                // Handle attacks if the entity is in range.
                if (distance < 40 && engine.getController().getState('LeftShift')) {
                    entity.callEvents('UpdateHealth', new UpdateHealthPayload(self, entity, 10 + Math.floor(Math.random() * 10)))
                }
            })
            .addAnimation('Default',
                Animation.create('resources/pack_rpg_character/Static/c3.png')
                    .addFrame(Frame.create(19, 13, 9, 20))
            )
            .setBehavior((self) => {
                if (self.getAcceleration().getX()) {
                    self.setFlipX(self.getAcceleration().getX() < 0);
                }

                if (engine.getController().getState('1Key')) {
                    self.setAttribute('Health', self.getAttribute('MaxHealth'));

                    self.getAttribute('Linked/Emitter/Effects')
                        .setAttribute('Linked/Entity', self)
                        .setAttribute('Variant', 'LevelUp')
                        .setTimeline(
                            Timeline.create([
                                Sequence.create((value) => {
                                    if (!value) {
                                        self.getAttribute('Linked/Emitter/Effects').stop();
                                    }
                                }).addKeyFrame(new KeyFrame(new Vector2f(1, 0), 2))
                            ])
                        ).play();
                }

                if (self.getAttribute('Health') > 0) {
                    if (self.getAnimation().getLoop() || !self.getAnimation().isPlaying) {
                        // Display the attack animation.
                        if (!engine.getController().getState('LeftShift')) {
                            // If not moving and not attacking, display the first directional frame.
                            if (!engine.getController().hasArrowKeyDown()) {
                                switch (self.getDirection()) {
                                    case 'Down':
                                        self.setAnimation('Default')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Right':
                                        self.setAnimation('Default')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Up':
                                        self.setAnimation('Default')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Left':
                                        self.setAnimation('Default')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;
                                }
                            }

                            // Handle character movement.
                            if (engine.getController().getState('UpArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setDirection('Up')
                                    .getAcceleration()
                                    .add(new Vector2f(0, -0.1));
                            }

                            if (engine.getController().getState('DownArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setDirection('Down')
                                    .getAcceleration()
                                    .add(new Vector2f(0, 0.1));
                            }

                            if (engine.getController().getState('LeftArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setDirection('Left')
                                    .getAcceleration()
                                    .add(new Vector2f(-0.1, 0));
                            }

                            if (engine.getController().getState('RightArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setDirection('Right')
                                    .getAcceleration()
                                    .add(new Vector2f(0.1, 0));
                            }
                        }
                    }
                }

                // Force player to stay in bounds.
                let transition = false;
                let momentum = new Vector2f(0, 0);

                if (self.getPosition().getX() < 0) {
                    self.setAttribute('Scene/LastPosition', new Vector2f(self.getPosition().getX(), self.getPosition().getY()));
                    self.getPosition().setX(engine.getScene().getArea().getX() - self.getScaledSize().getX());
                    transition = true;
                    momentum.setX(-1);
                }

                if (self.getPosition().getY() < 0) {
                    self.setAttribute('Scene/LastPosition', new Vector2f(self.getPosition().getX(), self.getPosition().getY()));
                    self.getPosition().setY(engine.getScene().getArea().getY() - self.getScaledSize().getY());
                    transition = true;
                    momentum.setY(-1);
                }

                if (self.getPosition().getX() > engine.getScene().getArea().getX() - self.getScaledSize().getX()) {
                    self.setAttribute('Scene/LastPosition', new Vector2f(self.getPosition().getX(), self.getPosition().getY()));
                    self.getPosition().setX(0);
                    transition = true;
                    momentum.setX(1);
                }

                if (self.getPosition().getY() > engine.getScene().getArea().getY() - self.getScaledSize().getY()) {
                    self.setAttribute('Scene/LastPosition', new Vector2f(self.getPosition().getX(), self.getPosition().getY()));
                    self.getPosition().setY(0);
                    transition = true;
                    momentum.setY(1);
                }

                if(transition){
                    self.setAttribute('Scene/LastScene', new Vector2f(Game.scenePosition.getX(), Game.scenePosition.getY()));
                    Game.scenePosition.add(momentum);

                    if(Game.sceneNodes.getValue(Game.scenePosition) instanceof Scene){
                        engine.setScene(Game.sceneNodes.getValue(Game.scenePosition));
                    }
                    else{
                        const generator = new Generator(new Vector2f(50, 50), 'resources/pack_som/tiles_1.png', new Vector2f(30, 16));

                        generator.addPath(new Path(generator.getArea()));
                        let scene = generator.getScene();

                        scene.setSprites(engine.getScene().getSprites())
                            .addCamera('Default', Camera.create()
                                .setSprite(Engine.getEntity('Player'))
                                .setZoom(2)
                            );

                        engine.setScene(scene);
                        Game.sceneNodes.setValue(Game.scenePosition, engine.getScene());
                    }
                }
            });
    }


    /**
     * Initialize the game resources.
     */
    getSetup() {
        const engine = Engine.getInstance();
        const generator = new Generator(new Vector2f(50, 50), 'resources/pack_som/tiles_1.png', new Vector2f(30, 16));

        this.setScene(generator.getScene());

        let playerStart = new Vector2f(
            Math.floor(Math.random() * 49) * 16,
            Math.floor(Math.random() * 48) * 16,
        );

        this.getScene()
            .addEntity('Player', Game.getPlayer);
        // .addEntity('Boss/Ghoul', () => {
        //     return ISprite.create()
        //         .setSolid(true)
        //         .setScale(new Vector2f(1.6, 1.6))
        //         .setPosition(new Vector2f(50, 50))
        //         .addAnimation('Idle',
        //             Animation.create('resources/enemy_ghoul/ghoul-Sheet.png')
        //                 .setRate(6)
        //                 .addFrame(Frame.create(0, 1, 51, 18))
        //                 .addFrame(Frame.create(51, 1, 51, 18))
        //                 .addFrame(Frame.create(102, 1, 51, 18))
        //                 .addFrame(Frame.create(153, 1, 51, 18))
        //                 .play()
        //         );
        // })
        // .addEntity('Boss/Golem', () => {
        //     return ISprite.create()
        //         .setSolid(true)
        //         .setScale(new Vector2f(1.8, 1.8))
        //         .setPosition(new Vector2f(100, 50))
        //         .setCollisionRect(new Vector4f(19, 16, 47, 40))
        //         .addAnimation('Idle',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .addFrame(Frame.create(0, 0, 74, 57))
        //                 .addFrame(Frame.create(74, 0, 74, 57))
        //                 .addFrame(Frame.create(148, 0, 74, 57))
        //                 .addFrame(Frame.create(222, 0, 74, 57))
        //                 .addFrame(Frame.create(296, 0, 74, 57))
        //                 .play()
        //         )
        //         .addAnimation('Death',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .setLoop(false)
        //                 .addFrame(Frame.create(148, 284, 74, 57))
        //                 .addFrame(Frame.create(222, 284, 74, 57))
        //                 .addFrame(Frame.create(296, 284, 74, 57))
        //                 .addFrame(Frame.create(370, 284, 74, 57))
        //                 .addFrame(Frame.create(0, 341, 74, 57))
        //                 .addFrame(Frame.create(74, 341, 74, 57))
        //                 .addFrame(Frame.create(148, 341, 74, 57))
        //                 .addFrame(Frame.create(222, 341, 74, 57))
        //                 .addFrame(Frame.create(296, 341, 74, 57))
        //                 .addFrame(Frame.create(296, 341, 74, 57))
        //                 .addFrame(Frame.create(296, 341, 74, 57))
        //                 .play()
        //         )
        //         .addAnimation('Hurt',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .setLoop(false)
        //                 .addFrame(Frame.create(370, 227, 74, 57))
        //                 .addFrame(Frame.create(0, 284, 74, 57))
        //                 .addFrame(Frame.create(74, 284, 74, 57))
        //                 .play()
        //         )
        //         .addAnimation('Attack/Primary',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .setLoop(false)
        //                 .addFrame(Frame.create(0, 170, 74, 57))
        //                 .addFrame(Frame.create(74, 170, 74, 57))
        //                 .addFrame(Frame.create(148, 170, 74, 57))
        //                 .addFrame(Frame.create(222, 170, 74, 57))
        //                 .addFrame(Frame.create(296, 170, 74, 57))
        //                 .addFrame(Frame.create(370, 170, 74, 57))
        //                 .addFrame(Frame.create(0, 227, 74, 57))
        //                 .addFrame(Frame.create(74, 227, 74, 57))
        //                 .addFrame(Frame.create(148, 227, 74, 57))
        //                 .addFrame(Frame.create(222, 227, 74, 57))
        //                 .addFrame(Frame.create(296, 227, 74, 57))
        //                 .play()
        //         )
        //         .addAnimation('Attack/Secondary',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .setLoop(false)
        //                 .addFrame(Frame.create(370, 56, 74, 57))
        //                 .addFrame(Frame.create(0, 113, 74, 57))
        //                 .addFrame(Frame.create(74, 113, 74, 57))
        //                 .addFrame(Frame.create(148, 113, 74, 57))
        //                 .addFrame(Frame.create(222, 113, 74, 57))
        //                 .addFrame(Frame.create(296, 113, 74, 57))
        //                 .addFrame(Frame.create(370, 113, 74, 57))
        //                 .play()
        //         )
        //         .addAnimation('Walk',
        //             Animation.create('resources/enemy_golem/golem-Sheet.png')
        //                 .setRate(4)
        //                 .addFrame(Frame.create(370, 0, 74, 57))
        //                 .addFrame(Frame.create(0, 56, 74, 57))
        //                 .addFrame(Frame.create(74, 56, 74, 57))
        //                 .addFrame(Frame.create(148, 56, 74, 57))
        //                 .addFrame(Frame.create(222, 56, 74, 57))
        //                 .addFrame(Frame.create(296, 56, 74, 57))
        //                 .play()
        //         )
        //         .setBehavior((self) => {
        //             const player = engine.getScene().getEntity('Player');
        //             const distance = self.getDistanceFrom(player);
        //
        //             if (!self.isAlive()) {
        //                 return;
        //             }
        //
        //             self.setFlipX(player.getCalculatedCenter().getX() > self.getCalculatedCenter().getX());
        //
        //             // Only process other animations if we're not currently in the middle of a loop animation.
        //             if (self.getAnimation().getLoop() || !self.getAnimation().isPlaying) {
        //                 if (distance < 50) {
        //                     self.setAnimation(Math.random() < 0.2 ? 'Attack/Primary' : 'Attack/Secondary');
        //
        //                     switch (self.getAnimationName()) {
        //                         case 'Attack/Primary':
        //                             engine.getScene().getCamera().setTimeline(
        //                                 Timeline.create([
        //                                     Sequence.create((value) => engine.getScene().getCamera().setShake(value))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(0, 6), 1))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(6, 0), 0.2))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(0, 8), 1.2))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(8, 0), 0.2))
        //                                 ])
        //                             );
        //                             break;
        //
        //                         case 'Attack/Secondary':
        //                             engine.getScene().getCamera().setTimeline(
        //                                 Timeline.create([
        //                                     Sequence.create((value) => engine.getScene().getCamera().setShake(value))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(0, 0), 0.3))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(0, 4), 0.7))
        //                                         .addKeyFrame(KeyFrame.create(new Vector2f(4, 0), 0.2))
        //                                 ])
        //                             );
        //                             break;
        //                     }
        //                 }
        //                 else {
        //                     // Handle enemy movement.
        //                     if (distance > 100) {
        //                         let difference = new Vector2f(
        //                             player.getCalculatedCenter().getX() - self.getCalculatedCenter().getX(),
        //                             player.getCalculatedCenter().getY() - self.getCalculatedCenter().getY()
        //                         );
        //
        //                         self.getAcceleration().add(new Vector2f(
        //                             difference.getX() > 0 ? 0.02 : -0.02,
        //                             difference.getY() > 0 ? 0.02 : -0.02
        //                         ));
        //                     }
        //
        //                     self.setAnimation(self.inMotion() ? 'Walk' : 'Idle');
        //                 }
        //             }
        //             else {
        //                 // Deal player damage on certain frames within range.
        //                 switch (self.getAnimationName()) {
        //                     case 'Attack/Primary':
        //                         if (Sprite.inRange(distance, 10, 70, true) && [3, 4, 7, 8].includes(self.getAnimation().getCurrentFrame())) {
        //                             player.callEvents('UpdateHealth',
        //                                 new UpdateHealthPayload(self, player, 20 + Math.floor(Math.random() * 10))
        //                             )
        //                         }
        //                         break;
        //
        //                     case 'Attack/Secondary':
        //                         if (Sprite.inRange(distance, 30, 70, true) && [2, 3].includes(self.getAnimation().getCurrentFrame())) {
        //                             player.callEvents('UpdateHealth',
        //                                 new UpdateHealthPayload(self, player, 10 + Math.floor(Math.random() * 10))
        //                             )
        //                         }
        //                         break;
        //                 }
        //             }
        //         });
        // })
        // .addEntity('Boss/Imp', () => {
        //     return ISprite.create()
        //         .setSolid(true)
        //         .setScale(new Vector2f(1.6, 1.6))
        //         .setPosition(new Vector2f(215, 50))
        //         .addAnimation('Idle',
        //             Animation.create('resources/enemy_imp/imp-Sheet.png')
        //                 .setRate(6)
        //                 .addFrame(Frame.create(11, 1, 43, 41))
        //                 .addFrame(Frame.create(59, 1, 43, 41, new Vector2f(-3, 2)))
        //                 .addFrame(Frame.create(111, 1, 43, 41, new Vector2f(-1, 6)))
        //                 .addFrame(Frame.create(155, 1, 43, 41, new Vector2f(-10, 9)))
        //                 .addFrame(Frame.create(206, 1, 43, 41, new Vector2f(-8, 4)))
        //                 .play()
        //         );
        // })
        // .addEntity('Boss/PhantomKnight', () => {
        //     return ISprite.create()
        //         .setSolid(true)
        //         .setScale(new Vector2f(1.6, 1.6))
        //         .setPosition(new Vector2f(20, 100))
        //         .addAnimation('Idle',
        //             Animation.create('resources/enemy_phantom_knight/phantom knight-Sheet.png')
        //                 .setRate(5)
        //                 .addFrame(Frame.create(13, 13, 29, 37))
        //                 .addFrame(Frame.create(70, 13, 29, 37))
        //                 .addFrame(Frame.create(127, 13, 29, 37))
        //                 .addFrame(Frame.create(184, 13, 29, 37))
        //                 .play()
        //         );
        // })
        // .addEntity('Boss/Satyr', () => {
        //     return ISprite.create()
        //         .setSolid(true)
        //         .setScale(new Vector2f(1.6, 1.6))
        //         .setPosition(new Vector2f(245, 100))
        //         .addAnimation('Idle',
        //             Animation.create('resources/enemy_satyr/satyr-Sheet.png')
        //                 .setRate(4)
        //                 .addFrame(Frame.create(21, 12, 43, 33))
        //                 .addFrame(Frame.create(89, 12, 41, 33))
        //                 .addFrame(Frame.create(157, 12, 42, 33))
        //                 .addFrame(Frame.create(225, 12, 41, 33))
        //                 .play()
        //         );
        // });

        // Cut the GUI tileset.
        engine.getScene()
            .addEntity('GUI/ExperienceFrame', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/bars/bar_224.png'))
            )
            .addEntity('GUI/ExperienceBar', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/bars/bar_226.png')
                        .addFrame(Frame.create(2, 3, 20, 2)))
            )
            .addEntity('GUI/HealthFrame', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/bars/bar_56.png'))
            )
            .addEntity('GUI/HealthBar', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/bars/bar_76.png')
                        .addFrame(Frame.create(2, 3, 20, 2)))
            )
            .addEntity('GUI/TopLeft', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(0, 0, 16, 16)))
            )
            .addEntity('GUI/Top', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(16, 0, 16, 16)))
            )
            .addEntity('GUI/TopRight', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(32, 0, 16, 16)))
            )
            .addEntity('GUI/Right', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(32, 16, 16, 16)))
            )
            .addEntity('GUI/BottomRight', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(32, 32, 16, 16)))
            )
            .addEntity('GUI/Bottom', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(16, 32, 16, 16)))
            )
            .addEntity('GUI/BottomLeft', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(0, 32, 16, 16)))
            )
            .addEntity('GUI/Left', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(0, 16, 16, 16)))
            )
            .addEntity('GUI/Center', Sprite.create()
                .setVisible(false)
                .addAnimation('Default',
                    Animation.create('resources/pack_rpg_ui/Windows/_sheet_window_06.png')
                        .addFrame(Frame.create(16, 16, 16, 16)))
            );

        engine.getScene().getEntity('Player').setPosition(playerStart);
        engine.getScene().addEntity('Tileset', Sprite.create('resources/pack_som/tiles_1.png').setVisible(false));

        // Add a linked sprite camera.
        engine.getScene()
            .addCamera('Default', Camera.create()
                .setSprite(Engine.getEntity('Player'))
                .setZoom(2)
            );

        Game.sceneNodes.setValue(
            Game.scenePosition, engine.getScene()
        );
    }


    /**
     * Handles the gameplay.
     */
    getGameplay() {
        const engine = Engine.getInstance();

        // For controls that should act as a single fire, we'll immediately remove the active state.
        engine.getController().setState('LeftShift', false);

        // Render the UI elements.
        let frame = 50;
        let margin = 5;
        let origin = new Vector2f(
            (Engine.getInstance().getCanvasWidth() / 2) - ((frame * 3) / 2),
            Engine.getInstance().getCanvasHeight() - (frame + margin)
        );

        for (let i = 0; i < 3; i++) {
            Game.getGUIFrame(new Vector4f(origin.getX() + ((frame + margin) * i), origin.getY(), frame, frame));
            Engine.text(i + 1, new Vector2f(origin.getX() + ((frame + margin) * i) + 9, origin.getY() + 16), 6);
        }

        Engine.getEntity('GUI/HealthFrame')
            .setScale(new Vector2f(6.8, 2))
            .setPosition(new Vector2f(
                origin.getX() - 2, origin.getY() - 15
            ));

        Engine.getEntity('GUI/HealthBar')
            .setScale(new Vector2f(6.8 * (Engine.getEntity('Player').getAttribute('Health') / Engine.getEntity('Player').getAttribute('MaxHealth')), 2))
            .setPosition(new Vector2f(
                origin.getX() + 12, origin.getY() - 9
            ));

        Engine.getEntity('GUI/ExperienceFrame')
            .setScale(new Vector2f(6.8, 2))
            .setPosition(new Vector2f(
                origin.getX() - 2, origin.getY() - 27
            ));

        Engine.getEntity('GUI/ExperienceBar')
            .setScale(new Vector2f(6.8, 2))
            .setPosition(new Vector2f(
                origin.getX() + 12, origin.getY() - 21
            ));

        Game.drawSprite(Engine.getEntity('GUI/ExperienceFrame'));
        Game.drawSprite(Engine.getEntity('GUI/ExperienceBar'));
        Game.drawSprite(Engine.getEntity('GUI/HealthFrame'));
        Game.drawSprite(Engine.getEntity('GUI/HealthBar'));

        // Display the tile map for debugging purposes.
        if(engine.getController().getState('TildeKey')){

            let tilePosition = engine.getController().getMousePosition();
            tilePosition.setX(Math.floor(tilePosition.getX() / 16))
                .setY(Math.floor(tilePosition.getY() / 16));

            Engine.rectangle(new Vector2f(0, 0), new Vector2f(Engine.getEntity('Tileset').getAnimation().getFrame().getW(), Engine.getEntity('Tileset').getAnimation().getFrame().getH()), '#000000');
            Game.drawSprite(Engine.getEntity('Tileset'));
            Engine.rectangle(new Vector2f(tilePosition.getX() * 16, tilePosition.getY() * 16), new Vector2f(16, 16), '#ff0000', 1, 'Stroke');
            Engine.text(`X: ${tilePosition.getX()}, Y: ${tilePosition.getY()}, I: ${(tilePosition.getY() * 30) + tilePosition.getX()}`, new Vector2f(5, 14), 8, '#ffffff', 1);
        }
    }
}