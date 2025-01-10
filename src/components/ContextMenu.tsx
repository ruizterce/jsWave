import React from "react";

interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  children?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  menuRef: React.RefObject<HTMLDivElement>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items, menuRef }) => {
  const renderItems = (items: ContextMenuItem[]) => {
    return items.map((item, index) =>
      item.children ? (
        <div key={index} className="mb-2 ml-1">
          <div className="font-bold">{item.label}</div>
          <div className="ml-3">{renderItems(item.children)}</div>
        </div>
      ) : (
        <button
          key={index}
          className="p-2 text-left rounded hover:bg-gray-200"
          onClick={item.onClick}
        >
          {item.label}
        </button>
      )
    );
  };

  return (
    <div
      ref={menuRef}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-light text-dark rounded-xl shadow-xl border-2 border-lightMedium z-40 max-h-[600px] max-w-[500px] overflow-auto"
    >
      {renderItems(items)}
    </div>
  );
};

export default ContextMenu;
