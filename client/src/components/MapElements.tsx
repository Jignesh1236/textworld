
export const MAP_ELEMENTS = {
  // Roads and paths
  roads: {
    horizontal: "═══════════════════════════════════════",
    vertical: "║\n║\n║\n║\n║\n║\n║\n║\n║\n║",
    intersection: "═══╬═══\n   ║   \n   ║   \n   ║   ",
    curve_tl: "═══╗\n   ║\n   ║\n   ║",
    curve_tr: "╔═══\n║   \n║   \n║   ",
    curve_bl: "   ║\n   ║\n   ║\n═══╝",
    curve_br: "║   \n║   \n║   \n╚═══",
    highway: "══════════════════════════════════════════\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n══════════════════════════════════════════"
  },

  // Trees and nature
  trees: {
    oak: "    🌳\n   /|\\\n  / | \\\n /  |  \\\n|   |   |\n    |",
    pine: "   🌲\n  /|\\\n / | \\\n/  |  \\\n   |",
    small_tree: "  🌿\n  /|\\\n   |",
    forest: "🌲 🌳 🌲\n🌿   🌿 🌳\n  🌲   🌿",
    bush: "🌿🌿🌿\n🌿🌿🌿",
    flower: "🌸🌼🌻\n🌿🌿🌿",
    birch: "🌳",
    jungle: "🌴",
    cactus: "🌵",
    mushroom: "🍄",
    bamboo: "🎋"
  },

  // Buildings
  houses: {
    small_house: "   🏠\n  /^\\\n /   \\\n|  ⚫  |\n|_____|",
    large_house: "    🏠\n   /^^^\\\n  /     \\\n |  ⚫   |\n |   ⚫  |\n |_______|",
    apartment: "┌─────┐\n│⚫ ⚫ │\n├─────┤\n│⚫ ⚫ │\n├─────┤\n│⚫ ⚫ │\n└─────┘",
    shop: "  SHOP  \n┌───────┐\n│ ⚫   ⚫ │\n│   ⚫   │\n└───────┘",
    church: "    ✝\n   /|\\\n  /─┴─\\\n |     |\n |  ⚫  |\n |_____|"
  },

  // Infrastructure
  infrastructure: {
    bridge: "═══════════════\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n~~~~~~~~~~~~~~~\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n═══════════════",
    parking: "┌─────────┐\n│ 🚗   🚗 │\n│         │\n│ 🚗   🚗 │\n└─────────┘",
    fountain: "  ⛲\n ╔═══╗\n ║ ∩ ║\n ║∩ ∩║\n ╚═══╝",
    streetlight: "💡\n |\n |\n |\n▓▓▓",
    bench: "████████\n│      │\n│      │\n┴──────┴"
  },

  // Vehicles
  vehicles: {
    car: "🚗",
    truck: "🚛",
    bus: "🚌",
    bike: "🚲"
  },

  // Landscape features
  landscape: {
    river: "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    lake: "~~~~~~~~~~~~~~~~~~~~\n~~   🌊  ~~~  🌊  ~~\n~~  🌊    ~~~    🌊~~\n~~🌊  ~~~  🌊  ~~~🌊~~\n~~  🌊  ~~~  🌊  ~~~~ \n~~~~~~~~~~~~~~~~~~~~",
    mountain: "      ⛰️\n     /▲\\\n    /▲▲▲\\\n   /▲▲▲▲▲\\\n  /▲▲▲▲▲▲▲\\\n /▲▲▲▲▲▲▲▲▲\\\n▲▲▲▲▲▲▲▲▲▲▲▲",
    hill: "   ⛰️\n  /▲▲\\\n /▲▲▲▲\\\n▲▲▲▲▲▲▲"
  },

  // Minecraft-style blocks
  blocks: {
    grass: "🟩",
    dirt: "🟫",
    stone: "⬜",
    wood: "🟤",
    diamond: "💎",
    gold: "🟡",
    iron: "⚪",
    coal: "⚫",
    emerald: "💚",
    redstone: "🔴",
    water: "🟦",
    lava: "🟥",
    sand: "🟨",
    snow: "⬜"
  },

  // Animals and mobs
  mobs: {
    pig: "🐷",
    cow: "🐄",
    sheep: "🐑",
    chicken: "🐔",
    horse: "🐴",
    wolf: "🐺",
    cat: "🐱",
    villager: "👨‍🌾",
    zombie: "🧟",
    skeleton: "💀",
    creeper: "💚",
    spider: "🕷️"
  }
};

interface MapElementsProps {
  onSelectElement: (content: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function MapElements({ onSelectElement, isVisible, onToggle }: MapElementsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-3 border-b bg-green-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-green-800">🗺️ Map Elements</h3>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="p-3 space-y-4 max-w-sm">
        {Object.entries(MAP_ELEMENTS).map(([category, elements]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
              {category.replace('_', ' ')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(elements).map(([name, content]) => (
                <button
                  key={name}
                  onClick={() => onSelectElement(content)}
                  className="p-2 border border-gray-200 rounded text-xs hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                  title={name.replace('_', ' ')}
                >
                  <div className="whitespace-pre-wrap font-mono text-xs leading-tight">
                    {content.split('\n').slice(0, 3).join('\n')}
                    {content.split('\n').length > 3 && '...'}
                  </div>
                  <div className="text-gray-500 mt-1 text-xs">
                    {name.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
