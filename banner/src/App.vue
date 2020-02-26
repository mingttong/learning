<template>
  <div id="app">
    <div class="container">
      <div class="left-btn" @click="onSwipe(-1)">&lt;</div>
      <div class="right-btn" @click="onSwipe(1)">&gt;</div>
      <div
        class="banner"
        :style="`width: ${list.length * 300}px; left:${bannerLeft}px; transition: left ${transitionTime}s;`"
      >
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          :style="`background-color: ${item.color}`"
        >{{ item.number }}</div>
      </div>
    </div>
  </div>
</template>

<script>

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: 'App',
  data() {
    return {
      list: [
        {
          color: '#000',
          number: 6,
        },
        {
          color: 'red',
          number: 1,
        },
        {
          color: 'yellow',
          number: 2,
        },
        {
          color: 'blue',
          number: 3,
        },
        {
          color: 'green',
          number: 4,
        },
        {
          color: '#ccc',
          number: 5,
        },
        {
          color: '#000',
          number: 6,
        },
        {
          color: 'red',
          number: 1,
        },
      ],
      index: 1,
      transitionTime: 0,
      operating: false,
    }
  },
  methods: {
    async onSwipe(v) {
      if (this.operating) {
        return;
      }
      this.operating = true;

      const len = this.list.length;
      this.transitionTime = 0.5;
      this.index = (this.index + v + len) % (len);
      console.log(this.index);
      await wait(this.transitionTime * 1000);
      this.transitionTime = 0;
      // 划到最后一个元素时，换回第一个元素
      if (this.index == len - 1) {
        await this.$nextTick();
        this.index = 1;
      }
      if (this.index == 0) {
        await this.$nextTick();
        this.index = len - 2;
      }

      this.operating = false;
    },
  },
  computed: {
    bannerLeft() {
      return -300 * this.index;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 300px;
  height: 200px;
  overflow: hidden;
  user-select:none;
}
.banner {
  height: 100%;
  position: absolute;
  top: 0px;
}
.banner .item {
  float: left;
  width: 300px;
  height: 100%;
  font-size: 80px;
  line-height: 200px;
}

.left-btn, .right-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  line-height: 50px;
  text-align: center;
  color: #fff;
  top: 75px;
  cursor: pointer;
  z-index: 2;
}
.left-btn {
  left: 0;
}
.right-btn {
  right: 0;
}
</style>
