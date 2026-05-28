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
    kw: ["chipset", "socket", "procesador", "ryzen", "intel", "core"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/processor.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["memoria interna", "ddr", "ram", "dimm"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/memory-slot.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["almacenamiento", "disco", "sata", "nvme", "m.2", "ssd"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/ssd.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: [
      "gráfico",
      "gpu",
      "directx",
      "radeon",
      "nvidia",
      "geforce",
      "vega",
      "rtx",
      "gtx",
    ],
    icon: `https://img.icons8.com/ios/50/${COLOR}/video-card.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["audio", "sonido", "canal"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/speaker.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["hdmi", "displayport", "dvi"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/hdmi-cable.png`,
    label: (f: Feature) => `HDMI: ${f.value}`,
  },
  {
    kw: ["usb"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/usb-2.png`,
    label: (f: Feature) =>
      `${f.prop.replace(/cantidad de puertos /i, "")}: ${f.value}`,
  },
  {
    kw: ["ethernet", "lan", "gigabit"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/network-card.png`,
    label: (f: Feature) => (f.value !== "No" ? f.value : null),
  },
  {
    kw: ["wifi", "wireless", "bluetooth"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/wifi.png`,
    label: (f: Feature) => (f.value !== "No" ? `Wi-Fi: ${f.value}` : null),
  },
  {
    kw: ["factor de forma", "atx"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/motherboard.png`,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["bios", "uefi"],
    icon: `https://img.icons8.com/ios/50/${COLOR}/bios.png`,
    label: (f: Feature) => f.value,
  },
];
const PRIORITY = [
  "chipset",
  "socket",
  "procesador",
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
