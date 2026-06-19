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
{slug:'cash-flow-vs-appreciation',tag:'Investor Insights',lines:['Cash flow pays','you today.','Appreciation pays','you later.'],gold:[1,3]},
{slug:'the-1-percent-rule',tag:'Investor Insights',lines:['The 1% rule:','monthly rent ≥ 1%','of the price.','A rough screen.'],gold:[1]},
{slug:'house-hacking',tag:'Investor Insights',lines:['Live in one unit,','rent the others,','and let tenants pay','your mortgage.'],gold:[3]},
{slug:'leverage-cuts-both-ways',tag:'Investor Insights',lines:['Leverage magnifies','gains AND losses.','Respect it.'],gold:[1]},
{slug:'cap-rate-explained',tag:'Investor Insights',lines:['Cap rate =','net income ÷ price.','Higher cap rate,','higher risk.'],gold:[1,3]},
{slug:'reserves-before-rentals',tag:'Investor Insights',lines:['Own a rental?','Keep cash reserves.','Repairs don’t','schedule themselves.'],gold:[1]},
{slug:'real-estate-is-illiquid',tag:'Investor Insights',lines:['Stocks sell','in seconds.','Houses take months.','Plan for it.'],gold:[3]},
{slug:'brrrr-method',tag:'Investor Insights',lines:['Buy. Rehab. Rent.','Refinance. Repeat.','Recycle your','capital.'],gold:[2,3]},
{slug:'pay-yourself-first',tag:'Wealth Mindset',lines:['Pay yourself first.','Save before you','spend, not after.'],gold:[0]},
{slug:'emergency-fund-first',tag:'Wealth Mindset',lines:['Before you invest,','build 3–6 months','of expenses','in cash.'],gold:[1]},
{slug:'high-interest-debt-first',tag:'Wealth Mindset',lines:['Credit card at 22%?','Pay that off before','you chase 8%','returns.'],gold:[1]},
{slug:'lifestyle-creep',tag:'Wealth Mindset',lines:['Raises feel great','until spending','rises to match.','Bank the raise.'],gold:[3]},
{slug:'net-worth-not-income',tag:'Wealth Mindset',lines:['Income is what','you make.','Net worth is what','you keep.'],gold:[3]},
{slug:'the-big-three',tag:'Wealth Mindset',lines:['Skipping coffee','won’t make you rich.','Housing, car, food','will.'],gold:[2]},
{slug:'good-debt-vs-bad-debt',tag:'Wealth Mindset',lines:['Debt that buys','assets builds you.','Debt that buys stuff','breaks you.'],gold:[1,3]},
{slug:'automate-your-savings',tag:'Wealth Mindset',lines:['The best budget','is the one','you never','have to touch.'],gold:[3]},
{slug:'fees-compound-too',tag:'Wealth Mindset',lines:['A 1% fee','sounds tiny —','until it eats 20%+','of your nest egg.'],gold:[2,3]},
{slug:'dont-cash-out-401k',tag:'Wealth Mindset',lines:['Cashing out a 401k','early = taxes','+ penalty + lost','compounding.'],gold:[2,3]},
{slug:'budget-is-freedom',tag:'Wealth Mindset',lines:['A budget isn’t','a cage.','It’s a plan for','your money.'],gold:[2]},
{slug:'invest-in-yourself',tag:'Wealth Mindset',lines:['The best ROI?','Skills nobody','can take','from you.'],gold:[0]},
{slug:'credit-score-basics',tag:'Borrower Guides',lines:['Credit scores run','300 to 850.','~740+ unlocks','the best rates.'],gold:[3]},
{slug:'what-is-dti',tag:'Borrower Guides',lines:['DTI = monthly debt','÷ monthly income.','Lenders watch it','closely.'],gold:[1]},
{slug:'fixed-vs-adjustable-rate',tag:'Borrower Guides',lines:['Fixed rate:','same payment.','Adjustable:','it can change.'],gold:[1,3]},
{slug:'what-is-pmi',tag:'Borrower Guides',lines:['Under 20% down?','Expect PMI —','insurance that','protects the lender.'],gold:[1]},
{slug:'preapproval-vs-prequal',tag:'Borrower Guides',lines:['Pre-qual is a guess.','Pre-approval is','verified. Get','pre-approved.'],gold:[1]},
{slug:'what-is-escrow',tag:'Borrower Guides',lines:['Escrow holds your','taxes & insurance,','then pays them','for you.'],gold:[1]},
{slug:'rate-vs-apr',tag:'Borrower Guides',lines:['Rate is the interest.','APR adds the fees.','Compare APR','to APR.'],gold:[1]},
{slug:'earnest-money-explained',tag:'Borrower Guides',lines:['Earnest money shows','you’re serious.','It’s credited','at closing.'],gold:[2]},
{slug:'what-is-an-index-fund',tag:'Wealth Mindset',lines:['An index fund buys','the whole market','at once —','low cost, simple.'],gold:[3]},
{slug:'diversification-basics',tag:'Wealth Mindset',lines:['Don’t bet it all','on one stock.','Spread the risk.'],gold:[2]},
{slug:'roth-vs-traditional',tag:'Wealth Mindset',lines:['Roth: pay tax now.','Traditional:','pay tax later.','Pick your timing.'],gold:[0,1]},
{slug:'get-the-employer-match',tag:'Wealth Mindset',lines:['A 401k match is','free money.','Always grab','the full match.'],gold:[1]},
{slug:'tax-advantaged-first',tag:'Wealth Mindset',lines:['Use tax-advantaged','accounts first.','Untaxed growth beats','taxed growth.'],gold:[2,3]},
{slug:'market-dips-are-normal',tag:'Wealth Mindset',lines:['Market drops','are normal.','They’re the price','of long-term gains.'],gold:[1]},
{slug:'stop-checking-daily',tag:'Wealth Mindset',lines:['Checking your','portfolio daily','adds stress,','not returns.'],gold:[2,3]},
{slug:'risk-and-your-timeline',tag:'Wealth Mindset',lines:['Money you need soon','shouldn’t take','big risks.','Time changes it.'],gold:[1]},
{slug:'rates-and-buying-power',tag:'Borrower Guides',lines:['When rates rise,','your buying','power falls.','Less house, same pay.'],gold:[1,2]},
{slug:'renting-isnt-wasting-money',tag:'Wealth Mindset',lines:['Renting isn’t','throwing money away.','Flexibility','has value too.'],gold:[1]},
{slug:'online-estimates-vs-appraisal',tag:'Borrower Guides',lines:['An online estimate','isn’t an appraisal.','The bank trusts','the appraisal.'],gold:[1]},
{slug:'location-still-matters',tag:'Investor Insights',lines:['You can fix a house.','You can’t fix','its location.'],gold:[1,2]},
];
try{const _ex='tools/extra';for(const _f of (await fs.readdir(_ex)).filter(f=>f.endsWith('.json'))){for(const _p of JSON.parse(await fs.readFile(`${_ex}/${_f}`,'utf8')))POSTS.push(_p);}}catch(e){}
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
