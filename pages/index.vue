<template lang="pug">
  .sec-page(id="prg-page")
    .sec-content
      h1.s-title 分割ったー
      .mod-resultMessage(v-if="latestResult !== null")
        .message(:class="{error: latestResult === false}")
          p.content(v-if="latestResult === true") 投稿が成功しました
          p.content(v-else) 投稿が失敗しました
      .mod-login(v-if="!isLogined")
        p.s-paragraph 長い文章をいい感じの長さに区切ってツイートできます。使い方は文章を書いて投稿ボタンを押すだけ！
        .login
          button.login__button.s-button.block(@click="login") ① Twitterを連携する
      .mod-post
        .post(v-if="!isDraftState")
          .post__form(:class="{ disabled: !credential }")
            .post__form__label(v-if="!!user")
              img.s-avatar(v-if="user.photoURL" :src="user.photoURL")
              span.label {{ user.displayName }}
            limited-textarea(
              v-model="content"
              :maxLength="MAX_LENGTH"
              placeHsssolder="ツイート内容を入力"
              rows="7"
              :disabled="!credential"
            )
            .post__form__label
              settings
              span.label 設定
            .post__form__options
              .post__form__options__option
                p.title つながりを記載するか
                .option(@click="switchOption('prefix')")
                  component(:is="checkBoxComponent(isWithPrefix)")
                  span.option__label 2投稿目以降、冒頭に(続き)
                .option(@click="switchOption('suffix')")
                  component(:is="checkBoxComponent(isWithSuffix)")
                  span.option__label 最後の投稿以外、末尾に(続く)
                .option(@click="switchOption('withCount')")
                  component(:is="checkBoxComponent(option.withCount)")
                  span.option__label (1/4), (2/4)...のようにカウントを付ける
              .post__form__options__option
                p.title 句読点および改行でツイートを区切る
                .option(@click="switchOption('useSeparator')")
                  component(:is="checkBoxComponent(option.useSeparator)")
                  span.option__label 区切る
            button(:disabled="!canPost" @click="onDraft").s-button.block.post__form__submit ② 確認する
        .draft(v-else)
          h2.s-subtitle 投稿内容の確認
          .draft__back
            button.s-button.abnormal(@click="isDraftState = false") ＜ 戻る
          .draft__form
            ul.draft__form__chunkedForm
              template(v-for="(_, index) in sendContentArray")
                li.chunked
                  limited-textarea(
                    v-model="sendContentArray[index]"
                    :maxLength="TWITTER_MAX_LENGTH"
                    rows="8"
                  )
            button(:disabled="!canPost" @click="onPost").s-button.block.post__form__submit ③ 投稿する
      .mod-logout(v-if="!!credential")
        .logout
          button.logout__button.s-button.abnormal(@click="onLogout(uid)") ログアウト
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import twitter from "twitter-text";
import max from "lodash/max";
import LimitedTextarea from "@/components/form/LimitedTextarea";
import CheckboxBlankOutline from "vue-material-design-icons/CheckboxBlankOutline.vue";
import CheckboxMarked from "vue-material-design-icons/CheckboxMarked.vue";
import Settings from "vue-material-design-icons/Settings.vue";

export default {
  components: {
    CheckboxBlankOutline,
    CheckboxMarked,
    Settings,
    LimitedTextarea
  },
  watch: {
    latestResult(newResult) {
      this.$nuxt.$loading.finish();
      if (newResult !== null) {
        this.resetViewStatus();

        if (newResult === true) {
          this.content = "";
        }
      }
    }
  },
  computed: {
    ...mapState("auth", ["user", "uid", "credential"]),
    ...mapState("tweet", ["latestResult"]),
    calcedContent: {
      get() {
        return this.content.substr(0, this.MAX_LENGTH);
      },
      set(str) {
        this.content = str.substr(0, this.MAX_LENGTH);
      }
    },
    prefixText() {
      if (this.isWithPrefix) {
        return "(続き)";
      }
      return "";
    },
    isWithPrefix() {
      return !this.option.withCount && this.option.prefix;
    },
    suffixText() {
      if (this.isWithSuffix) {
        return "(続く)";
      }
      return "";
    },
    isWithSuffix() {
      return !this.option.withCount && this.option.suffix;
    },
    splittedContent() {
      let str = this.calcedContent;
      const parsed = twitter.parseTweet(str);
      if (parsed.valid) {
        return [str];
      }
      let chunked = [];
      let count = 0;
      while (str && count++ < 1000) {
        let currentLength = this.MAX_LENGTH_PER_TWEET;
        // 1. 句読点を考慮して120文字以下で文字列を作る
        if (this.option.useSeparator) {
          const japanesePeriodIndex =
            max([
              str.lastIndexOf("。", currentLength),
              str.lastIndexOf("、", currentLength),
              str.lastIndexOf("\n", currentLength) - 1
            ]) + 1;
          if (japanesePeriodIndex > this.MIN_LENGTH) {
            currentLength = japanesePeriodIndex;
          }
        }

        let content = str.substr(0, currentLength);

        // 2. (続く)などの前後テキストを付ける
        if (count > 1) {
          content = this.prefixText + content;
        }

        // 3. str自体を削る
        str = str.slice(currentLength);
        if (str) {
          content = content + this.suffixText;
        }

        // 4. chunkに突っ込む
        chunked.push(content);
      }
      if (this.option.withCount) {
        const len = chunked.length;
        for (let i = 0; i < len; i++) {
          chunked[i] = `(${i + 1}/${len})\n${chunked[i]}`;
        }
      }
      return chunked;
    },
    isValidContent() {
      if (!this.calcedContent) {
        return false;
      }
      if (!this.calcedContent.length > this.MAX_LENGTH) {
        return false;
      }
      return true;
    },
    isLogined() {
      return !!this.user && !!this.uid && !!this.credential;
    },
    canPost() {
      return this.isLogined && this.isValidContent;
    }
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      logout: "auth/logout",
      post: "tweet/post"
    }),
    ...mapMutations({
      setResult: "tweet/setResult"
    }),
    onDraft() {
      this.isDraftState = true;
      this.sendContentArray = this.splittedContent;
      this.scrollToTop();
      this.setResult(null);
    },
    onPost() {
      if (!this.isValidContent) return false;
      if (!this.credential) return false;

      const bodyArray = this.sendContentArray.filter(tweet => !!tweet);

      this.$nextTick(() => {
        this.$nuxt.$loading.start();
      });
      this.post({
        uid: this.uid,
        post: { bodyArray }
      });
    },
    onLogout(uid) {
      this.content = "";
      this.resetViewStatus();
      this.logout(uid);
    },
    resetViewStatus() {
      this.isDraftState = false;
      this.scrollToTop();
    },
    checkBoxComponent(bool) {
      if (bool) {
        return "checkbox-marked";
      }
      return "checkbox-blank-outline";
    },
    switchOption(key) {
      if (!this.isLogined) {
        return;
      }
      this.option[key] = !this.option[key];
    },
    scrollToTop() {
      var VueScrollTo = require("vue-scrollto");
      VueScrollTo.scrollTo("body");
    }
  },
  data() {
    return {
      content: "",
      sendContentArray: [],
      isDraftState: false,
      MAX_LENGTH: 3000,
      MAX_LENGTH_PER_TWEET: 128,
      MIN_LENGTH: 90,
      TWITTER_MAX_LENGTH: 140,
      option: {
        prefix: false,
        suffix: false,
        withCount: false,
        useSeparator: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.mod-login {
  margin-bottom: 40px;
}

.mod-resultMessage {
  margin-bottom: 20px;

  .message {
    padding: 20px;
    background: lighten($accent, 20%);
    border-radius: 10px;

    &.error {
      background: lighten($error, 20%);

      .content {
        color: $error;
      }
    }

    .content {
      color: $accent;
      font-weight: bold;
    }
  }
}

.mod-post {
  padding: 20px 0;
  .post {
    &__form {
      &.disabled {
        p,
        span {
          color: $gray-light-2 !important;
        }
      }

      &__label {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: $gray-light-1;

        .label {
          margin-left: 5px;
        }
      }
      &__options {
        display: flex;
        margin-bottom: 20px;
        color: $gray-dark-1;

        @include mq("sp") {
          flex-direction: column;
        }

        &__option {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 10px;
          background: $gray-light-3;

          .title {
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .option {
            display: flex;
            align-items: center;
            margin-top: 10px;
            cursor: pointer;

            &__label {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .draft {
    &__form {
      &__chunkedForm {
        .chunked {
          margin-bottom: 20px;

          &__counter {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
            color: $gray-light-1;
          }
        }
      }
    }
  }
}

.mod-logout {
  .logout {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
