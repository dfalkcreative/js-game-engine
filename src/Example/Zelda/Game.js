(function () {
    /**
     * Casts a shadow to an entity.
     *
     * @param payload
     */
    function addShadow(payload) {
        let engine = Engine.getInstance();

        if(payload.getSprite().getAttribute('Health') <= 0){
            return;
        }

        // Generate a scaled size Vector.
        let size = new Vector2f(
            Engine.scale(12),
            Engine.scale(12)
        );

        // Determine the center point.
        let center = new Vector2f(
            payload.getSprite().getCalculatedPosition().getX() + (Engine.scale(15)),
            payload.getSprite().getCalculatedPosition().getY() + (Engine.scale(20))
        );

        // Build the gradient.
        let gradient = engine.getContext().createRadialGradient(
            center.getX(), center.getY() + (size.getY() / 3), Engine.scale(4),
            center.getX(), center.getY() + (size.getY() / 3), size.getX()
        );

        gradient.addColorStop(0, 'rgba(214,180,136,0.5)');
        gradient.addColorStop(1, 'rgba(214,180,136,0)');

        engine.getContext().arc(
            center.getX(), center.getY(),
            0, 0, 2 * Math.PI
        );

        engine.getContext().fillStyle = gradient;
        engine.getContext().fillRect(0, 0, engine.getCanvasWidth(), engine.getCanvasHeight());
    }


    /**
     * Returns the game scene.
     *
     * @returns {Scene}
     */
    function getScene() {
        let world = (new Layer('resources/pack_zelda/zelda_tiles_overworld.png'))
            .slice(new Vector2f(8, 8))
            .setScale(new Vector2f(2, 2));

        // Create the base tile.
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                world.addTile(new Tile(33, new Vector2f(x * 16, y * 16)))
            }
        }

        // Render obstacle trees.
        for (let x = 0; x < 200; x++) {
            world.addTile(
                new Tile(49, new Vector2f(
                    Math.floor(Math.random() * 50) * 16,
                    Math.floor(Math.random() * 50) * 16
                ), true));
        }

        // Render stairs to move the player throughout.
        for (let x = 0; x < 25; x++) {
            world.addTile(
                (new Tile(28, new Vector2f(
                    Math.floor(Math.random() * 50) * 16,
                    Math.floor(Math.random() * 50) * 16
                ))).addEvent('Collide', (payload) => {
                    payload.getEntity().setPosition(
                        new Vector2f(
                            Math.floor(Math.random() * 50 * 16),
                            Math.floor(Math.random() * 50 * 16),
                        )
                    )
                })
            );
        }

        return (new Scene()).addLayer(world);
    }


    /**
     * Returns the player.
     *
     * @returns {Sprite}
     */
    function getPlayer() {
        const engine = Engine.getInstance();

        return (new Sprite())
            .setSolid(true)
            .setScale(new Vector2f(1.8, 1.8))
            .setAttribute('Identifier', 'Player')
            .setAttribute('MaxHealth', 100)
            .setAttribute('Health', 100)
            .addEvent('RenderBefore', addShadow)
            .addEvent('Death', (self) => {
                self.setTimeline(
                    Timeline.create([
                        Sequence.create((value) => {
                            self.setOpacity(value);
                        }).addKeyFrame(new KeyFrame(new Vector2f(1, 0), 1))
                    ])
                ).setSolid(false).setStatic(true);

                Engine.getEntity('Sparkles').setTimeline(
                    Timeline.create([
                        Sequence.create((value) => {
                            if(value <= 0.01){
                                Engine.getEntity('Sparkles').stop();
                            }
                        }).addKeyFrame(new KeyFrame(new Vector2f(1, 0), 2))
                    ])
                ).play();
            })
            .addEvent('Distance', (payload) => {
                if (!engine.getController().getState('LeftShift')) {
                    return;
                }

                if (payload.getEntity().getAttribute('Identifier') !== 'Enemy') {
                    return;
                }

                if (payload.getDistance() < 50 && Engine.getEntity('Player').isFacing(payload.getEntity())) {
                    payload.getEntity()
                        .setAttribute('Health', payload.getEntity().getAttribute('Health', 0) - 20)
                        .getAcceleration()
                        .add(new Vector2f(
                            (payload.getEntity().getPosition().getX() - Engine.getEntity('Player').getPosition().getX()) * 25,
                            (payload.getEntity().getPosition().getY() - Engine.getEntity('Player').getPosition().getY()) * 25
                        ));

                    if (payload.getEntity().getAttribute('Health') <= 0) {
                        payload.getEntity().setVisible(false);
                    }
                }
            })
            .addAnimation('Default', (new Animation('resources/pack_zelda/sprite.png'))
                .addFrame(new Frame(0, 0, 15, 16))
            )
            .addAnimation('WalkDown', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(6)
                .addFrame(new Frame(0, 0, 15, 16))
                .addFrame(new Frame(0, 30, 15, 16))
            )
            .addAnimation('AttackDown', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(16)
                .setLoop(false)
                .addFrame(new Frame(0, 60, 15, 16))
                .addFrame(new Frame(0, 84, 15, 30))
                .addFrame(new Frame(0, 84, 15, 30))
                .addFrame(new Frame(0, 84, 15, 30))
            )
            .addAnimation('WalkRight', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(6)
                .addFrame(new Frame(90, 0, 15, 16))
                .addFrame(new Frame(90, 30, 15, 16))
            )
            .addAnimation('AttackRight', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(16)
                .setLoop(false)
                .addFrame(new Frame(90, 60, 15, 16))
                .addFrame(new Frame(84, 90, 27, 16))
                .addFrame(new Frame(84, 90, 27, 16))
                .addFrame(new Frame(84, 90, 27, 16))
            )
            .addAnimation('WalkUp', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(6)
                .addFrame(new Frame(60, 0, 15, 16))
                .addFrame(new Frame(60, 30, 15, 16))
            )
            .addAnimation('AttackUp', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(16)
                .setLoop(false)
                .addFrame(new Frame(60, 60, 16, 16))
                .addFrame(new Frame(60, 84, 16, 28, new Vector2f(0, -21)))
                .addFrame(new Frame(60, 84, 16, 28, new Vector2f(0, -21)))
                .addFrame(new Frame(60, 84, 16, 28, new Vector2f(0, -21)))
            )
            .addAnimation('WalkLeft', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(6)
                .addFrame(new Frame(30, 0, 15, 16))
                .addFrame(new Frame(30, 30, 15, 16))
            )
            .addAnimation('AttackLeft', (new Animation('resources/pack_zelda/sprite.png'))
                .setRate(16)
                .setLoop(false)
                .addFrame(new Frame(30, 60, 16, 16))
                .addFrame(new Frame(24, 90, 27, 16, new Vector2f(-21, 0)))
                .addFrame(new Frame(24, 90, 27, 16, new Vector2f(-21, 0)))
                .addFrame(new Frame(24, 90, 27, 16, new Vector2f(-21, 0)))
            )
            .setBehavior((self) => {
                if(self.getAttribute('Health') > 0){
                    if (self.getAnimation().getLoop() || !self.getAnimation().isPlaying) {
                        // Display the attack animation.
                        if (engine.getController().getState('LeftShift')) {
                            switch (self.getDirection()) {
                                case 'Down':
                                    self.setAnimation('AttackDown');
                                    break;

                                case 'Right':
                                    self.setAnimation('AttackRight');
                                    break;

                                case 'Up':
                                    self.setAnimation('AttackUp');
                                    break;

                                case 'Left':
                                    self.setAnimation('AttackLeft');
                                    break;
                            }
                        }
                        else {
                            // If not moving and not attacking, display the first directional frame.
                            if (!engine.getController().hasArrowKeyDown()) {
                                switch (self.getDirection()) {
                                    case 'Down':
                                        self.setAnimation('WalkDown')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Right':
                                        self.setAnimation('WalkRight')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Up':
                                        self.setAnimation('WalkUp')
                                            .getAnimation()
                                            .setFrame(0)
                                            .stop();
                                        break;

                                    case 'Left':
                                        self.setAnimation('WalkLeft')
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
                                    .setAnimation('WalkUp')
                                    .setDirection('Up')
                                    .getAcceleration()
                                    .add(new Vector2f(0, -0.2));
                            }

                            if (engine.getController().getState('DownArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setAnimation('WalkDown')
                                    .setDirection('Down')
                                    .getAcceleration()
                                    .add(new Vector2f(0, 0.2));
                            }

                            if (engine.getController().getState('LeftArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setAnimation('WalkLeft')
                                    .setDirection('Left')
                                    .getAcceleration()
                                    .add(new Vector2f(-0.2, 0));
                            }

                            if (engine.getController().getState('RightArrow')) {
                                engine.getScene()
                                    .getEntity('Player')
                                    .setAnimation('WalkRight')
                                    .setDirection('Right')
                                    .getAcceleration()
                                    .add(new Vector2f(0.2, 0));
                            }
                        }
                    }
                }

                // Force player to stay in bounds.
                if (self.getPosition().getX() < 0) {
                    self.getPosition().setX(0);
                }

                if (self.getPosition().getY() < 0) {
                    self.getPosition().setY(0);
                }

                if (self.getPosition().getX() > engine.getScene().getArea().getX()) {
                    self.getPosition().setX(engine.getScene().getArea().getX());
                }

                if (self.getPosition().getX() > engine.getScene().getArea().getY()) {
                    self.getPosition().setX(engine.getScene().getArea().getY());
                }
            });
    }


    /**
     * Returns an enemy instance.
     *
     * @returns {Sprite}
     */
    function getEnemy() {
        return (new Sprite())
            .setScale(new Vector2f(1.8, 1.8))
            .setSolid(true)
            .setAttribute('Identifier', 'Enemy')
            .setAttribute('MaxHealth', 100)
            .setAttribute('Health', 100)
            .setPosition(new Vector2f(64, 64))
            .addEvent('RenderBefore', addShadow)
            .addEvent('Collide', (payload) => {
                if (payload.getEntity().getAttribute('Identifier') === 'Player') {
                    payload.getEntity().setAttribute('Health', payload.getEntity().getAttribute('Health') - 5);

                    if(payload.getEntity().getAttribute('Health') <= 0){
                        payload.getEntity().callEvents('Death', payload.getEntity());
                    }
                }

                if (payload.getEntity().getStatic()) {
                    return;
                }

                payload.getEntity().getAcceleration().add(new Vector2f(
                    (payload.getEntity().getPosition().getX() - payload.getRoot().getPosition().getX()) * 25,
                    (payload.getEntity().getPosition().getY() - payload.getRoot().getPosition().getY()) * 25
                ));
            })
            .addAnimation('Default', (new Animation('resources/pack_zelda/enemies.png'))
                .addFrame(new Frame(0, 180, 16, 16))
            )
            .addAnimation('WalkDown', (new Animation('resources/pack_zelda/enemies.png'))
                .setRate(6)
                .addFrame(new Frame(0, 180, 16, 16))
                .addFrame(new Frame(0, 210, 16, 16))
            )
            .addAnimation('WalkLeft', (new Animation('resources/pack_zelda/enemies.png'))
                .setRate(6)
                .addFrame(new Frame(30, 180, 16, 16))
                .addFrame(new Frame(30, 210, 16, 16))
            )
            .addAnimation('WalkUp', (new Animation('resources/pack_zelda/enemies.png'))
                .setRate(6)
                .addFrame(new Frame(60, 180, 16, 16))
                .addFrame(new Frame(60, 210, 16, 16))
            )
            .addAnimation('WalkRight', (new Animation('resources/pack_zelda/enemies.png'))
                .setRate(6)
                .addFrame(new Frame(90, 180, 16, 16))
                .addFrame(new Frame(90, 210, 16, 16))
            )
            .setBehavior((self) => {
                // Handle enemy movement.
                self.getAcceleration().add(new Vector2f(
                    (Engine.getEntity('Player').getCalculatedCenter().getX() - self.getCalculatedCenter().getX()) * 0.001,
                    (Engine.getEntity('Player').getCalculatedCenter().getY() - self.getCalculatedCenter().getY()) * 0.001
                ));

                if (Math.abs(self.getAcceleration().getX()) > Math.abs(self.getAcceleration().getY())) {
                    self.setDirection(
                        self.getAcceleration().getX() > 0 ? 'Right' : 'Left'
                    );
                }
                else {
                    self.setDirection(
                        self.getAcceleration().getY() > 0 ? 'Down' : 'Up'
                    );
                }

                switch (self.getDirection()) {
                    case 'Up':
                        self.setAnimation('WalkUp');
                        break;

                    case 'Down':
                        self.setAnimation('WalkDown');
                        break;

                    case 'Left':
                        self.setAnimation('WalkLeft');
                        break;

                    case 'Right':
                        self.setAnimation('WalkRight');
                        break;
                }
            });
    }


    /**
     * Instantiate the engine.
     */
    new Engine((engine) => {
        engine.setScene(getScene());

        // Add a dummy emitter.
        engine.getScene()
            .addEntity('Emitter', (new Emitter((self) => {
                let cloned = Engine.getEntity('Enemy').clone();

                cloned.getPosition()
                    .setX(self.getPosition().getX())
                    .setY(self.getPosition().getY());

                return new Particle(
                    cloned.setAttribute('Health', cloned.getAttribute('MaxHealth'))
                );
            })).setPosition(new Vector2f(25, 25)).setVisible(false));

        engine.getScene()
            .addEntity('Ball',
                (new Sprite('resources/pack_zelda/zelda_tiles_overworld.png', new Frame(112, 72, 8, 8)))
                    .setVisible(false)
            );

        engine.getScene()
            .addEntity('Sparkles', (new Emitter((self) => {
                let cloned = Engine.getEntity('Ball').clone();
                let scale = Math.random() + 0.2;

                cloned.setVisible(true)
                    .setScale(new Vector2f(scale, scale))
                    .setOpacity(0)
                    .getPosition()
                    .setX(Engine.getEntity('Player').getPosition().getX() + ((Math.random() - 0.5) * 32))
                    .setY(Engine.getEntity('Player').getPosition().getY() + ((Math.random() - 0.5) * 32));

                cloned.setTimeline(
                    Timeline.create([
                        Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(value, 0)))
                            .addKeyFrame(new KeyFrame(new Vector2f(0, Math.random() - 0.5), 2)),

                        Sequence.create((value) => cloned.getAcceleration().add(new Vector2f(0, value)))
                            .addKeyFrame(new KeyFrame(new Vector2f(0, Math.random() - 0.5), 2)),

                        Sequence.create((value) => cloned.setOpacity(value))
                            .addKeyFrame(new KeyFrame(new Vector2f(0, 1), 0.2))
                            .addKeyFrame(new KeyFrame(new Vector2f(1, 1), 1.3))
                            .addKeyFrame(new KeyFrame(new Vector2f(1, 0), 0.5))
                    ])
                );

                return new Particle(cloned,
                    cloned.getTimeline().getDurationInMilliseconds()
                );
            }, 10, 100)));

        // Load the sprite sheet.
        engine.getScene()
            .addEntity('Player', getPlayer())
            .addEntity('Enemy', getEnemy());

        // Add a linked sprite camera.
        engine.getScene()
            .addCamera('Default', (new Camera()
                .setSprite(Engine.getEntity('Player')))
                .setZoom(3)
            );
    }, (engine) => {
        engine.getScene().getCamera().setZoom(
            engine.getController().getState('Space') ? 4 : 2
        );

        // For controls that should act as a single fire, we'll immediately remove the active state.
        engine.getController().setState('LeftShift', false);

        // Write text.
        Engine.text(`Player: ${engine.getScene()
            .getEntity('Player').getAttribute('Health')}/${engine.getScene()
            .getEntity('Player').getAttribute('MaxHealth')}`, new Vector2f(24, 48));
    });
})();