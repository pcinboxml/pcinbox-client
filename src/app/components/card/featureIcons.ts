import { IconType } from "react-icons";
import {
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlineServerStack,
  HiOutlineComputerDesktop,
  HiOutlineSpeakerWave,
  HiOutlineWifi,
  HiOutlineSignal,
} from "react-icons/hi2";
import { MdSettingsInputHdmi, MdUsb } from "react-icons/md";
import { TbCircuitAmmeter } from "react-icons/tb";

interface Feature {
  prop: string;
  value: string;
}
export interface MappedFeature {
  icon: IconType;
  label: string;
}

const ICON_MAP = [
  {
    kw: ["chipset", "socket", "procesador", "ryzen", "intel", "core"],
    icon: HiOutlineCpuChip,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["memoria interna", "ddr", "ram", "dimm"],
    icon: HiOutlineCircleStack,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["almacenamiento", "disco", "sata", "nvme", "m.2", "ssd"],
    icon: HiOutlineServerStack,
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
    icon: HiOutlineComputerDesktop,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["audio", "sonido", "canal"],
    icon: HiOutlineSpeakerWave,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["hdmi", "displayport", "dvi"],
    icon: MdSettingsInputHdmi,
    label: (f: Feature) => `HDMI: ${f.value}`,
  },
  {
    kw: ["usb"],
    icon: MdUsb,
    label: (f: Feature) =>
      `${f.prop.replace(/cantidad de puertos /i, "")}: ${f.value}`,
  },
  {
    kw: ["ethernet", "lan", "gigabit"],
    icon: HiOutlineSignal,
    label: (f: Feature) => (f.value !== "No" ? f.value : null),
  },
  {
    kw: ["wifi", "wireless", "bluetooth"],
    icon: HiOutlineWifi,
    label: (f: Feature) => (f.value !== "No" ? `Wi-Fi: ${f.value}` : null),
  },
  {
    kw: ["factor de forma", "atx"],
    icon: TbCircuitAmmeter,
    label: (f: Feature) => f.value,
  },
  {
    kw: ["bios", "uefi"],
    icon: HiOutlineCpuChip,
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
        const key = rule.icon.toString();
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
