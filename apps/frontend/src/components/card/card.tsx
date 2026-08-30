import { cn } from "@/lib/utils";
import styles from "./card.module.scss";

type CardProps = {
  title: string;
  description?: string;
  badge?: string;
  highlighted?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function Card({
  title,
  description,
  badge,
  highlighted,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        highlighted && styles["card--highlighted"],
        className
      )}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <h3 className={styles.card__title}>{title}</h3>
      {description && (
        <p className={styles.card__description}>{description}</p>
      )}
      {children && <div className={styles.card__footer}>{children}</div>}
    </div>
  );
}
