import type { CaseData } from '@/types';
import { hasLink } from '@/types';

export const semnalPierdut: CaseData = {
  id: 'semnal-pierdut',
  title: 'Semnal Pierdut',
  victim: 'Andreea Vasilescu, 22 ani',
  passcode: '0217',
  intro: {
    eyebrow: 'Caz #01',
    title: 'Semnal Pierdut',
    subtitle:
      'Andreea, 22 de ani, a dispărut acum câteva zile. Telefonul ei a fost găsit abandonat. Investighează-l și trage propriile concluzii.'
  },
  threads: [
    {
      id: 't1',
      name: 'Mama',
      initials: 'M',
      messages: [
        { from: 'them', text: 'Andreea, sună-mă când ajungi la cămin.' },
        { from: 'me', text: 'Da mami, ajung în 20 min.' },
        { from: 'them', text: 'Nu ai mai răspuns de 2 zile, sunt îngrijorată.', clue: true }
      ]
    },
    {
      id: 't2',
      name: 'Radu (coleg)',
      initials: 'R',
      messages: [
        { from: 'them', text: 'Ai plecat de la petrecere fără să zici nimic.' },
        { from: 'them', text: 'Cine era tipul cu care vorbeai afară?' },
        { from: 'me', text: 'Nu vreau să vorbesc despre asta acum.' }
      ]
    },
    {
      id: 't3',
      name: 'Necunoscut',
      initials: '?',
      messages: [
        { from: 'them', text: 'Știu ce ai făcut. Mai avem de vorbit.', clue: true },
        { from: 'me', text: 'Cine ești? Nu te cunosc.' },
        { from: 'them', text: 'O să afli curând. Fii la locul obișnuit, vineri.', clue: true }
      ]
    },
    {
      id: 't4',
      name: 'Ioana (colegă de cameră)',
      initials: 'I',
      messages: [
        { from: 'them', text: 'Ai uitat încărcătorul la mine, ți-l aduc mâine.' },
        { from: 'them', text: 'De ce nu ai dormit acasă azi noapte?' },
        { from: 'me', text: 'Am stat la o prietenă, nu-ți face griji.' },
        { from: 'them', text: 'Ai fost ciudată în ultima săptămână. S-a întâmplat ceva?', clue: true }
      ]
    },
    {
      id: 't5',
      name: 'Tata',
      initials: 'T',
      messages: [
        { from: 'them', text: 'Ai vorbit cu mama ta? E foarte îngrijorată.' },
        { from: 'me', text: 'Sunt bine, doar am nevoie de puțin spațiu acum.' },
        { from: 'them', text: 'Dacă ai nevoie de bani pentru orice, sună-mă direct pe mine, nu pe altcineva.', clue: true }
      ]
    }
  ],
  gallery: [
    {
      id: 'g1',
      img: 'https://picsum.photos/seed/petrecere1/500/500',
      label: 'Foto grup — petrecere, 28 ian',
      note: 'Se văd 6 persoane. Unul din fundal poartă o geacă identică cu cea descrisă de coleg de cameră.',
      meta: { Loc: 'Str. Copou 14', Ora: '23:41', Metadate: 'GPS activ' }
    },
    {
      id: 'g2',
      img: 'https://picsum.photos/seed/banking1/500/500',
      label: 'Captură bancară',
      note: 'Transfer de 2.000 RON către un cont necunoscut, cu o zi înainte de dispariție.',
      meta: { Loc: '—', Ora: '14:02', Metadate: 'Editat de 2 ori' }
    },
    {
      id: 'g3',
      img: 'https://picsum.photos/seed/cafenea1/500/500',
      label: 'Selfie — cafenea',
      note: 'Pare normal, dar reflexia din geam arată o a doua persoană care o urmărește.',
      meta: { Loc: 'Cafeneaua Nomad', Ora: '09:15', Metadate: 'Locație suprascrisă' }
    }
  ],
  notes: [
    { t: 'Listă rezolvare teză', b: 'Cap 1-3 gata. Mai trebuie bibliografie.' },
    { t: 'NU UITA', b: 'Ia banii de la R. înainte de vineri. Nu spune nimănui.' },
    { t: 'Frică', b: 'Cred că cineva mi-a intrat în cont. Parolele schimbate azi.' },
    { t: 'De ce întreabă toți de bani?', b: 'Radu, tata, toată lumea. Nu e treaba nimănui de unde fac rost.' }
  ],
  locations: [
    { id: 'l1', name: 'Cămin studențesc', x: 22, y: 70, time: 'Zilnic, seara', note: 'Adresa oficială. Ultimul semnal confirmat de aici a fost cu 3 zile înaintea dispariției.', last: false },
    { id: 'l2', name: 'Str. Copou 14 — petrecere', x: 58, y: 30, time: '28 ian, 23:41', note: 'Locul din fotografia de grup. GPS-ul telefonului confirmă prezența ei aici.', last: false },
    { id: 'l3', name: 'Cafeneaua Nomad', x: 38, y: 50, time: '30 ian, 09:15', note: 'Ultima locație cu metadate GPS reale — restul pozelor din acea zi au locație suprascrisă manual.', last: false },
    { id: 'l4', name: 'Zonă industrială, margine oraș', x: 78, y: 75, time: '31 ian, 21:02', note: 'Ultimul semnal GPS înregistrat, apoi telefonul a intrat offline. Nu apare în nicio poză sau mesaj.', last: true }
  ],
  calls: [
    { name: 'Mama', dir: 'primit', dur: '4:12', time: '29 ian, 20:10', missed: false },
    { name: 'Radu', dir: 'efectuat', dur: '1:03', time: '30 ian, 11:45', missed: false },
    { name: 'Necunoscut', dir: 'ratat', dur: '—', time: '31 ian, 19:22', missed: true, clue: true },
    { name: 'Necunoscut', dir: 'ratat', dur: '—', time: '31 ian, 20:47', missed: true, clue: true },
    { name: 'Mama', dir: 'ratat', dur: '—', time: '1 feb, 08:03', missed: true }
  ],
  board: [
    { id: 'p1', type: 'Mesaj', text: '"Nu ai mai răspuns de 2 zile" — mama', x: 20, y: 20 },
    { id: 'p2', type: 'Mesaj', text: '"Cine era tipul de afară?" — Radu', x: 180, y: 60 },
    { id: 'p3', type: 'Mesaj', text: '"Știu ce ai făcut" — necunoscut', x: 360, y: 20 },
    { id: 'p4', type: 'Foto', text: 'Foto grup, geacă suspectă', x: 40, y: 190 },
    { id: 'p5', type: 'Foto', text: 'Transfer bancar 2.000 RON', x: 220, y: 220 },
    { id: 'p6', type: 'Foto', text: 'Reflexie — a doua persoană', x: 400, y: 190 },
    { id: 'p7', type: 'Notiță', text: '"Ia banii de la R. înainte de vineri"', x: 80, y: 360 },
    { id: 'p8', type: 'Notiță', text: '"Cineva mi-a intrat în cont"', x: 320, y: 390 },
    { id: 'p9', type: 'Apel', text: '2 apeluri ratate — Necunoscut, seara dispariției', x: 460, y: 330 },
    { id: 'p10', type: 'Apel', text: 'Apel ratat — mama, a doua zi', x: 520, y: 430 }
  ],
  endings: [
    {
      id: 'ending_radu',
      check: (links) => hasLink(links, 'p2', 'p5') && hasLink(links, 'p5', 'p7'),
      eyebrow: 'Final — Concluzie corectă',
      title: 'Datoria ascunsă',
      body: 'Ai legat mesajul lui Radu de transferul bancar și de notița despre bani. Andreea făcea rost de bani pentru Radu și a fugit ca să scape de o datorie, nu răpită. S-a ascuns la o verișoară, temându-se să contacteze pe cineva.'
    },
    {
      id: 'ending_stalker',
      check: (links) => hasLink(links, 'p3', 'p6') && hasLink(links, 'p6', 'p8'),
      eyebrow: 'Final — Concluzie corectă',
      title: 'Urmăritorul',
      body: 'Ai legat mesajul necunoscutului de reflexia din fotografie și de notița despre contul spart. Cineva o urmărea sistematic, i-a compromis conturile, iar dispariția e legată de amenințările primite.'
    },
    {
      id: 'ending_confrontation',
      check: (links) => hasLink(links, 'p3', 'p9') && hasLink(links, 'p9', 'p10'),
      eyebrow: 'Final — Concluzie corectă',
      title: 'Întâlnirea din umbră',
      body: 'Ai legat mesajul necunoscutului de apelurile ratate din seara dispariției și de apelul ratat al mamei a doua zi. Andreea a fost sunată insistent înainte să dispară, apoi orice contact a încetat brusc — un semn clar al unei confruntări planificate, nu al unei fugi voluntare.'
    },
    {
      id: 'ending_wrong',
      check: () => true,
      eyebrow: 'Final — Concluzie neconfirmată',
      title: 'Prea puține dovezi',
      body: 'Conexiunile tale nu leagă încă un mesaj de amenințare de o dovadă fizică (foto, notiță sau apel). Cazul rămâne deschis — revino la board și încearcă alte legături între indicii.'
    }
  ]
};
