<template lang="pug">
  .s-limited
    textarea.s-limited__form.s-textarea.block(:value="calcedContent" @input="onInput($event.target.value)" :placeholder="placeHolder" :rows="rows" :disabled="disabled")
    .s-limited__counter
      span {{ calcedContent.length }}/{{ maxLength }}
</template>

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


<script>
export default {
  methods: {
    onInput(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    calcedContent() {
      return this.value.substr(0, this.maxLength);
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    maxLength: {
      type: Number,
      required: true
    },
    placeHolder: {
      type: String,
      default: "ここに入力"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rows: {
      type: String,
      default: "5"
    }
  }
};
</script>
