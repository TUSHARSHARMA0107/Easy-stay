import { motion as Motion } from "framer-motion";
import bg from "../assets/loginbg.jpg";

export default function AuthLayout({ children, title }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay for softness */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Glass card */}
      <motion.div
        className="relative glass p-10 rounded-3xl w-full max-w-md border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-6 drop-shadow">
          {title}
        </h2>
        {children}
      </motion.div>
    </div>
  );
}