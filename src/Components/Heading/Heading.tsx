interface HeadingProps {
  title: string;
}

const Heading = ({ title }: HeadingProps) => {
  return (
    <h1 className="w-full text-center mb-1 sm:mb-2 md:mb-3 lg:mb-4 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
      {title}
    </h1>
  );
};

export default Heading;
