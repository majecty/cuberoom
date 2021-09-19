<script>
  import { Link, navigate } from 'svelte-routing';
  import axios from 'axios';
  import ENV from '../../ENV';
  import names from '../entity/names';

  let skinNum = 1;
  let eyeNum = 1;
  let hairColorNum = 1;
  let hairStyleNum = 1;
  let clothesNum = 1;
  let name = '';

  function handleInput() {
    if (name.length > 12) name = name.slice(0, 12);
  }

  // 이 함수들 나중에 하나로 추상화하기
  function increaseSkinNum() {
    skinNum++;
    if (skinNum > 3) skinNum = 1;
  }

  function decreaseSkinNum() {
    skinNum--;
    if (skinNum < 1) skinNum = 3;
  }

  function increaseEyeNum() {
    eyeNum++;
    if (eyeNum > 12) eyeNum = 1;
  }

  function decreaseEyeNum() {
    eyeNum--;
    if (eyeNum < 1) eyeNum = 12;
  }

  function increaseHairColorNum() {
    hairColorNum++;
    if (hairColorNum > 4) hairColorNum = 1;
  }

  function decreaseHairColorNum() {
    hairColorNum--;
    if (hairColorNum < 1) hairColorNum = 4;
  }

  function increaseHairStyleNum() {
    hairStyleNum++;
    if (hairStyleNum > 12) hairStyleNum = 1;
  }

  function decreaseHairStyleNum() {
    hairStyleNum--;
    if (hairStyleNum < 1) hairStyleNum = 12;
  }

  function increaseClothesNum() {
    clothesNum++;
    if (clothesNum > 12) clothesNum = 1;
  }

  function decreaseClothesNum() {
    clothesNum--;
    if (clothesNum < 1) clothesNum = 12;
  }

  function decide() {
    name = name || names[Math.floor(Math.random() * names.length)];
    axios.post(`${ENV.URL}/character-selection`, {
      name,
      faceS: eyeNum,
      hairS: hairStyleNum,
      hairC: hairColorNum,
      skin: skinNum,
      cloth: clothesNum,
    })
    .then((res) => {
      window.playerImgUrl = res.data; // 약간 임시방편..ㅠㅠ
      window.playerName = name; // 이것도,,,,
      navigate('/map');
    })
    .catch((err) => {
      console.error(err);
    });
  }
</script>

<main>
  <div class="block-container">
    <div class="block label">
      큐브 스테이지에 입장하기 위한 캐릭터를 만들어 주세요.
    </div>
    <div class="block form">
      <div class="row whole">
        <div style="width: 50px; margin-right: 12px;">이름</div>
        <input bind:value={name} maxlength="12" on:input={handleInput} />
        <div style="width: 50px; margin-left: 12px; visibility: hidden;">(공백)</div>
      </div>
      <div class="row whole">
        <div class="center character">
          <img src="/img/character/Skincolor ({skinNum}).png" alt="" width="48" style="position: absolute;" />
          <img src="/img/character/face ({eyeNum}).png" alt="" width="48" style="position: absolute;" />
          <img src="/img/character/HairC0{hairColorNum} ({hairStyleNum}).png" alt="" width="48" style="position: absolute;" />
          <img src="/img/character/Clothes ({clothesNum}).png" alt="" width="48" style="position: absolute;" />
        </div>
      </div>
      <div class="row">
        <button class="left" on:click={decreaseEyeNum}></button>
        <div class="center">얼굴</div>
        <button class="right" on:click={increaseEyeNum}></button>
      </div>
      <div class="row">
        <button class="left" on:click={decreaseHairColorNum}></button>
        <div class="center">머리색</div>
        <button class="right" on:click={increaseHairColorNum}></button>
      </div>
      <div class="row">
        <button class="left" on:click={decreaseHairStyleNum}></button>
        <div class="center">머리모양</div>
        <button class="right" on:click={increaseHairStyleNum}></button>
      </div>
      <div class="row">
        <button class="left" on:click={decreaseClothesNum}></button>
        <div class="center">의상</div>
        <button class="right" on:click={increaseClothesNum}></button>
      </div>
      <div class="row">
        <button class="left" on:click={decreaseSkinNum}></button>
        <div class="center">피부색</div>
        <button class="right" on:click={increaseSkinNum}></button>
      </div>
      <button class="decide" on:click={decide}>
        <img src="/img/ui/decide.png" alt="결정" />
      </button>
    </div>
  </div>
  <Link to='/' class="to-main">
    <img src="/img/ui/back_to_main.png" alt="메인으로" />
  </Link>
</main>

<style>
  main {
    height: 100%;
    background-image: url('/img/ui/intro_background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .block-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 10%;
  }

  .block {
    border: 4px solid black;
    background-color: white;
    font-family: NeoDunggeunmo;
  }

  .block.label {
    font-size: 24px;
    width: 260px;
    padding: 20px;
    margin-right: 40px;
    word-break: keep-all;
    line-height: 140%;
  }

  .block.form {
    width: 550px;
    height: 400px;
    display: grid;
    grid-template-rows: 1fr 3fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    padding: 20px 0px;
    position: relative;
  }

  .row {
    display: flex;
    justify-content: center;
  }

  .row.whole {
    grid-column: 1 / 3;
  }

  .row div {
    font-size: 24px;
  }

  input {
    width: 100px;
    height: 24px;
    padding: 10px;
    border-radius: 0;
    box-shadow: inset 0px 3px grey;
    font-family: NeoDunggeunmo;
    font-size: 20px;
  }

  input:focus {
    outline: none;
  }

  .center {
    width: 120px;
    font-size: 24px;
  }

  .character {
    height: 120px;
    border: 2px solid black;
    box-shadow: inset 0px 3px grey;
  }

  button {
    border: none;
    background: none;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    padding: 0;
  }

  button:hover {
    cursor: pointer;
  }

  .left {
    background-image: url('/img/ui/arrow_left.png');
    margin-right: 12px;
  }

  .left:active {
    background-image: url('/img/ui/arrow_left_pressed.png');
  }

  .right {
    background-image: url('/img/ui/arrow_right.png');
    margin-left: 12px;
  }

  .right:active {
    background-image: url('/img/ui/arrow_right_pressed.png');
  }

  .decide {
    position: absolute;
    bottom: 24px;
    right: 48px;
  }

  :global(a.to-main) {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }

  @media (orientation: portrait) {
    main {
      overflow: scroll;
      margin-bottom: 20px;
    }

    .block-container {
      flex-direction: column;
      align-items: center;
      padding: 0px;
    }

    .block.label {
      width: 80%;
      margin: 20px 0px;
      padding: 12px;
      font-size: 20px;
    }

    .block.form {
      width: 80%;
      padding: 12px;
      height: fit-content;
      grid-template-rows: 1fr 3fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-columns: 1fr;
    }

    .row.whole {
    grid-column: 1;
  }

    .row div {
      font-size: 20px;
    }

    .decide {
      position: absolute;
      text-align: center;
      right: 28px;
      bottom: -63px;
    }

    .decide img {
      border: 3px solid black;
      height: 44px;
    }

    :global(a.to-main) {
      position: relative;
      bottom: -20px;
      /* right: calc(90% - 160px + 4px); */
      left: calc(10% - 12px - 4px);
    }
  }
</style>
