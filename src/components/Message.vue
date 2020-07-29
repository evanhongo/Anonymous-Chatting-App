<template>
  <div class="box">
    <div class="content" :class="isMyMessage">
      <div></div>
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useConfig } from "../store/store";

export default {
  name: "Message",
  props: ["message"],
  setup(props) {
    const { config } = useConfig();
    const isMyMessage = computed(() => {
      return { right: props.message.userId === config.userId };
    });

    return {
      isMyMessage
    };
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: inline-block;
  width: 100%;
  padding: 10px;
  *zoom: 1;
  .content {
    display: inline-block;
    position: relative;
    font-size: x-large;
    color: #008f00;
    word-break: break-all;
    background: transparent; //linear-gradient(135deg, #6D3F59 0%, #685B79 100%);
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 0;
    padding: 5px;
    z-index: 0;
    &.right {
      color: #808000;
      background: transparent; //linear-gradient(135deg, #6E6E90 0%, #9E5276 100%);
      float: right;
    }
    div {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      overflow: hidden;
      &:after {
        content: "";
        position: absolute;
        left: -20px;
        top: -20px;
        right: -20px;
        bottom: -20px;
        //background: linear-gradient(135deg, #6E6E90 0%, #9E5276 100%);
        background-image: url("../img/bg.jpg");
        background-size: cover;
        background-attachment: fixed;
        filter: blur(10px); //毛玻璃特效
      }
    }
  }
}
</style>
