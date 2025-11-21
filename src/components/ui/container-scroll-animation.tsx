import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Debug scroll progress
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      //console.log("Map scroll progress:", value.toFixed(3));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.95] : [1.1, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [25, 10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.9]);

  return (
    <div
      className="h-[80rem] md:h-[100rem] flex items-center justify-center relative p-4 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} opacity={opacity}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  opacity,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  opacity: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        opacity,
        backgroundColor: '#013220',
        transformStyle: "preserve-3d",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-emerald-200 p-2 md:p-6 rounded-[30px] shadow-2xl"
      initial={{ rotateX: 25 }}
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-white md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
