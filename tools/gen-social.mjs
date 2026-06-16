import { promises as fs } from 'node:fs';
const POSTS=[
{slug:'prepaids-vs-closing-costs',tag:'Borrower Guides',lines:['Closing costs and','prepaids are NOT','the same thing.'],gold:[2]},
{slug:'closing-costs-socal-what-to-expect',tag:'Borrower Guides',lines:['“$150 to 1%”','is not a real quote.','Make them give','you a number.'],gold:[2,3]},
{slug:'negotiate-or-shop-closing-costs',tag:'Borrower Guides',lines:['Half your closing','costs are negotiable.','Most buyers','never ask.'],gold:[2,3]},
{slug:'who-pays-what-buyer-vs-seller',tag:'Borrower Guides',lines:['Who pays what','at closing','isn’t law.','It’s negotiable.'],gold:[3]},
{slug:'get-a-roof-inspection',tag:'Borrower Guides',lines:['A roof inspection','costs $300.','A surprise roof','costs $15,000.'],gold:[2,3]},
{slug:'why-your-loan-estimate-spikes',tag:'Borrower Guides',lines:['Your payment jumped','mid-approval?','That’s the ceiling,','not the bill.'],gold:[2,3]},
{slug:'mortgage-points-and-basis-points',tag:'Borrower Guides',lines:['A “point” = 1%','of your loan.','A “basis point”','= 0.01%.'],gold:[2,3]},
{slug:'insurance-before-loan-approval',tag:'Borrower Guides',lines:['You need home','insurance BEFORE','the bank approves','your loan.'],gold:[1]},
{slug:'when-you-can-walk-away-contingencies',tag:'Borrower Guides',lines:['Contingencies are','your exit ramps.','Know them','before you sign.'],gold:[2,3]},
{slug:'get-it-in-writing',tag:'Borrower Guides',lines:['If it’s not','in writing,','don’t count on it.'],gold:[2]},
{slug:'set-yourself-up-before-you-buy',tag:'Borrower Guides',lines:['The best buyers','win before they','ever make','an offer.'],gold:[2,3]},
];
const BG='#0A0E1A',GOLD='#E8B43A',TEXT='#F5F7FA',MUTED='#9AA7BD',LINE='#233048';
const W=1080,H=1350,X=96,BUDGET=W-X-64;
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function mark(x,y,s){const u=v=>v*s;return `<g transform='translate(${x},${y})'><rect x='${u(0)}' y='${u(22)}' width='${u(7)}' height='${u(14)}' rx='${u(2)}' fill='${TEXT}'/><rect x='${u(11)}' y='${u(12)}' width='${u(7)}' height='${u(24)}' rx='${u(2)}' fill='${TEXT}'/><rect x='${u(22)}' y='${u(0)}' width='${u(7)}' height='${u(36)}' rx='${u(2)}' fill='${GOLD}'/><path d='M ${u(20)} ${u(0)} L ${u(25.5)} ${u(-8)} L ${u(31)} ${u(0)} Z' fill='${GOLD}'/></g>`;}
function svg(p){
  const maxLen=Math.max(...p.lines.map(l=>l.length));
  let fz=Math.min(78,Math.floor(BUDGET/(maxLen*0.60)));fz=Math.max(52,fz);
  const lh=Math.round(fz*1.2),total=p.lines.length*lh,startY=(H/2)-total/2+fz*0.34+16;
  const lines=p.lines.map((t,i)=>{const fill=(p.gold||[]).includes(i)?GOLD:TEXT;return `<text x='${X}' y='${startY+i*lh}' font-family='DejaVu Serif' font-size='${fz}' font-weight='700' fill='${fill}'>${esc(t)}</text>`;}).join('');
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><defs><radialGradient id='g' cx='80%' cy='6%' r='60%'><stop offset='0%' stop-color='${GOLD}' stop-opacity='0.20'/><stop offset='55%' stop-color='${GOLD}' stop-opacity='0'/></radialGradient></defs><rect width='${W}' height='${H}' fill='${BG}'/><rect width='${W}' height='${H}' fill='url(#g)'/><rect x='40' y='40' width='${W-80}' height='${H-80}' rx='28' fill='none' stroke='${LINE}' stroke-width='2'/>${mark(96,92,1.5)}<text x='150' y='120' font-family='DejaVu Serif' font-size='30' font-weight='700' fill='${TEXT}' letter-spacing='2'>CAPITAL <tspan fill='${GOLD}'>DECODED</tspan></text><rect x='96' y='168' width='${28+p.tag.length*15}' height='44' rx='22' fill='${GOLD}' fill-opacity='0.14'/><text x='116' y='197' font-family='DejaVu Sans' font-size='22' font-weight='700' fill='${GOLD}' letter-spacing='2'>${esc(p.tag.toUpperCase())}</text>${lines}<text x='96' y='${H-72}' font-family='DejaVu Sans' font-size='30' font-weight='700' fill='${MUTED}'>@capital.decodedhq</text>${mark(W-150,H-104,1.2)}</svg>`;
}
await fs.mkdir('assets/social',{recursive:true});
for(const p of POSTS){ await fs.writeFile(`assets/social/${p.slug}.svg`, svg(p)); }
console.log('Generated', POSTS.length, 'SVGs');
