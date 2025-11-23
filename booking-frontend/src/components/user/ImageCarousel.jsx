// components/user/ImageCarousel.jsx
export default function ImageCarousel({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-scroll pb-2">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className="h-48 w-72 rounded-xl shadow object-cover"
        />
      ))}
    </div>
  );
}