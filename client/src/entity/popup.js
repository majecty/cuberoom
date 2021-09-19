import works from './works';

let popupSprite;
let descriptionContainer;




export function popupCreate(scene, { x, y }, workNum) {
  const work = works[workNum];
  popupSprite = scene.add.sprite(x, y, "popup");
  popupSprite.setInteractive();

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerover", () => {
    scene.input.setDefaultCursor("pointer");
  });

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerout", () => {
    scene.input.setDefaultCursor("auto");
  });

  // FIXME: event 등록 해제해야 하는지 확인 필요
  popupSprite.on("pointerdown", () => {
    descriptionContainer = document.createElement('div');
    descriptionContainer.onmousedown = () => window.game.input.enabled = false;
    descriptionContainer.onmouseup = () => window.game.input.enabled = true;
    descriptionContainer.ontouchstart = () => window.game.input.mouse.enabled = false;
    descriptionContainer.ontouchend = () => window.game.input.mouse.enabled = true;
    descriptionContainer.classList.add('description-container');
    descriptionContainer.style.position = 'absolute';
    descriptionContainer.style.top = '0px';
    descriptionContainer.style.left = '0px';
    descriptionContainer.style.width = '100vw';
    descriptionContainer.style.height = '100%';
    descriptionContainer.style.display = 'flex';
    descriptionContainer.style.flexDirection = 'column';
    descriptionContainer.style.justifyContent = 'flex-end';
    descriptionContainer.style.alignItems = 'center';


    const description = document.createElement('div');
    description.id = work.id;
    description.classList.add("work");
    description.style.minWidth = '300px';
    description.style.maxWidth = '600px';
    description.style.backgroundColor = 'white';
    description.style.borderColor = 'black';
    description.style.borderWidth = '4px';
    description.style.borderStyle = 'solid';
    description.style.padding = '34px';
    description.style.paddingBottom = '50px';
    description.style.display = 'flex';
    description.style.justifyContent = 'space-between';
    description.style.position = 'relative';
    description.style.bottom = '100px';


    const left = document.createElement('img');
    left.classList.add("popup-left");
    left.src = work.imgUrl;
    left.style.width = '160px';
    left.style.height = '160px';
    left.style.marginRight = '24px';

    const right = document.createElement('div');
    right.style.flex = '1';
    right.style.position = 'relative';

    let div = document.createElement('div');
    div.appendChild(document.createTextNode(work.title));
    right.appendChild(div);

    div = document.createElement('div');
    div.style.marginBottom = '16px';
    div.appendChild(document.createTextNode(work.medium));
    right.appendChild(div);

    if(work.title2 != null){
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(work.title2));
      right.appendChild(div);
  
      div = document.createElement('div');
      div.style.marginBottom = '16px';
      div.appendChild(document.createTextNode(work.medium2));
      right.appendChild(div);
    }


    div = document.createElement('div');
    div.style.wordBreak = 'keep-all';
    div.style.marginBottom = '32px';
    div.appendChild(document.createTextNode(work.alt));
    right.appendChild(div);

    const showmore = document.createElement('div');
    showmore.style.wordBreak = 'keep-all';
    showmore.style.marginBottom = '32px';
    showmore.style.textDecoration = "underline";
    showmore.innerHTML = "더보기";
    showmore.onclick = () => {
      if(showmore.classList.contains("showmore")){
        document.getElementsByClassName("description")[0].style.display="none";
        showmore.classList.remove("showmore");
        showmore.innerHTML = "더보기";
      }else{
        document.getElementsByClassName("description")[0].style.display="inline-block";
        showmore.classList.add("showmore");
        showmore.innerHTML = "접기";
      }

    }
    showmore.ontouchstart = () => {
      if(showmore.classList.contains("showmore")){
        document.getElementsByClassName("description")[0].style.display="none";
        showmore.classList.remove("showmore");
        showmore.innerHTML = "더보기";
      }else{
        document.getElementsByClassName("description")[0].style.display="inline-block";
        showmore.classList.add("showmore");
        showmore.innerHTML = "접기";
      }

    }
    right.appendChild(showmore);

    div = document.createElement('div');
    div.classList.add("description");
    div.style.wordBreak = 'keep-all';
    div.style.marginBottom = '16px';
    div.style.display = "none";
    div.appendChild(document.createTextNode(work.description));
    right.appendChild(div);

    const closeButton = document.createElement('button');
    closeButton.classList.add("closebutton");
    closeButton.style.border = 'none';
    closeButton.style.backgroundImage = 'url("/img/ui/close.png")';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.top = '0px';
    closeButton.style.right = '-30px';
    closeButton.style.position = 'absolute';
    closeButton.onclick = () => document.body.removeChild(descriptionContainer);
    closeButton.ontouchstart = () => document.body.removeChild(descriptionContainer);

    const link = document.createElement('a');
    link.classList.add("link1");
    link.href = work.url;
    link.target = "_blank";
    link.style.position = 'absolute';
    link.style.right = '0px';
    link.style.bottom = '-20px';
    link.ontouchstart = () => {
      window.open(work.url); 
    } 
    link.appendChild(document.createTextNode('새 창으로 링크 열기'));

    let isLink2 =false;
    let link2 ;
    if(work.url2 != null){

      link.removeChild(link.firstChild);
      link.appendChild(document.createTextNode('작품1 새 창으로 링크 열기'))

      link2 = document.createElement('a');
      link2.href = work.url2;
      link2.classList.add("link2");
      link2.target = "_blank";
      link2.style.position = 'absolute';
      link2.style.right = '0px';
      link2.style.bottom = '-50px';
      link2.appendChild(document.createTextNode('작품2 새 창으로 링크 열기'));
      link2.ontouchstart = () => {
        var el = this;
        window.open(work.url2); 
      } 
      isLink2 = true;
    }

    right.appendChild(closeButton);
    right.appendChild(link);
    if(isLink2){
    right.appendChild(link2);
    }

    description.appendChild(left);
    description.appendChild(right);
    descriptionContainer.appendChild(description);
    document.body.appendChild(descriptionContainer);


    // let showmore = document.getElementsByClassName("showmore")[0].addEventListener("click",event=>{
    //     showmore.innerHTML="";
    //     showmore.style.textDecoration ="none";
    //     showmore.appendChild(document.createTextNode(work.description));
    // })

  });

  return {
    phaser: popupSprite,
  };
}

export function popupDestroy() {
  popupSprite.destroy();
  // if (descriptionContainer) document.body.removeChild(descriptionContainer);
}
