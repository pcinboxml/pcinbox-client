"use client";

export const trackingSteps = [
  {
    id: "1",
    title: "Pedido confirmado",
    date: "25 Sep",
    time: "10:00",
    completed: true,
    current: true,
  },
  {
    id: "2",
    title: "En camino",
    date: "26 Sep",
    time: "12:00",
    completed: false,
    current: false,
  },
  {
    id: "3",
    title: "Entregado",
    date: "27 Sep",
    time: "—",
    completed: false,
    current: false,
  },
];

export const pastPurchases = [
  {
    title: "Curso de React Avanzado",
    store: "Academia JS",
    date: "2025-09-20",
    price: 1200,
    status: "entregado",
    category: "Cursos",
  },
  {
    title: "Curso de UX/UI",
    store: "UX Masters",
    date: "2025-08-15",
    price: 950,
    status: "cancelado",
    category: "Diseño",
  },
];

export const producto = {
  name: "Curso de Next.js",
  image: "/dhl.png", // imagen local o URL
  provider: "Dev Academy",
  price: 1200,
  orderCode: "SKO-12-1222",
  orderDate: "25 Sep",
  estimatedDelivery: "27 Sep",
  canCancel: true,
};
