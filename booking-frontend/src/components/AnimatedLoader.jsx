import Lottie from "lottie-react";
import loaderAnim from "../assets/animations/search.json";

export default function AnimatedLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-40">
        <Lottie animationData={loaderAnim} loop autoplay />
      </div>
    </div>
  );
}