import React from 'react';
import { Brain, Github, Twitter, ExternalLink, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer({ onOpenDownload, onOpenLiveDemo }) {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090B] py-16 px-4 sm:px-6 lg:px-8 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-[#09090B] rounded-[7px] flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <span className="font-display font-bold text-base text-white tracking-tight">
              Synapse<span className="text-violet-400">OS</span>
            </span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-4">
            The autonomous desktop AI copilot connecting your operating system, ambient context, and proactive task planning with 165+ tok/s NVIDIA Nemotron inference on Nebius Token Factory.
          </p>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">Nebius H100 Cluster: Operational</span>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2">
            <li>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </li>
            <li>
              <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
            </li>
            <li>
              <a href="#pro-trial" className="hover:text-white transition-colors">Pro Trial</a>
            </li>
            <li>
              <button onClick={onOpenLiveDemo} className="hover:text-violet-300 transition-colors text-left">
                Live Cloud Demo
              </button>
            </li>
          </ul>
        </div>

        {/* Downloads */}
        <div>
          <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Downloads</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onOpenDownload('mac')} className="hover:text-white transition-colors text-left">
                macOS Apple Silicon
              </button>
            </li>
            <li>
              <button onClick={() => onOpenDownload('mac')} className="hover:text-white transition-colors text-left">
                macOS Intel (x86_64)
              </button>
            </li>
            <li>
              <button onClick={() => onOpenDownload('win')} className="hover:text-white transition-colors text-left">
                Windows 10/11 x64
              </button>
            </li>
            <li>
              <a href="#compatibility" className="hover:text-white transition-colors">
                System Specs
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                Release Notes v1.2
              </a>
            </li>
          </ul>
        </div>

        {/* Hackathon & Legal */}
        <div>
          <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Hackathon & Tech</h4>
          <ul className="space-y-2">
            <li>
              <span className="text-violet-400 font-mono">NVIDIA Nemotron-3.5</span>
            </li>
            <li>
              <span className="text-cyan-400 font-mono">Nebius Token Factory</span>
            </li>
            <li>
              <span className="text-emerald-400 font-mono">NeMo Guardrails</span>
            </li>
            <li>
              <span className="text-pink-400 font-mono">Tavily Search API</span>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors">Contact Team</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400">
        <div>
          © 2026 SynapseOS. Built for the <strong className="text-white">NVIDIA × Nebius Token Factory Hackathon</strong>.
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Privacy Policy</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Terms of Service</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Security Whitepaper</span>
        </div>
      </div>
    </footer>
  );
}
