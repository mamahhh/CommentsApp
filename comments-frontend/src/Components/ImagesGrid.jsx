export const ImagesGrid = ({ images }) => {
  if (!images?.length) return null;
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {sortedImages.map((img) => (
        <div key={img.id} className="aspect-square overflow-hidden rounded-lg">
          <img
            src={img.url}
            alt="comment image"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      ))}
    </div>
  );
};
