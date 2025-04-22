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
let cameraOffsetY = 0; // Camera offset for following player
let img, img2, jumpImg;

function preload() {
  img = loadImage("ryan.png");
  img2 = loadImage("bg.png");
  jumpImg = loadImage("ryan_jump.png"); // Load jump sprite
}

function setup() {
  let canvas = createCanvas(1020, 6012);
  canvas.parent('sketch-holder'); // Attach canvas to #sketch-holder
  initializeGame();
  
  // Create reset button
  resetButton = createButton('Reset Game');
  resetButton.position(width - 1020, height + 10);
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
    { x: 402, y: 226, width: 226, height: 32, isGoal: true},
    { x: 88, y: 405, width: 279, height: 170 },
    { x: 602, y: 548, width: 296, height: 173 },
    { x: 420, y: 830, width: 58, height: 52 },
    { x: 123, y: 857, width: 97, height: 88 },
    { x: 270, y: 1136, width: 85, height: 79 },
    { x: 514, y: 1291, width: 70, height: 76 },
    { x: 358, y: 1376, width: 79, height: 64 },
    { x: 555, y: 1585, width: 38, height: 46 },
    { x: 243, y: 1629, width: 44, height: 35 },
    { x: 320, y: 1761, width: 41, height: 14 },
    { x: 728, y: 1776, width: 232, height: 55 },
    { x: 470, y: 1940, width: 120, height: 55 },
    { x: 141, y: 2031, width: 102, height: 52 },
    { x: 655, y: 2107, width: 293, height: 26 },
    { x: 67, y: 2178, width: 94, height: 55 },
    { x: 232, y: 2310, width: 111, height: 49 },
    { x: 55, y: 2433, width: 199, height: 52 },
    { x: 799, y: 2530, width: 117, height: 55 },
    { x: 414, y: 2586, width: 185, height: 17 },
    { x: 743, y: 2630, width: 76, height: 26 },
    { x: 167, y: 2671, width: 99, height: 14 },
    { x: 76, y: 2803, width: 26, height: 17 },
    { x: 194, y: 2803, width: 55, height: 20 },
    { x: 426, y: 2847, width: 158, height: 26 },
    { x: 111, y: 2888, width: 138, height: 17 },
    { x: 658, y: 2906, width: 273, height: 17 },
    { x: 390, y: 3003, width: 232, height: 8 },
    { x: 173, y: 3061, width: 52, height: 17 },
    { x: 208, y: 3164, width: 97, height: 23 },
    { x: 749, y: 3243, width: 49, height: 23 },
    { x: 673, y: 3349, width: 99, height: 20 },
    { x: 326, y: 3396, width: 126, height: 26 },
    { x: 537, y: 3560, width: 123, height: 23 },
    { x: 282, y: 3763, width: 135, height: 20 },
    { x: 549, y: 3951, width: 138, height: 29 },
    { x: 778, y: 4159, width: 58, height: 26 },
    { x: 293, y: 4168, width: 155, height: 23 },
    { x: 79, y: 4274, width: 61, height: 61 },
    { x: 532, y: 4347, width: 26, height: 11 },
    { x: 643, y: 4444, width: 120, height: 73 },
    { x: 490, y: 4623, width: 38, height: 41 },
    { x: 676, y: 4782, width: 235, height: 44 },
    { x: 414, y: 4914, width: 94, height: 17 },
    { x: 76, y: 5072, width: 246, height: 44 },
    { x: 464, y: 5146, width: 26, height: 11 },
    { x: 249, y: 5260, width: 149, height: 41 },
    { x: 652, y: 5260, width: 11, height: 49 },
    { x: 781, y: 5439, width: 164, height: 46 },
    { x: 76, y: 5489, width: 293, height: 52 },
    { x: 711, y: 5521, width: 85, height: 20 },
    { x: 76, y: 5692, width: 199, height: 46 },
    { x: 676, y: 5736, width: 229, height: 11 },
    { x: 558, y: 5812, width: 26, height: 17 },
    { x: 270, y: 5865, width: 129, height: 44 },
    { x: 0, y: 6012, width: 1020, height: 80 }  // Base platform
];

}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    event.preventDefault(); // Prevent default browser behavior (scrolling)
    return false; // Stop event propagation
  }
}

function draw() {
// Calculate desired camera offset to center player's midpoint in viewport
  let targetOffsetY = height / 2 - player.y - player.height / 2;
  // Get viewport height (fallback to 720 if windowHeight unavailable)
  let viewportHeight = windowHeight || 720;
  // Clamp offset to keep canvas bounds in view (0 to 6012)
  targetOffsetY = constrain(targetOffsetY, -(6012 - viewportHeight), 0);
  // Smoothly interpolate camera position
  cameraOffsetY = lerp(cameraOffsetY, targetOffsetY, 0.1);

  // Apply camera translation
  push();
  translate(0, cameraOffsetY);

  background(220);
  image(img2, 0, 0, 1020, 6012); // Draw background

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

  // End camera translation
  pop();

  // Draw UI elements (e.g., win message) in screen coordinates
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
    text("YOU WIN!", width / 2, height / 2 - cameraOffsetY); // Adjust for camera
    noLoop(); // Stop the game loop
  }
}

// Reset game by reinitializing game objects and variables
function resetGame() {
  initializeGame();
  jumpCooldown = 0; // Reset cooldown on game reset
  cameraOffsetY = 0; // Reset camera position
  loop(); // Restart the game loop in case it was stopped
}
