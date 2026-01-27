import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    fontFamily: {
      BebasNeue: ['BebasNeue', 'sans-serif'],
      BiaoTiHei: ['YouSheBiaoTiHei', 'sans-serif'],
      AlibabaPuHuiTi: ['AlibabaPuHuiTi', 'sans-serif'],
    },
  },
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex justify-center items-center flex-col',
      'flex-between': 'flex justify-between items-center',
      'flex-start': 'flex justify-start items-center',
      'theme-purple': 'text-[#9333ea]',
      'theme-green': 'text-[#00C800]',
      'theme-pale-green': 'text-[#61D6D1]',
      'theme-blue': 'text-[#1296DB]',
      'theme-orange': 'text-[#F1A55B]',
      'theme-red': 'text-[#FF0000]',
      'theme-gray': 'text-[#E0F0FF]/80',
    },
  ],
  safelist: [
    'bg-blue-100',
    'text-blue-700',
    'bg-emerald-100',
    'text-emerald-700',
    'bg-pink-100',
    'text-pink-700',
    'bg-indigo-100',
    'text-indigo-700',
    'bg-cyan-100',
    'text-cyan-700',
    'bg-violet-100',
    'text-violet-700',
    'bg-sky-100',
    'text-sky-700',
    'bg-teal-100',
    'text-teal-700',
    'bg-purple-100',
    'text-purple-700',
    'bg-green-100',
    'text-green-700',
  ],
});
