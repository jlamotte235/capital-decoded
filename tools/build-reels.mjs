import { promises as fs } from 'node:fs';
import { execSync } from 'node:child_process';
const NL = String.fromCharCode(10);
const reels = JSON.parse(await fs.readFile('tools/reels.json','utf8'));
await fs.mkdir('dist/assets/reels',{recursive:true});
const cwd = process.cwd();
const vf = 'scale=1080:1350,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:0x0A0E1A,format=yuv420p,fps=30';
for (const r of reels){
  const dur = r.dur || 2.6;
  const lines = [];
  for (const s of r.slides){ lines.push(`file '${cwd}/dist/assets/social/${s}.png'`); lines.push(`duration ${dur}`); }
  lines.push(`file '${cwd}/dist/assets/social/${r.slides[r.slides.length-1]}.png'`);
  await fs.writeFile('/tmp/reel-list.txt', lines.join(NL) + NL);
  execSync(`ffmpeg -y -f concat -safe 0 -i /tmp/reel-list.txt -f lavfi -i anullsrc=r=44100:cl=stereo -vf '${vf}' -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart dist/assets/reels/${r.id}.mp4`, {stdio:'inherit'});
  console.log('built reel', r.id);
}
console.log('Reels built:', reels.length);
