import Phaser from 'phaser'
import sky from 'asset/img/sky.png'
import ground from 'asset/img/platform.png'
import dude from 'asset/img/dude.png'
import star from 'asset/img/star.png'

const assets = {
    sky, ground, star
}

console.log('Starting...')

const preload = scene => {
    Object.entries(assets)
        .forEach(([id, path]) => scene.load.image(id, path))

    scene.load.spritesheet('dude', dude, {frameWidth: 32, frameHeight: 48})
}

let cursors
let player
let stars
const create = scene => {
    scene.add.image(400, 300, 'sky')

    let score = 0
    const scoreText = scene.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'})

    const platforms = scene.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    player = scene.physics.add.sprite(100, 450, 'dude')
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    // player.body.setGravityY(3000)
    scene.physics.add.collider(player, platforms)

    stars = scene.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    })

    stars.children.iterate(c =>
        c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)))

    scene.physics.add.collider(stars, platforms)
    scene.physics.add.overlap(player, stars, (p, star) => {
        star.disableBody(true, true)
        score += 10
        scoreText.setText('Score: ' + score)
    }, null, scene)

    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })

    scene.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    })

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    })

    cursors = scene.input.keyboard.createCursorKeys()

    // var particles = this.add.particles('red')
    //
    // var emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: {start: 1, end: 0},
    //     blendMode: 'ADD'
    // })
    //
    // var logo = this.physics.add.image(400, 100, 'logo')
    //
    // logo.setVelocity(100, 200)
    // logo.setBounce(1, 1)
    // logo.setCollideWorldBounds(true)
    //
    // emitter.startFollow(logo)
}

const update = () => {
    if (cursors.left.isDown) {
        player.setVelocityX(-160)

        player.anims.play('left', true)
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160)

        player.anims.play('right', true)
    }
    else {
        player.setVelocityX(0)

        player.anims.play('turn')
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330)
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: {
        preload: function () {
            preload(this)
        },
        create: function () {
            create(this)
        },
        update
    }
}

const game = new Phaser.Game(config)