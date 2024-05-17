<template>
  <!-- container -->
  <div class="container mx-auto px-4">
    <!-- navbar -->
    <div class="navbar rounded-btn bg-base-300">
      <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl">
        </a>
      </div>
      <div class="navbar-center">
        <a class="btn btn-ghost text-xl">Lucky Hash Game</a>
      </div>
      <div class="navbar-end">
        <div class="badge badge-primary badge-outline">V0.0.2</div>
      </div>
    </div>

    <!-- description -->
    <div class="flex items-center justify-center pt-5">
      <div tabindex="0" class="collapse w-2/3 bg-primary text-primary-content">
        <div class="collapse-title custom-collapse-title">
          点击查看规则
        </div>
        <div class="collapse-content">
          <p>1. 输入一个五位数的幸运号码以及一句"幸运句子"。我们将这句话发送给语言模型（LLM）。</p>
          <p>2. 幸运句子和LLM答复用加号拼在一起，使用 SHA-256 哈希函数处理。</p>
          <p>3. 将得到的哈希值转换为16进制。取哈希值的最后五位作为中奖号码。</p>
          <h3 class="mt-4">SHA-256 简介</h3>
          <p>SHA-256 是一种安全哈希算法，能将任意大小的数据转换为一个固定长度的唯一散列值。这种算法的结果具有不可预测性，使得游戏结果完全基于运气。</p>
        </div>
      </div>
    </div>

    <!-- content -->
    <h1 class="text-2xl font-bold text-center block pt-5">请输入你的 <div class="badge badge-lg badge-primary">Lucky Number
      </div> !</h1>
    <div class="center-flex">
      <input type="text" pattern="\d{5}" maxlength="5" placeholder="00000" oninput="value=value.replace(/[^\d]/g,'')"
        class="input input-bordered input-lg input-primary w-full max-w-xs lucky-number-input" />
    </div>
    <div class="center-flex">
      <input type="text" maxlength="20" placeholder="幸运句子(20字以内)" oninput="this.value = this.value.slice(0, 20)"
        class="input input-bordered input-lg input-primary w-full max-w-s lucky-sentence-input" />
    </div>
    <div class="center-flex">
      <button class="btn btn-primary">Lucky!</button>
    </div>


  </div>

  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <aside>
      <p><span id="busuanzi_container_site_pv">本站总访问量<span id="busuanzi_value_site_pv"></span>次</span></p>
    </aside>
  </footer>
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
.custom-collapse-title {
  text-align: center;
  /* 居中对齐 */
  font-weight: bold;
  /* 加粗 */
  font-size: 1.25em;
  /* 可选: 调整字体大小 */
}

.center-flex {
  display: flex;
  /* 启用Flexbox布局 */
  justify-content: center;
  /* 水平居中 */
  margin: 20px auto;
}

.center-flex .lucky-number-input {
  width: 300px;
  text-align: center;
  /* 使文本居中 */
  font-size: 36px;
  /* 字号加大 */
  font-weight: bold;
  /* 加粗 */
  letter-spacing: 25px;
  /* 增加字符间距 */
  padding-left: 40px;
}

.center-flex .lucky-sentence-input {
  width: 1000px;
  text-align: center;
  /* 使文本居中 */
  font-size: 15px;
  /* 字号加大 */
  font-weight: bold;
  /* 加粗 */
}

.footer {
  position: fixed;
  /* 固定定位 */
  bottom: 0;
  /* 紧贴底部 */
  left: 0;
  right: 0;
  /* 其他样式保持不变 */
}
</style>