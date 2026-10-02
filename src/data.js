// All game content lives here. Every brand is fictional on purpose.

export const BRANDS = [
  { id: 'lumora', name: 'LumoraPay', kind: 'Payments', domain: 'lumorapay.com', legit: 'https://www.lumorapay.com/signin', bait: 'Your LumoraPay wallet has been put on hold. Confirm your details to restore access.' },
  { id: 'vantix', name: 'Vantix Bank', kind: 'Bank', domain: 'vantixbank.com', legit: 'https://online.vantixbank.com/login', bait: 'Unusual sign-in detected on your Vantix account. Verify within 24 hours.' },
  { id: 'quillbox', name: 'Quillbox Mail', kind: 'Email', domain: 'quillbox.com', legit: 'https://mail.quillbox.com/inbox', bait: 'Your mailbox is 99% full. Upgrade storage now or lose incoming mail.' },
  { id: 'parcelyn', name: 'Parcelyn', kind: 'Delivery', domain: 'parcelyn.com', legit: 'https://track.parcelyn.com/parcel', bait: 'We missed you! Pay a small redelivery fee to reschedule your parcel.' },
  { id: 'streamory', name: 'Streamory', kind: 'Streaming', domain: 'streamory.com', legit: 'https://www.streamory.com/account', bait: 'Your Streamory payment failed. Update billing to keep watching.' },
  { id: 'kestrel', name: 'Kestrel Cloud', kind: 'Work suite', domain: 'kestrelcloud.com', legit: 'https://login.kestrelcloud.com/', bait: 'A colleague shared "Q3 Salary Revisions.xlsx" with you. Sign in to view.' },
  { id: 'hexa', name: 'Hexa Social', kind: 'Social', domain: 'hexasocial.com', legit: 'https://www.hexasocial.com/login', bait: 'Someone reported your profile. Appeal within 48 hours to avoid suspension.' },
  { id: 'cartora', name: 'Cartora', kind: 'Shopping', domain: 'cartora.com', legit: 'https://www.cartora.com/orders', bait: 'Your refund is approved. Claim it before it expires today.' }
];
export const brandById = (id) => BRANDS.find((b) => b.id === id) || BRANDS[0];

// The hit list, easiest first. Each level hunts one member: the fake links you see use
// their trick (`technique` in the URL bank). Crack `goal` of them to capture the member;
// make LIVES mistakes and they escape. The Boss uses every trick at once.
export const FAMILY = [
  { id: 'typosquat', alias: 'The Typo', trick: 'Misspelled name', mo: 'Changes one letter of the real name.', tip: 'Spell the name out letter by letter.', band: '#b5452f',
    taunt: 'One wrong letter. Nobody ever reads that closely.', goal: 3, seconds: 30,
    ex: [{ t: 'quilbox', c: 'danger' }, { t: '.com', c: 'dim' }] },
  { id: 'wrong-tld', alias: 'The Wrong Turn', trick: 'Wrong ending', mo: 'Keeps the real name but changes the ending (.co, .net, .support).', tip: 'Know the real ending and check it.', band: '#2f6f9a',
    taunt: 'Same name, different ending. Who checks endings?', goal: 3, seconds: 30,
    ex: [{ t: 'cartora', c: 'dim' }, { t: '.co', c: 'danger' }] },
  { id: 'extra-words', alias: 'The Sweet-Talker', trick: 'Trust words in the name', mo: 'Glues friendly words like "secure" and "verify" onto the name.', tip: 'Words like secure-, verify-, refund- in the name are a warning.', band: '#3f8a6a',
    taunt: 'Add the word "secure" and people trust anything.', goal: 3, seconds: 30,
    ex: [{ t: 'vantix-bank-secure-verify.net', c: 'danger' }] },
  { id: 'homoglyph', alias: 'The Twin', trick: 'Look-alike letters', mo: 'Swaps in letters that look the same: rn for m, 1 for l, 0 for o.', tip: 'Watch for rn vs m, l vs i, 1 vs l, 0 vs o.', band: '#7a62b8',
    taunt: 'rn or m? Your eyes can\'t tell the difference.', goal: 3, seconds: 30,
    ex: [{ t: 'lurnorapay', c: 'danger' }, { t: '.com', c: 'dim' }] },
  { id: 'subdomain-spoof', alias: 'The Mask', trick: 'Real name in front of a fake site', mo: 'Wears the real name at the front, but the website is hers.', tip: 'Only the name just before the first single slash counts.', band: '#b0306a',
    taunt: 'I wear the real name right on my face.', goal: 4, seconds: 30,
    ex: [{ t: 'lumorapay.com.', c: 'dim' }, { t: 'account-review.ru', c: 'danger' }] },
  { id: 'ip-or-shortener', alias: 'The Ghost', trick: 'Hidden address', mo: 'Hides the real address behind numbers, "@" or short links.', tip: 'Numbers-only addresses, short links and "@" hide where you land.', band: '#9aa3ad',
    taunt: 'You can\'t catch what you can\'t see.', goal: 4, seconds: 30,
    ex: [{ t: 'kestrelcloud.com@', c: 'dim' }, { t: '203.0.113.9', c: 'danger' }] }
];
export const BOSS = {
  id: 'boss', alias: 'The Boss', trick: 'Every trick at once', mo: 'Uses all six tricks, and hides the real website from you.', tip: 'Find the first single slash, then read backwards.', band: '#d4a24c',
  taunt: 'You crossed out my whole crew. Now face all their tricks at once.', goal: 5, seconds: 30, hideHint: true,
  ex: [{ t: 'vantixbank.com.', c: 'dim' }, { t: 'secure-login.info', c: 'danger' }]
};
export const HIT_LIST = [...FAMILY, BOSS];
export const LIVES = 3;
export const mobsterById = (id) => FAMILY.find((m) => m.id === id);

// People around the world who forward you a link and ask "is this safe?"
export const PEOPLE = [
  { name: 'Amara', city: 'Lagos' }, { name: 'Mateo', city: 'Buenos Aires' }, { name: 'Priya', city: 'Mumbai' },
  { name: 'Kenji', city: 'Osaka' }, { name: 'Fatima', city: 'Casablanca' }, { name: 'Lukas', city: 'Berlin' },
  { name: 'Ana', city: 'São Paulo' }, { name: 'Wei', city: 'Singapore' }, { name: 'Grace', city: 'Nairobi' },
  { name: 'Omar', city: 'Cairo' }, { name: 'Sofia', city: 'Madrid' }, { name: 'Jack', city: 'Sydney' },
  { name: 'Leila', city: 'Istanbul' }, { name: 'Diego', city: 'Mexico City' }, { name: 'Min-jun', city: 'Seoul' },
  { name: 'Emily', city: 'Toronto' }, { name: 'Ravi', city: 'Dhaka' }, { name: 'Nadia', city: 'Warsaw' }
];

// The URL bank. `tell` lists the word-parts that give a fake away.
export const CANNED_BANK = [
  { url: 'https://www.lumorapay.com/signin', brandId: 'lumora', isPhishing: false, explain: 'Real domain lumorapay.com, plain sign-in path. Legitimate.' },
  { url: 'https://lumorapay.com.account-review.ru/login', brandId: 'lumora', isPhishing: true, tell: ['account', 'review', 'ru'], technique: 'subdomain-spoof', explain: 'The real domain is account-review.ru. "lumorapay.com" is just a decoy subdomain in front of it.' },
  { url: 'https://www.lurnorapay.com/signin', brandId: 'lumora', isPhishing: true, tell: ['lurnorapay'], technique: 'homoglyph', explain: '"rn" squeezed together looks like "m". That reads lurnorapay, not lumorapay.' },
  { url: 'https://online.vantixbank.com/login', brandId: 'vantix', isPhishing: false, explain: 'A subdomain of the real vantixbank.com. Legitimate.' },
  { url: 'https://vantix-bank-secure-verify.net/session', brandId: 'vantix', isPhishing: true, tell: ['vantix', 'bank', 'secure', 'verify', 'net'], technique: 'extra-words', explain: 'The whole domain is vantix-bank-secure-verify.net. Trust words stuffed into a domain are a classic red flag.' },
  { url: 'http://203.0.113.47/vantixbank/login', brandId: 'vantix', isPhishing: true, tell: ['203', '0', '113', '47'], technique: 'ip-or-shortener', explain: 'A raw IP address instead of a domain, over plain http. Banks never send you to a bare IP.' },
  { url: 'http://vantixbank.com.secure-login.info/verify?acct=992', brandId: 'vantix', isPhishing: true, tell: ['secure', 'login', 'info'], technique: 'subdomain-spoof', explain: 'Read right to left from the first single slash: the real domain is secure-login.info.' },
  { url: 'https://mail.quillbox.com/inbox', brandId: 'quillbox', isPhishing: false, explain: 'mail.quillbox.com is a normal subdomain of the real quillbox.com.' },
  { url: 'https://quilbox.com/password-reset', brandId: 'quillbox', isPhishing: true, tell: ['quilbox'], technique: 'typosquat', explain: 'One "l" is missing: quilbox instead of quillbox.' },
  { url: 'https://quillbox.mail-storage-full.xyz/upgrade', brandId: 'quillbox', isPhishing: true, tell: ['mail', 'storage', 'full', 'xyz'], technique: 'subdomain-spoof', explain: 'The real domain is mail-storage-full.xyz. "quillbox" is only a subdomain label.' },
  { url: 'https://track.parcelyn.com/parcel/PX7712', brandId: 'parcelyn', isPhishing: false, explain: 'Tracking page on the real parcelyn.com domain.' },
  { url: 'https://parcelyn-redelivery.support/fee', brandId: 'parcelyn', isPhishing: true, tell: ['redelivery', 'support'], technique: 'wrong-tld', explain: 'Parcelyn lives on parcelyn.com. A ".support" domain asking for a fee is the trap.' },
  { url: 'https://shrt.lnk/pcl-fee', brandId: 'parcelyn', isPhishing: true, tell: ['shrt', 'lnk'], technique: 'ip-or-shortener', explain: 'A short link hides where you will really land. Never sign in or pay after one.' },
  { url: 'https://www.streamory.com/account', brandId: 'streamory', isPhishing: false, explain: 'Account page on the real streamory.com.' },
  { url: 'https://accounts.streamory.com/reset', brandId: 'streamory', isPhishing: false, explain: 'accounts.streamory.com is a genuine subdomain. Legitimate.' },
  { url: 'https://streamory.com-billing-update.top/account', brandId: 'streamory', isPhishing: true, tell: ['com', 'billing', 'update', 'top'], technique: 'wrong-tld', explain: 'A hyphen hides the switch: the real domain is com-billing-update.top.' },
  { url: 'https://login.kestrelcloud.com/', brandId: 'kestrel', isPhishing: false, explain: 'Sign-in subdomain of the real kestrelcloud.com.' },
  { url: 'https://login.kestre1cloud.com/', brandId: 'kestrel', isPhishing: true, tell: ['kestre1cloud'], technique: 'typosquat', explain: 'A "1" replaces the "l" in kestrel.' },
  { url: 'https://kestrelcloud.com@203.0.113.9/login', brandId: 'kestrel', isPhishing: true, tell: ['203', '0', '113', '9'], technique: 'ip-or-shortener', explain: 'Everything before "@" is ignored by the browser. You would really go to the IP 203.0.113.9.' },
  { url: 'https://www.hexasocial.com/login', brandId: 'hexa', isPhishing: false, explain: 'Correct domain hexasocial.com. Legitimate.' },
  { url: 'https://www.hexasoclal.com/login', brandId: 'hexa', isPhishing: true, tell: ['hexasoclal'], technique: 'homoglyph', explain: 'An "l" stands in for the "i": hexasoclal.' },
  { url: 'https://hexasocial.security-check-alert.com/verify', brandId: 'hexa', isPhishing: true, tell: ['security', 'check', 'alert'], technique: 'subdomain-spoof', explain: 'The real domain is security-check-alert.com. The brand is only a subdomain.' },
  { url: 'https://www.cartora.com/orders', brandId: 'cartora', isPhishing: false, explain: 'Orders page on the real cartora.com.' },
  { url: 'https://help.cartora.com/returns', brandId: 'cartora', isPhishing: false, explain: 'help.cartora.com is a genuine subdomain.' },
  { url: 'https://www.cartora.co/orders/refund', brandId: 'cartora', isPhishing: true, tell: ['co'], technique: 'wrong-tld', explain: '.co, not .com. One missing letter sends you to a different owner.' },
  { url: 'https://cartora-order-refund.help/claim', brandId: 'cartora', isPhishing: true, tell: ['order', 'refund', 'help'], technique: 'extra-words', explain: 'The domain is cartora-order-refund.help. Real Cartora pages end in cartora.com.' },
  // typosquat
  { url: 'https://www.lumorapy.com/signin', brandId: 'lumora', isPhishing: true, tell: ['lumorapy'], technique: 'typosquat', explain: 'An "a" is missing: lumorapy, not lumorapay.' },
  { url: 'https://www.streamroy.com/account', brandId: 'streamory', isPhishing: true, tell: ['streamroy'], technique: 'typosquat', explain: 'Two letters swapped: streamroy, not streamory.' },
  { url: 'https://online.vantixbnak.com/login', brandId: 'vantix', isPhishing: true, tell: ['vantixbnak'], technique: 'typosquat', explain: '"bank" is spelled "bnak". Easy to miss at a glance.' },
  { url: 'https://track.parcelynn.com/parcel', brandId: 'parcelyn', isPhishing: true, tell: ['parcelynn'], technique: 'typosquat', explain: 'One extra "n": parcelynn, not parcelyn.' },
  // wrong-tld
  { url: 'https://www.lumorapay.net/signin', brandId: 'lumora', isPhishing: true, tell: ['net'], technique: 'wrong-tld', explain: 'LumoraPay is on .com. lumorapay.net belongs to someone else.' },
  { url: 'https://login.kestrelcloud.co/', brandId: 'kestrel', isPhishing: true, tell: ['co'], technique: 'wrong-tld', explain: '.co, not .com. A different owner entirely.' },
  { url: 'https://mail.quillbox.info/inbox', brandId: 'quillbox', isPhishing: true, tell: ['info'], technique: 'wrong-tld', explain: 'Quillbox is on .com. The .info ending is the trap.' },
  // extra-words
  { url: 'https://hexasocial-account-verify.com/login', brandId: 'hexa', isPhishing: true, tell: ['account', 'verify'], technique: 'extra-words', explain: 'The real site is hexasocial.com. "-account-verify" makes it a different website.' },
  { url: 'https://secure-lumorapay-login.com/signin', brandId: 'lumora', isPhishing: true, tell: ['secure', 'login'], technique: 'extra-words', explain: '"secure-" and "-login" turn it into a different website, not lumorapay.com.' },
  { url: 'https://streamory-billing-support.com/update', brandId: 'streamory', isPhishing: true, tell: ['billing', 'support'], technique: 'extra-words', explain: 'streamory-billing-support.com is not streamory.com. The extra words are the giveaway.' },
  // homoglyph
  { url: 'https://login.kestrelc1oud.com/', brandId: 'kestrel', isPhishing: true, tell: ['kestrelc1oud'], technique: 'homoglyph', explain: 'A "1" stands in for the "l" in cloud: c1oud.' },
  { url: 'https://www.cart0ra.com/orders', brandId: 'cartora', isPhishing: true, tell: ['cart0ra'], technique: 'homoglyph', explain: 'A zero stands in for the "o": cart0ra.' },
  { url: 'https://www.vantixbank.corn/login', brandId: 'vantix', isPhishing: true, tell: ['corn'], technique: 'homoglyph', explain: 'Look closely at the ending: .corn, not .com. "rn" passes for "m".' },
  // subdomain-spoof
  { url: 'https://www.streamory.com.account-help.net/login', brandId: 'streamory', isPhishing: true, tell: ['account', 'help', 'net'], technique: 'subdomain-spoof', explain: 'The real website is account-help.net. "streamory.com" is just a label in front.' },
  { url: 'https://cartora.com.order-status.top/track', brandId: 'cartora', isPhishing: true, tell: ['order', 'status', 'top'], technique: 'subdomain-spoof', explain: 'Read back from the first single slash: the real website is order-status.top.' },
  // ip-or-shortener
  { url: 'https://tiny.lnk/lumora-verify', brandId: 'lumora', isPhishing: true, tell: ['tiny', 'lnk'], technique: 'ip-or-shortener', explain: 'A short link hides where you will really land. Never sign in after one.' },
  { url: 'http://198.51.100.23/streamory/billing', brandId: 'streamory', isPhishing: true, tell: ['198', '51', '100', '23'], technique: 'ip-or-shortener', explain: 'Just numbers instead of a name. Real companies never send you to a bare number address.' },
  { url: 'https://hexasocial.com@198.51.100.77/verify', brandId: 'hexa', isPhishing: true, tell: ['198', '51', '100', '77'], technique: 'ip-or-shortener', explain: 'Browsers ignore everything before "@". This really goes to 198.51.100.77.' }
];

// "How to play": one rule, the gang, a practice link, the scoring.
export const BRIEFING = [
  {
    kicker: 'Step 1',
    title: 'Find the real website',
    body: 'Find the first single slash after https://. The name just before it is the real website. Everything else can be faked.',
    dissect: [{ t: 'https://', c: 'dim' }, { t: 'track.', c: 'dim' }, { t: 'parcelyn.com', c: 'domain' }, { t: '/parcel/PX7712', c: 'dim' }]
  },
  {
    kicker: 'Step 2',
    title: 'Your hit list',
    body: 'Seven gang members, weakest first. Crack enough of their fake links to capture them and cross out their name. Three mistakes and they escape.',
    diary: true
  },
  {
    kicker: 'Step 3',
    title: 'Try it',
    body: 'Tap the part that shows the real website.',
    practice: { url: 'https://cartora.com.refund-desk.top/claim', answer: ['refund', 'desk', 'top'] }
  },
  {
    kicker: 'Step 4',
    title: 'Beat the clock',
    body: 'Tap the fake part, or mark the link safe. About a third of links are real.',
    scoring: [
      ['Tap the fake part', '+100'],
      ['Mark a real link safe', '+60'],
      ['Speed bonus, per second left', '+3/s'],
      ['3 or 5 right in a row', '×1.5 · ×2'],
      ['Hard mode (real address hidden)', '×1.25'],
      ['Knew it was fake, tapped the wrong part', '+30'],
      ['Called a fake safe, or a real one fake', '−25']
    ]
  }
];

export const RANKS = [[0, 'Trainee'], [400, 'Link Checker'], [1200, 'Detective'], [2500, 'Senior Detective'], [5000, 'Chief Detective']];

