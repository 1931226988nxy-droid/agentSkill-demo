export const getSiblingNodes = ({ data = [], node, key, config = {} } = {}) => {
  const { children = "children", key: idKey = "key" } = config || {};

  const targetKey = node != null ? node[idKey] : key;

  if (targetKey == null || !Array.isArray(data)) {
    return [];
  }

  const eachFn = (arr) => {
    if (!Array.isArray(arr)) return null;

    // 判断目标节点是否在当前层级
    if (arr.some((item) => item?.[idKey] === targetKey)) {
      return arr;
    }

    // 遍历当前层级所有节点的子树
    for (const item of arr) {
      const result = eachFn(item?.[children]);

      // 只有真正找到目标节点才结束
      if (result !== null) {
        return result;
      }
    }

    return null;
  };

  return eachFn(data) ?? [];
};
