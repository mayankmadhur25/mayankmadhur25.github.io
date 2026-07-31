/* Healthcare Pulse — floating Ask widget
   Reuses the same knowledge base and Cloudflare Worker as /ask/.
   Loaded sitewide from _layouts/default.html. */
(function(){
  if (window.__hpAskLoaded) return;
  window.__hpAskLoaded = true;
  // don't duplicate the experience on the Ask page itself
  if (location.pathname.indexOf('/ask') === 0) return;

  var WORKER_URL = "https://healthcare-pulse-ask.mayankmadhur25.workers.dev";

var EDITIONS = [
    {ed:63,url:"/edition-63-csection-nfhs6.html",title:"India's C-section surge is a payment-design problem",cat:"Policy",kw:"csection caesarean c-section nfhs nfhs-6 surgical birth delivery private hospital public facility maternal who ceiling reimbursement parity robson disclosure telangana bihar obstetric fee for service",sum:"NFHS-6 puts India's C-section rate at 27.2%, but private hospitals run at 54.1% against 16.9% in public. A 3x gap clinical need can't explain. The fix is reimbursement parity, rate disclosure, and Robson auditing, not more training."},
    {ed:62,url:"/edition-62-profit-vs-care.html",title:"Profit or Patient Care? That's the Wrong Question",cat:"Governance",kw:"governance board director profit patient care margin outcome fee for service value based five aims fortis narayana stent price cap pmjay independent director clinical oversight equity access boardroom",sum:"Margins and patient care pull against each other, but it's a design problem boards can fix, not an ethics problem they can only worry about. Five aims, how money flows, four Indian cases, and six board actions."},
    {ed:61,url:"/the-100-crore-illusion.html",title:"The 100 Crore Illusion",cat:"Digital Health",kw:"abha ayushman bharat digital health id mission abdm adoption emr ehr records interoperability 100 crore number proof works digital infrastructure health stack",sum:"India built the world's largest digital health ID system in record time. The one number that proves it actually works has quietly gone missing. A Friday deep dive into ABHA, EMR vs EHR, and the metric that vanished."},
    {ed:60,url:"/posts/edition-60-nfhs6/",title:"What India's newest NFHS really tells us",cat:"Policy",kw:"nfhs national family health survey fertility maternal child mortality demographics population ncd non communicable disease nutrition data districts households next decade",sum:"For forty years, India fought one battle: keep mothers and babies alive, and get people into the health system. The sixth National Family Health Survey, covering 6.79 lakh households across 715 districts, is the clearest signal yet that the battle is largely won."},
    {ed:59,url:"/edition-59-dpdpa.html",title:"What DPDPA changes for healthcare",cat:"Policy",kw:"dpdpa data protection privacy law consent patient records hospital lab insurer telemedicine researcher compliance regulation personal data",sum:"The Act, in force since November 2025, flipped the asymmetry between provider and patient. The 'file' the hospital owned for 50 years is now legally the patient's. Five stakeholder snapshots of what actually changed."},
    {ed:58,url:"/edition-58-ebola.html",title:"Ebola is back",cat:"Biotech",kw:"ebola outbreak bundibugyo virus diagnostics preparedness india biosecurity infectious disease epidemic surveillance vaccine",sum:"A 2026 Bundibugyo Ebola outbreak is unfolding. India has zero cases and low direct risk. But the real story is diagnostics, preparedness, and vaccine-manufacturing positioning."},
    {ed:57,url:"/edition-57-pharma-fmcg.html",title:"The 1% Problem Every Indian Pharma CEO Is Ignoring",cat:"Pharma",kw:"pharma pharmaceutical pricing price volume growth nlem generics fmcg consumer health otc nutraceuticals ayush dabur patanjali marico apollo dermatology glp1 mounjaro market",sum:"India's pharma market grew 8.1% last year. Only 1.5% came from real demand. Why the other 6.6% is a slow-moving crisis, and how the industry is quietly becoming FMCG."},
    {ed:56,url:"/edition-56-orchestration.html",title:"The Orchestration Gap: Mid-Tier Hospitals",cat:"Strategy",kw:"medical tourism international patients hospitals orchestration apollo fortis manipal medanta max tier1 midtier conversion inquiry referral hfs",sum:"International patients are knocking. Mid-tier hospitals aren't converting. What Tier-1 chains figured out about medical tourism orchestration, and what most CEOs are still missing."},
    {ed:55,url:"/edition-55-pyramid.html",title:"India's biggest healthcare bet isn't a hospital",cat:"Policy",kw:"healthcare pyramid prevention primary care pmjay ayushman arogya mandir asha workforce abha out of pocket expenditure oope ncd public health system",sum:"While headlines obsess over new AIIMS and hospital IPOs, India is rebuilding healthcare from the bottom up. The pyramid, eight numbers that tell the real story, and why prevention beats capacity."},
    {ed:54,url:"/edition-54-four-indias.html",title:"The Four Indias of Healthcare",cat:"Strategy",kw:"four indias segmentation market affluent insured missing middle pmjay esic cghs irdai bima sugam insurance opd payer",sum:"Why 'pan-India' is usually a lie. India's healthcare market isn't one market, it's four, each with different economics, payers, and failure modes. The framework and where the next decade will be won."},
    {ed:53,url:"/edition-53-nuclear.html",title:"India cracked 400 years of energy independence",cat:"Geopolitics",kw:"nuclear energy fast breeder reactor pfbr kalpakkam thorium uranium bhabha three stage criticality net zero reliance tata adani smr",sum:"India's Prototype Fast Breeder Reactor achieved first criticality. Why it makes India the only democracy running commercial fast breeder tech, and a thorium pathway for 400+ years of low-carbon power."},
    {ed:52,url:"/edition-52-preventive.html",title:"India's largest preventive health system",cat:"Policy",kw:"preventive health screening corporate wellness blue collar ncd ayushman arogya mandir abha telemanas mental health elderly women hpv vaccination ai primary care gcc ayush medical tourism",sum:"India built the world's largest preventive health infrastructure: 1.8 lakh AAMs, 834M ABHA IDs, Tele-MANAS at scale. The execution gap, the three gaps that decide the outcome, and where the real opportunity lies."},
    {ed:51,url:"/edition-51-autism.html",title:"Autism is a system design failure",cat:"Policy",kw:"autism neurodevelopmental special educators caregivers mothers system design fragmentation disability mental health stigma rural urban diagnosis therapy inclusive",sum:"Families don't struggle because care doesn't exist. They struggle because nothing connects. Why India's autism crisis is a design failure, not a funding gap, through five frameworks and the 5 Whys."},
    {ed:50,url:"/edition-50-glp1.html",title:"India's GLP-1 Inflection Point",cat:"Pharma",kw:"glp1 glp-1 semaglutide ozempic wegovy mounjaro tirzepatide diabetes obesity weight loss generic dr reddy zydus natco metabolic care drug pricing",sum:"Semaglutide went generic and prices collapsed to ~Rs1,290/month. India's GLP-1 market moved from premium to mass-market in one quarter. The molecule is now a commodity; the care model is not."},
    {ed:49,url:"/edition-49-war-healthcare.html",title:"War is rewriting the rules of healthcare",cat:"Geopolitics",kw:"war conflict healthcare resilience supply chain disruption flow based care telehealth displaced patients geopolitical infrastructure",sum:"The real disruption isn't AI, it's conflict. War breaks the three assumptions healthcare was built on, and is shifting care from place-based to flow-based."},
    {ed:48,url:"/edition-48-middle-east.html",title:"The Middle East conflict and Indian healthcare",cat:"Geopolitics",kw:"middle east conflict iran israel war energy oil lpg fuel strait hormuz medical tourism hospital cost device polypropylene",sum:"How the Middle East conflict hits Indian healthcare indirectly: energy shocks, costlier hospital operations, device supply disruders, and a medical-tourism slowdown."},
    {ed:47,url:"/edition-47-obesity.html",title:"India's Obesity Crisis",cat:"Policy",kw:"obesity overweight nfhs lifestyle ultra processed food sedentary diabetes ncd fit india poshan eat right digital health wellness",sum:"NFHS-5 shows ~24% of Indian adults are overweight or obese, and rising. Why obesity is becoming a national economic challenge, and the digital-health opportunity it creates."},
    {ed:46,url:"/edition-46-ai-readiness.html",title:"India Is Ready for AI in Healthcare. But Only in Parts.",cat:"Digital Health",kw:"ai artificial intelligence healthcare readiness abdm sahi bodh data quality regulation cdsco workforce rural urban divide equity",sum:"India has the digital rails and policy momentum (ABDM, SAHI, BODH) to scale healthcare AI. But data quality, regulation depth and frontline capacity will decide whether it's universal or elite-only."},
    {ed:45,url:"/edition-45-sahi-bodh.html",title:"India just institutionalized Healthcare AI",cat:"Digital Health",kw:"sahi bodh ai strategy healthcare india benchmarking open data platform iit kanpur national health authority governance ethics federated",sum:"At the India AI Impact Summit 2026, the government launched SAHI (AI strategy) and BODH (a privacy-preserving benchmarking platform), India's first structured blueprint for responsible healthcare AI."},
    {ed:44,url:"/edition-44-budget-2026.html",title:"India Budget 2026",cat:"Policy",kw:"union budget 2026 healthcare biopharma shakti workforce allied health caregivers mental health nimhans gdp execution two tier",sum:"Union Budget 2026 crosses Rs1 lakh crore for healthcare and treats it as an economic growth engine, biopharma, workforce, mental health. But spending is still ~0.3% of GDP and execution will decide outcomes."},
    {ed:43,url:"/edition-43-eu-india-fta.html",title:"EU-India FTA & Healthcare",cat:"Policy",kw:"eu india fta free trade agreement tariff medical device pharma export biosimilar ip intellectual property regulatory supply chain",sum:"India and the EU concluded their largest-ever FTA in January 2026, removing tariffs on 90%+ of goods. For healthcare it's a long-term structural reset on device costs, drug access, and pharma exports."},
    {ed:42,url:"/edition-42-diagnostics-boom.html",title:"India's diagnostics boom",cat:"Strategy",kw:"diagnostics lab pathology dr lal metropolis agilus srl thyrocare krsnaa vijaya lis lims ai platform consolidation tier 2 3 ppp",sum:"India's diagnostics market is moving from lab business to platform business, doubling by the early 2030s, consolidating into national chains, and becoming a multi-tower wallet for IT and data services."},
    {ed:41,url:"/edition-41-hospital-readiness.html",title:"India's Hospitals Are Not Ready for NHCX and DPDP",cat:"Digital Health",kw:"nhcx dpdp abdm hospital readiness adoption fhir legacy his emr consent data fiduciary infrastructure tier 2 3 cloud managed services",sum:"India built the digital health rails (ABDM, NHCX, DPDP) but only ~1-2% of hospitals are onboarded to NHCX. Hospital readiness, not policy intent, is the real bottleneck."},
    {ed:40,url:"/edition-40-ai-clinic.html",title:"India's First Government AI Clinic Is Live",cat:"Digital Health",kw:"ai clinic gims greater noida government hospital imaging pathology cancer detection genomics remote monitoring iit kanpur madras",sum:"GIMS Greater Noida launched India's first government hospital-based AI clinic in Jan 2026, moving AI from pilots to frontline public healthcare across imaging, pathology, cancer detection and genomics."},
    {ed:39,url:"/edition-39-year-review-2025.html",title:"2025 Year in Review",cat:"Strategy",kw:"year review 2025 learnings forecast execution funding digital hybrid equity trust governance archive summary",sum:"Closing 38 editions of 2025: five foundational truths, execution trumps funding, digital needs embedding, the future is hybrid, equity is sustainability, and trust is the hardest constraint."},
    {ed:38,url:"/edition-38-abha-awareness.html",title:"800 Million Health IDs; And People Still Ask What Is ABHA",cat:"Digital Health",kw:"abha abdm hfr hpr health id awareness adoption phc chc usage activated registration rural urban digital divide",sum:"India created ~80 crore ABHA IDs but a Maharashtra study found only 4% ever used ABHA services. The gap isn't infrastructure, it's awareness. Why 2026 must treat awareness as infrastructure."},
    {ed:37,url:"/edition-37-nhcx.html",title:"India's National Health Claims Exchange (NHCX)",cat:"Digital Health",kw:"nhcx claims exchange insurance fhir cashless discharge 3 hour clock payer tpa hospital fraud claim cost upi moment",sum:"NHCX is India's UPI moment for health claims: a national FHIR-based protocol that cuts claim cost from ~Rs500 to <Rs15, enforces a 3-hour discharge clock, and unlocks mass-market insurance."},
    {ed:36,url:"/edition-36-antibiotic-resistance.html",title:"India's antibiotic resistance crisis",cat:"Policy",kw:"antibiotic resistance amr antimicrobial azithromycin colistin sepsis newborn kerala amrith stewardship one health glass who",sum:"India is now a primary contributor to global AMR: 83% of patients carry multidrug-resistant organisms, 58,000 newborns die yearly from resistant sepsis. Kerala's Operation AMRITH shows it can be tamed."},
    {ed:35,url:"/edition-35-rural-urban-gap.html",title:"India's Rural-Urban Healthcare Gap",cat:"Policy",kw:"rural urban healthcare gap phc chc sub centre beds specialist shortage arogya mandir esanjeevani telemedicine district hospital diagnostics",sum:"65% of Indians are rural but 70-75% of healthcare infrastructure is urban. Only 3% of specialists practice rurally. The gap is a design brief, and a massive digital build-out opportunity."},
    {ed:34,url:"/edition-34-doctor-distribution.html",title:"Why a country meeting WHO's doctor benchmark still struggles",cat:"Policy",kw:"doctor population ratio who benchmark maldistribution public private vacancy specialist rural andhra odisha chhattisgarh hr dashboard",sum:"India's 1:811 doctor ratio beats WHO's benchmark, but public hospitals face 1:11,000. The crisis is maldistribution, not shortage. State playbooks (Andhra, Odisha, Chhattisgarh) show what works."},
    {ed:33,url:"/edition-33-jan-aushadhi.html",title:"Generic Medicines at Scale: Jan Aushadhi",cat:"Pharma",kw:"jan aushadhi generic medicine pmbjp e-aushadhi sugam pharma sahi daam abdm uhi nhcx affordable drug price supply chain blockchain",sum:"Medicines are ~two-thirds of Indian families' health spend. Jan Aushadhi's 16,900+ stores sell generics 50-90% cheaper, and the next leap, e-Aushadhi + ABDM + NHCX, is building a digital medicine network."},
    {ed:32,url:"/edition-32-organ-transplants.html",title:"From Zero to 18,900: The Organ Story",cat:"Policy",kw:"organ transplant donation notto sotto deceased donor pmp green corridor vidiyal blockchain brain death one nation one policy",sum:"India hit ~18,900 organ transplants in 2024, #3 globally, but donation is still under 1 per million. Policy reform and a digital stack (NOTTO, Vidiyal, blockchain pilots) are reshaping transplants."},
    {ed:31,url:"/edition-31-ivf-boom.html",title:"India's IVF Boom",cat:"Strategy",kw:"ivf fertility infertility art surrogacy embryo icsi indira nova oasis private equity bpea eqt tpg corporate egg freezing",sum:"India's fertility market is a $1.6bn enterprise growing 15-18% yearly, with 3.3 lakh IVF cycles set to double by 2030. PE money, AI embryo grading and corporate fertility perks are reshaping the sector."},
    {ed:30,url:"/edition-30-opd-insurance.html",title:"Health insurance is growing but protection is not",cat:"Strategy",kw:"health insurance opd outpatient out of pocket oope pm-jay coverage diagnostics pharmacy cashless premium claim primary care",sum:"OOPE fell to 39.4% but Indians still pay ~half of health costs out-of-pocket. Insurance growth misses the mark because it ignores OPD, where 65-70% of spending happens. The fix: an OPD-first product."},
    {ed:29,url:"/edition-29-cghs-2025.html",title:"CGHS 2025: A long-awaited overhaul",cat:"Policy",kw:"cghs central government health scheme rate revision hmis pan id nabh hospital reimbursement pensioner transgender digital",sum:"CGHS's first overhaul in 15 years: revised rates for ~2,000 procedures, a new C-DAC digital HMIS, PAN-based IDs, and inclusion of transgender dependents, benefiting 4.6 million employees and pensioners."},
    {ed:28,url:"/edition-28-csection-economy.html",title:"Rewiring India's C-section economy",cat:"Policy",kw:"c-section cesarean csection maternal birth robson nfhs private hospital overuse vbac maternity outcomes episode pricing",sum:"India's C-section rate doubled from 1-in-10 to 1-in-5 (over 1-in-2 in Telangana). Overuse harms mothers and drains budgets. Five behaviour levers, and the IT tools, to get to right surgery, right reason."},
    {ed:27,url:"/edition-27-dpdp-act-2023.html",title:"DPDP Act 2023",cat:"Policy",kw:"dpdp act data protection privacy consent fiduciary penalty hospital insurer dpo consent manager breach encryption gdpr",sum:"India's first comprehensive data protection law carries penalties up to Rs250 crore. For hospitals, payers and enterprises it means redesigning consent and security, and a chance to turn compliance into trust."},
    {ed:26,url:"/edition-26-mental-health.html",title:"India's Mental Health Crisis",cat:"Policy",kw:"mental health depression anxiety suicide tele-manas mental healthcare act dmhp burden chatbot eap corporate wellness stigma",sum:"197 million Indians (1 in 7) live with a mental health condition, yet only ~1% of the health budget goes to it. Tele-MANAS and the 2017 Act laid foundations; five enterprise opportunities can scale care."},
    {ed:25,url:"/edition-25-chronic-care-shift.html",title:"From Infections to Chronic Care",cat:"Strategy",kw:"chronic care disease burden ncd diabetes cardiovascular cancer respiratory mental health abdm registry remote monitoring transition",sum:"India's disease burden has pivoted from infections to chronic and mental health conditions, the West's transition in fast-forward. Five enterprise plays, from chronic care to ABDM-leveraged triage."},
    {ed:24,url:"/edition-24-pharma-paradox.html",title:"India's Pharma Paradox",cat:"Pharma",kw:"pharma paradox generics api china dependence vaccine export r&d innovation biosimilar fda manufacturing margin value pli",sum:"India supplies 20% of global generics and 60% of vaccines, yet imports 65-70% of APIs from China, spends only 6-8% on R&D, and leaves 23% unable to afford essential medicines. Five contradictions decoded."},
    {ed:23,url:"/edition-23-autism-2025.html",title:"Autism 2025: Rising prevalence, real impact",cat:"Policy",kw:"autism asd neurodiversity prevalence rpwd act inclusion hiring sap ey accenture wells fargo cogniable therapy aba comorbid gene therapy",sum:"Autism prevalence is up 300% since 2000; ~18 million Indians are on the spectrum. With costs nearing $1 trillion and neurodiverse unemployment at 30-40%, inclusion is both a responsibility and ROI-positive."},
    {ed:22,url:"/edition-22-rebalancing.html",title:"Stop Squeezing. Start Rebalancing",cat:"Strategy",kw:"cost outcome balloon staffing prevention telehealth home care precision process redesign value analytics quadruple aim",sum:"Healthcare is a balloon: squeeze cost and outcomes bulge out; chase outcomes and costs explode. The fix isn't squeezing harder, it's rebalancing with upstream investment, tight ops and smart tech."},
    {ed:21,url:"/edition-21-hyperlocal.html",title:"Lead with the local: healthcare is hyperlocal",cat:"Strategy",kw:"hyperlocal asha traditional healer state playbook kerala rajasthan bihar tamil nadu arogya mandir esanjeevani jan aushadhi block",sum:"India's winning health model is national rails + state playbooks + trusted village relationships. With 1M+ ASHAs, 344M eSanjeevani consults and 16,900 Jan Aushadhi stores, locality defines performance."},
    {ed:20,url:"/edition-20-esanjeevani-phygital.html",title:"India's phygital healthcare is scaling: eSanjeevani",cat:"Digital Health",kw:"esanjeevani phygital telemedicine teleconsultation abdm abha doctor patient practo apollo tata 1mg saas cloud diagnostics bundle",sum:"140 million consultations in, eSanjeevani is the foundation of India's hybrid 'phygital' care model, and a sleeping giant of monetization for SaaS, cloud, telehealth-diagnostics bundles and AI."},
    {ed:19,url:"/edition-19-rmncah-continuum.html",title:"Monetize India's RMNCAH+N Continuum of Care",cat:"Strategy",kw:"rmncah maternal newborn child adolescent nutrition fertility immunization lifecycle subscription bundle insurance b2g b2b b2c",sum:"RMNCAH+N is a lifecycle business, not a one-off sale. From fertility to adolescence to nutrition, enterprises that build for continuity own the patient journey and compound lifetime value."},
    {ed:18,url:"/edition-18-funding-landscape.html",title:"Map, Engage, Invest in Healthcare Funding",cat:"Strategy",kw:"healthcare funding mohfw defence railways esi cghs phc chc anganwadi ngo csr startup investor stakeholder map",sum:"India's health system is a puzzle of public (MoHFW, Defence, Railways) and private funding. Before investing, map the money flows, a tailored playbook for CSR teams, startups, IT firms and investors."},
    {ed:17,url:"/edition-17-public-health-journey.html",title:"India's Public Health Journey: 20-Year Sprint",cat:"Policy",kw:"public health journey uhc spending disease burden imr mmr stunting state equity digital health esanjeevani cowin abdm pillars",sum:"Since 2005 India built platforms for Universal Health Coverage, but deep state and rural-urban inequities endure (IMR ranges 3-46 across states). Six pillars for a healthier, more equitable future."},
    {ed:16,url:"/edition-16-ayushman-bharat.html",title:"Take Action on Ayushman Bharat",cat:"Policy",kw:"ayushman bharat pm-jay hwc health wellness centre abha card insurance cashless empanelment vay vandana seniors fraud detection",sum:"Ayushman Bharat is the world's largest government health assurance scheme: 55 crore covered, Rs5 lakh per family, 1.6 lakh upgraded centres. An enterprise playbook for hospitals, insurers and health-tech."},
    {ed:15,url:"/edition-15-prevention.html",title:"Stop Funding Sickness, Invest in Prevention",cat:"Policy",kw:"prevention sdoh social determinants education incentives infrastructure primary care community sri lanka brazil costa rica cuba rwanda",sum:"Returns in healthcare come from social determinants, not reorganizing boards. Sri Lanka, Brazil, Costa Rica and Cuba show upstream investment in education, incentives, infrastructure and primary care wins."},
    {ed:14,url:"/edition-14-nhp-2017.html",title:"National Health Policy 2017",cat:"Policy",kw:"national health policy nhp 2017 digital health ehr ppp workforce upskilling r&d devices generics surveillance uhc",sum:"India's NHP 2017 still guides budgets and Ayushman Bharat. Five enterprise takeaways: digital health infrastructure, PPPs, workforce upskilling, R&D in devices/generics, and population health surveillance."},
    {ed:13,url:"/edition-13-who-pays.html",title:"Who's Paying for Healthcare in the Future?",cat:"Strategy",kw:"payer insurance self-insured employer aca marketplace group commercial uninsured medicaid platform consumer directed us",sum:"The US coverage model is being rewritten: self-insured employers rise (117M to 122M), group insurance declines, ACA marketplaces grow, and the uninsured rate climbs. Traditional payers lose centrality."},
    {ed:12,url:"/edition-12-generational-benefits.html",title:"Generational shifts demand a rethink",cat:"Strategy",kw:"generational millennial gen z gen alpha workforce health benefits wellness preventive digital first mental health employer",sum:"By 2033 millennials and Gen Z will be 73%+ of the workforce, digital-first, prevention-focused, wellness-driven. The shift from sick care to smart care is here; benefits must signal culture, not just coverage."},
    {ed:11,url:"/edition-11-data-retention.html",title:"Data retention poses a lurking threat",cat:"Digital Health",kw:"data retention storage gdpr dpdp deletion estonia federated consent cybersecurity breach risk purpose bound abdm",sum:"Healthcare stores data for 7-30 years but 90%+ is never reused, inflating cost and breach risk. GDPR and DPDP say store only as long as needed. Estonia's federated model shows the way: shrink to secure."},
    {ed:10,url:"/edition-10-cio-agenda.html",title:"The CIO Agenda Reset",cat:"Strategy",kw:"cio health plan technology quadruple aim legacy modernization data governance innovation tech debt partner ecosystem talent",sum:"Health plan CIOs face declining enrollment and shrinking reimbursements. The reset: stop fixing IT, become a growth architect, ten moves aligning technology to the Quadruple Aim of cost, experience, health and equity."},
    {ed:9,url:"/edition-9-medical-tourism.html",title:"Navigating India's Medical Tourism Revolution",cat:"Strategy",kw:"medical tourism international patient jci nabh affordability e-visa chennai bangalore mumbai delhi cardiology oncology fertility",sum:"India's medical tourism is set to leap from $6bn to $35bn by 2027 (20%+ CAGR), with 700,000+ arrivals in 2024. Four pillars, affordability, accreditation, English care and e-visas, drive the boom."},
    {ed:8,url:"/edition-8-health-equity.html",title:"Four is Greater Than Three: Health Equity",cat:"Policy",kw:"health equity triple aim quadruple aim berwick outcomes cost experience life expectancy underserved access sustainable",sum:"The Triple Aim is wobbling, costs soar, experience stagnates, US life expectancy fell to 1996 levels, because it forgot equity. The Quadruple Aim adds equity as the foundation of sustainable care."},
    {ed:7,url:"/edition-7-tech-delivery-crisis.html",title:"Embrace Technology for the Healthcare Crisis",cat:"Digital Health",kw:"physician shortage chronic aging ai wearable ingestible smart home remote monitoring need based care quadruple aim digital health",sum:"By 2035 the US faces an 80,000+ physician shortage as chronic disease and aging surge. AI, wearables and smart-home tech enable a shift from reactive demand-based to proactive need-based care."},
    {ed:6,url:"/edition-6-tariffs-health-systems.html",title:"New Tariffs Threaten US Health Systems",cat:"Geopolitics",kw:"tariff us health system hospital margin health plan premium inflation medicare medicaid sourcing innovation resilience",sum:"US healthcare costs rose 146% in 25 years while incomes rose <15%. New tariffs hit break-even hospitals hard while lean health plans barely feel it. For health systems, innovation is now existential."},
    {ed:5,url:"/edition-5-learn-from-us.html",title:"India Must Learn from US Healthcare Failures",cat:"Strategy",kw:"value based care vbc us failure india local rural chronic informal funding cowin esanjeevani asha ayushman public private",sum:"Value-Based Care largely failed in the US ($15,000+ per person, up to 20% revenue in compliance). India can't absorb it. Healthcare is local, India should adapt best practices, not adopt models blindly."},
    {ed:4,url:"/edition-4-tariff-shock.html",title:"Tariff Shock: India must build resilience",cat:"Geopolitics",kw:"tariff medical device import dependency make in india pmjay esic loss ratio local manufacturing procurement leasing",sum:"A 26% US tariff on Indian medical devices is a stress test, not just a trade spat. It threatens diagnostics costs, rural hospitals and PMJAY/ESIC. India's 4-point survival plan, starting with local manufacturing."},
    {ed:3,url:"/edition-3-iot-autism.html",title:"Harness IoT to revolutionize autism care",cat:"Digital Health",kw:"autism asd iot wearable smart home sensory caregiver meltdown personalized therapy remote monitoring spectrum",sum:"Autism is up 317% since 2000 (1 in 36 US children), with societal cost nearing $461bn by 2025. IoT, wearables, smart homes, remote monitoring, enables personalized care for a spectrum that's never one-size-fits-all."},
    {ed:2,url:"/edition-2-physician-burnout.html",title:"Tackling physician burnout",cat:"Strategy",kw:"physician burnout workforce exhaustion bureaucracy ama quadruple aim aviation tech military automation autonomy wellbeing system",sum:"48.2% of physicians reported burnout in 2023. It's not a wellness problem, it's a systemic signal of inefficiency. Treat it as a strategic KPI and borrow from aviation, tech and the military to fix the system."},
    {ed:1,url:"/edition-1-private-equity.html",title:"Private equity can transform India's healthcare",cat:"Strategy",kw:"private equity pe blackstone temasek kkr hospital chain acquisition consolidation patient centric regulation primary care us mistakes",sum:"Post-COVID PE surged to $5-6bn/year, Blackstone, Temasek, KKR buying hospital chains. PE can transform Indian healthcare, but only if smart regulation keeps it patient-centric and avoids US-style pitfalls."}
  ];

  var STOP = "the a an is are was what how why when where who which of to in on for and or do does my your me i india indian about with this that it its".split(" ");

  function tokenize(s){
    return (s||"").toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/)
      .filter(function(w){ return w.length>2 && STOP.indexOf(w)<0; });
  }
  function score(qTokens, ed){
    var hay = (ed.kw + " " + ed.title + " " + ed.cat).toLowerCase(), s = 0;
    qTokens.forEach(function(t){
      if(hay.indexOf(t) > -1) s += 2;
      else { var stem = t.length > 5 ? t.slice(0,5) : t; if(hay.indexOf(stem) > -1) s += 1; }
    });
    return s;
  }
  function esc(s){ return (s||"").replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  var CSS = '\
.hpa-bubble{position:fixed;right:20px;bottom:20px;z-index:9998;display:inline-flex;align-items:center;gap:8px;\
  background:linear-gradient(135deg,#0FA3A3,#2E7CB8);color:#fff;border:0;border-radius:999px;cursor:pointer;\
  padding:13px 18px;font-family:Manrope,system-ui,sans-serif;font-size:14.5px;font-weight:700;\
  box-shadow:0 10px 26px -8px rgba(15,163,163,.65);transition:transform .18s ease,box-shadow .18s ease}\
.hpa-bubble:hover{transform:translateY(-2px);box-shadow:0 14px 30px -8px rgba(15,163,163,.75)}\
.hpa-bubble.hide{display:none}\
.hpa-panel{position:fixed;right:20px;bottom:20px;z-index:9999;width:380px;max-width:calc(100vw - 32px);\
  height:520px;max-height:calc(100vh - 40px);background:#fff;border:1px solid #E2E8EC;border-radius:16px;\
  box-shadow:0 24px 60px -20px rgba(27,58,75,.5);display:none;flex-direction:column;overflow:hidden;\
  font-family:Manrope,system-ui,sans-serif}\
.hpa-panel.open{display:flex}\
html[data-theme="dark"] .hpa-panel{background:#16252C;border-color:#2C3F47}\
.hpa-head{background:#1B3A4B;color:#fff;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;flex:none}\
.hpa-title{font-size:14.5px;font-weight:800;letter-spacing:-.01em}\
.hpa-sub{font-size:11.5px;opacity:.82;margin-top:2px}\
.hpa-x{background:none;border:0;color:#fff;cursor:pointer;padding:4px;line-height:0;opacity:.85}\
.hpa-x:hover{opacity:1}\
.hpa-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}\
.hpa-msg{max-width:88%;font-size:13.5px;line-height:1.6;padding:10px 13px;border-radius:13px}\
.hpa-q{align-self:flex-end;background:#0FA3A3;color:#fff;border-bottom-right-radius:3px}\
.hpa-a{align-self:flex-start;background:#F1F6F7;color:#22333B;border-bottom-left-radius:3px}\
html[data-theme="dark"] .hpa-a{background:#1E313A;color:#DCE9EC}\
.hpa-a b{color:#1B3A4B}\
html[data-theme="dark"] .hpa-a b{color:#E8F4F4}\
.hpa-cites{margin-top:9px;padding-top:9px;border-top:1px solid rgba(90,107,114,.22);display:flex;flex-direction:column;gap:5px}\
.hpa-cite{font-size:12.5px;color:#0FA3A3;text-decoration:none;font-weight:700}\
.hpa-cite:hover{text-decoration:underline}\
.hpa-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
.hpa-chip{font-size:12px;font-weight:600;color:#5A6B72;background:transparent;border:1px solid #E2E8EC;\
  border-radius:999px;padding:6px 11px;cursor:pointer}\
.hpa-chip:hover{border-color:#0FA3A3;color:#0FA3A3}\
html[data-theme="dark"] .hpa-chip{border-color:#2C3F47;color:#A8BDC4}\
.hpa-foot{flex:none;border-top:1px solid #E2E8EC;padding:10px 12px;display:flex;gap:8px;align-items:center}\
html[data-theme="dark"] .hpa-foot{border-top-color:#2C3F47}\
.hpa-in{flex:1;border:1px solid #E2E8EC;border-radius:999px;padding:10px 14px;font-family:inherit;font-size:13.5px;\
  background:#fff;color:#22333B;outline:none}\
.hpa-in:focus{border-color:#0FA3A3}\
html[data-theme="dark"] .hpa-in{background:#0F1B22;border-color:#2C3F47;color:#DCE9EC}\
.hpa-send{flex:none;width:36px;height:36px;border-radius:50%;border:0;cursor:pointer;\
  background:linear-gradient(135deg,#0FA3A3,#2E7CB8);color:#fff;display:inline-flex;align-items:center;justify-content:center}\
.hpa-more{display:block;text-align:center;font-size:12px;color:#5A6B72;padding:6px 0 2px;text-decoration:none}\
.hpa-more:hover{color:#0FA3A3}\
@media(max-width:560px){\
 .hpa-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:88vh;border-radius:16px 16px 0 0}\
 .hpa-bubble{right:14px;bottom:14px;padding:12px 16px}\
}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.innerHTML = '\
<button class="hpa-bubble" id="hpaBubble" type="button" aria-label="Ask Healthcare Pulse">\
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.6-.7L3 21l1.9-5A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/></svg>Ask</button>\
<div class="hpa-panel" id="hpaPanel" role="dialog" aria-label="Ask Healthcare Pulse">\
  <div class="hpa-head">\
    <div><div class="hpa-title">Ask Healthcare Pulse</div><div class="hpa-sub">Answers grounded in the archive</div></div>\
    <button class="hpa-x" id="hpaClose" type="button" aria-label="Close">\
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>\
  </div>\
  <div class="hpa-body" id="hpaBody"></div>\
  <div class="hpa-foot">\
    <input class="hpa-in" id="hpaIn" type="text" placeholder="Ask about Indian healthcare…" autocomplete="off">\
    <button class="hpa-send" id="hpaSend" type="button" aria-label="Send">\
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>\
  </div>\
</div>';
  document.body.appendChild(wrap);

  var bubble=document.getElementById('hpaBubble'), panel=document.getElementById('hpaPanel'),
      body=document.getElementById('hpaBody'), input=document.getElementById('hpaIn'),
      send=document.getElementById('hpaSend'), close=document.getElementById('hpaClose');

  function add(cls, html){
    var d=document.createElement('div'); d.className='hpa-msg '+cls; d.innerHTML=html;
    body.appendChild(d); body.scrollTop=body.scrollHeight; return d;
  }
  function greet(){
    add('hpa-a','Ask me anything about Indian healthcare. I answer from what I have actually published, and I will point you to the edition.'
      +'<div class="hpa-chips">'
      +'<button class="hpa-chip" data-q="What is India\'s C-section rate?">C-section rates</button>'
      +'<button class="hpa-chip" data-q="How does ABHA work?">ABHA</button>'
      +'<button class="hpa-chip" data-q="What does DPDPA change for hospitals?">DPDPA</button>'
      +'<button class="hpa-chip" data-q="Why are rural specialist posts vacant?">Rural specialists</button>'
      +'</div>');
  }
  function cites(top){
    return '<div class="hpa-cites">' + top.map(function(x){
      return '<a class="hpa-cite" href="'+x.ed.url+'">Edition '+x.ed.ed+' · '+esc(x.ed.title)+' &rarr;</a>';
    }).join('') + '</div>';
  }
  function notCovered(q){
    add('hpa-a','I have not written about that yet. '
      +'<a class="hpa-cite" href="mailto:mayank@mayankmadhur.in?subject='+encodeURIComponent('Topic suggestion: '+q)+'">Suggest it as a topic &rarr;</a>');
  }

  function ask(){
    var q=(input.value||'').trim(); if(!q) return;
    add('hpa-q', esc(q)); input.value='';
    var qt=tokenize(q);
    if(!qt.length){ notCovered(q); return; }
    var ranked=EDITIONS.map(function(ed){return {ed:ed,s:score(qt,ed)};})
      .filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s;});
    if(!ranked.length || ranked[0].s<2){ notCovered(q); return; }
    var top=ranked.slice(0,3);
    var thinking=add('hpa-a','Thinking through what I have written…');

    var context=top.map(function(x){
      return "Edition "+x.ed.ed+" — "+x.ed.title+" ("+x.ed.cat+"): "+(x.ed.sum||"");
    }).join("\n\n");

    fetch(WORKER_URL,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question:q,context:context})})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(d){
      var a=(d&&d.answer)?d.answer:""; if(!a) throw 0;
      thinking.innerHTML=esc(a).replace(/\n/g,'<br>')+cites(top)
        +'<a class="hpa-more" href="/ask/">Open the full Ask page &rarr;</a>';
      body.scrollTop=body.scrollHeight;
    })
    .catch(function(){
      thinking.innerHTML='Here is what I have written that covers it:'+cites(top);
      body.scrollTop=body.scrollHeight;
    });
  }

  function open(){ panel.classList.add('open'); bubble.classList.add('hide');
    if(!body.children.length) greet(); setTimeout(function(){input.focus();},80); }
  function shut(){ panel.classList.remove('open'); bubble.classList.remove('hide'); }

  bubble.addEventListener('click', open);
  close.addEventListener('click', shut);
  send.addEventListener('click', ask);
  input.addEventListener('keydown', function(e){ if(e.key==='Enter') ask(); });
  body.addEventListener('click', function(e){
    var c=e.target.closest('.hpa-chip'); if(!c) return;
    input.value=c.getAttribute('data-q'); ask();
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && panel.classList.contains('open')) shut(); });
})();
