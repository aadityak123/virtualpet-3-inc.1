//Create variables here
var normalDog, happyDog, database, foodS, foodStock;
var obj;
var fedTime, lastFed, foodObj;
var feed, addFood;
var milk;
var bedRoom, deadDog, normalDog, vaccinationPG, stock, gardenImg, injection, lazyDog, livingRoomImg;
var runningR, runningL, vaccination, washRoomImg;
var gameState = "hungry";
var name;

function preload()
{
	//load images here
  bedRoom       = loadImage("images/Bed Room.png");
  deadDog       = loadImage("images/deadDog.png");
  normalDog     = loadImage("images/dogImg.png");
  happyDog      = loadImage("images/dogImg1.png");
  vaccinationPG = loadImage("images/dogVaccination.png");
  stock         = loadImage("images/Food Stock.png");
  gardenImg     = loadImage("images/Garden.png");
  injection     = loadImage("images/injection.png");
  lazyDog       = loadImage("images/Lazy.png");
  livingRoomImg = loadImage("images/Living Room.png");
  milkBottle    = loadImage("images/Milk.png");
  runningR      = loadImage("images/running.png");;
  runningL      = loadImage("images/runningLeft.png");
  vaccination   = loadImage("images/Vaccination.jpg");
  washRoomImg   = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  foodStock.set(20 );

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  getGameState();

  dogObj = createSprite(800,200,10,10);
  dogObj.addImage(normalDog);
  dogObj.scale = 0.15;

  milk = createSprite(200,200,10,10);
  milk.visibility = false;
  milk.scale = 0.1;
  
  foodObj = new Food;

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  input = createInput("name");
  input.position(950,120);

  button = createButton("confirm");
  button.position(1000,145);
  button.mousePressed(createName)


  
}


function draw() {  
  background(46, 139, 87)

  console.log(foodS);

    currentTime = hour();
    if(currentTime == (lastFed + 1)){
      update("Playing")
      foodObj.garden();
    }else if(currentTime == (lastFed + 2)){
      update("Sleeping")
      foodObj.bedroom();
    }else if(currentTime > (lastFed +2) && currentTime <= (lastFed +4)){
      update("Bathing")
      foodObj.washroom();
    }else{
      update("Hungry")
      foodObj.display();

    }

    fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
       lastFed = data.val();
  })

  if(gameState != "hungry"){
    feed.hide();
    addFood.hide();
    dogObj.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(normalDog);
  }

  foodObj.getFoodStock();
  getGameState();

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("last Feed : "+ lastFed%12 +"PM",350,30);
  }else if(lastFed == 0){
    text("last Feed : 12 AM", 350,30);
  }else{
    text("last Feed : "+ lastFed +"AM",350,30);
  }

  if(milk.x > 720){
    milk.velocityX = 0;
    dogObj.addImage(happyDog);
    text("I ENJOY DA MILK...",720,150)
  }else(
    dogObj.addImage(normalDog)
  );
 
  foodObj.display();
  dogObj.display();
  milk.display();
  
  //add styles here

}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}

function writeStock(x){
  
  if(x<0){
    x = 0;
  }else{
    x = x - 1;
  }

  database.ref('/').update({
    Food : x
  })

}

function addFoods(){
foodS++
database.ref('/').update({
  Food:foodS
})
}

function feedDog(){

  milk.addImage(milkBottle);
  milk.velocityX = 5;
  milk.x = 200;

  console.log("data",foodObj.getFoodStock())
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  console.log("data after update",foodObj.getFoodStock())
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("pet's name:"+name);
  greeting.position(width/2+850,height/2+200);

}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState = data.val()
  });
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
  }









