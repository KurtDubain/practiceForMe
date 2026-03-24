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
    - [数组扁平化](#数组扁平化)
    - [对象扁平化](#对象扁平化)
    - [深比较](#深比较)
    - [URL 参数解析 / 序列化](#url-参数解析--序列化)
    - [数组去重](#数组去重)
    - [深度合并（deepMerge）](#深度合并deepmerge)
    - [对象路径取值与赋值](#对象路径取值与赋值)
  - [JS 语言基础手写](#js-语言基础手写)
    - [instanceof 手写](#instanceof-手写)
    - [call / apply / bind](#call--apply--bind)
    - [手写 new](#手写-new)
    - [柯里化](#柯里化)
    - [柯里化（可变参数）](#柯里化可变参数)
    - [函数组合（compose / pipe）](#函数组合compose--pipe)
    - [函数记忆（memoize）](#函数记忆memoize)
    - [函数只执行一次（once）](#函数只执行一次once)
    - [原型链继承](#原型链继承)
    - [构造函数继承](#构造函数继承)
    - [组合继承](#组合继承)
    - [原型式继承](#原型式继承)
    - [寄生式继承](#寄生式继承)
    - [寄生组合继承](#寄生组合继承)
    - [ES6 class 继承](#es6-class-继承)
    - [深拷贝（处理循环引用）](#深拷贝处理循环引用)
  - [异步与 Promise 控制](#异步与-promise-控制)
    - [Promise.all 手写](#promiseall-手写)
    - [Promise 的 retry](#promise-的-retry)
    - [Promise 的递归调用（顺序执行任务）](#promise-的递归调用顺序执行任务)
    - [Promise 并发限制](#promise-并发限制)
    - [Promise 队列 + 并发控制](#promise-队列--并发控制)
    - [Task 调度器（add / wait / run）](#task-调度器add--wait--run)
    - [Promise 串行执行器（调用一次执行一次）](#promise-串行执行器调用一次执行一次)
    - [Promise.race 手写](#promiserace-手写)
    - [Promise.allSettled 手写](#promiseallsettled-手写)
    - [Promise.any 手写](#promiseany-手写)
    - [Promise 超时包装（timeout）](#promise-超时包装timeout)
  - [数据结构设计题](#数据结构设计题)
    - [LRUCache](#lrucache)
    - [RandomizedSet（补充自 33-answers.js）](#randomizedset补充自-33-answersjs)
    - [LFUCache（补充自 33-answers.js）](#lfucache补充自-33-answersjs)
    - [MinStack](#minstack)
    - [用栈实现队列](#用栈实现队列)
    - [用队列实现栈](#用队列实现栈)
    - [前缀树 Trie](#前缀树-trie)
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
    - [前 K 小（大顶堆）](#前-k-小大顶堆)
    - [移动零](#移动零)
    - [盛最多水](#盛最多水)
    - [矩形重叠面积](#矩形重叠面积)
    - [最长公共前缀](#最长公共前缀)
    - [合并两个有序数组](#合并两个有序数组)
    - [旋转数组](#旋转数组)
    - [滑动窗口最大值](#滑动窗口最大值)
    - [字母异位词分组](#字母异位词分组)
    - [和为 K 的子数组](#和为-k-的子数组)
    - [最长连续序列](#最长连续序列)
    - [除自身以外数组的乘积](#除自身以外数组的乘积)
    - [前 K 个高频元素](#前-k-个高频元素)
    - [买卖股票的最佳时机](#买卖股票的最佳时机)
    - [跳跃游戏](#跳跃游戏)
    - [子集](#子集)
    - [组合总和](#组合总和)
    - [括号生成](#括号生成)
    - [每日温度（单调栈）](#每日温度单调栈)
    - [柱状图中最大的矩形（单调栈）](#柱状图中最大的矩形单调栈)
    - [搜索插入位置](#搜索插入位置)
    - [搜索范围（左右边界二分）](#搜索范围左右边界二分)
    - [寻找旋转排序数组中的最小值](#寻找旋转排序数组中的最小值)
  - [排序](#排序)
    - [快速排序](#快速排序)
    - [归并排序](#归并排序)
  - [动态规划](#动态规划)
    - [零钱兑换](#零钱兑换)
    - [爬楼梯](#爬楼梯)
    - [打家劫舍](#打家劫舍)
    - [最长上升子序列（O(n^2)）](#最长上升子序列on2)
    - [编辑距离](#编辑距离)
    - [最大子数组和](#最大子数组和)
    - [不同路径](#不同路径)
    - [最长公共子序列](#最长公共子序列)
  - [链表](#链表)
    - [反转链表](#反转链表)
    - [合并两个有序链表](#合并两个有序链表)
    - [回文链表](#回文链表)
    - [K 个一组反转链表（补充自 33-answers.js）](#k-个一组反转链表补充自-33-answersjs)
    - [环形链表](#环形链表)
    - [删除倒数第 N 个节点](#删除倒数第-n-个节点)
    - [相交链表](#相交链表)
    - [两数相加](#两数相加)
  - [树](#树)
    - [翻转二叉树](#翻转二叉树)
    - [二叉树遍历（前/中/后/层序）](#二叉树遍历前中后层序)
    - [二叉树最近公共祖先](#二叉树最近公共祖先)
    - [对象 DFS/BFS、多叉树层序](#对象-dfsbfs多叉树层序)
    - [普通树最大深度](#普通树最大深度)
    - [普通树层序遍历](#普通树层序遍历)
    - [普通树前序 / 后序遍历](#普通树前序--后序遍历)
    - [普通树路径总和](#普通树路径总和)
    - [普通树最近公共祖先](#普通树最近公共祖先)
    - [二叉树右视图 / 锯齿层序（补充自 33-answers.js）](#二叉树右视图--锯齿层序补充自-33-answersjs)
    - [二叉树序列化 / 反序列化（层序，补充自 33-answers.js）](#二叉树序列化--反序列化层序补充自-33-answersjs)
    - [二叉树最大深度](#二叉树最大深度)
    - [验证二叉搜索树](#验证二叉搜索树)
    - [二叉搜索树中第 K 小的元素](#二叉搜索树中第-k-小的元素)
    - [路径总和](#路径总和)
    - [在树里寻找 target 值的路径](#在树里寻找-target-值的路径)
    - [在树里寻找 target 值的路径（路径数量）](#在树里寻找-target-值的路径路径数量)
    - [对称二叉树](#对称二叉树)
    - [平衡二叉树](#平衡二叉树)
    - [二叉树最小深度](#二叉树最小深度)
    - [二叉树直径](#二叉树直径)
    - [从前序与中序构建二叉树](#从前序与中序构建二叉树)
  - [图 / 并查集](#图--并查集)
    - [并查集 + 岛屿数量](#并查集--岛屿数量)
    - [课程表（拓扑排序，补充自 33-answers.js）](#课程表拓扑排序补充自-33-answersjs)
    - [课程表 II（拓扑排序输出）](#课程表-ii拓扑排序输出)
    - [腐烂的橘子](#腐烂的橘子)
    - [省份数量](#省份数量)

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

<a id="flattenarray"></a>
### 数组扁平化
```js
function flattenArray(arr, depth = Infinity) {
  const result = [];
  (function flat(current, d) {
    for (const item of current) {
      if (Array.isArray(item) && d > 0) {
        flat(item, d - 1);
      } else {
        result.push(item);
      }
    }
  })(arr, depth);
  return result;
}
```

<a id="flattenobject"></a>
### 对象扁平化
```js
function flattenObject(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}
```

<a id="deepequal"></a>
### 深比较
```js
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}
```

<a id="querystring"></a>
### URL 参数解析 / 序列化
```js
function parseQuery(query) {
  const q = query.startsWith("?") ? query.slice(1) : query;
  const result = {};
  if (!q) return result;
  for (const part of q.split("&")) {
    if (!part) continue;
    const [key, value = ""] = part.split("=");
    const k = decodeURIComponent(key);
    const v = decodeURIComponent(value);
    if (result[k] === undefined) result[k] = v;
    else if (Array.isArray(result[k])) result[k].push(v);
    else result[k] = [result[k], v];
  }
  return result;
}

function stringifyQuery(obj) {
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    const k = encodeURIComponent(key);
    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${k}=${encodeURIComponent(String(v))}`));
    } else if (value != null) {
      parts.push(`${k}=${encodeURIComponent(String(value))}`);
    } else {
      parts.push(`${k}=`);
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}
```

<a id="uniquearray"></a>
### 数组去重
```js
function uniqueArray(arr) {
  return Array.from(new Set(arr));
}
```

<a id="deepmerge"></a>
### 深度合并（deepMerge）
```js
function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target, source) {
  const result = isPlainObject(target) ? { ...target } : {};
  if (!isPlainObject(source)) return result;

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      result[key] = value.slice();
    } else if (isPlainObject(value)) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

<a id="pathgetset"></a>
### 对象路径取值与赋值
```js
function toPath(path) {
  if (Array.isArray(path)) return path.map(String);
  return String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/\["([^"]+)"\]/g, ".$1")
    .replace(/\['([^']+)'\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

function getByPath(obj, path, defaultValue) {
  const parts = toPath(path);
  let cur = obj;
  for (const key of parts) {
    if (cur == null) return defaultValue;
    cur = cur[key];
  }
  return cur === undefined ? defaultValue : cur;
}

function setByPath(obj, path, value) {
  const parts = toPath(path);
  if (parts.length === 0) return obj;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    if (cur[key] == null || typeof cur[key] !== "object") {
      cur[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
  return obj;
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

<a id="currysum"></a>
### 柯里化（可变参数）
```js
function currySum(...args) {
  let total = args.reduce((sum, val) => sum + val, 0);
  function next(...more) {
    if (more.length === 0) return total;
    total += more.reduce((sum, val) => sum + val, 0);
    return next;
  }
  return next;
}
```

<a id="composepipe"></a>
### 函数组合（compose / pipe）
```js
function compose(...fns) {
  return function (input) {
    return fns.reduceRight((acc, fn) => fn(acc), input);
  };
}

function pipe(...fns) {
  return function (input) {
    return fns.reduce((acc, fn) => fn(acc), input);
  };
}
```

<a id="memoize"></a>
### 函数记忆（memoize）
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

<a id="once"></a>
### 函数只执行一次（once）
```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
```

<a id="inherit-prototype"></a>
### 原型链继承
```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child() {}
Child.prototype = new Parent("parent");
Child.prototype.constructor = Child;
```

<a id="inherit-constructor"></a>
### 构造函数继承
```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}

function Child(name, age) {
  Parent.call(this, name); // 借用构造函数
  this.age = age;
}
```

<a id="inherit-combination"></a>
### 组合继承
```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent("parent");
Child.prototype.constructor = Child;
```

<a id="inherit-prototypal"></a>
### 原型式继承
```js
const parent = {
  name: "parent",
  colors: ["red", "blue"],
};

const child = Object.create(parent);
```

<a id="inherit-parasitic"></a>
### 寄生式继承
```js
function createChild(obj) {
  const clone = Object.create(obj);
  clone.sayHi = function () {
    return "hi";
  };
  return clone;
}
```

<a id="inherit-parasitic-combination"></a>
### 寄生组合继承
```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

<a id="inherit-class"></a>
### ES6 class 继承
```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
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

<a id="taskscheduler"></a>
### Task 调度器（add / wait / run）
```js
class TaskScheduler {
  constructor() {
    this.queue = [];
  }

  add(task) {
    this.queue.push(() => Promise.resolve().then(task));
    return this;
  }

  wait(ms) {
    this.queue.push(() => new Promise((resolve) => setTimeout(resolve, ms)));
    return this;
  }

  async run() {
    const queue = this.queue.slice();
    this.queue.length = 0;
    const results = [];

    for (const task of queue) {
      results.push(await task());
    }

    return results;
  }
}
```

<a id="serialexecutor"></a>
### Promise 串行执行器（调用一次执行一次）
```js
function createSerialExecutor() {
  let last = Promise.resolve();
  return function run(task) {
    last = last.then(() => task(), () => task());
    return last;
  };
}
```

<a id="promiserace"></a>
### Promise.race 手写
```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}
```

<a id="promiseallsettled"></a>
### Promise.allSettled 手写
```js
function promiseAllSettled(promises) {
  const list = Array.from(promises);
  return new Promise((resolve) => {
    if (list.length === 0) {
      resolve([]);
      return;
    }
    const results = new Array(list.length);
    let done = 0;
    list.forEach((p, i) => {
      Promise.resolve(p)
        .then(
          (value) => {
            results[i] = { status: "fulfilled", value };
          },
          (reason) => {
            results[i] = { status: "rejected", reason };
          }
        )
        .then(() => {
          done++;
          if (done === list.length) resolve(results);
        });
    });
  });
}
```

<a id="promiseany"></a>
### Promise.any 手写
```js
function promiseAny(promises) {
  const list = Array.from(promises);
  return new Promise((resolve, reject) => {
    if (list.length === 0) {
      const err =
        typeof AggregateError !== "undefined"
          ? new AggregateError([], "All promises were rejected")
          : Object.assign(new Error("All promises were rejected"), { errors: [] });
      reject(err);
      return;
    }
    const errors = new Array(list.length);
    let rejected = 0;
    list.forEach((p, i) => {
      Promise.resolve(p).then(
        resolve,
        (reason) => {
          errors[i] = reason;
          rejected++;
          if (rejected === list.length) {
            const err =
              typeof AggregateError !== "undefined"
                ? new AggregateError(errors, "All promises were rejected")
                : Object.assign(new Error("All promises were rejected"), { errors });
            reject(err);
          }
        }
      );
    });
  });
}
```

<a id="promisetimeout"></a>
### Promise 超时包装（timeout）
```js
function withTimeout(promise, ms, message = "Timeout") {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([Promise.resolve(promise), timeout]).then(
    (value) => {
      clearTimeout(timer);
      return value;
    },
    (err) => {
      clearTimeout(timer);
      throw err;
    }
  );
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

<a id="minstack"></a>
### MinStack
```js
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(x) {
    this.stack.push(x);
    const min =
      this.minStack.length === 0 ? x : this.minStack[this.minStack.length - 1];
    this.minStack.push(x < min ? x : min);
  }

  pop() {
    if (this.stack.length === 0) return null;
    this.minStack.pop();
    return this.stack.pop();
  }

  top() {
    if (this.stack.length === 0) return null;
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    if (this.minStack.length === 0) return null;
    return this.minStack[this.minStack.length - 1];
  }
}
```

<a id="myqueue"></a>
### 用栈实现队列
```js
class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }

  push(x) {
    this.inStack.push(x);
  }

  move() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
  }

  pop() {
    this.move();
    return this.outStack.pop();
  }

  peek() {
    this.move();
    return this.outStack[this.outStack.length - 1];
  }

  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}
```

<a id="mystack"></a>
### 用队列实现栈
```js
class MyStack {
  constructor() {
    this.queue = [];
  }

  push(x) {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift());
    }
  }

  pop() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  empty() {
    return this.queue.length === 0;
  }
}
```

<a id="trie"></a>
### 前缀树 Trie
```js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch);
    }
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch);
    }
    return true;
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
function permuteUnique(nums) {
  const result = [];

  function backtrack(start) {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }

    const used = new Set(); // 这一层 start 位置已经尝试过的值
    for (let i = start; i < nums.length; i++) {
      if (used.has(nums[i])) continue; // 同层去重：同一个值只放一次到 start
      used.add(nums[i]);

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

function arrayToTreeOnePass(arr) {
  const map = new Map();
  const roots = [];
  const rootSet = new Set();
  const pendingChildren = new Map();

  function addRoot(node) {
    if (!rootSet.has(node.id)) {
      rootSet.add(node.id);
      roots.push(node);
    }
  }

  function removeRoot(node) {
    if (!rootSet.has(node.id)) return;
    rootSet.delete(node.id);
    const index = roots.indexOf(node);
    if (index !== -1) roots.splice(index, 1);
  }

  for (const item of arr) {
    const current = map.get(item.id) || { children: [] };
    Object.assign(current, item);
    if (!Array.isArray(current.children)) current.children = [];
    map.set(item.id, current);

    const waiting = pendingChildren.get(item.id);
    if (waiting) {
      for (const child of waiting) {
        if (!current.children.includes(child)) current.children.push(child);
        removeRoot(child);
      }
      pendingChildren.delete(item.id);
    }

    if (item.parentId === null || item.parentId === undefined) {
      addRoot(current);
      continue;
    }

    const parent = map.get(item.parentId);
    if (parent) {
      if (!parent.children.includes(current)) parent.children.push(current);
      removeRoot(current);
    } else {
      if (!pendingChildren.has(item.parentId)) {
        pendingChildren.set(item.parentId, []);
      }
      pendingChildren.get(item.parentId).push(current);
      addRoot(current);
    }
  }

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

<a id="topksmallest"></a>
### 前 K 小（大顶堆）
```js
function maxHeapPush(heap, x) {
  heap.push(x);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] >= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    i = p;
  }
}

function maxHeapPop(heap) {
  if (heap.length === 1) return heap.pop();
  const top = heap[0];
  heap[0] = heap.pop();
  let i = 0;
  const n = heap.length;
  while (true) {
    let largest = i;
    const l = i * 2 + 1;
    const r = i * 2 + 2;
    if (l < n && heap[l] > heap[largest]) largest = l;
    if (r < n && heap[r] > heap[largest]) largest = r;
    if (largest === i) break;
    [heap[i], heap[largest]] = [heap[largest], heap[i]];
    i = largest;
  }
  return top;
}

function topKSmallest(nums, k) {
  if (k <= 0) return [];
  const heap = [];
  for (const x of nums) {
    maxHeapPush(heap, x);
    if (heap.length > k) maxHeapPop(heap);
  }
  return heap.sort((a, b) => a - b);
}
```

<a id="movezeroes"></a>
### 移动零
```js
function moveZeroes(nums) {
  let insert = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insert] = nums[i];
      insert++;
    }
  }
  while (insert < nums.length) {
    nums[insert] = 0;
    insert++;
  }
  return nums;
}
```

<a id="maxarea"></a>
### 盛最多水
```js
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    best = Math.max(best, h * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}
```

<a id="rectangleoverlap"></a>
### 矩形重叠面积
```js
function rectangleOverlapArea(rect1, rect2) {
  const left = Math.max(rect1.x, rect2.x);
  const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const top = Math.max(rect1.y, rect2.y);
  const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  return Math.max(0, right - left) * Math.max(0, bottom - top);
}
```

<a id="longestcommonprefix"></a>
### 最长公共前缀
```js
function longestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
```

<a id="mergesortedarray"></a>
### 合并两个有序数组
```js
function mergeSortedArrays(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  return nums1;
}
```

<a id="rotatearray"></a>
### 旋转数组
```js
function rotateArray(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  reverse(nums, 0, n - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, n - 1);
  return nums;
}

function reverse(arr, i, j) {
  while (i < j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    i++;
    j--;
  }
}
```

<a id="maxslidingwindow"></a>
### 滑动窗口最大值
```js
function maxSlidingWindow(nums, k) {
  if (k <= 0) return [];
  const deque = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
```

<a id="groupanagrams"></a>
### 字母异位词分组
```js
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return Array.from(map.values());
}
```

<a id="subarraysum"></a>
### 和为 K 的子数组
```js
function subarraySum(nums, k) {
  const map = new Map();
  map.set(0, 1);
  let sum = 0;
  let count = 0;
  for (const x of nums) {
    sum += x;
    const need = sum - k;
    if (map.has(need)) count += map.get(need);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
```

<a id="longestconsecutive"></a>
### 最长连续序列
```js
function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue; // only start from sequence head
    let cur = x;
    let len = 1;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    best = Math.max(best, len);
  }
  return best;
}
```

<a id="productexceptself"></a>
### 除自身以外数组的乘积
```js
function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}
```

<a id="topkfrequent"></a>
### 前 K 个高频元素
```js
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq.entries()) {
    buckets[count].push(num);
  }

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}
```

<a id="maxprofit"></a>
### 买卖股票的最佳时机
```js
function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    best = Math.max(best, p - minPrice);
  }
  return best;
}
```

<a id="canjump"></a>
### 跳跃游戏
```js
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}
```

<a id="subsets"></a>
### 子集
```js
function subsets(nums) {
  const result = [];
  const path = [];
  function dfs(index) {
    if (index === nums.length) {
      result.push([...path]);
      return;
    }
    dfs(index + 1);
    path.push(nums[index]);
    dfs(index + 1);
    path.pop();
  }
  dfs(0);
  return result;
}
```

<a id="combinationsum"></a>
### 组合总和
```js
function combinationSum(candidates, target) {
  const result = [];
  const path = [];
  function dfs(start, sum) {
    if (sum === target) {
      result.push([...path]);
      return;
    }
    if (sum > target) return;
    for (let i = start; i < candidates.length; i++) {
      const val = candidates[i];
      path.push(val);
      dfs(i, sum + val);
      path.pop();
    }
  }
  dfs(0, 0);
  return result;
}
```

<a id="generateparenthesis"></a>
### 括号生成
```js
function generateParenthesis(n) {
  const res = [];
  function dfs(open, close, str) {
    if (str.length === 2 * n) {
      res.push(str);
      return;
    }
    if (open < n) dfs(open + 1, close, str + "(");
    if (close < open) dfs(open, close + 1, str + ")");
  }
  dfs(0, 0, "");
  return res;
}
```

<a id="dailytemperatures"></a>
### 每日温度（单调栈）
```js
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}
```

<a id="largestrectangle"></a>
### 柱状图中最大的矩形（单调栈）
```js
function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  const arr = heights.concat(0); // sentinel
  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[i] < arr[stack[stack.length - 1]]) {
      const h = arr[stack.pop()];
      const right = i;
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, h * (right - left - 1));
    }
    stack.push(i);
  }
  return best;
}
```

<a id="searchinsert"></a>
### 搜索插入位置
```js
function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}
```

<a id="searchrange"></a>
### 搜索范围（左右边界二分）
```js
function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function upperBound(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function searchRange(nums, target) {
  const left = lowerBound(nums, target);
  const right = upperBound(nums, target) - 1;
  if (left <= right && nums[left] === target) return [left, right];
  return [-1, -1];
}
```

<a id="findmin"></a>
### 寻找旋转排序数组中的最小值
```js
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return nums[left];
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

<a id="maxsubarray"></a>
### 最大子数组和
```js
function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
```

<a id="uniquepaths"></a>
### 不同路径
```js
function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}
```

<a id="lcs"></a>
### 最长公共子序列
```js
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
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

<a id="hascycle"></a>
### 环形链表
```js
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

<a id="removenth"></a>
### 删除倒数第 N 个节点
```js
function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  if (slow.next) slow.next = slow.next.next;
  return dummy.next;
}
```

<a id="intersectionnode"></a>
### 相交链表
```js
function getIntersectionNode(headA, headB) {
  let p1 = headA;
  let p2 = headB;
  while (p1 !== p2) {
    p1 = p1 ? p1.next : headB;
    p2 = p2 ? p2.next : headA;
  }
  return p1;
}
```

<a id="addtwonumbers"></a>
### 两数相加
```js
function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;
  let p1 = l1;
  let p2 = l2;
  while (p1 || p2 || carry) {
    const x = p1 ? p1.val : 0;
    const y = p2 ? p2.val : 0;
    const sum = x + y + carry;
    carry = Math.floor(sum / 10);
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    p1 = p1 ? p1.next : null;
    p2 = p2 ? p2.next : null;
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

<a id="narynode"></a>
### 普通树最大深度
```js
class NTreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

function naryMaxDepth(root) {
  if (!root) return 0;
  let max = 0;
  if (Array.isArray(root.children)) {
    for (const child of root.children) {
      max = Math.max(max, naryMaxDepth(child));
    }
  }
  return max + 1;
}
```

<a id="narylevelorder"></a>
### 普通树层序遍历
```js
function naryLevelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    const level = [];
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          if (child) queue.push(child);
        }
      }
    }
    result.push(level);
  }
  return result;
}
```

<a id="narytraversal"></a>
### 普通树前序 / 后序遍历
```js
function naryPreorder(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    result.push(node.val);
    if (Array.isArray(node.children)) {
      for (const child of node.children) dfs(child);
    }
  }
  dfs(root);
  return result;
}

function naryPostorder(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    if (Array.isArray(node.children)) {
      for (const child of node.children) dfs(child);
    }
    result.push(node.val);
  }
  dfs(root);
  return result;
}
```

<a id="narypathsum"></a>
### 普通树路径总和
```js
function naryPathSum(root, targetSum) {
  const result = [];
  const path = [];
  function dfs(node, sum) {
    if (!node) return;
    path.push(node.val);
    const next = sum - node.val;
    const children = Array.isArray(node.children) ? node.children : [];
    if (children.length === 0) {
      if (next === 0) result.push([...path]);
    } else {
      for (const child of children) dfs(child, next);
    }
    path.pop();
  }
  dfs(root, targetSum);
  return result;
}
```

<a id="narylca"></a>
### 普通树最近公共祖先
```js
function naryLowestCommonAncestor(root, p, q) {
  let lca = null;
  function dfs(node) {
    if (!node) return 0;
    let count = node === p || node === q ? 1 : 0;
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        count += dfs(child);
      }
    }
    if (count >= 2 && lca === null) lca = node;
    return count;
  }
  dfs(root);
  return lca;
}
```

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

<a id="maxdepth"></a>
### 二叉树最大深度
```js
function maxDepth(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

<a id="isvalidbst"></a>
### 验证二叉搜索树
```js
function isValidBST(root) {
  function helper(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return helper(node.left, min, node.val) && helper(node.right, node.val, max);
  }
  return helper(root, -Infinity, Infinity);
}
```

<a id="kthsmallest"></a>
### 二叉搜索树中第 K 小的元素
```js
function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  let count = 0;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    count++;
    if (count === k) return cur.val;
    cur = cur.right;
  }
  return null;
}
```

<a id="haspathsum"></a>
### 路径总和
```js
function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const next = targetSum - root.val;
  return hasPathSum(root.left, next) || hasPathSum(root.right, next);
}
```

<a id="pathsumall"></a>
### 在树里寻找 target 值的路径
```js
function pathSumAll(root, targetSum) {
  const result = [];
  const path = [];
  function dfs(node, sum) {
    if (!node) return;
    path.push(node.val);
    const next = sum - node.val;
    if (!node.left && !node.right) {
      if (next === 0) result.push([...path]);
    } else {
      dfs(node.left, next);
      dfs(node.right, next);
    }
    path.pop();
  }
  dfs(root, targetSum);
  return result;
}
```

<a id="pathsumcount"></a>
### 在树里寻找 target 值的路径（路径数量）
```js
function pathSumCount(root, targetSum) {
  const prefix = new Map();
  prefix.set(0, 1);
  let count = 0;
  function dfs(node, sum) {
    if (!node) return;
    const cur = sum + node.val;
    const need = cur - targetSum;
    if (prefix.has(need)) count += prefix.get(need);
    prefix.set(cur, (prefix.get(cur) || 0) + 1);
    dfs(node.left, cur);
    dfs(node.right, cur);
    prefix.set(cur, prefix.get(cur) - 1);
  }
  dfs(root, 0);
  return count;
}
```

<a id="issymmetric"></a>
### 对称二叉树
```js
function isSymmetric(root) {
  function isMirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.val !== b.val) return false;
    return isMirror(a.left, b.right) && isMirror(a.right, b.left);
  }
  return isMirror(root, root);
}
```

<a id="isbalanced"></a>
### 平衡二叉树
```js
function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    const left = height(node.left);
    if (left === -1) return -1;
    const right = height(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  }
  return height(root) !== -1;
}
```

<a id="mindepth"></a>
### 二叉树最小深度
```js
function minDepth(root) {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;
  if (!root.left) return minDepth(root.right) + 1;
  if (!root.right) return minDepth(root.left) + 1;
  return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}
```

<a id="diameter"></a>
### 二叉树直径
```js
function diameterOfBinaryTree(root) {
  let max = 0;
  function depth(node) {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    max = Math.max(max, left + right);
    return Math.max(left, right) + 1;
  }
  depth(root);
  return max;
}
```

<a id="buildtreeprein"></a>
### 从前序与中序构建二叉树
```js
function buildTreeFromPreIn(preorder, inorder) {
  if (!preorder || preorder.length === 0) return null;
  const indexMap = new Map();
  for (let i = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }
  let preIndex = 0;
  function helper(left, right) {
    if (left > right) return null;
    const rootVal = preorder[preIndex++];
    const root = new TreeNode(rootVal);
    const mid = indexMap.get(rootVal);
    root.left = helper(left, mid - 1);
    root.right = helper(mid + 1, right);
    return root;
  }
  return helper(0, inorder.length - 1);
}
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

<a id="findorder"></a>
### 课程表 II（拓扑排序输出）
```js
function findOrder(numCourses, prerequisites) {
  const indeg = new Array(numCourses).fill(0);
  const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    g[b].push(a);
    indeg[a]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  for (let i = 0; i < queue.length; i++) {
    const u = queue[i];
    order.push(u);
    for (const v of g[u]) {
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}
```

<a id="orangesrotting"></a>
### 腐烂的橘子
```js
function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length && fresh > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc]);
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
```

<a id="provinces"></a>
### 省份数量
```js
function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  let count = 0;
  function dfs(i) {
    visited[i] = true;
    for (let j = 0; j < n; j++) {
      if (isConnected[i][j] === 1 && !visited[j]) dfs(j);
    }
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      count++;
      dfs(i);
    }
  }
  return count;
}
```

```

[⬆ 返回目录](#目录)
