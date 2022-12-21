<script>
import MainWindow from "@/components/MainWindow.vue";
import GithubIco from "@/components/GithubIco.vue";

export default {
  components: { MainWindow, GithubIco },
  mounted() {},
};
</script>

<template>
  <div class="App">
    <div class="Container">
      <div class="Name">Steam Exchange Rate Tracker</div>
      <MainWindow />
      <div class="By">— By <a href="https://somespecial.one" target="_blank">somespecial.one</a> —</div>
    </div>
    <GithubIco />
    <div class="Background" />
  </div>
</template>

<style lang="scss">
.App {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;

  display: flex;

  > a {
    position: absolute;
    z-index: 1000;
    top: -1.7rem;
    left: -1.7rem;
  }

  & .Container {
    z-index: 10;
    margin: auto;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    height: 100%;
    width: 100%;

    font-size: 2.5rem;
    font-weight: 100;
    color: white;

    cursor: default;

    @media screen and (max-width: 600px) {
      & {
        font-size: 2rem;
      }
    }

    & .By,
    .Name {
      text-align: center;
    }

    & .By a {
      color: white;
      text-decoration-line: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.3rem;

      transition: color 0.15s linear;

      &:hover {
        color: var(--accent-color);
      }
    }
  }

  & .Background {
    $scaleHeight: 140vh;
    $scaleWidth: 140vw;

    position: absolute;
    left: 50%;
    top: 50%;

    height: max($scaleHeight, $scaleWidth);
    width: max($scaleHeight, $scaleWidth);

    transform: translate(-50%, -50%);

    background: radial-gradient(circle at left top, lightsalmon 0%, aquamarine 100%);
    animation: rotate 60s infinite linear;
  }
}

@keyframes rotate {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
