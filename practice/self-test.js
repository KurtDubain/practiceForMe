// 自测题单（与 README 目录一致）
//
// 工程 / 工具类

const { dir } = require("console");
const { futimes } = require("fs");
const { resolve } = require("path");

// - 节流
function throttle(func, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
// - 防抖
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
// - 简单 EventBus
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

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((handler) => {
        handler.apply(this, args);
      });
    }
  }

  off(event, handler) {
    if (!this.events.has(event)) {
      return;
    }
    if (handler) {
      this.events.get(event).delete(handler);
    } else {
      this.events.delete(event);
    }
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, handler);
    };
    this.on(event, wrapper);
  }
}

// - Observable（发布订阅）

// - 千分位转换

function changeK(str) {
  const [intNum, decNum] = str.split(".");
  const chars = intNum.split("");
  let count = 2;
  const results = [];
  for (let i = 0; i < chars.length; i++) {
    results.unshift(chars[i]);
    if (count === 0 && i !== 0) {
      results.unshift(",");
      count = 2;
    } else {
      count--;
    }
  }
  const intPart = results.join("");
  return decNum ? `${intPart}.${decNum}` : intNum;
}
// - 下划线/中划线转驼峰

function changeToCamel(str) {
  const parts = str.split(/[-_]/);
  const result = [parts[0]];
  if (parts.length === 0) return;
  for (let i = 1; i < parts.length; i++) {
    result.push(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result.join("");
}
// - 自定义数组解析（简化版）
function parseArr(str) {
  let index = 0;
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
        while (index < str.length && str[index] !== "," && str[index] !== "]") {
          value += str[index];
          index;
        }
        result.push(parseVal(value));
      }
    }
  }

  function parseVal(value) {
    const trimmed = value.trim();
    if (trimmed === "") return "";
    if (!trimmed.isNaN()) {
      return trimmed;
    }
    if (
      trimmed.startsWith('"') &&
      trimmed.endsWith('"') &&
      trimmed.length > 2
    ) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  }
}

// - 封装 indexOf
// - 16 进制转 10 进制
// - 数组扁平化
// - 对象扁平化
// - 深比较
// - URL 参数解析 / 序列化
// - 数组去重
//
// JS 语言基础手写
// - instanceof 手写
function myInstanceof(obj, constructor) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }
  const prototype = Object.getPrototypeOf(obj);
  while (prototype) {
    if (prototype === constructor.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}
// - call / apply / bind

// - 手写 new
// - 柯里化
// - 柯里化（可变参数）
// - 函数组合（compose / pipe）
// - 函数记忆（memoize）
// - 函数只执行一次（once）
// - 深拷贝（处理循环引用）
//
// 异步与 Promise 控制
// - Promise.all 手写
function promiseAll(arr) {
  return new Promise((resolve, reject) => {
    const results = [];
    let finished = 0;
    const n = arr.length;
    if (n === 0) {
      resolve(results);
      return;
    }
    arr.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((res) => {
          results[index].push(res);
          finished++;
          if (finished === n) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
// - Promise 的 retry

function promiseRetry(func, count) {
  return new Promise(res, (rej) => {
    let times = 0;
    // Promise.resolve(func)
    function tryIt() {
      Promise.resolve()
        .then(func)
        .then(res)
        .catch((err) => {
          if (count === times) {
            rej(err);
          } else {
            count++;
            tryIt();
          }
        });
    }
  });
}
// - Promise 的递归调用（顺序执行任务）
function diguiPromise(tasks) {
  const arr = tasks.slice();
  function run(index) {
    if (index >= arr.length) {
      return Promise.resolve();
    }
    const cur = arr[index];
    Promise.resolve(typeof cur === "function" ? cur : cur())
      .then((res) => {
        return run(index + 1);
      })
      .catch((rej) => {
        return run(index + 1);
      });
  }
  return run(0);
}
// - Promise 并发限制

function limitPromise(tasks, limit) {
  return new Promise((resolve, reject) => {
    if (tasks.length === 0) {
      resolve([]);
      return;
    }
    const results = new Array(tasks.length);
    let next = 0;
    let finished = 0;
    function run(index) {
      if (index >= tasks.length) {
        return;
      }
      const task = tasks[index];
      Promise.resolve()
        .then(task)
        .then((res) => {
          results[index] = res;
          finished++;
          if (finished === tasks.length) {
            resolve(results);
          } else {
            run(next++);
          }
        });
    }
    const minLimit = Math.min(tasks.length, limit);
    for (let i = 0; i < minLimit; i++) {
      run(next++);
    }
  });
}
// - Promise 队列 + 并发控制
// - Promise 串行执行器（调用一次执行一次）

//
// 数据结构设计题
// - LRUCache
class LRUCache {
  constructor(cap) {
    this.cap = cap;
    this.cache = new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
  }

  put(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.cap) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(key, val);
  }
}
// - RandomizedSet（补充自 33-answers.js）
class RandomizedSet {
  constructor() {
    this.arr = [];
    this.map = new Map();
  }

  insert(val) {
    if (!this.map.has(val)) {
      this.map.set(val, this.arr.length);
      this.arr.push(val);
      return true;
    }
    return false;
  }
  remove(val) {
    if (this.map.has(val)) {
      const index = this.map.get(val);
      const last = this.arr[this.arr.length - 1];
      [this.arr[index], this.arr[this.arr.length - 1]] = [
        last,
        this.arr[index],
      ];
      this.map.delete(val);
      this.arr.pop();
      this.map.set(last, index);
      return true;
    }
    return false;
  }

  getRandom() {
    return this.arr[Math.floor(Math.random() * this.arr.length)];
  }
}
// - LFUCache（补充自 33-answers.js）
// - MinStack
// - 用栈实现队列
// - 用队列实现栈
// - 前缀树 Trie
//
// 数组 / 字符串 / 双指针
// - 大数相加
function bigNumSum(str1, str2) {
  let i = str1.length - 1;
  let j = str2.length - 1;
  let carry = 0;
  const results = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const num1 = i >= 0 ? Number(str1[i]) : 0;
    const num2 = j >= 0 ? Number(str2[j]) : 0;
    let result = num1 + num2 + carry;
    results.unshift(result % 10);
    carry = Math.floor(result / 10);
    i--;
    j--;
  }
  return results.join("");
}
// - Two Sum（返回数对）
// - 最长无重复子串
function maxLengthStr(str) {
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

// - 最小覆盖子串

// - 下一个更大元素（单调栈）
function nextMax(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const index = stack.pop();
      res[index] = nums[i];
    }
    stack.push(i);
  }
  return res;
}

// - 合并区间
function mergeArr(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0].slice()];
  for (let i = 0; i < intervals.length; i++) {
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
// - 二分查找 & 旋转数组搜索
function findArrMid(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] >= nums[left]) {
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
// - 三数之和

function threeSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > target) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === target) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
        }
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}

// - 接雨水
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let lMax = 0;
  let rMax = 0;
  let water = 0;
  while (left < right) {
    lMax = Math.max(lMax, height[left]);
    rMax = Math.max(rMax, height[right]);
    if (lMax < rMax) {
      water += lMax - height[left];
      left++;
    } else {
      water += rMax - height[right];
      right--;
    }
  }
  return water;
}

// - 对角线遍历矩阵
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
      row -= 1;
      col += 2;
      direction = -direction;
    }
    if (col >= cols) {
      col -= 1;
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

// - 全排列
function permute(nums) {
  const result = [];
  function backTrack(start) {
    if (start === nums.length) {
      result.push(...nums);
      return;
    }
    const used = new Set();
    for (let i = start; i < nums.length; i++) {
      if (used.has(nums[i])) continue;
      used.add(nums[i]);
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backTrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }
  backTrack(0);
  return result;
}
// - 数组转树
function arrayToTree(arr) {
  const map = {};
  const roots = [];
  arr.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  Object.values(map).forEach((node) => {
    if (node.parentId) {
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

// - Pow（递归 + 快速幂）

// - 括号闭合
function isClosed(str) {
  if (!str) return true;
  const left = ["(", "[", "{"];
  const right = [")", "]", "}"];
  const stack = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (left.includes(char)) {
      stack.push(char);
    } else if (right.includes(char)) {
      const lastCh = stack.pop();
      const expected = left[right.indexOf(char)];
      if (expected !== lastCh) {
        return false;
      }
    }
  }
  return stack.length === 0;
}
// - KMP 字符串匹配
// - 前 K 大（小顶堆）
// - 移动零
function moveZero(nums) {
  let insert = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insert] === nums[i];
      insert++;
    }
  }
  while (insert < nums.length) {
    nums[insert] = 0;
    insert++;
  }
  return nums;
}
// - 盛最多水
function getMostWater(heights) {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;
  while (left < right) {
    h = Math.min(heights[left], heights[right]);
    best = Math.max(best, h * (right - left));
    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }
  return best;
}

// - 最长公共前缀
function longestPrefix(strs) {
  if (!strs || strs.length === 0) {
    return;
  }
  let prefix = strs[0];
  for (let i = 0; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
// - 合并两个有序数组
function mergeArr(arr1, arr2) {
  let l1 = arr1.length - 1;
  let l2 = arr2.length - 1;

  let k = l1 + l2 - 1;

  while (l2 >= 0) {
    if (l1 >= 0 && arr1[l1] > arr2[l2]) {
      arr1[k] = arr1[l1];
      l1--;
      k--;
    } else {
      arr1[k] = arr2[l2];
      l2--;
      k--;
    }
  }
  return arr1;
}
// - 旋转数组
function reverseArr(nums, k) {
  const length = nums.length;
  if (length === 0) return nums;
  k = k % n;
  reverse(nums, 0, n - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, n - 1);
  function reverse(arr, start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }
}
// - 滑动窗口最大值
function maxSlidingWindow(nums, k) {
  if (k <= 0) return;
  const deque = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push();
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
// - 字母异位词分组
function groupAna(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split("").sort.join("");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }
  return Array.from(map.values());
}
//
// 排序
// - 快速排序
function quickSort(arr) {
  if (arr.length === 0) return arr;
  let mid = Math.floor(arr.length / 2);
  const left = [];
  const right = [];
  const midArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < arr[mid]) {
      left.push(arr[i]);
    } else if (arr[i] > arr[mid]) {
      right.push(arr[i]);
    } else {
      midArr.push(arr[i]);
    }
  }
  return quickSort(left).concat(mid, quickSort(right));
}
// - 归并排序
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
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

//
// 动态规划
// - 零钱兑换
function findMoney(amount, coins) {
  const dp = new Array(amount + 1).fill(Infinity);
  for (let i = 1; i < amount; i++) {
    for (const coin of coins) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// - 爬楼梯
function jumpFloor1(n) {
  if (n <= 0) return 0;
  if (n === 1) {
    return 1;
  }
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
// - 打家劫舍

// - 最长上升子序列（O(n^2)）
// - 编辑距离
// - 最大子数组和
// - 不同路径
// - 最长公共子序列
//
// 链表
// - 反转链表
function reverseList(node) {
  let prev = null;
  let cur = node;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
}
// - 合并两个有序链表
function mergtTwoList(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let p1 = l1;
  let p2 = l2;
  while (p1 && p2) {
    if (p1.val >= p2.val) {
      cur.next = p2;
      p2 = p2.next;
    } else {
      cur.next = p1;
      p1 = p1.next;
    }
    cur = cur.next;
  }
  cur.next = p1 || p2;
  return dummy.next;
}

// - 回文链表
function isBackList(node) {
  if (!node || !head.next) return true;
  let slow = node;
  let fast = node;

  while (fast) {
    slow = slow.next;
    fast = fast.next.next;
  }
  if (fast) {
    slow = slow.next;
  }

  let secondHead = reverseList(slow);
  let p1 = node;
  let p2 = secondHead;
  while (p2) {
    if (p1 !== p2) {
      return false;
    }
    p1 = p1.next;
    p2 = p2.next;
  }
  return true;
}

// - K 个一组反转链表（补充自 33-answers.js）

// - 环形链表
function ishuan(head) {
  let slow = head;
  let fast = head;
  while (fast) {
    slow = slow.next;
    fast = fast.next.next;
    if ((slow.val = fast.val)) {
      return true;
    }
  }
  return false;
}
// - 删除倒数第 N 个节点
function deleteN(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  if (slow.next) slow.next = slow.next.next;
  return dummy.next;
}
// - 相交链表
function isxiangjiao(l1, l2) {
  let p1 = l1;
  let p2 = l2;
  while (p1 !== p2) {
    p1 = p1 ? p1.next : l2;
    p2 = p2 ? p2.next : l1;
  }
  return p1;
}

// - 两数相加
function addTwoNumber(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;
  let p1 = l1;
  let p2 = l2;
  while (p1 || p2 || carry) {
    const x = p1 ? p1.val : 0;
    const y = p2 ? p2.val : 0;
    const sum = x + y;
    carry = Math.floor(sum / 10);
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    p1 = p1 ? p1.next : null;
    p2 = p2 ? p2.val : null;
  }
  return dummy.next;
}
//
// 树
// - 翻转二叉树
function reverseTree(root) {
  if (!root) return null;
  const left = reverseTree(root.left);
  const right = reverseTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}
// - 二叉树遍历（前/中/后/层序）
function preGoTree(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(root.left);
    result.push(root);
    dfs(root.right);
  }
  dfs(root);
  return result;
}
function levelGoTree(root) {
  if (!root) return;
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const length = queue.length;
    const level = [];
    for (let i = 0; i < length; i++) {
      const node = queue.shift();
      level.push(node.val);
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// - 二叉树最近公共祖先

// - 对象 DFS/BFS、多叉树层序
// - 二叉树右视图 / 锯齿层序（补充自 33-answers.js）
// - 二叉树序列化 / 反序列化（层序，补充自 33-answers.js）
// - 二叉树最大深度
// - 验证二叉搜索树
// - 二叉搜索树中第 K 小的元素
// - 路径总和
// - 在树里寻找 target 值的路径
// - 在树里寻找 target 值的路径（路径数量）
// - 对称二叉树
// - 平衡二叉树
// - 二叉树最小深度
// - 二叉树直径
// - 从前序与中序构建二叉树
//
// 图 / 并查集
// - 并查集 + 岛屿数量
// - 课程表（拓扑排序，补充自 33-answers.js）
// - 课程表 II（拓扑排序输出）
// - 腐烂的橘子
// - 省份数量
