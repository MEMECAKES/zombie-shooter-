var bg,bgImg;
var player, shooterImg, shooter_shooting;
var bullet,bulletGroup,bulletImg;
var bullets= 100;
var zombie,zombieImg,zombieGroup;
var gameState="fight";
var life=1;
var heart,heartImg;
var loseSound, winSound, explosion;
var score=0;
var restartImg, restart;


function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  bulletImg = loadImage("assets/bullet.png")
  zombieImg = loadImage("assets/zombie2.png")
  heartImg = loadImage("assets/heart_1.png")
  restartImg = loadImage("assets/restart.png")

  bgImg = loadImage("assets/bg.jpeg")

  loseSound = loadSound("assets/lose.mp3")
  winSound = loadSound("assets/win.mp3")
  explosion = loadSound("assets/explosion.mp3")


}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)
   
   //creating sprite for heart
   heart = createSprite(displayWidth-200,50,20,20);
   heart.addImage(heartImg)
   heart.scale=0.4

  restart = createSprite(displayWidth/2,500);
  restart.addImage(restartImg)
  restart.visible = false

   bulletGroup = new Group();
   zombieGroup = new Group();


}

function draw() {
  background(180); 

  if (gameState ==="fight") {

      //moving the player up and down and making the game mobile compatible using touches
    if(keyIsDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
      touches = [];
    }
    if(keyIsDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30
    touches = [];
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space") || touches.length > 0){
    
      bullet = createSprite(displayWidth-1150, player.y-30,20,10);
      bullet.addImage(bulletImg);
      bullet.velocityX=20;
      bullet.scale=0.2
      bulletGroup.add(bullet);
      player.addImage(shooter_shooting)
      bullets=bullets-1;
      touches = [];
    
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }

    if (bullets===0) {
      //change game  state
        gameState="bullet"
         //play the lose sound
        loseSound.play();
     
    }
    if (zombieGroup.isTouching(bulletGroup)) {
      for (let i = 0; i<zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          explosion.play();
          score=score+2
        }
      
      }
    }
    if (zombieGroup.isTouching(player)) {
      loseSound.play();
      for (let i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(player)) {
          zombieGroup[i].destroy();
          life=life-1
          gameState="lost";
        }
        
      }
    }

    enemy();
    drawSprites();
    textSize(20);
    fill("white")
    text("Bullets = "+bullets,displayWidth-210,displayHeight/2-250);
    text("Score = "+score,displayWidth-200,displayHeight/2-220);
  }
  
  else if(gameState ==="bullet"){
    textSize(50);
    fill("yellow");
    text("You ran out of Ammo!",470,410);
    zombieGroup.destroyEach();
    player.visible = false;
    bulletGroup.destroyEach();
  }//closing off gameState bullet
  else if (gameState ==="lost") {
    restart.visible = true
    drawSprites();
    textSize(100);
    fill("red");
    text("You Lost!",400,400);
    textSize(50);
    text("Click The Restart Button To Start Again", 300,450);
   
    zombieGroup.destroyEach();
    player.visible = false;

    if(mousePressedOver(restart) || touches.length > 0){
      score = 0;
      bullets = 100;
      life = 1;
      restart.visible = false;
      gameState = "fight";
      player.visible = true;
      touches = [];
    }
    
  }
}
function enemy() {
  if (frameCount % 50 ===0) {
    zombie = createSprite(random(500,11000),random(100,500),40,40);
    zombie.addImage(zombieImg);
    zombie.velocityX=-3;
    zombie.scale=0.2
    zombie.lifeTime=400
    zombieGroup.add(zombie);
  }
}


