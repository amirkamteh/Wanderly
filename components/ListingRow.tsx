import type { Experience } from "@/types/experience";
import type { Home } from "@/types/listing";
import type { Service } from "@/types/service";
import Carousel, { CarouselItem } from "./Carousel";
import ExperienceCard from "./ExperienceCard";
import ListingCard from "./ListingCard";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

type RowItems =
  | { kind: "homes"; items: Home[] }
  | { kind: "experiences"; items: Experience[]; showTimes?: boolean }
  | { kind: "services"; items: Service[] };

type ListingRowProps = RowItems & {
  title: string;
  href?: string;
  subtitle?: string;
  /** First rail on a page renders eagerly for a faster LCP. */
  priority?: boolean;
};

const RAIL_SIZES =
  "(max-width: 640px) 63vw, (max-width: 768px) 42vw, (max-width: 1024px) 30vw, (max-width: 1280px) 23vw, 17vw";

/**
 * One titled rail of cards. Keeps the three verticals rendering through a
 * single component so spacing and arrow behaviour never drift apart.
 */
export default function ListingRow(props: ListingRowProps) {
  const { title, href, subtitle, priority } = props;

  if (props.items.length === 0) return null;

  return (
    <Carousel
      label={title}
      subtitle={subtitle}
      title={<SectionHeader title={title} href={href} />}
    >
      {props.kind === "homes" &&
        props.items.map((home, index) => (
          <CarouselItem key={home.id}>
            <ListingCard
              home={home}
              priority={priority && index < 6}
              sizes={RAIL_SIZES}
            />
          </CarouselItem>
        ))}

      {props.kind === "experiences" &&
        props.items.map((experience, index) => (
          <CarouselItem key={experience.id}>
            <ExperienceCard
              experience={experience}
              showTime={props.showTimes}
              priority={priority && index < 6}
              sizes={RAIL_SIZES}
            />
          </CarouselItem>
        ))}

      {props.kind === "services" &&
        props.items.map((service, index) => (
          <CarouselItem key={service.id}>
            <ServiceCard
              service={service}
              priority={priority && index < 6}
              sizes={RAIL_SIZES}
            />
          </CarouselItem>
        ))}
    </Carousel>
  );
}
