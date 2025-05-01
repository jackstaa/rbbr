// Global variables
let player;
let platforms;
let gameState;
let resetButton;
let jumpTimer = 0;
const maxJumpTime = 1000;
const walkSpeed = 3;
let bufferedDirection = 0;
let jumpCooldown = 0;
let img, img2, jumpImg, walkingLeftImg, walkingRightImg;
let stages, currentStageIndex;
let items, itemsCollected;

// Platform definitions
let stage1_platforms = [
  { x: 164, y: 43, width: 66, height: 27 },
  { x: 205, y: 151, width: 101, height: 25 },
  { x: 745, y: 230, width: 61, height: 31 },
  { x: 668, y: 332, width: 109, height: 24 },
  { x: 318, y: 374, width: 136, height: 37 },
  { x: 527, y: 543, width: 138, height: 35 },
  { x: 275, y: 742, width: 149, height: 35 },
  { x: 545, y: 934, width: 146, height: 29 },
  { x: 290, y: 1152, width: 163, height: 32 },
  { x: 0, y: 1530, width: 1020, height: 50 } // Adjusted base platform
];
let stage2_platforms = [
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
let stage3_platforms = [
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
let stage4_platforms = [
    { x: 214, y: 82, width: 119, height: 23 },
    { x: 224, y: 110, width: 105, height: 27 },
    { x: 686, y: 130, width: 107, height: 47 },
    { x: 334, y: 133, width: 12, height: 2 },
    { x: 246, y: 140, width: 99, height: 23 },
    { x: 246, y: 170, width: 143, height: 43 },
    { x: 100, y: 178, width: 79, height: 161 },
    { x: 590, y: 302, width: 121, height: 43 },
    { x: 126, y: 342, width: 59, height: 37 },
    { x: 172, y: 386, width: 71, height: 37 },
    { x: 212, y: 430, width: 93, height: 33 },
    { x: 286, y: 468, width: 24, height: 2 },
    { x: 204, y: 470, width: 77, height: 39 },
    { x: 422, y: 702, width: 51, height: 27 },
    { x: 408, y: 734, width: 55, height: 31 },
    { x: 380, y: 770, width: 81, height: 37 },
    { x: 850, y: 808, width: 173, height: 43 },
    { x: 364, y: 812, width: 59, height: 35 },
    { x: 852, y: 856, width: 41, height: 73 },
    { x: 776, y: 934, width: 115, height: 45 },
    { x: 730, y: 974, width: 87, height: 49 },
    { x: 32, y: 976, width: 207, height: 47 },
    { x: 686, y: 1028, width: 97, height: 41 },
    { x: 154, y: 1030, width: 69, height: 31 },
    { x: 216, y: 1066, width: 73, height: 37 },
    { x: 740, y: 1074, width: 45, height: 301 },
    { x: 238, y: 1106, width: 95, height: 45 },
    { x: 258, y: 1152, width: 105, height: 35 },
    { x: 309, y: 1355, width: 191, height: 47 }
];
let stage5_platforms = [
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
let stage6_platforms = [
  { x: 369, y: 240, width: 285, height: 37, isGoal: true }, // Goal platform
  { x: 139, y: 377, width: 231, height: 43 },
  { x: 645, y: 473, width: 239, height: 43 },
  { x: 227, y: 637, width: 223, height: 41 },
  { x: 501, y: 831, width: 235, height: 43 },
  { x: 207, y: 1067, width: 225, height: 39 },
  { x: 589, y: 1207, width: 233, height: 47 },
  { x: 233, y: 1407, width: 235, height: 41 }
];

function preload() {
  img = loadImage("ryan.png");
  jumpImg = loadImage("ryan_jump.png");
  walkingLeftImg = loadImage("WALKING_LEFT.gif");
  walkingRightImg = loadImage("WALKING_RIGHT.gif");

  // Load stage backgrounds
  let stageBackgrounds = [];
  stageBackgrounds[0] = loadImage("start.png");
  stageBackgrounds[1] = loadImage("parking.png");
  stageBackgrounds[2] = loadImage("seven.png");
  stageBackgrounds[3] = loadImage("alley.png");
  stageBackgrounds[4] = loadImage("liquor.png");
  stageBackgrounds[5] = loadImage("heaven.png");

  // Define stages
  stages = [
    { background: stageBackgrounds[0], platforms: stage1_platforms },
    { background: stageBackgrounds[1], platforms: stage2_platforms },
    { background: stageBackgrounds[2], platforms: stage3_platforms },
    { background: stageBackgrounds[3], platforms: stage4_platforms },
    { background: stageBackgrounds[4], platforms: stage5_platforms },
    { background: stageBackgrounds[5], platforms: stage6_platforms }
  ];

  // Load item images
  let itemImages = [];
  itemImages[0] = loadImage("coke.png");
  itemImages[1] = loadImage("henny.png");
  itemImages[2] = loadImage("beer.png");
  itemImages[3] = loadImage("ports.png");

  // Define items (positioned in mid-air)
  items = [
    { stageIndex: 3, x: 500, y: 200, width: 50, height: 50, image: itemImages[0], collected: false },
    { stageIndex: 4, x: 400, y: 300, width: 50, height: 50, image: itemImages[1], collected: false },
    { stageIndex: 2, x: 500, y: 400, width: 50, height: 50, image: itemImages[2], collected: false },
    { stageIndex: 5, x: 50, y: 560, width: 50, height: 50, image: itemImages[3], collected: false }
  ];
}

function setup() {
  let canvas = createCanvas(1020, 1530);
  canvas.parent('sketch-holder');
  initializeGame();

  resetButton = createButton('Reset Game');
  resetButton.position(width - 1020, height + 10);
  resetButton.mousePressed(resetGame);
}

function initializeGame() {
  gameState = {
    isJumping: false,
    jumpPower: 0,
    maxJumpPower: 20,
    jumpDirection: null,
    gameOver: false
  };

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

  currentStageIndex = 0;
  platforms = stages[currentStageIndex].platforms;
  itemsCollected = 0;
  items.forEach(item => item.collected = false);
}

function keyPressed() {
  if (keyCode === 32) {
    event.preventDefault();
    return false;
  }
}

function draw() {
  // Stage switching
  if (player.y < 0 && currentStageIndex < 5) {
    currentStageIndex++;
    platforms = stages[currentStageIndex].platforms;
    player.y = 1500 - player.height;
    player.grounded = false;
  } else if (player.y > 1530 && currentStageIndex > 0) {
    currentStageIndex--;
    platforms = stages[currentStageIndex].platforms;
    player.y = 0;
    player.grounded = false;
  } else if (player.y > 1530 && currentStageIndex === 0) {
    resetGame();
  }

  background(220);
  image(stages[currentStageIndex].background, 0, 0, 1020, 1530);

platforms.forEach(platform => {
  fill(0, 0, 0, 0);
  noStroke();
  rect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw items
  items.forEach(item => {
    if (item.stageIndex === currentStageIndex && !item.collected) {
      image(item.image, item.x, item.y, item.width, item.height);
    }
  });

  player.prevX = player.x;
  player.prevY = player.y;

  handleJump();
  handleWalking();

  if (player.grounded && jumpTimer === 0) {
    jumpCooldown += deltaTime;
    if (jumpCooldown >= 1000) {
      bufferedDirection = 0;
    }
  }

  applyGravity();
  player.x += player.velocityX;
  player.y += player.velocityY;

  checkPlatformCollisions();
  checkWallCollisions();
  checkItemCollisions();

  // Draw player with walking animations
  if (player.grounded) {
    if (player.velocityX < 0) {
      image(walkingLeftImg, player.x, player.y, player.width, player.height);
    } else if (player.velocityX > 0) {
      image(walkingRightImg, player.x, player.y, player.width, player.height);
    } else {
      image(img, player.x, player.y, player.width, player.height);
    }
  } else {
    image(jumpImg, player.x, player.y, player.width, player.height);
  }

  checkWinCondition();
}

function applyGravity() {
  if (!player.grounded) {
    player.velocityY += 0.5;
  } else {
    player.velocityY = 0;
  }
}

function handleJump() {
  if (keyIsDown(32)) {
    jumpTimer += deltaTime;
    jumpTimer = min(jumpTimer, maxJumpTime);
    jumpCooldown = 0;

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      bufferedDirection = -1;
    } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      bufferedDirection = 1;
    }
  } else {
    if (jumpTimer > 0 && player.grounded) {
      const jumpPower = map(jumpTimer, 0, maxJumpTime, 0, gameState.maxJumpPower);
      let xVelocity = 0;
      if (bufferedDirection === -1) xVelocity = -5;
      else if (bufferedDirection === 1) xVelocity = 5;

      player.velocityY = -jumpPower;
      player.velocityX = xVelocity;
      player.grounded = false;
      jumpCooldown = 0;
    }
    jumpTimer = 0;
  }
}

function handleWalking() {
  if (player.grounded && !keyIsDown(32)) {
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      player.velocityX = -walkSpeed;
    } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      player.velocityX = walkSpeed;
    } else {
      player.velocityX = 0;
    }
  } else if (keyIsDown(32)) {
    if (player.grounded) player.velocityX = 0;
  }
}

function checkWallCollisions() {
  if (player.x < 0) {
    player.x = 0;
    player.velocityX = -player.velocityX;
  }
  if (player.x + player.width > width) {
    player.x = width - player.width;
    player.velocityX = -player.velocityX;
  }
}

function checkPlatformCollisions() {
  player.grounded = false;

  platforms.forEach(platform => {
    const isHorizontallyOverlapping =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    if (isHorizontallyOverlapping) {
      if (player.velocityY >= 0 &&
          player.prevY + player.height <= platform.y &&
          player.y + player.height >= platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
        if (player.velocityY > 0) player.velocityX = 0;
      }
      if (player.velocityY < 0 &&
          player.prevY >= platform.y + platform.height &&
          player.y <= platform.y + platform.height) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  });
}

function checkItemCollisions() {
  items.forEach(item => {
    if (item.stageIndex === currentStageIndex && !item.collected) {
      if (player.x < item.x + item.width &&
          player.x + player.width > item.x &&
          player.y < item.y + item.height &&
          player.y + player.height > item.y) {
        item.collected = true;
        itemsCollected++;
      }
    }
  });
}

function checkWinCondition() {
  const goalPlatform = platforms.find(p => p.isGoal);
  if (goalPlatform &&
      player.grounded &&
      itemsCollected === 4 &&
      player.y + player.height <= goalPlatform.y + 5 &&
      player.x + player.width > goalPlatform.x &&
      player.x < goalPlatform.x + goalPlatform.width) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("THANK YOU FOR GUIDING RYAN TO HEAVEN", width / 2, height / 2);
    noLoop();
  }
}

function resetGame() {
  initializeGame();
  jumpCooldown = 0;
  loop();
}
