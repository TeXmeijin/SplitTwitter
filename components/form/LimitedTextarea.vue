<template lang="pug">
  .s-limited
    textarea.s-limited__form.s-textarea.block(:value="calcedContent" @input="onInput($event.target.value)" :placeholder="placeHolder" :rows="rows" :disabled="disabled")
    .s-limited__counter
      span {{ calcedContent.length }}/{{ maxLength }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component
export default class LimitedTextarea extends Vue {
  @Prop()
  public value!: string;

  @Prop()
  public maxLength!: number;

  @Prop({ default: "ここに入力" })
  public placeHolder!: string;

  @Prop({ default: false })
  public disabled!: boolean;

  @Prop({ default: 5 })
  public rows!: number;

  @Emit("input")
  public onInput(val: any) {
    return val;
  }

  public get calcedContent(): string {
    return this.value.substr(0, this.maxLength);
  }
}
</script>


<style lang="scss" scoped>
.s-limited {
  &__form {
    margin-bottom: 10px;
  }
  &__counter {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    color: $gray-light-1;
  }
}
</style>
