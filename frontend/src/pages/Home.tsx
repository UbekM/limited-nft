/** @format */

import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import styled from "@emotion/styled";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen min-w-[100vw] bg-[#0A0A0A] text-white overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <HeroSection>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A] z-10" />

        <div className="relative z-20 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 bg-clip-text text-transparent">
                  Limited NFT
                </span>
                <br />
                <span className="text-white/90">Collection</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Discover and collect unique digital art pieces from our
                exclusive collection. Each NFT is a one-of-a-kind masterpiece
                waiting to be claimed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/gallery"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-r from-lime-500 to-lime-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-black border-2 border-white group-hover:bg-gradient-to-r group-hover:from-lime-500 group-hover:to-lime-600 group-hover:text-white"></span>
                  <span className="relative text-lg">Explore Gallery</span>
                </Link>

                <Link
                  to="/gallery?mint=true"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-r from-lime-400 to-lime-500 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-black border-2 border-white group-hover:bg-gradient-to-r group-hover:from-lime-400 group-hover:to-lime-500 group-hover:text-white"></span>
                  <span className="relative text-lg">Mint Now</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
                {[
                  { value: "100", label: "Total NFTs" },
                  { value: "0.01", label: "Mint Price" },
                  { value: "Unique", label: "Art Style" },
                ].map((stat, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative rounded-lg p-6 bg-gradient-to-r from-lime-500 to-lime-600">
                      <div className="text-2xl font-bold bg-white bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-black/90 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating NFTs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3].map((id, index) => (
            <div
              key={id}
              className="absolute w-48 h-48 rounded-xl border border-white/10 overflow-hidden"
              style={{
                top: `${20 + index * 25}%`,
                right: `${10 + index * 15}%`,
                animation: `float ${3 + index}s ease-in-out ${
                  index * 0.2
                }s infinite`,
              }}
            >
              <div className="w-full h-full bg-black/50 p-2 backdrop-blur-sm">
                <div className="w-full h-full bg-gradient-to-br from-lime-500/20 to-lime-600/20 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://ipfs.io/ipfs/bafybeiboqfyvwo6fzhjbnudrgfxr565vkz2pgqyencvds33qgfquxbpwmi/image_${id}.svg`}
                    alt={`NFT ${id}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="py-32 bg-lime-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-black bg-clip-text text-transparent">
            Why Choose Our NFTs?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎨",
                title: "Unique Art",
                description:
                  "Each NFT is a unique piece of digital art, created with love and attention to detail.",
                gradient: "from-lime-400 to-lime-500",
              },
              {
                icon: "🔒",
                title: "Secure",
                description:
                  "Built on Ethereum blockchain, ensuring security and authenticity of your digital assets.",
                gradient: "from-lime-500 to-lime-600",
              },
              {
                icon: "💎",
                title: "Limited Edition",
                description:
                  "Only 100 NFTs available, making each piece a rare and valuable collectible.",
                gradient: "from-lime-400 to-lime-500",
              },
              {
                icon: "🚀",
                title: "Easy to Mint",
                description:
                  "Simple and intuitive minting process. Get your NFT in just a few clicks.",
                gradient: "from-lime-500 to-lime-600",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}
                ></div>
                <div className="relative bg-black rounded-xl p-8 h-full border border-white/10">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
              Ready to Start Your NFT Journey?
            </h2>
            <p className="text-xl text-white/60">
              Join our community of collectors and artists. Mint your first NFT
              today!
            </p>
            <Link
              to="/gallery?mint=true"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-r from-lime-500 to-lime-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full bg-black border-2 border-white group-hover:bg-gradient-to-r group-hover:from-lime-500 group-hover:to-lime-600 group-hover:text-white"></span>
              <span className="relative text-lg">Start Minting</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #0a0a0a;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

export default Home;
