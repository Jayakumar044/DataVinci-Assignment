import React, { useMemo, useState } from "react";
import { treeData } from "./treeData";
import TriStateCheckbox from "./TriStateCheckbox";
import NodeRow from "./NodeRow";

// Root node for "Select All"
const ROOT_ID = "__root__";
const ROOT_NODE = { id: ROOT_ID, label: "Select All", children: treeData };

// Build indexes for fast lookup
function buildIndexes(root) {
  const idToNode = {};
  const nodeToLeafIds = {};

  const visit = (node) => {
    idToNode[node.id] = node;
    if (!node.children || node.children.length === 0) {
      nodeToLeafIds[node.id] = [node.id];
      return nodeToLeafIds[node.id];
    }
    let allLeaves = [];
    for (const child of node.children) {
      allLeaves = allLeaves.concat(visit(child));
    }
    nodeToLeafIds[node.id] = allLeaves;
    return allLeaves;
  };

  visit(root);
  return { idToNode, nodeToLeafIds };
}

// Compute state of a node from checked leaf ids
function getNodeState(node, checkedLeafIds, nodeToLeafIds) {
  if (!node.children || node.children.length === 0) {
    return checkedLeafIds.has(node.id) ? "checked" : "unchecked";
  }
  const leaves = nodeToLeafIds[node.id] || [];
  if (leaves.length === 0) return "unchecked";

  let checkedCount = 0;
  for (const leafId of leaves) {
    if (checkedLeafIds.has(leafId)) checkedCount++;
  }
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === leaves.length) return "checked";
  return "indeterminate";
}

export default function NestedCheckbox() {
  const { idToNode, nodeToLeafIds } = useMemo(() => buildIndexes(ROOT_NODE), []);
  const allLeafIds = nodeToLeafIds[ROOT_ID];

  const [checkedLeafIds, setCheckedLeafIds] = useState(new Set());

  const onToggle = (node, currentState) => {
    if (node.children && node.children.length > 0) {
      const leaves = nodeToLeafIds[node.id] || [];
      setCheckedLeafIds((prev) => {
        const next = new Set(prev);
        const shouldCheck = currentState === "unchecked";
        if (shouldCheck) {
          for (const leaf of leaves) next.add(leaf);
        } else {
          for (const leaf of leaves) next.delete(leaf);
        }
        return next;
      });
      return;
    }

    setCheckedLeafIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  };

  const rootState = getNodeState(ROOT_NODE, checkedLeafIds, nodeToLeafIds);

  const handleSelectAll = () => {
    setCheckedLeafIds((prev) => {
      if (prev.size === allLeafIds.length) return new Set();
      return new Set(allLeafIds);
    });
  };

  return (
    <div className="rounded-2 bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Nested Checkbox</h2>

      {/* Select All */}
      <div className="mb-4">
        <TriStateCheckbox
          id={ROOT_ID}
          label={ROOT_NODE.label}
          state={rootState}
          onChange={handleSelectAll}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        {ROOT_NODE.children.map((node) => (
          <NodeRow
            key={node.id}
            node={node}
            depth={1}
            checkedLeafIds={checkedLeafIds}
            onToggle={onToggle}
            nodeToLeafIds={nodeToLeafIds}
            getNodeState={getNodeState}
          />
        ))}
      </div>

      {/* Debug output */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium mb-2">Selected Items</h3>
        <p className="text-sm text-gray-700">
          {allLeafIds.filter((id) => checkedLeafIds.has(id))
            .map((id) => idToNode[id]?.label)
            .join(", ") || "None"}
        </p>
      </div>
    </div>
  );
}
