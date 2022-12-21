<script>
import Github from "@/components/icons/Github.vue";

import { getRandomArbitrary } from "@/utils";

const MIN_DELAY = 21000;
const MAX_DELAY = 36000;

export default {
  name: "GithubIco",
  components: { Github },
  data() {
    return {
      inIdle: false,
      isHover: false,
    };
  },
  mounted() {
    setTimeout(this.toggleIdle, getRandomArbitrary(MIN_DELAY, MAX_DELAY));
  },
  watch: {
    inIdle() {
      if (this.inIdle) {
        setTimeout(this.toggleIdle, 501); // turn off
      } else {
        setTimeout(this.toggleIdle, getRandomArbitrary(MIN_DELAY, MAX_DELAY));
      }
    },
  },
  methods: {
    toggleIdle() {
      this.inIdle = !this.inIdle;
    },
  },
};
</script>

<template>
  <a
    href="https://github.com/somespecialone/sert"
    target="_blank"
    :class="!isHover && inIdle ? 'Idle' : ''"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <Github />
  </a>
</template>

<style scoped lang="scss">
a {
  width: 4rem;
  transform: rotate(-45deg);
  transition: transform 0.5s ease-in-out;

  fill: #2b2c38;

  cursor: pointer;

  &:hover {
    transform: translate(1.7rem, 1.5rem) rotate(-30deg);
  }

  &.Idle {
    animation: idle 0.25s infinite reverse;
  }
}

@keyframes idle {
  0% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}
</style>
