import React from "react";

interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  menuRef: React.RefObject<HTMLDivElement>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, menuRef }) => {
  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded z-40 max-h-60 max-w-[490px] overflow-scroll"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className="p-2 text-left rounded hover:bg-gray-200"
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
