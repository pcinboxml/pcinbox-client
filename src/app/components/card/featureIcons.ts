interface Feature {
  prop: string;
  value: string;
}
interface MappedFeature {
  icon: string;
  label: string;
}

const ICON_MAP = [
  {
    keywords: [
      "procesador",
      "cpu",
      "socket",
      "ryzen",
      "intel",
      "core",
      "chipset",
    ],
    icon: "ti-cpu",
    label: (f: Feature) => f.value,
  },
  {
    keywords: [
      "memoria",
      "ram",
      "ddr",
      "dimm",
      "ranura de memoria",
      "memoria interna",
    ],
    icon: "ti-database",
    label: (f: Feature) => f.value,
  },
  {
    keywords: ["almacenamiento", "disco", "sata", "nvme", "m.2", "ssd"],
    icon: "ti-device-floppy",
    label: (f: Feature) => f.value,
  },
  {
    keywords: [
      "gráfico",
      "gpu",
      "directx",
      "radeon",
      "nvidia",
      "geforce",
      "vega",
    ],
    icon: "ti-device-desktop",
    label: (f: Feature) => f.value,
  },
  {
    keywords: ["audio", "sonido", "canal"],
    icon: "ti-volume",
    label: (f: Feature) => f.value,
  },
  {
    keywords: ["hdmi", "vga", "displayport", "dvi"],
    icon: "ti-plug-connected",
    label: (f: Feature) =>
      `${f.prop.replace("Número de puertos ", "")}: ${f.value}`,
  },
  {
    keywords: ["usb"],
    icon: "ti-usb",
    label: (f: Feature) =>
      `${f.prop.replace("Cantidad de puertos ", "")}: ${f.value}`,
  },
  {
    keywords: ["ethernet", "lan", "rj-45", "gigabit"],
    icon: "ti-network",
    label: (f: Feature) => (f.value !== "No" ? f.value : null),
  },
  {
    keywords: ["wifi", "inalámbrico", "wireless", "bluetooth"],
    icon: "ti-wifi",
    label: (f: Feature) => (f.value !== "No" ? `Wi-Fi: ${f.value}` : null),
  },
  {
    keywords: ["factor de forma", "atx"],
    icon: "ti-layout-board",
    label: (f: Feature) => f.value,
  },
  {
    keywords: ["bios", "uefi"],
    icon: "ti-settings",
    label: (f: Feature) => f.value,
  },
];

// Orden de prioridad — qué características se prefieren mostrar primero
const PRIORITY = [
  "procesador",
  "chipset",
  "socket",
  "memoria interna",
  "almacenamiento",
  "gráfico",
  "audio",
  "hdmi",
  "ethernet",
  "wifi",
  "factor",
];

export function getTopFeatures(
  features: Feature[],
  limit = 3,
): MappedFeature[] {
  const seen = new Set<string>();
  const matched: (MappedFeature & { prop: string })[] = [];

  for (const f of features) {
    const haystack = `${f.prop} ${f.value}`.toLowerCase();
    for (const rule of ICON_MAP) {
      if (rule.keywords.some((k) => haystack.includes(k))) {
        if (seen.has(rule.icon)) break;
        const label = rule.label(f);
        if (!label) break;
        seen.add(rule.icon);
        matched.push({ icon: rule.icon, label, prop: f.prop.toLowerCase() });
        break;
      }
    }
  }

  return matched
    .sort((a, b) => {
      const ai = PRIORITY.findIndex((k) => a.prop.includes(k));
      const bi = PRIORITY.findIndex((k) => b.prop.includes(k));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .slice(0, limit);
}
