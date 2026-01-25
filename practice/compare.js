const path = require("path");

function tryRequire(modulePath) {
  try {
    const loaded = require(modulePath);
    if (loaded && typeof loaded === "object" && "default" in loaded) {
      return loaded.default;
    }
    return loaded || {};
  } catch (err) {
    const missing =
      err &&
      err.code === "MODULE_NOT_FOUND" &&
      typeof err.message === "string" &&
      err.message.includes(modulePath);
    if (missing) return {};
    console.error(`Failed to load ${modulePath}: ${err.message}`);
    return {};
  }
}

const userSolutions = tryRequire("./my-solutions");

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function listFromArray(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const val of arr) {
    cur.next = new ListNode(val);
    cur = cur.next;
  }
  return dummy.next;
}

function arrayFromList(head, limit = 1000) {
  const result = [];
  let cur = head;
  let steps = 0;
  while (cur && steps < limit) {
    result.push(cur.val);
    cur = cur.next;
    steps++;
  }
  return result;
}

function listWithCycle(values, pos) {
  const nodes = values.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0] || null;
}

function appendList(head, tail) {
  if (!head) return tail;
  let cur = head;
  while (cur.next) cur = cur.next;
  cur.next = tail;
  return head;
}

function buildIntersectionList(headAValues, headBValues, intersectValues) {
  const intersection = listFromArray(intersectValues);
  const headA = appendList(listFromArray(headAValues), intersection);
  const headB = appendList(listFromArray(headBValues), intersection);
  return { headA, headB, intersection };
}

function buildTree(values) {
  if (!values || values.length === 0 || values[0] == null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (!node) continue;
    const leftVal = values[i++];
    if (leftVal != null) {
      node.left = new TreeNode(leftVal);
      queue.push(node.left);
    }
    const rightVal = values[i++];
    if (rightVal != null) {
      node.right = new TreeNode(rightVal);
      queue.push(node.right);
    }
  }
  return root;
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
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

function normalizeAnagrams(groups) {
  if (!Array.isArray(groups)) return groups;
  const normalized = groups.map((g) => [...g].sort());
  normalized.sort((a, b) => a.join("|").localeCompare(b.join("|")));
  return normalized;
}

function isValidOrder(order, numCourses, prerequisites) {
  if (!Array.isArray(order) || order.length !== numCourses) return false;
  const pos = new Array(numCourses).fill(-1);
  for (let i = 0; i < order.length; i++) {
    const course = order[i];
    if (course < 0 || course >= numCourses || pos[course] !== -1) return false;
    pos[course] = i;
  }
  for (const [a, b] of prerequisites) {
    if (pos[b] > pos[a]) return false;
  }
  return true;
}

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

function rotateArray(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k = k % n;
  reverseArray(nums, 0, n - 1);
  reverseArray(nums, 0, k - 1);
  reverseArray(nums, k, n - 1);
  return nums;
}

function reverseArray(arr, i, j) {
  while (i < j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    i++;
    j--;
  }
}

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
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}

function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return Array.from(map.values());
}

function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}

function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}

function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
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

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
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

function getIntersectionNode(headA, headB) {
  let p1 = headA;
  let p2 = headB;
  while (p1 !== p2) {
    p1 = p1 ? p1.next : headB;
    p2 = p2 ? p2.next : headA;
  }
  return p1;
}

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;
  let p1 = l1;
  let p2 = l2;
  while (p1 || p2 || carry) {
    const x = p1 ? p1.val : 0;
    const y = p2 ? p2.val : 0;
    const sum = x + y + carry;
    carry = Math.floor(sum / 10);
    cur.next = new ListNode(sum % 10);
    cur = cur.next;
    p1 = p1 ? p1.next : null;
    p2 = p2 ? p2.next : null;
  }
  return dummy.next;
}

function maxDepth(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

function isValidBST(root) {
  function helper(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return helper(node.left, min, node.val) && helper(node.right, node.val, max);
  }
  return helper(root, -Infinity, Infinity);
}

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

function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const next = targetSum - root.val;
  return hasPathSum(root.left, next) || hasPathSum(root.right, next);
}

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

const referenceFunctions = {
  moveZeroes,
  maxArea,
  longestCommonPrefix,
  mergeSortedArrays,
  rotateArray,
  maxSlidingWindow,
  groupAnagrams,
  maxSubArray,
  uniquePaths,
  longestCommonSubsequence,
  hasCycle,
  removeNthFromEnd,
  getIntersectionNode,
  addTwoNumbers,
  maxDepth,
  isValidBST,
  kthSmallest,
  hasPathSum,
  findOrder,
  orangesRotting,
  findCircleNum,
};

const referenceClasses = {
  MinStack,
  MyQueue,
  MyStack,
  Trie,
};

const functionTests = [
  {
    name: "moveZeroes",
    mutateIndex: 0,
    cases: [() => [[0, 1, 0, 3, 12]], () => [[0, 0, 1]], () => [[1, 2, 3]]],
  },
  {
    name: "maxArea",
    cases: [() => [[1, 8, 6, 2, 5, 4, 8, 3, 7]], () => [[1, 1]]],
  },
  {
    name: "longestCommonPrefix",
    cases: [
      () => [["flower", "flow", "flight"]],
      () => [["dog", "racecar", "car"]],
      () => [[""]],
    ],
  },
  {
    name: "mergeSortedArrays",
    mutateIndex: 0,
    cases: [
      () => [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3],
      () => [[1], 1, [], 0],
      () => [[0], 0, [1], 1],
    ],
  },
  {
    name: "rotateArray",
    mutateIndex: 0,
    cases: [
      () => [[1, 2, 3, 4, 5, 6, 7], 3],
      () => [[-1, -100, 3, 99], 2],
    ],
  },
  {
    name: "maxSlidingWindow",
    cases: [
      () => [[1, 3, -1, -3, 5, 3, 6, 7], 3],
      () => [[1], 1],
    ],
  },
  {
    name: "groupAnagrams",
    mapResult: normalizeAnagrams,
    cases: [
      () => [["eat", "tea", "tan", "ate", "nat", "bat"]],
      () => [[""]],
      () => [["a"]],
    ],
  },
  {
    name: "maxSubArray",
    cases: [
      () => [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
      () => [[1]],
      () => [[5, 4, -1, 7, 8]],
    ],
  },
  {
    name: "uniquePaths",
    cases: [() => [3, 7], () => [3, 2], () => [1, 1]],
  },
  {
    name: "longestCommonSubsequence",
    cases: [
      () => ["abcde", "ace"],
      () => ["abc", "abc"],
      () => ["abc", "def"],
    ],
  },
  {
    name: "hasCycle",
    cases: [
      () => [listWithCycle([3, 2, 0, -4], 1)],
      () => [listWithCycle([1], -1)],
      () => [listWithCycle([1, 2], 0)],
    ],
  },
  {
    name: "removeNthFromEnd",
    mapResult: (head) => arrayFromList(head),
    cases: [
      () => [listFromArray([1, 2, 3, 4, 5]), 2],
      () => [listFromArray([1]), 1],
      () => [listFromArray([1, 2]), 1],
    ],
  },
  {
    name: "addTwoNumbers",
    mapResult: (head) => arrayFromList(head),
    cases: [
      () => [listFromArray([2, 4, 3]), listFromArray([5, 6, 4])],
      () => [listFromArray([0]), listFromArray([0])],
      () => [
        listFromArray([9, 9, 9, 9, 9, 9, 9]),
        listFromArray([9, 9, 9, 9]),
      ],
    ],
  },
  {
    name: "maxDepth",
    cases: [
      () => [buildTree([3, 9, 20, null, null, 15, 7])],
      () => [buildTree([])],
      () => [buildTree([1])],
    ],
  },
  {
    name: "isValidBST",
    cases: [
      () => [buildTree([2, 1, 3])],
      () => [buildTree([5, 1, 4, null, null, 3, 6])],
      () => [buildTree([1, 1])],
    ],
  },
  {
    name: "kthSmallest",
    cases: [
      () => [buildTree([3, 1, 4, null, 2]), 1],
      () => [buildTree([5, 3, 6, 2, 4, null, null, 1]), 3],
    ],
  },
  {
    name: "hasPathSum",
    cases: [
      () => [buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]), 22],
      () => [buildTree([1, 2, 3]), 5],
      () => [buildTree([]), 0],
    ],
  },
  {
    name: "findOrder",
    validator: (actual, args, expected) => {
      const [numCourses, prerequisites] = args;
      const possible = Array.isArray(expected) && expected.length === numCourses;
      if (possible) return isValidOrder(actual, numCourses, prerequisites);
      return Array.isArray(actual) && actual.length === 0;
    },
    cases: [
      () => [2, [[1, 0]]],
      () => [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
      () => [2, [[1, 0], [0, 1]]],
    ],
  },
  {
    name: "orangesRotting",
    cases: [
      () => [
        [
          [2, 1, 1],
          [1, 1, 0],
          [0, 1, 1],
        ],
      ],
      () => [
        [
          [2, 1, 1],
          [0, 1, 1],
          [1, 0, 1],
        ],
      ],
      () => [[[0, 2]]],
    ],
  },
  {
    name: "findCircleNum",
    cases: [
      () => [
        [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 1],
        ],
      ],
      () => [
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      ],
    ],
  },
];

const customTests = [
  {
    name: "getIntersectionNode",
    run: (userFn) => {
      const first = buildIntersectionList([4, 1], [5, 6, 1], [8, 4, 5]);
      const actual1 = userFn(first.headA, first.headB);
      const pass1 = actual1 === first.intersection;
      const second = buildIntersectionList([1], [2], []);
      const actual2 = userFn(second.headA, second.headB);
      const pass2 = actual2 === null;
      return [
        { pass: pass1, detail: { expected: "intersection", actual: actual1 } },
        { pass: pass2, detail: { expected: null, actual: actual2 } },
      ];
    },
  },
];

const classTests = [
  {
    name: "MinStack",
    ops: ["push", "push", "push", "getMin", "pop", "top", "getMin"],
    args: [[3], [5], [2], [], [], [], []],
  },
  {
    name: "MyQueue",
    ops: ["push", "push", "peek", "pop", "empty", "pop", "empty"],
    args: [[1], [2], [], [], [], [], []],
  },
  {
    name: "MyStack",
    ops: ["push", "push", "top", "pop", "empty"],
    args: [[1], [2], [], [], []],
  },
  {
    name: "Trie",
    ops: ["insert", "search", "search", "startsWith", "insert", "search", "startsWith"],
    args: [["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"], ["ap"]],
  },
];

function formatValue(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
}

function resolveResult(result, args, test) {
  let value = result;
  if (typeof test.mutateIndex === "number" && value === undefined) {
    value = args[test.mutateIndex];
  }
  if (typeof test.mapResult === "function") {
    value = test.mapResult(value);
  }
  return value;
}

function runFunctionTests() {
  const results = [];
  for (const test of functionTests) {
    const userFn = userSolutions[test.name];
    const refFn = referenceFunctions[test.name];
    if (typeof userFn !== "function") {
      results.push({ name: test.name, status: "skip", details: "missing" });
      continue;
    }
    for (let i = 0; i < test.cases.length; i++) {
      const buildArgs = test.cases[i];
      const argsRef = buildArgs();
      const argsUser = buildArgs();
      let expected;
      let actual;
      let error = null;
      try {
        expected = refFn(...argsRef);
      } catch (err) {
        error = `reference error: ${err.message}`;
      }
      if (!error) {
        try {
          actual = userFn(...argsUser);
        } catch (err) {
          error = `user error: ${err.message}`;
        }
      }
      if (error) {
        results.push({
          name: test.name,
          status: "fail",
          caseIndex: i + 1,
          details: error,
        });
        continue;
      }
      const expectedValue = resolveResult(expected, argsRef, test);
      const actualValue = resolveResult(actual, argsUser, test);
      const pass = test.validator
        ? test.validator(actualValue, argsUser, expectedValue, argsRef)
        : deepEqual(actualValue, expectedValue);
      if (!pass) {
        results.push({
          name: test.name,
          status: "fail",
          caseIndex: i + 1,
          details: `expected ${formatValue(expectedValue)}, got ${formatValue(actualValue)}`,
        });
      } else {
        results.push({ name: test.name, status: "pass", caseIndex: i + 1 });
      }
    }
  }
  return results;
}

function runCustomTests() {
  const results = [];
  for (const test of customTests) {
    const userFn = userSolutions[test.name];
    if (typeof userFn !== "function") {
      results.push({ name: test.name, status: "skip", details: "missing" });
      continue;
    }
    const caseResults = test.run(userFn);
    caseResults.forEach((res, idx) => {
      if (!res.pass) {
        results.push({
          name: test.name,
          status: "fail",
          caseIndex: idx + 1,
          details: `expected ${formatValue(res.detail.expected)}, got ${formatValue(res.detail.actual)}`,
        });
      } else {
        results.push({ name: test.name, status: "pass", caseIndex: idx + 1 });
      }
    });
  }
  return results;
}

function runClassOps(ClassCtor, ops, args) {
  const instance = new ClassCtor();
  const outputs = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const res = instance[op](...(args[i] || []));
    outputs.push(res === undefined ? null : res);
  }
  return outputs;
}

function runClassTests() {
  const results = [];
  for (const test of classTests) {
    const UserClass = userSolutions[test.name];
    const RefClass = referenceClasses[test.name];
    if (typeof UserClass !== "function") {
      results.push({ name: test.name, status: "skip", details: "missing" });
      continue;
    }
    let expected;
    let actual;
    let error = null;
    try {
      expected = runClassOps(RefClass, test.ops, test.args);
    } catch (err) {
      error = `reference error: ${err.message}`;
    }
    if (!error) {
      try {
        actual = runClassOps(UserClass, test.ops, test.args);
      } catch (err) {
        error = `user error: ${err.message}`;
      }
    }
    if (error) {
      results.push({ name: test.name, status: "fail", details: error });
      continue;
    }
    const pass = deepEqual(actual, expected);
    if (!pass) {
      results.push({
        name: test.name,
        status: "fail",
        details: `expected ${formatValue(expected)}, got ${formatValue(actual)}`,
      });
    } else {
      results.push({ name: test.name, status: "pass" });
    }
  }
  return results;
}

function run() {
  if (Object.keys(userSolutions).length === 0) {
    const target = path.join(__dirname, "my-solutions.js");
    console.log(
      `No user solutions found. Create ${target} and export your functions/classes with module.exports.`
    );
  }
  const results = [
    ...runFunctionTests(),
    ...runCustomTests(),
    ...runClassTests(),
  ];
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const skipped = results.filter((r) => r.status === "skip").length;
  console.log(`Passed ${passed}, Failed ${failed}, Skipped ${skipped}`);
  if (failed > 0) {
    for (const res of results) {
      if (res.status === "fail") {
        const caseInfo = res.caseIndex ? ` case ${res.caseIndex}` : "";
        console.log(`[FAIL] ${res.name}${caseInfo}: ${res.details}`);
      }
    }
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
