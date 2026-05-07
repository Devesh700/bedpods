const features = [
  {
    icon: "🎵",
    title: "Premium Sound Quality",
    description: "Experience crystal-clear audio with deep bass and crisp highs"
  },
  {
    icon: "🔋",
    title: "Long Battery Life",
    description: "Up to 30 hours of listening time with charging case"
  },
  {
    icon: "🎯",
    title: "Active Noise Cancellation",
    description: "Block out the world and immerse yourself in music"
  },
  {
    icon: "📱",
    title: "Seamless Connectivity",
    description: "Instant pairing with all your Apple devices"
  },
  {
    icon: "🎮",
    title: "Spatial Audio",
    description: "Theater-like sound that surrounds you"
  },
  {
    icon: "💧",
    title: "Sweat & Water Resistant",
    description: "IPX4 rated for workouts and daily use"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-pure-black mb-4">
            Why Choose BEPODS?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium Apple products at unbeatable prices with exceptional service
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-pure-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-pure-black mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;