// Initialize stuff
let player;
let platforms;
let gameState;
let resetButton;
let jumpTimer = 0;
const maxJumpTime = 1000; // Maximum jump charge time
const walkSpeed = 3; // Speed of walking movement (pixels per frame)
let bufferedDirection = 0;
let jumpCooldown = 0; // Timer for jump direction cooldown (ms)
let img, img2, jumpImg;

function preload() {
  img = loadImage("ryan.png");
  img2 = loadImage("811.png");
  jumpImg = loadImage("ryan_jump.png"); // Load jump sprite
}

function setup() {
  let canvas = createCanvas(1080, 5760);
  // canvas.parent('sketch-holder'); // kept for potential legacy use
  initializeGame();
  
  // Create reset button
  resetButton = createButton('Reset Game');
  resetButton.position(width - 1080, height + 10);
  resetButton.mousePressed(resetGame);
}

function initializeGame() {
  // Initialize game state
  gameState = {
    isJumping: false,
    jumpPower: 0,
    maxJumpPower: 20,
    jumpDirection: null,
    gameOver: false
  };
  
  // Set up player with previous position fields for robust collision detection
  player = {
    x: width / 2,
    y: height - 64,
    prevX: width / 2,
    prevY: height - 64,
    width: 64,
    height: 64,
    velocityY: 0,
    velocityX: 0,
    grounded: true
  };

  // Define the platforms. One platform has an extra property isGoal.
  platforms = [
  { x: 205, y: 5533, width: 69, height: 69 },
  { x: 750, y: 5280, width: 69, height: 69 },
  { x: 1020, y: 5030, width: 69, height: 69 },
  { x: 545, y: 4830, width: 69, height: 69 },
  { x: 410, y: 4630, width: 69, height: 69 },
  { x: 140, y: 4640, width: 69, height: 69 },
  { x: 410, y: 4320, width: 69, height: 69 },
  { x: 140, y: 4255, width: 69, height: 69 },
  { x: 810, y: 4035, width: 69, height: 69 },
  { x: 410, y: 3650, width: 69, height: 69 },
  { x: 70, y: 3405, width: 69, height: 69 },
  { x: 410, y: 3080, width: 69, height: 69 },
  { x: 0, y: 5760, width: 1080, height: 80 }  // Base platform
];
}

function draw() {
  background(220);
  image(img2, 0, 0, 1080, 5760); // Draw background

  // Draw platforms – goal platforms are highlighted in green
  platforms.forEach(platform => {
    // Set fill color with transparency (alpha = 127 for 50% transparency)
    fill(platform.isGoal ? color(0, 255, 0, 127) : color(100, 100, 100, 127));
    rect(platform.x, platform.y, platform.width, platform.height);
  });

  // Update previous position for collision detection
  player.prevX = player.x;
  player.prevY = player.y;

  // Handle user input for jump charging and walking
  handleJump();      // Handles charging jump and launching when space is released
  handleWalking();   // Handles walking left or right when grounded
  // handleAirControl(); // Disabled to prevent movement keys in mid-air

  // Update jump cooldown when grounded and not charging jump
  if (player.grounded && jumpTimer === 0) {
    jumpCooldown += deltaTime;
    if (jumpCooldown >= 1000) { // Clear bufferedDirection after 1 second
      bufferedDirection = 0;
    }
  }

  // Apply gravity if not grounded
  applyGravity();

  // Update player position using current velocity values
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Check collisions against platforms and walls
  checkPlatformCollisions();
  checkWallCollisions();

  // Draw the player with appropriate sprite based on grounded state
  if (player.grounded) {
    image(img, player.x, player.y, player.width, player.height); // Idle sprite when grounded
  } else {
    image(jumpImg, player.x, player.y, player.width, player.height); // Jump sprite when in air
  }

  // Check for win condition
  checkWinCondition();
}

// Apply gravity only when the player is not on a platform
function applyGravity() {
  if (!player.grounded) {
    player.velocityY += 0.5;
  } else {
    player.velocityY = 0;
  }
}

// Handle jump charging and launching when the spacebar is released.
// Also supports both A/D and LEFT/RIGHT arrow keys for horizontal influence at jump time.
function handleJump() {
  // When the spacebar is held, charge the jump and update the buffered direction.
  if (keyIsDown(32)) { // 32 is the key code for space
    jumpTimer += deltaTime;
    jumpTimer = min(jumpTimer, maxJumpTime);
    jumpCooldown = 0; // Reset cooldown while charging jump

    // Update buffered direction for jumping: only set if directional keys are pressed
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A key or left arrow
      bufferedDirection = -1;
    } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D key or right arrow
      bufferedDirection = 1;
    }
    // If neither left nor right is pressed, keep the last buffered value.
  } else {
    // When space is released, and the player is on the ground, execute the jump.
    if (jumpTimer > 0 && player.grounded) {
      // Map the charge time to jump power (up to gameState.maxJumpPower)
      const jumpPower = map(jumpTimer, 0, maxJumpTime, 0, gameState.maxJumpPower);
      let xVelocity = 0;
      if (bufferedDirection === -1) {
        xVelocity = -5;
      } else if (bufferedDirection === 1) {
        xVelocity = 5;
      }

      // Apply the jump: set vertical and horizontal velocities,
      // then mark the player as no longer grounded.
      player.velocityY = -jumpPower;
      player.velocityX = xVelocity;
      player.grounded = false;
      jumpCooldown = 0; // Reset cooldown after jump
    }
    // Reset the jump timer after releasing space, but preserve bufferedDirection
    jumpTimer = 0;
  }
}

// Handle walking left or right when grounded and not holding the spacebar
function handleWalking() {
  if (player.grounded && !keyIsDown(32)) { // Only walk when grounded and spacebar is not held
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A key or left arrow
      player.velocityX = -walkSpeed;
    } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D key or right arrow
      player.velocityX = walkSpeed;
    } else {
      player.velocityX = 0; // Stop moving if no directional keys are pressed
    }
  } else if (keyIsDown(32)) {
    // Explicitly prevent walking movement when spacebar is held
    if (player.grounded) {
      player.velocityX = 0;
    }
  }
}

// Disabled to prevent movement keys affecting player in mid-air
/*
function handleAirControl() {
  if (!player.grounded) {
    // Adjust horizontal velocity gradually
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      player.velocityX -= 0.2;
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      player.velocityX += 0.2;
    }
    // Constrain horizontal speed to a maximum value
    player.velocityX = constrain(player.velocityX, -5, 5);
  }
}
*/

// Reverse velocity on wall collisions and clamp the player's position within the canvas.
function checkWallCollisions() {
  // Left wall collision
  if (player.x < 0) {
    player.x = 0;
    player.velocityX = -player.velocityX;
  }
  // Right wall collision
  if (player.x + player.width > width) {
    player.x = width - player.width;
    player.velocityX = -player.velocityX;
  }
}

// Improved platform collision detection using player's previous position.
// This handles both landing collisions and head collisions reliably even at high speeds.
function checkPlatformCollisions() {
  // Assume not grounded until a collision is detected.
  player.grounded = false;

  platforms.forEach(platform => {
    // Check for horizontal overlap first.
    const isHorizontallyOverlapping =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    if (isHorizontallyOverlapping) {
      // LANDING COLLISION:
      // If falling (velocityY >= 0) and the bottom of the player crossed the platform's top between frames.
      if (player.velocityY >= 0 &&
          player.prevY + player.height <= platform.y &&
          player.y + player.height >= platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
        // Only reset horizontal speed if the player was falling (i.e., not walking)
        if (player.velocityY > 0) {
          player.velocityX = 0;
        }
      }

      // HEAD COLLISION:
      // If ascending (velocityY < 0) and the top of the player crosses the platform's bottom.
      if (player.velocityY < 0 &&
          player.prevY >= platform.y + platform.height &&
          player.y <= platform.y + platform.height) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  });

  // Bottom boundary check (in case the player falls off the screen).
  if (player.y + player.height > height) {
    resetGame();
  }
}

// Check if the player has landed on the designated goal platform.
function checkWinCondition() {
  const goalPlatform = platforms.find(p => p.isGoal);
  if (goalPlatform &&
      player.grounded &&
      player.y + player.height <= goalPlatform.y + 5 && // allow a small margin
      player.x + player.width > goalPlatform.x &&
      player.x < goalPlatform.x + goalPlatform.width) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
    noLoop(); // Stop the game loop
  }
}

// Reset game by reinitializing game objects and variables
function resetGame() {
  initializeGame();
  jumpCooldown = 0; // Reset cooldown on game reset
  loop(); // Restart the game loop in case it was stopped
}
