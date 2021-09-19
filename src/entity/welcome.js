let welcomeSprite;



export function welcomeCreate(scene, { x, y }, flag) {

  if(flag){
    let counter = 1;

    welcomeSprite = scene.add.sprite(x, y, "welcome1");
    console.log("1");
    welcomeSprite.setName("welcome");
    counter= 2;
  

    let welcomeinterval = setInterval(() => {
         if(counter == 2){
          if(welcomeSprite!=null){
            welcomeSprite.setTexture("welcome2");
            counter =3;
            console.log("2");
          }
        }else if(counter==3){
          if(welcomeSprite!=null){
            welcomeSprite.setTexture("welcome3");
            counter=1;
            console.log("3");
          }
        }
    }  , 3000);

    if(counter = 1){
      clearInterval(welcomeinterval);
    }
  
  
    return {
      phaser: welcomeSprite,
    };
  }
    

  
}


export function welcomeDestroy() {
  welcomeSprite.destroy();
}


