import Lottie from "lottie-react";
import animation from "../assets/animations/loadinganimations.gif"

export default function LoadingAnimation({ text="Finding the best stays..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Lottie animationData={animation} loop autoplay style={{ width: 180 }} />
      <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">{text}</p>
    </div>
  );
}