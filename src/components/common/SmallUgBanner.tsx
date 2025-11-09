export const SmallUgBanner = () => {
  return (
    <div className="w-full flex justify-center bg-white">
      <div 
        className="relative overflow-hidden"
        style={{ 
          width: '1440px', 
          height: '15px',
          maxWidth: '100vw'
        }}
      >
        <img
          src="/images/Logo/pattern-01 1.png"
          alt="Uganda Pattern Banner"
          className="w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  );
};
