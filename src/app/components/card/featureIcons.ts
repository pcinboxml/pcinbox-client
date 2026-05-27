import { IconType } from "react-icons";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Volume2,
  HdmiPortIcon,
  Usb,
  Network,
  Wifi,
  CircuitBoard,
  LucideIcon,
} from "lucide-react";

interface Feature {
  prop: string;
  value: string;
}
export interface MappedFeature {
  icon: LucideIcon;
  label: string;
}

const ICON_MAP = [
  {
    kw: ["chipset", "socket", "procesador", "ryzen", "intel", "core"],
    icon: Cpu,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["memoria interna", "ddr", "ram", "dimm"],
    icon: MemoryStick,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["almacenamiento", "disco", "sata", "nvme", "m.2", "ssd"],
    icon: HardDrive,
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
    icon: Monitor,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["audio", "sonido", "canal"],
    icon: Volume2,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["hdmi", "displayport", "dvi"],
    icon: HdmiPortIcon,
    label: (f: Feature) => `HDMI: ${f.value}`,
  },
  {
    kw: ["usb"],
    icon: Usb,
    label: (f: Feature) =>
      `${f.prop.replace(/cantidad de puertos /i, "")}: ${f.value}`,
  },
  {
    kw: ["ethernet", "lan", "gigabit"],
    icon: Network,
    label: (f: Feature) => (f.value !== "No" ? f.value : null),
  },
  {
    kw: ["wifi", "wireless", "bluetooth"],
    icon: Wifi,
    label: (f: Feature) => (f.value !== "No" ? `Wi-Fi: ${f.value}` : null),
  },
  {
    kw: ["factor de forma", "atx"],
    icon: CircuitBoard,
    label: (f: Feature) => f.value,
  },
  { kw: ["bios", "uefi"], icon: Cpu, label: (f: Feature) => f.value },
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
        const key = rule.icon.displayName ?? rule.icon.name;
        if (seen.has(key)) break;
        const label = rule.label(f);
        if (!label) break;
        seen.add(key);
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
