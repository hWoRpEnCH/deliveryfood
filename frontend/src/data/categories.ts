import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "1", name: "Lanches", icon: "hamburger", slug: "lanches" },
  { id: "3", name: "Japonesa", icon: "sushi", slug: "japonesa" },
  { id: "5", name: "Mexicana", icon: "taco", slug: "mexicana" },
  { id: "6", name: "Italiana", icon: "pasta", slug: "italiana" },
  { id: "7", name: "Saudável", icon: "salad", slug: "saudavel" },
  { id: "10", name: "Chinesa", icon: "rice", slug: "chinesa" },
];

export const categorySlugMap: Record<string, string> = {
  lanches: "Lanches",
  japonesa: "Japonesa",
  mexicana: "Mexicana",
  italiana: "Italiana",
  saudavel: "Saudável",
  chinesa: "Chinesa",
};
