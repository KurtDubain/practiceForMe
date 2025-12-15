# 前端算法 & 手写题升级版（按类别整理，含完整实现）

> 包含原 `algorithms-from-js` 的全部题目实现，并按类别重组，便于快速定位。每节末尾有「返回目录」。

## 目录
- [前端算法 \& 手写题升级版（按类别整理，含完整实现）](#前端算法--手写题升级版按类别整理含完整实现)
  - [目录](#目录)
  - [工程 / 工具类](#工程--工具类)
    - [节流](#节流)
    - [防抖](#防抖)
    - [简单 EventBus](#简单-eventbus)
    - [Observable（发布订阅）](#observable发布订阅)
    - [千分位转换](#千分位转换)
    - [下划线/中划线转驼峰](#下划线中划线转驼峰)
    - [自定义数组解析（简化版）](#自定义数组解析简化版)
    - [封装 indexOf](#封装-indexof)
    - [16 进制转 10 进制](#16-进制转-10-进制)
  - [JS 语言基础手写](#js-语言基础手写)
    - [instanceof 手写](#instanceof-手写)
    - [call / apply / bind](#call--apply--bind)
    - [手写 new](#手写-new)
    - [柯里化](#柯里化)
    - [深拷贝（处理循环引用）](#深拷贝处理循环引用)
  - [异步与 Promise 控制](#异步与-promise-控制)
    - [Promise.all 手写](#promiseall-手写)
    - [Promise 的 retry](#promise-的-retry)
    - [Promise 的递归调用（顺序执行任务）](#promise-的递归调用顺序执行任务)
    - [Promise 并发限制](#promise-并发限制)
    - [Promise 队列 + 并发控制](#promise-队列--并发控制)
  - [数据结构设计题](#数据结构设计题)
    - [LRUCache](#lrucache)
    - [RandomizedSet（补充自 33-answers.js）](#randomizedset补充自-33-answersjs)
    - [LFUCache（补充自 33-answers.js）](#lfucache补充自-33-answersjs)
  - [数组 / 字符串 / 双指针](#数组--字符串--双指针)
    - [大数相加](#大数相加)
    - [Two Sum（返回数对）](#two-sum返回数对)
    - [最长无重复子串](#最长无重复子串)
    - [最小覆盖子串](#最小覆盖子串)
    - [下一个更大元素（单调栈）](#下一个更大元素单调栈)
    - [合并区间](#合并区间)
    - [二分查找 \& 旋转数组搜索](#二分查找--旋转数组搜索)
    - [三数之和](#三数之和)
    - [接雨水](#接雨水)
    - [对角线遍历矩阵](#对角线遍历矩阵)
    - [全排列](#全排列)
    - [数组转树](#数组转树)
    - [Pow（递归 + 快速幂）](#pow递归--快速幂)
    - [括号闭合](#括号闭合)
    - [KMP 字符串匹配](#kmp-字符串匹配)
    - [前 K 大（小顶堆）](#前-k-大小顶堆)
  - [排序](#排序)
    - [快速排序](#快速排序)
    - [归并排序](#归并排序)
  - [动态规划](#动态规划)
    - [零钱兑换](#零钱兑换)
    - [爬楼梯](#爬楼梯)
    - [打家劫舍](#打家劫舍)
    - [最长上升子序列（O(n^2)）](#最长上升子序列on2)
    - [编辑距离](#编辑距离)
  - [链表](#链表)
    - [反转链表](#反转链表)
    - [合并两个有序链表](#合并两个有序链表)
    - [回文链表](#回文链表)
    - [K 个一组反转链表（补充自 33-answers.js）](#k-个一组反转链表补充自-33-answersjs)
  - [树](#树)
    - [翻转二叉树](#翻转二叉树)
    - [二叉树遍历（前/中/后/层序）](#二叉树遍历前中后层序)
    - [二叉树最近公共祖先](#二叉树最近公共祖先)
    - [对象 DFS/BFS、多叉树层序](#对象-dfsbfs多叉树层序)
    - [二叉树序列化 / 反序列化（层序，补充自 33-answers.js）](#二叉树序列化--反序列化层序补充自-33-answersjs)

---

## 工程 / 工具类

<a id="throttle"></a>
### 节流
```js
function throttle(func, delay) {
  let timer = null;
  return function throttled(...args) {
    if (timer === null) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
```

<a id="debounce"></a>
### 防抖
```js
function debounce(func, delay) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

<a id="eventbus"></a>
### 简单 EventBus
```js
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(handler);
  }

  off(event, handler) {
    if (!this.events.has(event)) return;
    if (handler) {
      this.events.get(event).delete(handler);
    } else {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach((handler) => handler(...args));
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
```

<a id="observable"></a>
### Observable（发布订阅）
```js
class Observable {
  constructor(value) {
    this.value = value;
    this.subscribers = new Set();
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  setValue(newValue) {
    if (newValue === this.value) return;
    this.value = newValue;
    this.subscribers.forEach((fn) => fn(newValue));
  }

  getValue() {
    return this.value;
  }
}
```

<a id="changek"></a>
### 千分位转换
```js
function changeK(str) {
  const [intStr, decStr] = str.split(".");
  const chars = intStr.replace(/^(-)/, "").split("");
  const sign = intStr.startsWith("-") ? "-" : "";
  let count = 2;
  const result = [];

  for (let i = chars.length - 1; i >= 0; i--) {
    result.unshift(chars[i]);
    if (count === 0 && i !== 0) {
      result.unshift(",");
      count = 2;
    } else {
      count--;
    }
  }

  const intPart = sign + result.join("");
  return decStr != null ? `${intPart}.${decStr}` : intPart;
}
```

<a id="changetocamel"></a>
### 下划线/中划线转驼峰
```js
function changeToCamel(str) {
  const parts = str.split(/[-_]/);
  if (parts.length === 0) return "";
  const result = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    result.push(part[0].toUpperCase() + part.slice(1));
  }
  return result.join("");
}
```

<a id="parsearr"></a>
### 自定义数组解析（简化版）
```js
function parseArr(str) {
  let index = 0;

  function parseVal(value) {
    const trimmed = value.trim();
    if (trimmed === "") return "";
    if (!Number.isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
    if (
      trimmed.startsWith('"') &&
      trimmed.endsWith('"') &&
      trimmed.length >= 2
    ) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  }

  function parse() {
    const result = [];
    while (index < str.length) {
      const char = str[index];
      if (char === "[") {
        index++;
        result.push(parse());
      } else if (char === "]") {
        index++;
        break;
      } else if (char === ",") {
        index++;
      } else {
        let value = "";
        while (
          index < str.length &&
          str[index] !== "," &&
          str[index] !== "]"
        ) {
          value += str[index];
          index++;
        }
        result.push(parseVal(value));
      }
    }
    return result;
  }

  return parse();
}
```

<a id="findsubstringindex"></a>
### 封装 indexOf
```js
function findSubStringIndex(strDad, strSon) {
  return strDad.indexOf(strSon);
}
```

<a id="ch16to10"></a>
### 16 进制转 10 进制
```js
function Ch16To10(str) {
  const keyArr = "0123456789ABCDEF";
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const curStr = str[i];
    const trueNum = keyArr.indexOf(curStr.toUpperCase());
    if (trueNum === -1) {
      throw new Error("Invalid hex char: " + curStr);
    }
    sum = sum * 16 + trueNum;
  }
  return sum;
}
```

[⬆ 返回目录](#目录)

## JS 语言基础手写

<a id="newinstanceof"></a>
### instanceof 手写
```js
function NewInstanceof(obj, constructor) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }
  let prototype = Object.getPrototypeOf(obj);
  while (prototype !== null) {
    if (prototype === constructor.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}
```

<a id="callapplybind"></a>
### call / apply / bind
```js
Function.prototype.myCall = function (context, ...args) {
  context = context == null ? globalThis : Object(context);
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

Function.prototype.myApply = function (context, args) {
  context = context == null ? globalThis : Object(context);
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...(args || []));
  delete context[fn];
  return result;
};

Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  return function boundFn(...newArgs) {
    return fn.apply(context, args.concat(newArgs));
  };
};
```

<a id="mynew"></a>
### 手写 new
```js
function myNew(constructor, ...args) {
  const newObj = Object.create(constructor.prototype);
  const result = constructor.apply(newObj, args);
  return result && typeof result === "object" ? result : newObj;
}
```

<a id="curry"></a>
### 柯里化
```js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...newArgs) {
        return curried.apply(this, args.concat(newArgs));
      };
    }
  };
}
```

<a id="deepclone"></a>
### 深拷贝（处理循环引用）
```js
function Deepclone(obj, visited = new Map()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (visited.has(obj)) {
    return visited.get(obj);
  }
  const clone = Array.isArray(obj) ? [] : {};
  visited.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = Deepclone(obj[key], visited);
    }
  }
  return clone;
}
```

[⬆ 返回目录](#目录)

## 异步与 Promise 控制

<a id="promiseall"></a>
### Promise.all 手写
```js
function promiseAll(arr) {
  return new Promise((resolve, reject) => {
    const results = [];
    let finished = 0;
    const n = arr.length;

    if (n === 0) {
      resolve(results);
      return;
    }

    arr.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = value;
          finished++;
          if (finished === n) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

<a id="retry"></a>
### Promise 的 retry
```js
function retry(func, count) {
  return new Promise((resolve, reject) => {
    let times = 0;

    function tryIt() {
      Promise.resolve()
        .then(func)
        .then(resolve)
        .catch((error) => {
          if (times < count) {
            times++;
            tryIt();
          } else {
            reject(error);
          }
        });
    }

    tryIt();
  });
}
```

<a id="diguipromise"></a>
### Promise 的递归调用（顺序执行任务）
```js
function DiguiPromise(tasks) {
  const arr = tasks.slice();

  function run(index) {
    if (index >= arr.length) {
      return Promise.resolve();
    }
    const cur = arr[index];
    return Promise.resolve(
      typeof cur === "function" ? cur() : cur
    )
      .then((res) => {
        console.log(res);
        return run(index + 1);
      })
      .catch((err) => {
        console.log(err);
        return run(index + 1);
      });
  }

  return run(0);
}
```

<a id="limitconcurrency"></a>
### Promise 并发限制
```js
function limitConcurrency(tasks, limit) {
  return new Promise((resolve, reject) => {
    const n = tasks.length;
    if (n === 0) {
      resolve([]);
      return;
    }
    const results = new Array(n);
    let nextIndex = 0;
    let finished = 0;

    function run(index) {
      if (index >= n) return;
      const task = tasks[index];
      Promise.resolve()
        .then(() => task())
        .then((res) => {
          results[index] = res;
          finished++;
          if (finished === n) {
            resolve(results);
          } else if (nextIndex < n) {
            run(nextIndex++);
          }
        })
        .catch(reject);
    }

    const initial = Math.min(limit, n);
    for (let i = 0; i < initial; i++) {
      run(nextIndex++);
    }
  });
}
```

<a id="promisequeue"></a>
### Promise 队列 + 并发控制
```js
function promiseQueue(tasks, maxConcurrent) {
  const results = [];
  let index = 0;
  let running = 0;
  const queue = tasks.slice();

  return new Promise((resolve, reject) => {
    function runTask() {
      if (queue.length === 0 && running === 0) {
        resolve(results);
        return;
      }
      while (running < maxConcurrent && queue.length > 0) {
        const currentTaskIndex = index++;
        const task = queue.shift();
        running++;
        Promise.resolve()
          .then(() => task())
          .then((result) => {
            results[currentTaskIndex] = result;
            running--;
            runTask();
          })
          .catch(reject);
      }
    }
    runTask();
  });
}
```

[⬆ 返回目录](#目录)

## 数据结构设计题

<a id="lru"></a>
### LRUCache
```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
```

<a id="randomizedset"></a>
### RandomizedSet（补充自 33-answers.js）
```js
class RandomizedSet {
  constructor() {
    this.arr = [];
    this.map = new Map(); // val -> index
  }
  insert(val) {
    if (this.map.has(val)) return false;
    this.map.set(val, this.arr.length);
    this.arr.push(val);
    return true;
  }
  remove(val) {
    if (!this.map.has(val)) return false;
    const idx = this.map.get(val);
    const last = this.arr[this.arr.length - 1];
    [this.arr[idx], this.arr[this.arr.length - 1]] = [this.arr[this.arr.length - 1], this.arr[idx]];
    this.map.set(last, idx);
    this.arr.pop();
    this.map.delete(val);
    return true;
  }
  getRandom() {
    const idx = Math.floor(Math.random() * this.arr.length);
    return this.arr[idx];
  }
}
```

<a id="lfu"></a>
### LFUCache（补充自 33-answers.js）
```js
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyToVal = new Map();
    this.keyToFreq = new Map();
    this.freqToKeys = new Map();
    this.minFreq = 0;
  }
  _updateFreq(key) {
    const freq = this.keyToFreq.get(key);
    this.keyToFreq.set(key, freq + 1);
    this.freqToKeys.get(freq).delete(key);
    if (this.freqToKeys.get(freq).size === 0) {
      this.freqToKeys.delete(freq);
      if (this.minFreq === freq) this.minFreq++;
    }
    if (!this.freqToKeys.has(freq + 1)) this.freqToKeys.set(freq + 1, new Set());
    this.freqToKeys.get(freq + 1).add(key);
  }
  get(key) {
    if (!this.keyToVal.has(key)) return -1;
    this._updateFreq(key);
    return this.keyToVal.get(key);
  }
  put(key, value) {
    if (this.capacity === 0) return;
    if (this.keyToVal.has(key)) {
      this.keyToVal.set(key, value);
      this._updateFreq(key);
      return;
    }
    if (this.keyToVal.size >= this.capacity) {
      const keys = this.freqToKeys.get(this.minFreq);
      const victim = keys.values().next().value;
      keys.delete(victim);
      if (keys.size === 0) this.freqToKeys.delete(this.minFreq);
      this.keyToVal.delete(victim);
      this.keyToFreq.delete(victim);
    }
    this.keyToVal.set(key, value);
    this.keyToFreq.set(key, 1);
    if (!this.freqToKeys.has(1)) this.freqToKeys.set(1, new Set());
    this.freqToKeys.get(1).add(key);
    this.minFreq = 1;
  }
}
```

[⬆ 返回目录](#目录)

## 数组 / 字符串 / 双指针

<a id="bignumadd"></a>
### 大数相加
```js
function bigNumAdd(str1, str2) {
  let i = str1.length - 1;
  let j = str2.length - 1;
  let carry = 0;
  const result = [];

  while (i >= 0 || j >= 0 || carry > 0) {
    const num1 = i >= 0 ? Number(str1[i]) : 0;
    const num2 = j >= 0 ? Number(str2[j]) : 0;

    const sum = num1 + num2 + carry;
    result.unshift(sum % 10);
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  return result.join("");
}
```

<a id="findsum"></a>
### Two Sum（返回数对）
```js
function findSum(arr, target) {
  const map = new Map();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i];
    if (map.has(need)) {
      result.push([arr[i], need]);
    }
    map.set(arr[i], i);
  }
  return result;
}
```

<a id="longestnonrepeat"></a>
### 最长无重复子串
```js
function longestNonRepeatingSubstring(str) {
  let start = 0;
  let end = 0;
  let maxLen = 0;
  let maxStart = 0;
  const set = new Set();

  while (start < str.length && end < str.length) {
    if (!set.has(str[end])) {
      set.add(str[end]);
      if (end - start + 1 > maxLen) {
        maxLen = end - start + 1;
        maxStart = start;
      }
      end++;
    } else {
      set.delete(str[start]);
      start++;
    }
  }
  return str.substr(maxStart, maxLen);
}
```

<a id="minwindow"></a>
### 最小覆盖子串
```js
function minWindowSubstring(s, t) {
  if (!s || !t || s.length < t.length) return "";
  const need = new Map();
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }
  const window = new Map();
  let have = 0;
  const needCount = need.size;
  let left = 0;
  let minLen = Infinity;
  let start = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      window.set(ch, (window.get(ch) || 0) + 1);
      if (window.get(ch) === need.get(ch)) {
        have++;
      }
    }
    while (have === needCount) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const leftChar = s[left];
      if (need.has(leftChar)) {
        window.set(leftChar, window.get(leftChar) - 1);
        if (window.get(leftChar) < need.get(leftChar)) {
          have--;
        }
      }
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(start, start + minLen);
}
```

<a id="nextgreaterelement"></a>
### 下一个更大元素（单调栈）
```js
function nextGreaterElement(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      res[idx] = nums[i];
    }
    stack.push(i);
  }
  return res;
}
```

<a id="mergeintervals"></a>
### 合并区间
```js
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}
```

<a id="binarysearch"></a>
### 二分查找 & 旋转数组搜索
```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const val = nums[mid];
    if (val === target) return mid;
    if (val < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

<a id="searchrotatedarray"></a>
function searchInRotatedArray(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```

<a id="threesum"></a>
### 三数之和
```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

<a id="trappingrain"></a>
### 接雨水
```js
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let lMax = 0;
  let rMax = 0;
  let water = 0;
  while (l < r) {
    lMax = Math.max(lMax, height[l]);
    rMax = Math.max(rMax, height[r]);
    if (lMax < rMax) {
      water += lMax - height[l];
      l++;
    } else {
      water += rMax - height[r];
      r--;
    }
  }
  return water;
}
```

<a id="diagonaltraverse"></a>
### 对角线遍历矩阵
```js
function diagonalTraverse(matrix) {
  if (matrix.length === 0 || matrix[0].length === 0) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = [];
  let row = 0;
  let col = 0;
  let direction = 1;

  for (let i = 0; i < rows * cols; i++) {
    result.push(matrix[row][col]);
    row -= direction;
    col += direction;

    if (row >= rows) {
      row = rows - 1;
      col += 2;
      direction = -direction;
    }
    if (col >= cols) {
      col = cols - 1;
      row += 2;
      direction = -direction;
    }
    if (row < 0) {
      row = 0;
      direction = -direction;
    }
    if (col < 0) {
      col = 0;
      direction = -direction;
    }
  }
  return result;
}
```

<a id="permute"></a>
### 全排列
```js
function permute(nums) {
  const result = [];
  function backtrack(start) {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }
    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }
  backtrack(0);
  return result;
}
```

<a id="arraytotree"></a>
### 数组转树
```js
function arrayToTree(arr) {
  const map = {};
  const roots = [];

  arr.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  Object.values(map).forEach((node) => {
    if (node.parentId !== null && node.parentId !== undefined) {
      const parent = map[node.parentId];
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}
```

<a id="newpow"></a>
### Pow（递归 + 快速幂）
```js
function NewPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / NewPow(x, -n);
  if (n % 2 === 0) {
    const half = NewPow(x, n / 2);
    return half * half;
  }
  return x * NewPow(x, n - 1);
}
```

<a id="isclosed"></a>
### 括号闭合
```js
function isClosed(str) {
  if (!str) return true;

  const stack = [];
  const left = ["(", "[", "{"];
  const right = [")", "]", "}"];

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (left.includes(ch)) {
      stack.push(ch);
    } else if (right.includes(ch)) {
      const expected = left[right.indexOf(ch)];
      const last = stack.pop();
      if (last !== expected) {
        return false;
      }
    }
  }
  return stack.length === 0;
}
```

<a id="kmp"></a>
### KMP 字符串匹配
```js
function kmpSearch(text, pattern) {
  if (pattern === "") return 0;
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  for (let i = 1, len = 0; i < m; ) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === m) return i - j;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return -1;
}
```

<a id="topk"></a>
### 前 K 大（小顶堆）
```js
function heapPush(heap, x) {
  heap.push(x);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] <= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    i = p;
  }
}
function heapPop(heap) {
  if (heap.length === 1) return heap.pop();
  const top = heap[0];
  heap[0] = heap.pop();
  let i = 0;
  const n = heap.length;
  while (true) {
    let smallest = i;
    const l = i * 2 + 1;
    const r = i * 2 + 2;
    if (l < n && heap[l] < heap[smallest]) smallest = l;
    if (r < n && heap[r] < heap[smallest]) smallest = r;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;
  }
  return top;
}
function topKLargest(nums, k) {
  const heap = [];
  for (const x of nums) {
    heapPush(heap, x);
    if (heap.length > k) heapPop(heap);
  }
  return heap.sort((a, b) => b - a);
}
```

[⬆ 返回目录](#目录)

## 排序

<a id="quicksort"></a>
### 快速排序
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const p = Math.floor(arr.length / 2);
  const pivot = arr[p];
  const left = [];
  const right = [];
  const mid = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      mid.push(arr[i]);
    }
  }
  return quickSort(left).concat(mid, quickSort(right));
}
```

<a id="mergesort"></a>
### 归并排序
```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let li = 0;
  let ri = 0;
  while (li < left.length && ri < right.length) {
    if (left[li] < right[ri]) {
      result.push(left[li++]);
    } else {
      result.push(right[ri++]);
    }
  }
  return result.concat(left.slice(li)).concat(right.slice(ri));
}
```

[⬆ 返回目录](#目录)

## 动态规划

<a id="findmoney"></a>
### 零钱兑换
```js
function findMoney(amount, coins) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

<a id="jumpfloor"></a>
### 爬楼梯
```js
function jumpFloor1(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  return jumpFloor1(n - 1) + jumpFloor1(n - 2);
}

function jumpFloor2(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

<a id="rob1"></a>
### 打家劫舍
```js
function rob1(arr) {
  const n = arr.length;
  if (n === 0) return 0;
  if (n === 1) return arr[0];

  const dp = new Array(n);
  dp[0] = arr[0];
  dp[1] = Math.max(arr[0], arr[1]);

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + arr[i]);
  }
  return dp[n - 1];
}
```

<a id="lengthoflis"></a>
### 最长上升子序列（O(n^2)）
```js
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let res = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    res = Math.max(res, dp[i]);
  }
  return res;
}
```

<a id="editdistance"></a>
### 编辑距离
```js
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          Math.min(
            dp[i - 1][j],
            dp[i][j - 1],
            dp[i - 1][j - 1]
          ) + 1;
      }
    }
  }
  return dp[m][n];
}
```

[⬆ 返回目录](#目录)

## 链表

<a id="reverselinkedlist"></a>
### 反转链表
```js
function reverseLinkedList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

<a id="mergetwosortedlists"></a>
### 合并两个有序链表
```js
function mergeTwoSortedLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let current = dummy;
  let p1 = l1;
  let p2 = l2;
  while (p1 && p2) {
    if (p1.val <= p2.val) {
      current.next = p1;
      p1 = p1.next;
    } else {
      current.next = p2;
      p2 = p2.next;
    }
    current = current.next;
  }
  current.next = p1 || p2;
  return dummy.next;
}
```

<a id="isbacklist"></a>
### 回文链表
```js
function isBackList(head) {
  if (!head || !head.next) return true;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  if (fast) {
    slow = slow.next;
  }

  let secondHead = reverseNodeList(slow);
  let p1 = head;
  let p2 = secondHead;

  while (p2) {
    if (p1.val !== p2.val) {
      return false;
    }
    p1 = p1.next;
    p2 = p2.next;
  }
  return true;
}

function reverseNodeList(head) {
  let cur = head;
  let pre = null;
  while (cur) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}
```

<a id="reversekgroup"></a>
### K 个一组反转链表（补充自 33-answers.js）
```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  while (true) {
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;

    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur !== groupNext) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }

    const tmp = groupPrev.next;
    groupPrev.next = prev;
    groupPrev = tmp;
  }
  return dummy.next;
}
```

[⬆ 返回目录](#目录)

## 树

<a id="reversetree"></a>
### 翻转二叉树
```js
function reverseTree(root) {
  if (!root) return null;
  const left = reverseTree(root.left);
  const right = reverseTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}
```

<a id="traversals"></a>
### 二叉树遍历（前/中/后/层序）
```js
function preorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

function inorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

function postorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}

function levelOrderTraversal(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const len = queue.length;
    const level = [];
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

<a id="lca"></a>
### 二叉树最近公共祖先
```js
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

<a id="objecttraverse"></a>
### 对象 DFS/BFS、多叉树层序
```js
function dfsObj1(obj) {
  console.log(obj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        dfsObj1(obj[key]);
      }
    }
  }
}

function dfsObj2(obj) {
  const stack = [obj];
  while (stack.length > 0) {
    const current = stack.pop();
    console.log(current);
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        if (typeof current[key] === "object" && current[key] !== null) {
          stack.push(current[key]);
        }
      }
    }
  }
}

function bfsObj(obj) {
  const queue = [obj];
  while (queue.length > 0) {
    const current = queue.shift();
    console.log(current);
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        if (typeof current[key] === "object" && current[key] !== null) {
          queue.push(current[key]);
        }
      }
    }
  }
}

// root: { val: any, children: Node[] }
function bfsMuchTree(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];
  while (queue.length > 0) {
    const cur = queue.shift();
    result.push(cur.val);
    if (Array.isArray(cur.children)) {
      for (const child of cur.children) {
        if (child) queue.push(child);
      }
    }
  }
  return result;
}

<a id="rightview"></a>
### 二叉树右视图 / 锯齿层序（补充自 33-answers.js）
```js
function rightSideView(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    let last = null;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      last = node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(last);
  }
  return res;
}

function zigzagLevelOrder(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const len = queue.length;
    const level = [];
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (leftToRight) level.push(node.val);
      else level.unshift(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
    leftToRight = !leftToRight;
  }
  return res;
}
```

<a id="serializetree"></a>
### 二叉树序列化 / 反序列化（层序，补充自 33-answers.js）
```js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
function serialize(root) {
  if (!root) return "";
  const queue = [root];
  const out = [];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      out.push(node.val);
      queue.push(node.left, node.right);
    } else {
      out.push("#");
    }
  }
  return out.join(",");
}

function deserialize(data) {
  if (!data) return null;
  const arr = data.split(",");
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    const leftVal = arr[i++];
    const rightVal = arr[i++];
    if (leftVal !== "#" && leftVal !== undefined) {
      node.left = new TreeNode(leftVal);
      queue.push(node.left);
    }
    if (rightVal !== "#" && rightVal !== undefined) {
      node.right = new TreeNode(rightVal);
      queue.push(node.right);
    }
  }
  return root;
}
```
```

[⬆ 返回目录](#目录)

## 图 / 并查集

<a id="unionfind"></a>
### 并查集 + 岛屿数量
```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
  }
}

// grid: '1' / '0'
<a id="numislands"></a>
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const getIndex = (r, c) => r * cols + c;
  const uf = new UnionFind(rows * cols);
  let waterCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "0") {
        waterCount++;
        continue;
      }
      if (r + 1 < rows && grid[r + 1][c] === "1") {
        uf.union(getIndex(r, c), getIndex(r + 1, c));
      }
      if (c + 1 < cols && grid[r][c + 1] === "1") {
        uf.union(getIndex(r, c), getIndex(r, c + 1));
      }
    }
  }

  return uf.count - waterCount;
}

<a id="canfinish"></a>
### 课程表（拓扑排序，补充自 33-answers.js）
```js
function canFinish(numCourses, prerequisites) {
  const indeg = new Array(numCourses).fill(0);
  const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let visited = 0;
  for (let i = 0; i < q.length; i++) {
    const u = q[i];
    visited++;
    for (const v of g[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return visited === numCourses;
}
```
```

[⬆ 返回目录](#目录)
