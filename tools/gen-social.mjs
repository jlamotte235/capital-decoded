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
{slug:'hundred-k-at-40',tag:'Wealth Mindset',lines:['$100,000 at 40.','Left alone at 8%,','that’s ~$685,000','at 65.'],gold:[2]},
{slug:'ten-years-early-doubles',tag:'Wealth Mindset',lines:['$10k invested at 25','beats $10k at 35','by more than 2x','by 65.'],gold:[2]},
{slug:'five-hundred-a-month',tag:'Wealth Mindset',lines:['$500/month','from 30 to 65','at 8% becomes','~$1.1 million.'],gold:[3]},
{slug:'best-time-to-invest-yesterday',tag:'Wealth Mindset',lines:['The best time to','invest was 20','years ago. The next','best is today.'],gold:[2,3]},
{slug:'time-in-the-market',tag:'Wealth Mindset',lines:['Time IN the market','beats timing','the market.'],gold:[0]},
{slug:'rule-of-72',tag:'Wealth Mindset',lines:['Rule of 72:','at 8%, your money','doubles about','every 9 years.'],gold:[2,3]},
{slug:'the-cost-of-waiting',tag:'Wealth Mindset',lines:['Waiting 10 years','to start can cost','you over','$1,000,000.'],gold:[3]},
{slug:'compounding-is-exponential',tag:'Wealth Mindset',lines:['Compounding isn’t','addition.','It’s multiplication.'],gold:[2]},
{slug:'one-thousand-at-25',tag:'Wealth Mindset',lines:['One $1,000 deposit','at 25, untouched,','is ~$21,000','by 65.'],gold:[2]},
{slug:'boring-builds-wealth',tag:'Wealth Mindset',lines:['Boring is the point.','Steady beats','exciting.'],gold:[1]},
{slug:'dollar-cost-averaging',tag:'Wealth Mindset',lines:['You can’t time','the bottom.','So buy a little','every month.'],gold:[2,3]},
{slug:'start-small',tag:'Wealth Mindset',lines:['$200/month','for 30 years','at 8% ≈','$300,000.'],gold:[3]},
{slug:'inflation-eats-cash',tag:'Wealth Mindset',lines:['Cash feels safe.','Inflation quietly','shrinks it','every year.'],gold:[2,3]},
{slug:'dont-interrupt-compounding',tag:'Wealth Mindset',lines:['The fastest way to','kill compounding:','interrupting it.'],gold:[2]},
{slug:'automate-your-investing',tag:'Wealth Mindset',lines:['Willpower fades.','Automatic','investing doesn’t.'],gold:[1,2]},
{slug:'the-boring-middle',tag:'Wealth Mindset',lines:['Wealth is built','in the boring','middle — then','it explodes.'],gold:[3]},
{slug:'steady-beats-yolo',tag:'Wealth Mindset',lines:['YOLO trades','feel good.','Steady investing','builds the house.'],gold:[2,3]},
{slug:'hundred-a-week',tag:'Wealth Mindset',lines:['$100 a week,','30 years, at 8%','≈ $645,000.'],gold:[2]},
{slug:'reinvest-your-dividends',tag:'Wealth Mindset',lines:['Spent dividends','are gone.','Reinvested ones','compound.'],gold:[3]},
{slug:'your-time-is-the-edge',tag:'Wealth Mindset',lines:['Young investor?','Your biggest asset','isn’t money.','It’s time.'],gold:[3]},
];
const BG='#0A0E1A',GOLD='#E8B43A',TEXT='#F5F7FA',MUTED='#9AA7BD',LINE='#233048';
const W=1080,H=1350,X=96,BUDGET=W-X-64;
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function mark(x,y,s){const u=v=>v*s;return `<g transform='translate(${x},${y})'><rect x='${u(0)}' y='${u(22)}' width='${u(7)}' height='${u(14)}' rx='${u(2)}' fill='${TEXT}'/><rect x='${u(11)}' y='${u(12)}' width='${u(7)}' height='${u(24)}' rx='${u(2)}' fill='${TEXT}'/><rect x='${u(22)}' y='${u(0)}' width='${u(7)}' height='${u(36)}' rx='${u(2)}' fill='${GOLD}'/><path d='M ${u(20)} ${u(0)} L ${u(25.5)} ${u(-8)} L ${u(31)} ${u(0)} Z' fill='${GOLD}'/></g>`;}
function svg(p){
  const maxLen=Math.max(...p.lines.map(l=>l.length));
  let fz=Math.min(78,Math.floor(BUDGET/(maxLen*0.60)));fz=Math.max(50,fz);
  const lh=Math.round(fz*1.2),total=p.lines.length*lh,startY=(H/2)-total/2+fz*0.34+16;
  const lines=p.lines.map((t,i)=>{const fill=(p.gold||[]).includes(i)?GOLD:TEXT;return `<text x='${X}' y='${startY+i*lh}' font-family='DejaVu Serif' font-size='${fz}' font-weight='700' fill='${fill}'>${esc(t)}</text>`;}).join('');
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><defs><radialGradient id='g' cx='80%' cy='6%' r='60%'><stop offset='0%' stop-color='${GOLD}' stop-opacity='0.20'/><stop offset='55%' stop-color='${GOLD}' stop-opacity='0'/></radialGradient></defs><rect width='${W}' height='${H}' fill='${BG}'/><rect width='${W}' height='${H}' fill='url(#g)'/><rect x='40' y='40' width='${W-80}' height='${H-80}' rx='28' fill='none' stroke='${LINE}' stroke-width='2'/>${mark(96,92,1.5)}<text x='150' y='120' font-family='DejaVu Serif' font-size='30' font-weight='700' fill='${TEXT}' letter-spacing='2'>CAPITAL <tspan fill='${GOLD}'>DECODED</tspan></text><rect x='96' y='168' width='${28+p.tag.length*15}' height='44' rx='22' fill='${GOLD}' fill-opacity='0.14'/><text x='116' y='197' font-family='DejaVu Sans' font-size='22' font-weight='700' fill='${GOLD}' letter-spacing='2'>${esc(p.tag.toUpperCase())}</text>${lines}<text x='96' y='${H-72}' font-family='DejaVu Sans' font-size='30' font-weight='700' fill='${MUTED}'>@capital.decodedhq</text>${mark(W-150,H-104,1.2)}</svg>`;
}
await fs.mkdir('assets/social',{recursive:true});
for(const p of POSTS){ await fs.writeFile(`assets/social/${p.slug}.svg`, svg(p)); }
console.log('Generated', POSTS.length, 'SVGs');
