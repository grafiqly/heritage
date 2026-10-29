type Props = { craft: string };
/** Craft reference imagery, never a portrait attributed to a fictional profile. */
export function ArtisanImage({ craft }: Props) {
  const image = craft.toLowerCase().includes("palm")
    ? "/media/palm-leaf-craft.jpg"
    : craft.toLowerCase().includes("wood")
      ? "/media/wooden-toys.jpg"
      : "/media/artist-at-work.jpg";
  return (
    <div className="artisan-card-image">
      <img
        src={image}
        alt={`Illustrative ${craft} craft reference, not a portrait of this fictional artisan`}
        loading="lazy"
        decoding="async"
      />
      <span>CRAFT STUDY · ILLUSTRATIVE</span>
    </div>
  );
}
