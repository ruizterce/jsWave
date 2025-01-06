import { useState, useEffect, useRef } from "react";

// Define the type for the data passed to the context menu
interface NoteContextData {
  type: string;
  trackIndex: number;
  noteIndex: number;
}

interface AddSamplerContextData {
  type: string;
}

type ContextMenuData = NoteContextData | AddSamplerContextData;

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  data?: ContextMenuData;
}

const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = (e: React.MouseEvent, data?: ContextMenuData) => {
    e.preventDefault();
    setContextMenu({
      open: true,
      x: e.clientX,
      y: e.clientY,
      data,
    });
  };

  const closeMenu = () => {
    setContextMenu((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { contextMenu, openMenu, closeMenu, menuRef };
};

export default useContextMenu;
