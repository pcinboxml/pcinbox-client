interface Feature {
  prop: string;
  value: string;
}
export interface MappedFeature {
  icon: string;
  label: string;
}

const COLOR = "BB3D4B";

const ICON_MAP = [
  {
    kw: ["procesador", "cpu", "chipset", "socket", "ryzen", "intel", "core"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/cpu.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: [
      "tarjeta gr",
      "tarjeta de video",
      "gpu",
      "nvidia",
      "rtx",
      "gtx",
      "radeon",
      "geforce",
      "vega",
    ],
    icon: `https://img.icons8.com/ios/50/${COLOR}/video-card.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["tarjeta madre", "motherboard", "tarjeta m"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/motherboard.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["memoria ram", "ram", "ddr", "dimm", "memoria interna"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/memory-slot.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["ssd", "disco", "almacenamiento", "nvme", "m.2", "sata"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/ssd.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["gabinete", "case", "chasis"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/computer.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["disipador", "cooler", "ventilador", "refriger"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/fan.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["fuente", "psu", "watts", "poder"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/power.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["sistema operativo", "windows", "linux", "os"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/windows-10.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["audio", "sonido", "canal"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/speaker.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["wifi", "wireless", "bluetooth", "inalámbrico"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/wifi.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["ethernet", "lan", "gigabit", "red"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/network-card.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["hdmi", "displayport", "dvi"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/hdmi-cable.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["usb"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/usb-2.png`,
    label: (f: Feature) => f.value,
  },
];

// Orden de prioridad — qué props se muestran primero
const PRIORITY = [
  "procesador",
  "tarjeta gr",
  "tarjeta de video",
  "tarjeta madre",
  "memoria ram",
  "ssd",
  "disco",
  "gabinete",
  "disipador",
  "fuente",
  "sistema operativo",
  "wifi",
  "ethernet",
];

export function getTopFeatures(
  features: Feature[],
  limit = 3,
): MappedFeature[] {
  const seen = new Set<string>();
  const matched: (MappedFeature & { prop: string })[] = [];

  for (const f of features) {
    // lowercase para que "Procesador" y "procesador" hagan match igual
    const haystack = `${f.prop} ${f.value}`.toLowerCase();
    for (const rule of ICON_MAP) {
      if (rule.kw.some((k) => haystack.includes(k))) {
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
