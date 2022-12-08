<script>
import MainWindow from "./components/MainWindow.vue";
export default {
  components: { MainWindow },
};
</script>

<template>
  <div class="Container">
    <MainWindow />
    <div class="Background" />
  </div>
</template>

<style lang="scss">
.Container {
  position: fixed;
  overflow: hidden;

  width: 100vw;
  height: 100vh;

  & .Background {
    position: absolute;
    left: 50%;
    top: 50%;

    height: 130vw;
    width: 130vw;

    transform: translate(-50%, -50%);

    background: radial-gradient(circle at left top, lightsalmon 0%, aquamarine 100%);
    animation: rotate 15s infinite linear;
  }
}

@keyframes rotate {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
