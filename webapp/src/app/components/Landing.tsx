
type LandingProps = {
    onStart: () => void;
};

export function Landing({ onStart }: LandingProps) {
    return (
        <div
            className="flex min-h-screen bg-gray-950 text-gray-100 relative scanlines"
        >
            <div className="absolute inset-0 pointer-events-none noise-overlay opacity-[0.15]" />

            <nav className="absolute top-0 w-full pl-6 pr-6 pt-4 flex justify-between items-center font-mono z-50">
                <a
                    href="https://twitter.com/jamievoynow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                >
                    𝕏 @jamievoynow
                </a>
                <a
                    href="https://github.com/voynow/chat-with-jfk-files"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                >
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </span>
                </a>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative mt-24">
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <div className="flex items-center justify-center gap-2 text-sm font-mono text-gray-500 mb-12">
                        <span className="w-2 h-2 bg-green-500/50 rounded-full status-pulse" />
                        <span className="tracking-wider">System Online</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                            Chat With JFK Files
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-mono mb-12 max-w-2xl mx-auto leading-relaxed typing-text">
                            <span className="typing-cursor"></span>
                        </p>
                        <img
                            src="/favicon.png"
                            alt="JFK Files favicon"
                            className="w-16 h-16 mb-6"
                        />

                    </div>

                    <div className="animate-fade-in-up animation-delay-200 flex flex-col space-y-4 max-w-md mx-auto">
                        <button
                            onClick={onStart}
                            className="w-full group relative px-16 py-6 text-base font-mono bg-transparent text-green-400 border-2 border-green-500/30 hover:border-green-400/50 transition-all duration-300 overflow-hidden transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-green-900/5 to-black/0" />
                            <span className="relative z-10 group-hover:text-green-300 tracking-wider font-bold">
                                BEGIN_INVESTIGATION
                            </span>
                            <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 rotate-180 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-sm" />
                            </div>
                        </button>

                        <a
                            href="https://www.buymeacoffee.com/voynow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full group relative px-16 py-6 text-base font-mono bg-transparent text-amber-400 border-2 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 overflow-hidden transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-amber-900/5 to-black/0" />
                            <span className="relative z-10 group-hover:text-amber-300 tracking-wider font-bold">
                                SUPPORT_THIS_PROJECT
                            </span>
                            <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 rotate-180 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-sm" />
                            </div>
                        </a>
                    </div>

                    <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 font-mono text-sm max-w-4xl mx-auto px-4 md:px-6">
                        <div className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative border border-gray-800/30 bg-gray-900/20 backdrop-blur-sm p-4 md:p-6 hover:border-green-500/30 transition-colors duration-300">
                                <div className="text-green-400/80 mb-2 md:mb-3 flex items-center justify-center gap-2 text-xs md:text-sm">
                                    <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse" />
                                    Jan 23rd, 2025
                                </div>
                                <div className="text-gray-500 font-light tracking-wide text-xs md:text-sm leading-relaxed text-center">
                                    Trump Signs Declassification Order
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative border border-gray-800/30 bg-gray-900/20 backdrop-blur-sm p-4 md:p-6 hover:border-green-500/30 transition-colors duration-300">
                                <div className="text-green-400/80 mb-2 md:mb-3 flex items-center justify-center gap-2 text-xs md:text-sm">
                                    <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse" />
                                    March 18th, 2025
                                </div>
                                <div className="text-gray-500 font-light tracking-wide text-xs md:text-sm leading-relaxed text-center">
                                    Documents Released Publicly
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center font-mono">
                        <div className="inline-block border border-red-900/30 bg-gray-900/20 backdrop-blur-sm px-6 py-4 hover:border-red-700/40 transition-colors duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-red-900/5 animate-pulse" />
                            <div className="text-red-500/80 text-xs tracking-wider relative z-10">NO MEME COINS ARE ASSOCIATED WITH THIS PROJECT</div>
                        </div>
                    </div>

                    <div className="pt-12 text-[10px] text-gray-600/50 font-mono tracking-widest">
                        National Archives and Records Administration
                    </div>
                </div>
            </div>
        </div>
    );
} 