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
        <div class="collapse-title custom-collapse-title">请点击查看规则</div>
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
        class="input input-bordered input-lg input-primary w-full max-w-xs lucky-number-input" v-model="luckyNumber" />
    </div>
    <div class="center-flex">
      <input type="text" maxlength="20" placeholder="幸运句子(20字以内)" oninput="this.value = this.value.slice(0, 20)"
        class="input input-bordered input-lg input-primary w-full max-w-s lucky-sentence-input"
        v-model="luckySentence" />
    </div>
    <div class="center-flex">
      <button class="btn btn-primary" @click="getLucky">Lucky!</button>
    </div>

    <!-- 历史记录表格 -->
    <div class="overflow-x-auto mt-5">
      <div class="table-responsive">
        <table class="table table-xs">
          <thead>
            <tr>
              <th>id</th>
              <th>幸运句子</th>
              <th>LLM的回复</th>
              <th>hash结果</th>
              <th>中奖号码</th>
              <th>Lucky Number</th>
              <th>得分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in sortedHistoryRecords" :key="record.id">
              <td data-label="id">{{ record.id }}</td>
              <td data-label="幸运句子">{{ record.luckySentence }}</td>
              <td data-label="LLM的回复">{{ record.message }}</td>
              <td data-label="hash结果" v-html="highlightWinningNumber(formatHash(record.hash), record.winningNumber)">
              </td>
              <td data-label="中奖号码"><span class="text-red-500">{{ record.winningNumber }}</span></td>
              <td data-label="Lucky Number">{{ record.luckyNumber }}</td>
              <td data-label="得分">{{ record.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <aside>
      <p><span id="busuanzi_container_site_pv">本站总访问量<span id="busuanzi_value_site_pv"></span>次</span></p>
    </aside>
  </footer>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  data() {
    return {
      luckyNumber: '',
      luckySentence: '',
      historyRecords: []
    };
  },
  computed: {
    sortedHistoryRecords() {
      return this.historyRecords.slice().reverse();
    },
  },
  methods: {
    async getLucky() {
      // 检查输入的幸运号码是否为5位数字
      if (!/^\d{5}$/.test(this.luckyNumber)) {
        alert('请输入一个五位数的幸运号码！');
        return;
      }

      // 检查幸运句子是否为空
      if (!this.luckySentence) {
        alert('请输入一个幸运句子！');
        return;
      }

      try {
        // 发送幸运句子到API
        const response = await fetch('https://lucky-hash.sennes.workers.dev/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: this.luckySentence })
        });

        // 检查API响应状态
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }

        const data = await response.json();
        const message = data.message;

        // 拼接幸运句子和API响应的message
        const combined = `${this.luckySentence}${message}`;

        // 计算SHA-256哈希值
        const hash = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);

        // 获取哈希值的最后五个数字作为中奖号码
        const allDigits = hash.match(/\d/g);
        const winningNumber = allDigits ? allDigits.slice(-5).join('') : '';

        // 计算得分
        const score = this.calculateScore(this.luckyNumber, winningNumber);

        // 保存记录
        this.historyRecords.push({
          id: this.historyRecords.length + 1,
          luckyNumber: this.luckyNumber,
          luckySentence: this.luckySentence,
          message: message,
          hash: hash,
          winningNumber: winningNumber,
          score: score
        });

        // 清空输入框
        this.luckyNumber = '';
        this.luckySentence = '';

      } catch (error) {
        console.error('出错了:', error);
        alert('处理过程中出错，请稍后再试！');
      }
    },

    // 计算得分的方法
    calculateScore(luckyNumber, winningNumber) {
      let score = '';
      for (let i = 0; i < luckyNumber.length; i++) {
        if (luckyNumber[i] === winningNumber[i]) {
          score += luckyNumber[i];
        }
      }
      return score.length > 0 ? score : '0';
    },

    // 用于标记哈希值中最后五个数字的方法
    highlightWinningNumber(hash, winningNumber) {
      if (!winningNumber) return hash;
      let highlightedHash = '';
      let count = 0;
      for (let i = hash.length - 1; i >= 0; i--) {
        if (count < 5 && /\d/.test(hash[i])) {
          highlightedHash = `<span class="text-red-500">${hash[i]}</span>` + highlightedHash;
          count++;
        } else {
          highlightedHash = hash[i] + highlightedHash;
        }
      }
      return highlightedHash;
    },
    // 格式化哈希值的方法
    formatHash(hash) {
      if (hash.length <= 20) {
        return hash;
      }
      return '...' + hash.slice(-20);
    }
  }
};
</script>

<style scoped>
.center-flex {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.custom-collapse-title {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>

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

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
}

.table-xs {
  width: 100%;
  border-collapse: collapse;
}

.table-xs th,
.table-xs td {
  padding: 8px;
  border: 1px solid #ddd;
}

@media (max-width: 600px) {
  .table-xs thead {
    display: none;
  }

  .table-xs,
  .table-xs tbody,
  .table-xs tr,
  .table-xs td {
    display: block;
    width: 100%;
  }

  .table-xs tr {
    margin-bottom: 15px;
  }

  .table-xs td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .table-xs td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 10px;
    font-weight: bold;
    text-align: left;
  }
}
</style>