
import { ReactNode } from "react";

export type NavCategory = {
  name: string;
  icon: ReactNode;
  items: NavItem[];
  expanded?: boolean;
};

export type NavItem = {
  name: string;
  path: string;
  icon?: ReactNode;
};
