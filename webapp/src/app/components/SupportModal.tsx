import { useEffect, useState } from 'react';

type SupportModalProps = {
    onClose: () => void;
};

export function SupportModal({ onClose }: SupportModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slight delay for dramatic effect
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-gray-900/90 border border-amber-500/30 w-full max-w-lg transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-mono text-amber-400">🔍 Support the Investigation</h2>
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                        Unlocking the truth requires resources. Help us maintain and expand this declassified intelligence database.
                    </p>
                    <div className="pt-4 space-y-3">
                        <a
                            href="https://www.buymeacoffee.com/voynow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-sm transition-colors"
                        >
                            SUPPORT_THE_MISSION
                        </a>
                        <button
                            onClick={onClose}
                            className="block w-full py-2 text-gray-500 hover:text-amber-400 font-mono text-sm transition-colors"
                        >
                            [CONTINUE_INVESTIGATION]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 