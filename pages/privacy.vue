<template lang="pug">
  .sec-page
    .sec-content
      h1.s-title プライバシーポリシー
      p.s-paragraph.small 分割ったー運営チーム（以下、当チーム）は、ユーザーの個人情報の保護を重要な業務の一部と認識し、適切な管理のため最大限の努力をいたします。
      h2.s-subtitle 第１条 個人情報について
      p.s-paragraph.small 当サービスでは、以下の情報を保存しています（または、現状保存していなくても、今後予告なく保存する可能性があります）。
        br
        | ユーザーが、ソーシャルネットワークサービス等の外部サービスとの連携を許可した場合に、当該外部サービスでユーザーが利用するID、アクセストークン及び、その他当該外部サービスのプライバシー設定によりユーザーが開示を認めた情報
      h2.s-subtitle 第３条 個人情報の利用目的
      p.s-paragraph.small 当チームは、取得した個人情報を目的の範囲内で適切に利用いたします。
      h2.s-subtitle 第４条 個人情報の提供
      p.s-paragraph.small 当社は、お客様の個人情報を下記の場合を除いて第三者に提供することはいたしません。
        br
        | お客様からの事前の同意がある場合
        br
        | 法令に基づく場合
      h2.s-subtitle 第５条 プライバシーポリシーの改定
      p.s-paragraph.small 当社は個人情報保護上の必要に応じて、本方針を改定する場合があります。改定が行われた時点で、新しい方針が適用されるものといたします。
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Privacy extends Vue {}
</script>