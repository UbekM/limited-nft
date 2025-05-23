/** @format */

import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const IPFS_CID = "bafybeiboqfyvwo6fzhjbnudrgfxr565vkz2pgqyencvds33qgfquxbpwmi";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen min-w-screen bg-dark text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] min-w-[100vw] flex items-center justify-center px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Limited NFT
                </span>{" "}
                Collection
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0">
                Discover and collect unique digital art pieces from our
                exclusive collection. Each NFT is a one-of-a-kind masterpiece
                waiting to be claimed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/gallery"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explore Gallery
                </Link>
                <Link
                  to="/gallery?mint=true"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-dark-surface text-white border border-white/10 hover:bg-dark-surface-hover hover:border-primary transition-all duration-200"
                >
                  Mint Now
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    100
                  </div>
                  <div className="text-sm text-text-secondary uppercase tracking-wider">
                    Total NFTs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    0.01
                  </div>
                  <div className="text-sm text-text-secondary uppercase tracking-wider">
                    Mint Price
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    Unique
                  </div>
                  <div className="text-sm text-text-secondary uppercase tracking-wider">
                    Art Style
                  </div>
                </div>
              </div>
            </div>

            {/* Floating NFTs */}
            <div className="hidden lg:block relative h-[600px]">
              {[1, 2, 3].map((id, index) => (
                <div
                  key={id}
                  className="absolute w-48 h-48 rounded-xl border border-white/10 overflow-hidden"
                  style={{
                    top: `${index * 40}%`,
                    right: `${index * 10}%`,
                    animation: `float 3s ease-in-out ${index * 0.2}s infinite`,
                  }}
                >
                  <div className="w-full h-full bg-dark-surface p-2">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-hover/20 rounded-lg flex items-center justify-center">
                      <img
                        src={`https://ipfs.io/ipfs/${IPFS_CID}/image_${id}.svg`}
                        alt={`NFT ${id}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-dark-surface">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Our NFTs?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎨",
                title: "Unique Art",
                description:
                  "Each NFT is a unique piece of digital art, created with love and attention to detail.",
              },
              {
                icon: "🔒",
                title: "Secure",
                description:
                  "Built on Ethereum blockchain, ensuring security and authenticity of your digital assets.",
              },
              {
                icon: "💎",
                title: "Limited Edition",
                description:
                  "Only 100 NFTs available, making each piece a rare and valuable collectible.",
              },
              {
                icon: "🚀",
                title: "Easy to Mint",
                description:
                  "Simple and intuitive minting process. Get your NFT in just a few clicks.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-dark-surface rounded-xl border border-white/10 p-8 transition-all duration-200 hover:border-primary hover:-translate-y-0.5"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-dark">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                title: "Connect Wallet",
                description:
                  "Connect your Ethereum wallet to get started with minting.",
                image: "Connect Wallet",
              },
              {
                title: "Choose NFT",
                description:
                  "Browse our gallery and select your favorite NFT to mint.",
                image: "Choose NFT",
              },
              {
                title: "Mint & Own",
                description:
                  "Complete the minting process and become the proud owner of your NFT.",
                image: "Mint & Own",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-dark-surface rounded-xl border border-white/10 p-8 transition-all duration-200 hover:border-primary hover:-translate-y-0.5 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-semibold mb-6">
                    {index + 1}
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-hover/20 rounded-xl mb-6 flex items-center justify-center text-white font-semibold">
                    {step.image}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-primary-hover" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-dark-surface">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your NFT Journey?
            </h2>
            <p className="text-lg text-text-secondary">
              Join our community of collectors and artists. Mint your first NFT
              today!
            </p>
            <Link
              to="/gallery?mint=true"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Minting
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
