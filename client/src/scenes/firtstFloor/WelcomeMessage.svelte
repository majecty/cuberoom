<script>
  import HTMLPopup from "../../entity/HTMLPopup.svelte";
  import ENV from "../../../ENV";
</script>

<HTMLPopup>
  <img
    class="left-character"
    src="{`${ENV.URL_STATIC}/img/ui/welcome-person.png`}"
  />
  <div class="right-text">
    안녕하세요, 여기는 코리아나미술관입니다. 현재 국제기획전 ≪프로필을
    설정하세요≫ 전이 지하 1, 2층에서는 진행 중입니다. 5,6층에는 화장 박물관이
    있습니다. 즐거운 관람 되시기 바랍니다.
  </div>
</HTMLPopup>

<style>
  .right-text {
    padding-right: 25px;
  }
</style>
