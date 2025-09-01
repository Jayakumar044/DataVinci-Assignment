import React from "react";
import TriStateCheckbox from "./TriStateCheckbox";

export default function NodeRow({
  node,
  depth,
  checkedLeafIds,
  onToggle,
  nodeToLeafIds,
  getNodeState,
}) {
  const state = getNodeState(node, checkedLeafIds, nodeToLeafIds);
  const hasChildren = !!(node.children && node.children.length);

  return (
    <div className="pl-2">
      <div style={{ paddingLeft: depth * 16 }}>
        <TriStateCheckbox
          id={node.id}
          label={node.label}
          state={state}
          onChange={() => onToggle(node, state)}
        />
      </div>
      {hasChildren && (
        <div className="ml-4 mt-2 flex flex-col gap-2">
          {node.children.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              checkedLeafIds={checkedLeafIds}
              onToggle={onToggle}
              nodeToLeafIds={nodeToLeafIds}
              getNodeState={getNodeState}
            />
          ))}
        </div>
      )}
    </div>
  );
}
