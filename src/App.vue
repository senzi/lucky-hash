<template>
  <!-- container -->
  <div class="container mx-auto px-4">
    <!-- navbar -->
    <div class="navbar rounded-btn bg-base-300">
      <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl">
          logo here
        </a>
      </div>
      <div class="navbar-center">
        <a class="btn btn-ghost text-xl">Lucky Hash Game</a>
      </div>
      <div class="navbar-end">
        <div class="badge badge-primary badge-outline">V0.0.1</div>
      </div>
    </div>
    <!-- content -->
    <div class="center-flex">
      <input type="text" pattern="\d{5}" maxlength="5" placeholder="00000" oninput="value=value.replace(/[^\d]/g,'')" class="input" />
    </div>
  </div>

  <div class="container mx-auto px-4">

  </div>
</template>


<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped>
.center-flex {
  display: flex; /* 启用Flexbox布局 */
  justify-content: center; /* 水平居中 */
  margin: 20px auto;
}

.center-flex .input {
  width: 260px; 
  text-align: center; /* 使文本居中 */
  font-size: 36px; /* 字号加大 */
  font-weight: bold; /* 加粗 */
  letter-spacing: 25px; /* 增加字符间距 */
}

</style>