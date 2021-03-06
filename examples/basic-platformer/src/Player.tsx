import React, { useMemo, useState, useRef } from 'react'
import {
  ArcadeSprite,
  ArcadeCollider,
  useScene,
  useGameEvent,
  useGameLoop,
} from 'react-phaser-fiber'

export default function Player(props: { x: number; y: number }) {
  const scene = useScene()
  const ref = useRef<Phaser.Physics.Arcade.Sprite>(null)

  const keys = useMemo(
    () => ({
      left: scene.input.keyboard.addKey('left'),
      right: scene.input.keyboard.addKey('right'),
      up: scene.input.keyboard.addKey('up'),
    }),
    [scene.input.keyboard]
  )

  const [velocityX, setVelocityX] = useState(0)
  const [velocityY, setVelocityY] = useState(0)
  const [animation, setAnimation] = useState('turn')

  const animations = useMemo<Phaser.Types.Animations.Animation[]>(
    () => [
      {
        key: 'left',
        frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      },
      {
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
      },
      {
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      },
    ],
    [scene.anims]
  )

  // keep our velocityX state in sync with the current velocityX of the instance
  useGameEvent('prestep', () => {
    if (ref.current?.body) {
      setVelocityX(ref.current.body.velocity.x)
      setVelocityY(ref.current.body.velocity.y)
    }
  })

  useGameLoop(() => {
    // horizontal movement
    if (keys.left.isDown) {
      setVelocityX(-160)
      setAnimation('left')
    } else if (keys.right.isDown) {
      setVelocityX(160)
      setAnimation('right')
    } else {
      setVelocityX(0)
      setAnimation('turn')
    }

    // jump if on ground
    if (keys.up.isDown && ref.current?.body.touching.down) {
      setVelocityY(-330)
    }
  })

  return (
    <ArcadeSprite
      {...props}
      ref={ref}
      name="player"
      animations={animations}
      animation={animation}
      texture="dude"
      collideWorldBounds
      velocityX={velocityX}
      velocityY={velocityY}
    >
      <ArcadeCollider with="platform" />
    </ArcadeSprite>
  )
}
