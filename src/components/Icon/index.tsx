import { FC, SVGProps } from "react";
import classNames from "classnames";

import styles from "./Icon.module.scss";

import { icons } from "@/assets/icons";
import { PriceSortDirection } from "@/stores/vehicles-store";

export type IconName = keyof typeof icons;

export interface IconProps extends SVGProps<SVGSVGElement> {
  icon: IconName;
  active?: boolean;
  sortDirection?: PriceSortDirection;
}

const Icon: FC<IconProps> = (props) => {
  const {
    icon,
    className,
    width = 30,
    height = 20,
    active = false,
    sortDirection,
    ...rest
  } = props;

  const SvgIcon = icons[icon] as FC<
    SVGProps<SVGSVGElement> & {
      active?: boolean;
      sortDirection?: PriceSortDirection;
    }
  >;

  if (!SvgIcon) return null;

  return (
    <SvgIcon
      aria-label={icon}
      role="img"
      width={width}
      height={height}
      active={active}
      data-active={active}
      sortDirection={sortDirection}
      className={classNames(styles.icon, { className: !!className })}
      {...rest}
    />
  );
};

export default Icon;
