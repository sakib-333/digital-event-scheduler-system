interface HeadingProps {
  title: string;
}

const Heading = ({ title }: HeadingProps) => {
  return (
    <h1 className="w-full text-center my-1 sm:my-2 md:my-3 lg:my-4 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
      {title}
    </h1>
  );
};

export default Heading;
