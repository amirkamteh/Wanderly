import { formatFromPrice, formatPrice, formatStayPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type PriceDisplayProps =
  | {
      /** Stay pricing: shows the total for the quoted number of nights. */
      mode: "stay";
      price: number;
      nights: number;
      className?: string;
    }
  | {
      /** Experience and service pricing: "From AED 149 / guest". */
      mode: "from";
      price: number;
      unit: "guest" | "group";
      className?: string;
    }
  | {
      /** Bare amount, used inside the booking card breakdown. */
      mode: "amount";
      price: number;
      className?: string;
    };

export default function PriceDisplay(props: PriceDisplayProps) {
  const text =
    props.mode === "stay"
      ? formatStayPrice(props.price, props.nights)
      : props.mode === "from"
        ? formatFromPrice(props.price, props.unit)
        : formatPrice(props.price);

  return <span className={cn("whitespace-nowrap", props.className)}>{text}</span>;
}
