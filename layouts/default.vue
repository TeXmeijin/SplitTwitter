<template lang="pug">
  .main
    nuxt
    .sec-footer
      ul.credits
        li.credits__item
          nuxt-link(to="/").link TOP
        li.credits__item
          a(href="https://meijin.me" target="_blank").link 製作者：名人(https://meijin.me)
        li.credits__item
          nuxt-link(to="term").link 利用規約
        li.credits__item
          nuxt-link(to="privacy").link プライバシーポリシー
</template>


<style lang="scss">
html {
  font-family: "Keion", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.sec-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: linear-gradient(
    -45deg,
    $white 25%,
    $secondary 25%,
    $secondary 50%,
    $white 50%,
    $white 75%,
    $secondary 75%,
    $secondary
  );
  background-size: 20px 20px;
  padding: 100px 0 0;
  min-height: calc(100vh - 180px);

  @include mq("sp") {
    padding: 40px 10px;
  }
}

.sec-footer {
  padding: 20px 0;
  background: $gray-light-3;

  .credits {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__item {
      padding: 10px 0;

      .link {
        color: $gray-dark-1;
      }
    }
  }
}

.sec-content {
  width: 900px;
  margin: 0 auto;
  padding: 50px;
  border: 10px solid $primary;
  border-radius: 20px;
  background: $white;
  margin-bottom: 40px;

  @include mq("sp") {
    width: 100%;
    padding: 10px;
  }
}
</style>
