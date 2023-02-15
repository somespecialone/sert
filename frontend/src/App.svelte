<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";

  import ratesService from "@/services/rates";
  import ratesStored from "@/stores/rates";
  import { getRandomArbitrary } from "@/utils";
  import { ANIM_MIN_DELAY, ANIM_MAX_DELAY } from "@/constants";

  import Converter from "@/components/Converter.svelte";
  import RatesCharts from "@/components/RatesCharts.svelte";

  let history: Record<string, number[][]> = {};
  let timeout: number;
  let gitHubAnimation = false;

  function toggleGithubAnimation() {
    gitHubAnimation = !gitHubAnimation;
  }

  function animationWatcher(state: boolean) {
    if (state) {
      timeout = setTimeout(toggleGithubAnimation, 501); // turn off
    } else {
      timeout = setTimeout(toggleGithubAnimation, getRandomArbitrary(ANIM_MIN_DELAY, ANIM_MAX_DELAY));
    }
  }

  $: animationWatcher(gitHubAnimation);

  onMount(async () => {
    timeout = setTimeout(toggleGithubAnimation, getRandomArbitrary(ANIM_MIN_DELAY, ANIM_MAX_DELAY));

    const rates = get(ratesStored);
    history = await ratesService.getHistory();
    Object.entries(history).forEach(([k, v]) => (rates[k] = [v[0][0], v[0][1]]));
    ratesStored.set(rates);
  });

  onDestroy(() => clearTimeout(timeout));
</script>

<header>
  <div>STEAM EXCHANGE RATE TRACKER</div>
  <a href="https://github.com/somespecialone/sert" target="_blank" rel="noreferrer"
     data-animation='{gitHubAnimation ? "" : null}'>
    <!--		<GithubIco />-->
    <div class="GithubIco"></div>
  </a>
</header>
<main>
  <Converter rates="{$ratesStored}" />
  <RatesCharts {history} />
</main>
<footer>
  <div class="By">— BY <a href="https://somespecial.one" target="_blank" rel="noreferrer">SOMESPECIAL.ONE</a> —</div>
</footer>

<style lang="scss">
  :global(#app) {
    position: fixed;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: var(--bg);

    color: var(--text);

    ::selection {
      background: var(--accent);
      color: var(--bg-second);
    }
  }

  header, footer {
    position: relative;
    height: 4rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background: var(--bg-second);

    font-size: 1.55rem;
    font-weight: 300;

    &:after, &:before {
      --shadow-height: .5rem;
    }
  }

  header {
    position: relative;
    top: 0;

    a {
      position: absolute;
      right: 1rem;

      &[data-animation] {
        animation: quick 0.25s infinite reverse;
      }

      $s: rgba(0, 167, 255, 1);
      $w: rgba(235, 255, 0, 1);

      $d: 12%;
      $sd: darken($s, $d);
      $wd: darken($w, $d);

      &:hover :global(.GithubIco) {
        background: linear-gradient(180deg, $sd 0%, $sd 49%, $wd 50%, $wd 100%);
      }

      :global(.GithubIco) {
        width: 2rem;
        height: 2rem;

        background: linear-gradient(180deg, $s 0%, $s 49%, $w 50%, $w 100%);
        mask-image: url("@/assets/github.svg");
      }
    }

    &:after {
      content: "";
      position: absolute;
      width: 100%;
      height: var(--shadow-height);
      bottom: calc(-1 * var(--shadow-height));
      background: linear-gradient(to bottom, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, .05) 30%, transparent 100%);;
    }
  }

  footer {
    bottom: 0;

    .By a {
      color: var(--accent-second);

      &:hover {
        color: var(--accent);
        text-decoration-line: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 0.3rem;
      }
    }

    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: var(--shadow-height);
      top: calc(-1 * var(--shadow-height));
      background: linear-gradient(to top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, .05) 30%, transparent 100%);;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :global(.RatesCharts), :global(.Converter) {
      width: 70%;

      @media screen and (max-width: 768px) {
        & {
          width: 100%;
          border-radius: 0 !important;

        }
      }
    }
  }

  @keyframes quick {
    25% {
      transform: rotate(-15deg);
    }
    75% {
      transform: rotate(15deg);
    }
  }
</style>
