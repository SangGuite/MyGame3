var PLAY=1;
var END=0;
var gameState=PLAY;
var horse,horseIMG,horseJump;
var ground,background,backgroundIMG,gallop;
var carrot,carrotIMG,carrotGroup;
var score,scoreSound;
var arrow,arrowIMG,arrowGroup;
var ice,iceIMG,iceGroup;
var stillHorse;
var Arc,ArcIMG;
var laserIMG,laserGroup,laserSound;
var goblin,goblinIMG,goblinGroup;
var gameOver;
var restartIMG,restartGroup;

function preload() {
  horseRun=loadAnimation("Horse1.png","Horse2.png","Horse3.png","Horse4.png","Horse5.png","Horse6.png","Horse7.png","Horse8.png",
  "Horse9.png","Horse10.png","Horse11.png","Horse12.png");
  backgroundIMG=loadImage("jungle.jpg");
  gallop=loadSound("Galloping Horse.mp3");
  carrotIMG=loadImage("Carrot.png");
  arrowIMG=loadImage("arrow.png");
  iceIMG=loadImage("ice rock.png");
  stillHorse=loadAnimation("still horse.png");
  ArcIMG=loadImage("alien2.png");
  laserIMG=loadImage("laser.png");
  goblinIMG=loadImage("Goblin.png");
  laserSound=loadSound("lasergun.mp3");
  gameOver=loadImage("gameover.png");
  restartIMG=loadImage("restart.png");
  scoreSound=loadSound("score.mp3");
}

function setup() {
  createCanvas(820, 380);

  background=createSprite(0,0,820,380);
  background.addImage(backgroundIMG);

  horse=createSprite(410,200,5,5);
  horse.addAnimation("running",horseRun);
  horse.addAnimation("still",stillHorse);
  horse.scale=1;
  horse.debug=false;
  horse.setCollider("circle",0,0,80);

  ground=createSprite(400, 300, 2000, 20);
  ground.x=ground.width/2;
  ground.velocityX=-30;
  ground.visible=false;

  Arc=createSprite(horse.x-100,horse.y-100,5,5);
  Arc.addImage(ArcIMG);
  Arc.scale=0.8;

  carrotGroup=new Group();
  arrowGroup=new Group();
  iceGroup=new Group();
  laserGroup=new Group();
  goblinGroup=new Group();
  restartGroup=new Group();

  score=0;
}

function draw() {
  if(gameState===PLAY){
    Arc.y=World.mouseY;
    background.velocityX=-12;
    if(background.x < 300){
      background.x=background.width/2;
    }

    if(ground.x < 0){
      ground.x=ground.width/2;
    }

    if(keyDown("space")&& horse.y > 100 ){
      horse.velocityY=-10;
    }

    horse.velocityY = horse.velocityY + 0.8;
    horse.collide(ground);

    if(frameCount%500===0){
      goblin=createSprite(820,Math.round(random(40,250)),10,10);
      goblin.addImage(goblinIMG);
      goblin.lifetime=200;
      goblin.velocityX=-8;
      goblin.scale=0.8;
      goblinGroup.add(goblin);
    }

    if(frameCount%300===0){
      ice=createSprite(820,280,10,10);
      ice.y=ground.y-40;
      ice.addImage(iceIMG);
      ice.velocityX=-10;
      ice.scale=0.3;
      ice.lifetime=200;
      ice.debug=false;
      ice.setCollider("circle",0,0,100);
      iceGroup.add(ice);
    }

    if(frameCount%700===0){
      arrow = createSprite(820,100,60,10);
      arrow.addImage(arrowIMG);
      arrow.x = 820;
      arrow.y = Math.round(random(25,225));
      arrow.velocityX = background.velocityX;
      arrow.lifetime = 100;
      arrow.scale = 0.2;
      arrow.debug=false;
      arrow.setCollider("rectangle",0,0,250,40);
      arrowGroup.add(arrow);
    }

    if(frameCount%80===0){
      carrot=createSprite(820,300,10,10);
      carrot.addImage(carrotIMG);
      carrot.velocityX=-8;
      carrot.scale=0.1;
      carrot.lifetime=200;
      carrot.y=Math.round(random(10,200));
      carrotGroup.add(carrot);
    }

    if(horse.isTouching(carrotGroup)){
      carrotGroup.destroyEach();
      score+=2;
      scoreSound.play();
    }

    if(horse.isTouching(iceGroup) || horse.isTouching(arrowGroup) || horse.isTouching(goblinGroup)){
      gameState=END;
    }

    if(mouseDown("leftButton")){
      var laser=createSprite(0,0,60,10);
      laser.addImage(laserIMG);
      laser.x=Arc.x+30;
      laser.y=Arc.y;
      laser.velocityX=35;
      laser.lifetime=100;
      laser.scale=0.1;
      laserGroup.add(laser);
      laserSound.play();
    }

    if(laserGroup.isTouching(goblinGroup)){
      laserGroup.destroyEach();
      goblinGroup.destroyEach();
      score+=2;
    }
  }else if(gameState===END){
    var restart = createSprite(300,200);
    restart.addImage(restartIMG);
    restartGroup.add(restart);
    restart.scale=0.7;
    horse.changeAnimation("still");
    horse.scale=0.3;
    background.velocityX=0;
    ground.velocityX=0;
    horse.velocityY=0;
    Arc.velocityY=0;
    Arc.addImage(gameOver);
    Arc.scale=2;
    carrotGroup.setVelocityXEach(0);
    arrowGroup.setVelocityXEach(0);
    iceGroup.setVelocityXEach(0);
    goblinGroup.setVelocityXEach(0);
    goblinGroup.setLifetimeEach(-1);
    iceGroup.setLifetimeEach(-1);
    arrowGroup.setLifetimeEach(-1);
    carrotGroup.setLifetimeEach(-1);
    laserGroup.destroyEach();
  }

  if(mousePressedOver(restart) && gameState===END){
    score = 0;
    gameState = PLAY;
    horse.scale=1;
    horse.changeAnimation("running");
    Arc.scale=0.8;
    Arc.addImage(ArcIMG);
    laserGroup.destroyEach();
    carrotGroup.destroyEach();
    arrowGroup.destroyEach();
    goblinGroup.destroyEach();
    iceGroup.destroyEach();
    restartGroup.destroyEach();
  }

    drawSprites();
    camera.x=horse.x;
    camera.y=horse.y-50;

    stroke("black");
    textSize(20);
    fill("red");
    text("Score: "+ score,650,50);
}