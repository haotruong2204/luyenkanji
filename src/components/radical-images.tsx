import { useTheme } from "next-themes";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RadicalImages = ({
  radicalImageArray,
}: {
  radicalImageArray: string[];
}) => {
  const [index, setIndex] = React.useState(0);
  const [invert, setInvert] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);

  const { resolvedTheme } = useTheme();

  // Ensure client-side only rendering
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;
    resolvedTheme === "dark" ? setInvert(1) : setInvert(0);
  }, [resolvedTheme, isMounted]);

  React.useEffect(() => {
    const interval = setInterval(
      () => setIndex((state) => (state + 1) % radicalImageArray.length),
      2500
    );
    return () => {
      clearInterval(interval);
    };
  }, [radicalImageArray.length]);

  if (!isMounted) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute h-full w-full bg-contain bg-no-repeat" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <AnimatePresence>
        {radicalImageArray.map((image, idx) =>
          idx === index ? (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={`absolute h-full w-full bg-contain bg-no-repeat ${
                invert ? "invert" : ""
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadicalImages;
