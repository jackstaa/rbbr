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

 stage1_platforms = [
    { x: 164, y: 43, width: 66, height: 27 },
    { x: 205, y: 151, width: 101, height: 25 },
    { x: 745, y: 230, width: 61, height: 31 },
    { x: 668, y: 332, width: 109, height: 24 },
    { x: 318, y: 374, width: 136, height: 37 },
    { x: 527, y: 543, width: 138, height: 35 },
    { x: 275, y: 742, width: 149, height: 35 },
    { x: 545, y: 934, width: 146, height: 29 },
    { x: 290, y: 1152, width: 163, height: 32 },
    { x: 0, y: 1536, width: 1024, height: 80 }  // Base platform
];
stage2_platforms = [
    { x: 324, y: 63, width: 227, height: 43 },
    { x: 631, y: 182, width: 243, height: 48 },
    { x: 69, y: 228, width: 241, height: 48 },
    { x: 370, y: 294, width: 247, height: 44 },
    { x: 612, y: 433, width: 257, height: 39 },
    { x: 86, y: 479, width: 253, height: 46 },
    { x: 454, y: 586, width: 241, height: 44 },
    { x: 177, y: 744, width: 233, height: 40 },
    { x: 610, y: 795, width: 241, height: 42 },
    { x: 333, y: 927, width: 208, height: 45 },
    { x: 744, y: 983, width: 222, height: 42 },
    { x: 88, y: 1049, width: 218, height: 41 },
    { x: 516, y: 1116, width: 195, height: 42 },
    { x: 188, y: 1240, width: 209, height: 41 },
    { x: 717, y: 1287, width: 203, height: 41 },
    { x: 455, y: 1412, width: 177, height: 41 }
];
  stage3_platforms = [
    { x: 449, y: 43, width: 125, height: 35 },
    { x: 675, y: 233, width: 236, height: 47 },
    { x: 414, y: 370, width: 101, height: 16 },
    { x: 538, y: 372, width: 94, height: 14 },
    { x: 75, y: 527, width: 249, height: 43 },
    { x: 447, y: 677, width: 206, height: 19 },
    { x: 675, y: 678, width: 231, height: 18 },
    { x: 249, y: 713, width: 153, height: 46 },
    { x: 780, y: 895, width: 167, height: 46 },
    { x: 76, y: 944, width: 296, height: 55 },
    { x: 712, y: 976, width: 86, height: 26 },
    { x: 75, y: 1146, width: 201, height: 50 },
    { x: 673, y: 1189, width: 235, height: 18 },
    { x: 447, y: 1190, width: 204, height: 17 },
    { x: 267, y: 1317, width: 135, height: 50 }
];
stage4_platforms = [
    { x: 217, y: 79, width: 175, height: 133 },
    { x: 687, y: 127, width: 107, height: 49 },
    { x: 101, y: 179, width: 87, height: 203 },
    { x: 591, y: 299, width: 123, height: 51 },
    { x: 169, y: 383, width: 77, height: 45 },
    { x: 203, y: 429, width: 107, height: 85 },
    { x: 365, y: 697, width: 103, height: 155 },
    { x: 687, y: 805, width: 337, height: 261 },
    { x: 33, y: 973, width: 303, height: 175 },
    { x: 735, y: 1069, width: 53, height: 307 },
    { x: 259, y: 1149, width: 107, height: 41 },
    { x: 397, y: 1387, width: 277, height: 51 },
    { x: 309, y: 1355, width: 191, height: 47 }
];
  
stage5_platforms = [
    { x: 503, y: 173, width: 71, height: 39 },
    { x: 129, y: 175, width: 97, height: 33 },
    { x: 249, y: 175, width: 45, height: 35 },
    { x: 725, y: 299, width: 243, height: 55 },
    { x: 467, y: 461, width: 127, height: 55 },
    { x: 141, y: 559, width: 111, height: 47 },
    { x: 65, y: 701, width: 103, height: 53 },
    { x: 237, y: 833, width: 107, height: 55 },
    { x: 65, y: 961, width: 195, height: 47 },
    { x: 803, y: 1053, width: 117, height: 57 },
    { x: 415, y: 1135, width: 187, height: 25 },
    { x: 427, y: 1367, width: 165, height: 37 },
    { x: 69, y: 1473, width: 325, height: 43 }
];
stage6_platforms = [
    { x: 369, y: 237, width: 285, height: 37 },
    { x: 139, y: 377, width: 231, height: 43 },
    { x: 645, y: 473, width: 239, height: 43 },
    { x: 227, y: 637, width: 223, height: 41 },
    { x: 501, y: 831, width: 235, height: 43 },
    { x: 207, y: 1067, width: 225, height: 39 },
    { x: 589, y: 1207, width: 233, height: 47 },
    { x: 233, y: 1407, width: 235, height: 41 }
];


}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    event.preventDefault(); // Prevent default browser behavior (scrolling)
    return false; // Stop event propagation
  }
}

// --- Declare persistent state variables outside draw() ---
let hasSwitched = false;
let blockHeight = 1400;
let camCut = 200;
let viewportHeight = 915;

let curBlock = 6032 / 10 - 6000 - camCut;
let nextBlock = curBlock + blockHeight;
let prevBlock = curBlock - blockHeight;

let curBlockEnd = -1 * (curBlock + 590.8);
let curBlockStart = -1 * curBlock;

let camMode = 'curBlock'; // Track current camera mode

function draw() {
  // Clamp current block to canvas bounds
  curBlock = constrain(curBlock, -(6012 - viewportHeight), 0);

  // Smooth camera follow
  cameraOffsetY = lerp(cameraOffsetY, curBlock, 0.1);

  // --- Transition up ---
  if (player.y <= curBlockEnd) {
    prevBlock = curBlock;
    curBlock = nextBlock;
    nextBlock = curBlock + blockHeight/2;

    // Recalculate bounds for new block
    curBlockEnd -= 600;
    curBlockStart -= 600;
  }

  // --- Transition down ---
  if (player.y >= curBlockStart + 100) {
    nextBlock = curBlock;
    curBlock = prevBlock;
    prevBlock = curBlock - blockHeight/2;

    // Recalculate bounds
    curBlockEnd += 600 ;
    curBlockStart += 600;
  }
 
  // Apply camera translation
  push();
  translate(0, cameraOffsetY);

  background(220);
  image(img2, 0, 0, 1020, 6012); // Draw background

  // Draw platforms – goal platforms are highlighted in green
  platforms.forEach(platform => {
    // Set fill color with transparency (alpha = 127 for 50% transparency)
    fill(platform.isGoal ? color(0, 255, 0, 50) : color(100, 100, 100, 127));
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
