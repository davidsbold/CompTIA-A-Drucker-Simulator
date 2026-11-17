export type PrinterComponentId =
  | 'pickup'
  | 'toner'
  | 'drum'
  | 'transfer'
  | 'fuser'
  | 'duplex'
  | 'adf'
  | 'interface';

export interface PrinterComponentInfo {
  id: PrinterComponentId;
  englishTerm: string;
  germanTerm: string;
  analogy: string;
  simpleExplanation: string;
  examTip: string;
  colorHex: string;
  requiresDoorOpen: boolean;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export const PRINTER_COMPONENTS: PrinterComponentInfo[] = [
  {
    id: 'pickup',
    englishTerm: 'Pickup Rollers & Separation Pad',
    germanTerm: 'Einzugsrollen & Trennpolster',
    analogy:
      'Wie ein feuchter Finger beim Umblättern und ein Bremsklotz für die anderen Blätter.',
    simpleExplanation:
      'Die gummierten Einzugsrollen greifen genau das oberste Blatt aus dem Papierfach. Das raue Trennpolster darunter bremst die nächsten Blätter leicht ab, damit niemals mehrere Seiten auf einmal eingezogen werden.',
    examTip:
      'CompTIA A+ Praxis: Zieht der Drucker gar kein Papier ein oder staut wiederholt, zuerst die Pickup Rollers reinigen (Papierstaub). Bei Mehrfacheinzug oder hohem Durchsatz: Maintenance Kit (Wartungskit) installieren – darin sind Rollen, Trennpad und oft auch Fixierkomponenten enthalten.',
    colorHex: '#0284C7',
    requiresDoorOpen: true,
    cameraPosition: [0.65, 1.05, 3.05],
    cameraTarget: [0.0, 0.45, 0.55],
  },
  {
    id: 'toner',
    englishTerm: 'Toner Cartridge & Developer Roller',
    germanTerm: 'Tonerkartusche & Entwicklerwalze',
    analogy:
      'Der Vorratsbehälter mit trockenem Farbstaub statt flüssiger Tinte.',
    simpleExplanation:
      'Im Laserdrucker wird extrem feines Kunststoff-Farbpulver (Toner) genutzt. Die Entwicklerwalze (Developer Roller) transportiert das Pulver aus der Kartusche präzise an die Bildtrommel.',
    examTip:
      'Wichtig für die Prüfung: Lässt sich der Toner nach dem Drucken verwischen, liegt es NICHT an der Tonerkartusche, sondern an der Fixiereinheit (Fuser). Ist das ganze Blatt gleichmäßig blass, kann vorsichtiges Schütteln kurzzeitig helfen.',
    colorHex: '#2563EB',
    requiresDoorOpen: true,
    cameraPosition: [1.45, 1.85, 2.65],
    cameraTarget: [0.0, 1.15, 0.35],
  },
  {
    id: 'drum',
    englishTerm: 'Imaging Drum / EP Drum & Corona Wire',
    germanTerm: 'Bildtrommel, Corona-Draht & Entladungslampe',
    analogy:
      'Wie ein unsichtbarer magnetischer Stempel, der mit Licht beschrieben und danach gelöscht wird.',
    simpleExplanation:
      'Der Corona-Draht (oder die Ladewalze) lädt die glänzende Bildtrommel elektrisch auf. Der Laser belichtet das Schriftbild, sodass Toner haftet. Am Ende entfernt die Entladungslampe (Discharge Lamp) die Restladung für die nächste Seite.',
    examTip:
      'Prüfungsklassiker: Ein Kratzer auf der Bildtrommel wiederholt sich als exakt gleicher Punkt/Streifen im Walzenabstand auf jedem Ausdruck. Ein verschmutzter Corona-Draht erzeugt ebenfalls auf ALLEN Ausdrucken und Faxen Streifen (im Gegensatz zum Scanglas!).',
    colorHex: '#0D9488',
    requiresDoorOpen: true,
    cameraPosition: [-1.45, 1.65, 2.65],
    cameraTarget: [0.0, 0.88, 0.22],
  },
  {
    id: 'transfer',
    englishTerm: 'Transfer Belt / Roller',
    germanTerm: 'Transferband & Transferwalze',
    analogy:
      'Wie ein elektrischer Magnet-Teppich, der den Staub von der Trommel aufs Papier zieht.',
    simpleExplanation:
      'Während das Papier zwischen Bildtrommel und Transferwalze hindurchläuft, lädt die Transferwalze das Papier elektrisch entgegengesetzt auf. Dadurch springt das Tonerpulver von der Trommel sauber auf das Blatt über.',
    examTip:
      'Bei Farblaserdruckern sammelt oft ein breites Transfer Belt die vier Farben (CMYK) nacheinander ein, bevor alles gemeinsam auf das Papier übertragen wird.',
    colorHex: '#7C3AED',
    requiresDoorOpen: true,
    cameraPosition: [1.55, 1.35, 2.55],
    cameraTarget: [0.0, 0.68, 0.05],
  },
  {
    id: 'fuser',
    englishTerm: 'Fuser Assembly',
    germanTerm: 'Fixiereinheit',
    analogy:
      'Das heiße Bügeleisen für das Papier – schmilzt den Toner dauerhaft fest.',
    simpleExplanation:
      'Bis hierhin liegt das Tonerpulver nur lose auf dem Blatt. Zwei heiße Druckwalzen (über 180 °C) pressen und schmelzen das Kunststoffpulver dauerhaft in die Papierfasern ein. Deshalb kommt das Papier warm aus dem Drucker.',
    examTip:
      'Häufigste CompTIA-Frage: „Wörter und Bilder lösen sich beim Überwischen mit dem Finger ab“ -> Fixiereinheit (Fuser) austauschen! Bei Streifen + Schmierstellen + Einzugsfehlern zusammen: komplettes Maintenance Kit tauschen.',
    colorHex: '#DC2626',
    requiresDoorOpen: true,
    cameraPosition: [1.65, 2.05, 2.25],
    cameraTarget: [0.0, 1.18, -0.35],
  },
  {
    id: 'duplex',
    englishTerm: 'Duplexing Assembly & Alignment',
    germanTerm: 'Duplexeinheit, Ausrichtung & Papierfach',
    analogy:
      'Eine automatische Papier-Rutsche, die das Blatt für die Rückseite wendet.',
    simpleExplanation:
      'Für beidseitigen Druck (Duplex) leitet diese hintere Wendeeinheit das Blatt um und führt es ein zweites Mal an Trommel und Fixiereinheit vorbei.',
    examTip:
      'Prüfungswissen: Passen breite Tabellen im Duplexmodus nicht auf die Seite -> Seitenausrichtung (Querformat / Landscape) ändern! Sind Formulare nach unten verschoben -> Ausrichtungseinstellungen (Alignment) prüfen. Meldet der Drucker „Papier einlegen“, obwohl 11×17 oder Briefpapier drin liegt -> Facheinstellungen (Tray Settings) prüfen.',
    colorHex: '#D97706',
    requiresDoorOpen: true,
    cameraPosition: [2.25, 1.45, -2.0],
    cameraTarget: [0.0, 0.72, -0.62],
  },
  {
    id: 'adf',
    englishTerm: 'ADF & Flatbed Scanner Glass',
    germanTerm: 'Dokumenteneinzug (ADF) & Flachbettglas',
    analogy:
      'Die Kopier-Kamera auf dem Dach des Druckers – sauber halten wie eine Brille.',
    simpleExplanation:
      'Oben auf All-in-One-Geräten sitzt der Scanner mit Flachbettglas und automatischem Dokumenteneinzug (ADF). Er liest Vorlagen für Kopien, Scan-to-Folder (SMB) und Scan-to-Email (SMTP) ein.',
    examTip:
      'Prüfungsklassiker (#3): Erscheint eine vertikale Linie NUR beim Kopieren und Scannen, während normale Drucke und Empfangsfaxe sauber sind -> Schmutz oder Kratzer auf dem ADF- / Flachbettglas! Für Scan-to-Folder nutzt man SMB (ggf. SMB 1.0 bei Altgeräten), für Scan-to-Email nutzt man SMTP.',
    colorHex: '#0891B2',
    requiresDoorOpen: false,
    cameraPosition: [1.95, 2.55, 2.35],
    cameraTarget: [0.0, 1.62, -0.05],
  },
  {
    id: 'interface',
    englishTerm: 'Control Panel, NFC Reader & Ports',
    germanTerm: 'Bedienfeld, NFC-Ausweisleser, Netzwerk & Strom',
    analogy:
      'Die Steuerzentrale mit Ausweis-Scanner, Netzwerkkabel und Steckdose.',
    simpleExplanation:
      'Hier befinden sich das Display, der NFC-Leser für Mitarbeiter-Ausweise (Badging), Netzwerk-/USB-Anschlüsse sowie die Stromversorgung. Darüber laufen Firmware, Treibersprachen (PCL/PostScript) und sichere Authentifizierung.',
    examTip:
      'CompTIA A+ Kernwissen: Statische IP + Subnetzmaske + Standard-Gateway gegen Verbindungsabbrüche; USB nur für 1 Einzel-PC, Druckserver für Firmenbüros; Firmware-Update schließt Sicherheitslücken & fixt Scan-to-Email; PCL vs. PostScript-Treiber verhindert Hieroglyphen; weißes Display im Auslandsbüro -> Stromspannung (110 V / 230 V) prüfen!',
    colorHex: '#4F46E5',
    requiresDoorOpen: false,
    cameraPosition: [2.25, 1.85, 2.25],
    cameraTarget: [0.65, 1.25, 0.35],
  },
];

export interface OtherPrinterTypeInfo {
  id: 'inkjet' | 'thermal' | 'impact';
  title: string;
  englishName: string;
  everydayContext: string;
  howItWorks: string;
  parts: {
    englishTerm: string;
    germanTerm: string;
    explanation: string;
  }[];
}

export const OTHER_PRINTER_TYPES: OtherPrinterTypeInfo[] = [
  {
    id: 'inkjet',
    title: 'Tintenstrahldrucker',
    englishName: 'Inkjet Printer',
    everydayContext: 'Typischer Heim- und Fotodrucker für lebendige Farben.',
    howItWorks:
      'Winzige Düsen spritzen mikroskopische Tintentröpfchen direkt auf das Papier, während der Druckkopf hin und her fährt.',
    parts: [
      {
        englishTerm: 'Printhead',
        germanTerm: 'Druckkopf',
        explanation:
          'Enthält Hunderte winziger Düsen. Bleibt die Druckqualität auch nach Patronenwechsel schlecht -> Druckköpfe reinigen!',
      },
      {
        englishTerm: 'Carriage Belt',
        germanTerm: 'Schlittenriemen / Zahnriemen',
        explanation:
          'Zieht den Druckkopf-Schlitten präzise von links nach rechts über das Blatt.',
      },
      {
        englishTerm: 'Calibration',
        germanTerm: 'Kalibrierung / Ausrichtung',
        explanation:
          'Sorgt dafür, dass Hin- und Rückweg des Druckkopfs exakt übereinander treffen. Verhindert Doppelkonturen.',
      },
    ],
  },
  {
    id: 'thermal',
    title: 'Thermodrucker',
    englishName: 'Thermal Printer',
    everydayContext: 'Kassenbons im Supermarkt, Versandetiketten und Paketscheine.',
    howItWorks:
      'Kommt komplett ohne Tinte und Toner aus. Hitze verfärbt eine spezielle wärmeempfindliche Schicht auf dem Papier schwarz.',
    parts: [
      {
        englishTerm: 'Heating Element',
        germanTerm: 'Thermisches Heizelement',
        explanation:
          'Eine Leiste aus winzigen Heizpunkten. Zeigt der Bon vertikale weiße Linien -> Heizelement reinigen!',
      },
      {
        englishTerm: 'Thermal Paper',
        germanTerm: 'Thermopapier',
        explanation:
          'Nur auf einer Seite beschichtet. Wird die Rolle verkehrt herum eingelegt, bleibt der Kassenbon komplett weiß.',
      },
    ],
  },
  {
    id: 'impact',
    title: 'Nadeldrucker',
    englishName: 'Impact / Dot Matrix Printer',
    everydayContext: 'Kfz-Werkstätten, Arztpraxen oder Lager für Durchschlagformulare.',
    howItWorks:
      'Kleine Metallnadeln hämmern mechanisch durch ein Farbband auf das Papier – ideal für mehrteilige Durchschläge.',
    parts: [
      {
        englishTerm: 'Print Ribbon',
        germanTerm: 'Farbband',
        explanation:
          'Ist die Schrift über Zeit blasser geworden ODER bleibt die oberste Seite leer während Durchschläge drucken -> Farbband austauschen!',
      },
      {
        englishTerm: 'Tractor Feed',
        germanTerm: 'Traktorführung (Stachelwalze)',
        explanation:
          'Zahnräder greifen in den gelochten Rand von Endlospapier. (Waagerechte weiße Lücken auf allen Kopien = gebrochene Nadeln.)',
      },
    ],
  },
];

export interface LaserStepInfo {
  order: number;
  id: string;
  englishName: string;
  germanName: string;
  mnemonicWord: string;
  mnemonicLetter: string;
  simpleExplanation: string;
  componentId: PrinterComponentId | null;
  progressStart: number;
  progressEnd: number;
}

export const LASER_STEPS: LaserStepInfo[] = [
  {
    order: 1,
    id: 'processing',
    englishName: 'Processing',
    germanName: 'Verarbeitung',
    mnemonicWord: 'People',
    mnemonicLetter: 'P',
    simpleExplanation:
      'Der Computer schickt das Dokument (über PCL- oder PostScript-Treiber). Der Druckerspeicher rechnet Text und Bilder zuerst komplett in ein druckfertiges Raster um.',
    componentId: 'interface',
    progressStart: 0.0,
    progressEnd: 0.14,
  },
  {
    order: 2,
    id: 'charging',
    englishName: 'Charging',
    germanName: 'Aufladen',
    mnemonicWord: "Can't",
    mnemonicLetter: 'C',
    simpleExplanation:
      'Die Bildtrommel erhält durch den Corona-Draht / die Ladewalze eine gleichmäßige negative elektrische Grundladung und die Einzugsrollen ziehen das erste Blatt ein.',
    componentId: 'drum',
    progressStart: 0.14,
    progressEnd: 0.28,
  },
  {
    order: 3,
    id: 'exposing',
    englishName: 'Exposing',
    germanName: 'Belichten',
    mnemonicWord: 'Eat',
    mnemonicLetter: 'E',
    simpleExplanation:
      'Ein feiner Laserstrahl zeichnet das Bild spiegelverkehrt auf die Bildtrommel und senkt überall dort, wo später Schrift stehen soll, die negative Ladung ab.',
    componentId: 'drum',
    progressStart: 0.28,
    progressEnd: 0.43,
  },
  {
    order: 4,
    id: 'developing',
    englishName: 'Developing',
    germanName: 'Entwickeln',
    mnemonicWord: 'Donuts',
    mnemonicLetter: 'D',
    simpleExplanation:
      'Die Entwicklerwalze (Developer Roller) gibt feines Tonerpulver aus der Kartusche ab – es haftet genau an den vom Laser belichteten Stellen der Trommel.',
    componentId: 'toner',
    progressStart: 0.43,
    progressEnd: 0.58,
  },
  {
    order: 5,
    id: 'transferring',
    englishName: 'Transferring',
    germanName: 'Übertragen',
    mnemonicWord: 'That',
    mnemonicLetter: 'T',
    simpleExplanation:
      'Die Transferwalze gibt dem Papier eine positive Ladung. Dadurch springt das Tonerpulver von der Bildtrommel sauber auf das vorbeifahrende Blatt über.',
    componentId: 'transfer',
    progressStart: 0.58,
    progressEnd: 0.74,
  },
  {
    order: 6,
    id: 'fusing',
    englishName: 'Fusing',
    germanName: 'Fixieren',
    mnemonicWord: 'Look (Fusing)',
    mnemonicLetter: 'F',
    simpleExplanation:
      'Das Papier rollt durch die über 180 °C heiße Fixiereinheit (Fuser). Hitze und Druck schmelzen den Toner dauerhaft in die Papierfasern ein.',
    componentId: 'fuser',
    progressStart: 0.74,
    progressEnd: 0.90,
  },
  {
    order: 7,
    id: 'cleaning',
    englishName: 'Cleaning',
    germanName: 'Reinigen',
    mnemonicWord: 'Crazy',
    mnemonicLetter: 'C',
    simpleExplanation:
      'Ein Gummischaber entfernt restlichen Toner und die Entladungslampe (Discharge Lamp) löscht die Restladung auf der Trommel – bereit für das nächste Blatt.',
    componentId: 'drum',
    progressStart: 0.90,
    progressEnd: 1.0,
  },
];

export interface HelpdeskOption {
  id: string;
  label: string;
  linkedComponent?: PrinterComponentId;
}

export interface HelpdeskTicket {
  id: string;
  ticketNumber: string;
  callerName: string;
  printerModel: string;
  symptomTitle: string;
  userMessage: string;
  requires3DClickHint: boolean;
  correctOptionId: string;
  options: HelpdeskOption[];
  successExplanation: string;
  wrongExplanation: Record<string, string>;
}

export const HELPDESK_TICKETS: HelpdeskTicket[] = [
  {
    id: 'ticket-fuser',
    ticketNumber: 'HD-104',
    callerName: 'Sabine M. (Buchhaltung)',
    printerModel: 'All-in-One Laserdrucker',
    symptomTitle: 'Toner verwischt auf dem frischen Ausdruck',
    userMessage:
      '„Nach einem Wechsel der Tonerkassette kommen die Rechnungen zwar gedruckt heraus, aber ich kann die Wörter einfach mit dem Finger abwischen!“',
    requires3DClickHint: true,
    correctOptionId: 'fuser',
    options: [
      { id: 'fuser', label: 'Fuser Assembly (Fixiereinheit) tauschen', linkedComponent: 'fuser' },
      { id: 'drum', label: 'Imaging Drum (Bildtrommel) tauschen', linkedComponent: 'drum' },
      { id: 'toner', label: 'Entwicklerwalze reinigen', linkedComponent: 'toner' },
      { id: 'pickup', label: 'Entladungslampe prüfen', linkedComponent: 'pickup' },
    ],
    successExplanation:
      'Genau richtig! Die Fuser Assembly (Fixiereinheit) schmilzt den Toner mit Hitze und Druck dauerhaft ein. Bleibt sie kalt, liegt das Pulver nur lose auf.',
    wrongExplanation: {
      drum: 'Die Bildtrommel überträgt das Tonerbild elektrostatisch, schmilzt es aber nicht ein.',
      toner: 'Die Entwicklerwalze transportiert den Toner zur Trommel – sie hat mit dem Einschmelzen nichts zu tun.',
      pickup: 'Einzugsrollen oder Entladungslampe haben keinen Einfluss darauf, ob Toner festschmilzt.',
    },
  },
  {
    id: 'ticket-adf',
    ticketNumber: 'HD-106',
    callerName: 'Miriam L. (Sekretariat)',
    printerModel: 'All-in-One Laserdrucker',
    symptomTitle: 'Vertikale Linie nur beim Kopieren & Scannen',
    userMessage:
      '„Beim Kopieren und Scannen zieht sich immer eine durchgehende senkrechte Linie übers Bild. Normale Ausdrucke und empfangene Faxe sind aber völlig sauber!“',
    requires3DClickHint: true,
    correctOptionId: 'adf',
    options: [
      { id: 'adf', label: 'Dokumenteneinzug (ADF) / Flachbettglas reinigen', linkedComponent: 'adf' },
      { id: 'drum', label: 'Imaging Drum / Trommeleinheit tauschen', linkedComponent: 'drum' },
      { id: 'pickup', label: 'Pickup Rollers (Einzugsrollen) reinigen', linkedComponent: 'pickup' },
      { id: 'fuser', label: 'Fuser Assembly prüfen', linkedComponent: 'fuser' },
    ],
    successExplanation:
      'Volltreffer! Da normale Ausdrucke und Empfangsfaxe sauber bleiben, liegt der Fehler nicht im Druckwerk, sondern als Schmutz oder Kratzer auf dem Glas des ADF / Flachbettscanners.',
    wrongExplanation: {
      drum: 'Ein Trommel- oder Corona-Draht-Schaden würde sich auf ALLE Ausdrucke – inklusive Faxe und PC-Drucke – auswirken.',
      pickup: 'Einzugsrollen verursachen Papierstaus, aber keine senkrechten schwarzen Scanlinien.',
      fuser: 'Die Fixiereinheit wird auch bei normalen PC-Drucken genutzt und ist hier offensichtlich intakt.',
    },
  },
  {
    id: 'ticket-separation',
    ticketNumber: 'HD-108',
    callerName: 'Thomas K. (Vertrieb)',
    printerModel: 'Büro-Laserdrucker (hoher Durchsatz)',
    symptomTitle: 'Wiederholte Papierstaus, Schmierstellen & Mehrfacheinzug',
    userMessage:
      '„Unser Hauptdrucker zieht oft mehrere Blätter gleichzeitig ein, staut ständig und macht inzwischen auch Streifen auf die Blätter.“',
    requires3DClickHint: true,
    correctOptionId: 'pickup',
    options: [
      { id: 'pickup', label: 'Pickup Rollers & Separation Pad / Wartungskit', linkedComponent: 'pickup' },
      { id: 'toner', label: 'Toner Cartridge wechseln', linkedComponent: 'toner' },
      { id: 'duplex', label: 'Duplexeinheit deaktivieren', linkedComponent: 'duplex' },
      { id: 'adf', label: 'Scanglas abwischen', linkedComponent: 'adf' },
    ],
    successExplanation:
      'Richtig! Abgenutzte Einzugsrollen (Pickup Rollers) und Trennpads (Separation Pad) lösen Mehrfacheinzüge aus. Bei hohem Durchsatz mit Streifen & Staus installiert man ein komplettes Maintenance Kit (Wartungskit) oder reinigt zuerst die Rollen.',
    wrongExplanation: {
      toner: 'Eine neue Tonerkartusche behebt keine mechanischen Einzugs- oder Stauprobleme.',
      duplex: 'Das Abschalten von Duplexdruck verhindert nicht den fehlerhaften Einzug aus dem Hauptfach.',
      adf: 'Das Scanglas beeinflusst nur Kopien/Scans, keinen Papiereinzug beim Drucken.',
    },
  },
  {
    id: 'ticket-spooler',
    ticketNumber: 'HD-112',
    callerName: 'Elena R. (Empfang)',
    printerModel: 'Netzwerk-Laserdrucker & Windows-PC',
    symptomTitle: 'Druckaufträge von Website hängen in Warteschlange fest',
    userMessage:
      '„Wichtige Web-Formulare hängen in der Warteschlange fest. Ich kann die Website-Aufträge nicht einfach neu erstellen, und selbst ein Drucker-Neustart half nicht!“',
    requires3DClickHint: false,
    correctOptionId: 'spooler',
    options: [
      { id: 'spooler', label: 'Druckerspooler-Dienst (Print Spooler) auf dem PC neu starten' },
      { id: 'delete-reboot', label: 'Alle Aufträge löschen und PC komplett neu starten' },
      { id: 'firmware', label: 'Drucker-Firmware aktualisieren', linkedComponent: 'interface' },
      { id: 'fuser', label: 'Fuser Assembly abkühlen lassen', linkedComponent: 'fuser' },
    ],
    successExplanation:
      'Genau richtig! Der Neustart des lokalen Print-Spooler-Dienstes löst Blockaden im Speicher, ohne dass die schwer wiederherstellbaren Web-Druckaufträge verloren gehen.',
    wrongExplanation: {
      'delete-reboot': 'Wenn du alle Aufträge löschst, verliert die Nutzerin ihre wichtigen Website-Daten.',
      firmware: 'Da ein Hard-Reset des Druckers nichts gebracht hat, hängt die Warteschlange auf dem Windows-PC.',
      fuser: 'Es liegt ein Software-Stau auf dem PC vor, kein Hardwareproblem im Drucker.',
    },
  },
  {
    id: 'ticket-static-ip',
    ticketNumber: 'HD-115',
    callerName: 'Frank D. (IT-Leitung)',
    printerModel: 'Netzwerk-Laserdrucker',
    symptomTitle: 'Drucker nach Strom- oder Netzwerkausfall nicht mehr erreichbar',
    userMessage:
      '„Nach jedem Router-Neustart finden die Kollegen den Netzwerkdrucker nicht mehr. Was müssen wir dauerhaft einstellen (inkl. manueller Netzwerkpunkte)?“',
    requires3DClickHint: false,
    correctOptionId: 'static-ip',
    options: [
      { id: 'static-ip', label: 'Statische IP-Adresse (+ Subnetzmaske & Standard-Gateway)', linkedComponent: 'interface' },
      { id: 'dhcp', label: 'DHCP aktivieren für automatische Adressen' },
      { id: 'apipa', label: 'APIPA (169.254.x.x) verwenden' },
      { id: 'public-ip', label: 'Öffentliche Internet-IP am Drucker eintragen' },
    ],
    successExplanation:
      'Perfekt! Eine statische IP-Adresse verhindert, dass der Drucker nach Neustarts eine neue Adresse bekommt. Manuell trägt man dazu IP-Adresse, Subnetzmaske und Standard-Gateway ein.',
    wrongExplanation: {
      dhcp: 'DHCP vergibt dynamische Adressen, die sich nach Neustarts oder Lease-Ablauf ändern können.',
      apipa: 'APIPA ist nur eine Notfalladresse ohne Routing, wenn kein DHCP-Server antwortet.',
      'public-ip': 'Interne Bürodrucker gehören ins private LAN, nicht ungeschützt ans öffentliche Internet.',
    },
  },
  {
    id: 'ticket-guest-wifi',
    ticketNumber: 'HD-118',
    callerName: 'Svenja P. (Außendienst)',
    printerModel: 'Multifunktionsdrucker im Firmennetz',
    symptomTitle: 'Laptop sieht den Bürodrucker nicht mehr',
    userMessage:
      '„Alle anderen Kollegen drucken normal, und gestern ging es bei mir auch noch. Jetzt taucht der Drucker bei mir gar nicht mehr auf. Ich bin im Gäste-WLAN eingeloggt.“',
    requires3DClickHint: false,
    correctOptionId: 'corp-wifi',
    options: [
      { id: 'corp-wifi', label: 'Laptop mit dem Unternehmens-WLAN verbinden', linkedComponent: 'interface' },
      { id: 'driver', label: 'Druckertreiber neu vom Hersteller laden' },
      { id: 'powercycle', label: 'Drucker aus- und wieder einschalten' },
      { id: 'ap-reset', label: 'WLAN-Access-Point zurücksetzen' },
    ],
    successExplanation:
      'Richtig erkannt! Gäste-WLANs sind aus Sicherheitsgründen isoliert (VLAN-Trennung) und dürfen nicht auf interne Geräte wie Firmendrucker zugreifen.',
    wrongExplanation: {
      driver: 'Ohne Verbindung ins richtige Netzwerk hilft auch kein neuer Treiber.',
      powercycle: 'Alle anderen Kollegen können drucken – der Drucker läuft einwandfrei.',
      'ap-reset': 'Das WLAN funktioniert ja, der Laptop steckt nur im falschen (isolierten) Gast-Netzwerk.',
    },
  },
  {
    id: 'ticket-smb-smtp',
    ticketNumber: 'HD-122',
    callerName: 'Armin T. (Verwaltung)',
    printerModel: 'Multifunktionsgerät (Scan-to-Folder & Scan-to-Email)',
    symptomTitle: 'Scan-to-Folder klappt bei Altgerät unter Windows nicht',
    userMessage:
      '„Unser älterer Scanner soll Dokumente per SMB auf eine Windows-Freigabe legen. Benutzername und Passwort stimmen, aber auf dem PC taucht nichts auf!“',
    requires3DClickHint: false,
    correctOptionId: 'smb1',
    options: [
      { id: 'smb1', label: 'SMB 1.0 in den Windows-Funktionen aktivieren (Scan-to-Folder = SMB)', linkedComponent: 'adf' },
      { id: 'smtp', label: 'SMTP für den Ordnerzugriff nutzen' },
      { id: 'firewall-off', label: 'Windows-Firewall komplett abschalten' },
      { id: 'dollar', label: 'Ein $ ans Ende des Freigabenamens setzen' },
    ],
    successExplanation:
      'Genau! Ältere Multifunktionsgeräte nutzen oft nur SMB 1.0, das in modernem Windows standardmäßig deaktiviert ist. Merke auch: Scan-to-Folder nutzt SMB, Scan-to-Email nutzt SMTP!',
    wrongExplanation: {
      smtp: 'SMTP wird nur für den Versand von E-Mails (Scan-to-Email) verwendet, nicht für Ordnerfreigaben.',
      'firewall-off': 'Das Abschalten der Firewall ist ein Sicherheitsrisiko und behebt keine veraltete SMB-Version.',
      dollar: 'Ein $ macht eine Freigabe nur unsichtbar, löst aber das Protokollproblem nicht.',
    },
  },
  {
    id: 'ticket-firmware',
    ticketNumber: 'HD-126',
    callerName: 'Nadine B. (IT-Sicherheit)',
    printerModel: 'Neuer Netzwerk-Multifunktionsdrucker',
    symptomTitle: 'Sicherheitslücke gemeldet & Scan-to-Email fehlerhaft',
    userMessage:
      '„Der Hersteller warnt per E-Mail vor einer Sicherheitslücke im Gerät und liefert gleichzeitig einen Fix für fehlerhafte Scan-to-Email-Funktionen direkt am Gerät.“',
    requires3DClickHint: false,
    correctOptionId: 'firmware',
    options: [
      { id: 'firmware', label: 'Firmware des Druckers aktualisieren', linkedComponent: 'interface' },
      { id: 'driver', label: 'Windows-Druckertreiber neu installieren' },
      { id: 'disable-wifi', label: 'WLAN am Drucker abschalten' },
      { id: 'os-update', label: 'Windows-Update auf dem Client ausführen' },
    ],
    successExplanation:
      'Volltreffer! Die Firmware ist das interne Betriebssystem des Druckers. Updates schließen Sicherheitslücken direkt auf dem Gerät und beheben Fehler eigenständiger Funktionen wie Scan-to-Email.',
    wrongExplanation: {
      driver: 'Ein PC-Treiber steuert nur den Druck vom Computer, nicht die interne Gerätesicherheit oder Scan-to-Email.',
      'disable-wifi': 'Das Abschalten von WLAN behebt keine Sicherheitslücke im Systemcode.',
      'os-update': 'Ein PC-Betriebssystem-Update ändert nichts an der Software im Drucker.',
    },
  },
  {
    id: 'ticket-pcl-ps',
    ticketNumber: 'HD-130',
    callerName: 'Kevin H. (Marketing)',
    printerModel: 'Büro-Laserdrucker',
    symptomTitle: 'Drucker druckt seitenweise zufällige Sonderzeichen',
    userMessage:
      '„Immer wenn ich von meinem Laptop drucke, spuckt der Drucker endlos Seiten voller Hieroglyphen und wirrer Zeichen aus!“',
    requires3DClickHint: false,
    correctOptionId: 'driver-lang',
    options: [
      { id: 'driver-lang', label: 'Richtigen Druckertreiber (PCL / PostScript passend) installieren', linkedComponent: 'interface' },
      { id: 'malware', label: 'Virenscanner über den Laptop laufen lassen' },
      { id: 'bios', label: 'BIOS-Update auf dem Laptop einspielen' },
      { id: 'toner', label: 'Tonerkassette ersetzen', linkedComponent: 'toner' },
    ],
    successExplanation:
      'Genau! Seiten voller zufälliger Zeichen entstehen, wenn der Treiber die falsche Druckersprache spricht (z. B. PostScript an einen reinen PCL-Drucker sendet). Den passenden Treiber installieren löst es sofort.',
    wrongExplanation: {
      malware: 'Hieroglyphen auf Ausdrucken sind fast immer ein Treiber-Sprachproblem, kein Virus.',
      bios: 'Das BIOS hat keinen Einfluss auf die Übersetzung von Druckdaten.',
      toner: 'Der Toner druckt ja sichtbar – nur falsche Steuerzeichen wegen des Treibers.',
    },
  },
  {
    id: 'ticket-badging',
    ticketNumber: 'HD-134',
    callerName: 'Dr. Weber (Personalabteilung)',
    printerModel: 'Abteilungs-Multifunktionsdrucker',
    symptomTitle: 'Vertrauliche Kündigung blieb im Ausgabefach liegen',
    userMessage:
      '„Ich habe versehentlich ein geheimes Dokument im Ausgabefach vergessen! Außerdem sollen künftig nur Mitarbeiter kopieren dürfen. Was richten wir mit unserem NFC-Leser ein?“',
    requires3DClickHint: false,
    correctOptionId: 'badging',
    options: [
      { id: 'badging', label: 'Badging (NFC-Ausweis) & Benutzerauthentifizierung aktivieren', linkedComponent: 'interface' },
      { id: 'duplex', label: 'Duplexdruck einschalten', linkedComponent: 'duplex' },
      { id: 'wifi-enc', label: 'WLAN-Verschlüsselung erhöhen' },
      { id: 'sharing', label: 'Druckerfreigabe im Netzwerk aktivieren' },
    ],
    successExplanation:
      'Perfekt! Beim „Badging“ hält der Nutzer seinen NFC/RFID-Mitarbeiterausweis (Badge) an den Drucker, damit der Auftrag erst gedruckt wird, wenn er direkt davor steht. So bleiben geheime Dokumente geschützt.',
    wrongExplanation: {
      duplex: 'Beidseitiger Druck spart Papier, verhindert aber nicht, dass Fremde Ausdrucke mitnehmen.',
      'wifi-enc': 'Schützt den Funkweg, nicht aber bereits gedruckte Blätter im offenen Ausgabefach.',
      sharing: 'Eine Netzwerkfreigabe macht den Drucker für noch mehr Nutzer erreichbar.',
    },
  },
  {
    id: 'ticket-tray-align',
    ticketNumber: 'HD-138',
    callerName: 'Paula G. (Gesundheitsamt)',
    printerModel: 'Büro-Laserdrucker',
    symptomTitle: 'Drucker fordert Papier trotz vollem 11×17-Fach / Formular verschoben',
    userMessage:
      '„Obwohl 11×17-Zoll-Papier im Fach liegt, meldet der Drucker ‚Papier einlegen‘ (nachdem vorhin Karton gedruckt wurde). Und auf Formularen rutscht der Text nach unten!“',
    requires3DClickHint: false,
    correctOptionId: 'tray-align',
    options: [
      { id: 'tray-align', label: 'Facheinstellungen (Papierformat) & Ausrichtung (Alignment) prüfen', linkedComponent: 'duplex' },
      { id: 'usb', label: 'Auf USB-Kabel umsteigen' },
      { id: 'fuser', label: 'Fixiereinheit tauschen', linkedComponent: 'fuser' },
      { id: 'less-pages', label: 'Weniger Seiten auf einmal drucken' },
    ],
    successExplanation:
      'Genau richtig! Nach Karton oder Spezialformaten müssen die Facheinstellungen (Tray Settings) wieder auf das eingelegte Format angepasst werden. Verschobene Formulare korrigiert man über die Ausrichtungseinstellungen (Alignment).',
    wrongExplanation: {
      usb: 'Es liegt kein Verbindungsproblem vor – der Drucker empfängt den Auftrag bereits.',
      fuser: 'Die Fixiereinheit schmilzt nur Toner ein und prüft kein Papierformat.',
      'less-pages': 'Die Seitenanzahl löst weder falsche Schacht-Zuordnungen noch verschobene Ränder.',
    },
  },
  {
    id: 'ticket-duplex-landscape',
    ticketNumber: 'HD-142',
    callerName: 'Markus R. (Controlling)',
    printerModel: 'Büro-Laserdrucker',
    symptomTitle: 'Breite Tabelle läuft im Duplexdruck über',
    userMessage:
      '„Meine Excel-Tabelle soll unbedingt beidseitig (Duplex) gedruckt werden, aber die rechten Spalten brechen immer hässlich auf die Rückseite um!“',
    requires3DClickHint: false,
    correctOptionId: 'landscape',
    options: [
      { id: 'landscape', label: 'Seitenausrichtung auf Querformat (Landscape) ändern', linkedComponent: 'duplex' },
      { id: 'no-duplex', label: 'Duplexdruck komplett deaktivieren' },
      { id: 'driver', label: 'Anderen Druckertreiber installieren' },
      { id: 'fuser', label: 'Fixiertemperatur senken', linkedComponent: 'fuser' },
    ],
    successExplanation:
      'Sehr gut! Durch das Ändern der Seitenausrichtung von Hochformat (Portrait) auf Querformat (Landscape) passen mehr Spalten nebeneinander, und der Duplexdruck bleibt erhalten.',
    wrongExplanation: {
      'no-duplex': 'Der Nutzer möchte ausdrücklich weiterhin beidseitig drucken – und es macht die Zeile nicht breiter.',
      driver: 'Ein anderer Treiber verändert nicht das Seitenlayout der Tabelle.',
      fuser: 'Die Temperatur hat keinerlei Auswirkung auf Tabellenränder.',
    },
  },
  {
    id: 'ticket-power-intl',
    ticketNumber: 'HD-146',
    callerName: 'Oliver Z. (Auslandsbüro)',
    printerModel: 'Neu gelieferter Bürodrucker',
    symptomTitle: 'Display zeigt beim Einschalten nur leeren weißen Bildschirm',
    userMessage:
      '„Wir haben den neuen Drucker hier in unserem internationalen Büro angeschlossen, aber beim Einschalten leuchtet das Display nur komplett weiß!“',
    requires3DClickHint: false,
    correctOptionId: 'power',
    options: [
      { id: 'power', label: 'Stromanforderungen / Netzspannung (110 V vs. 230 V) prüfen', linkedComponent: 'interface' },
      { id: 'lan-port', label: 'Netzwerkport-Konnektivität prüfen' },
      { id: 'ad-ou', label: 'Organisationseinheit im Active Directory prüfen' },
      { id: 'firmware', label: 'Firmware aktualisieren' },
    ],
    successExplanation:
      'Treffer! In internationalen Büros unterscheiden sich die Netzspannungen (z. B. 110 V in den USA vs. 230 V in Europa). Falsche Spannungseinstellungen führen genau zu solchen Elektronik- und Displayausfällen.',
    wrongExplanation: {
      'lan-port': 'Ein weißer Hardware-Bildschirm beim Start hat nichts mit dem Netzwerkkabel zu tun.',
      'ad-ou': 'Active-Directory-Gruppen beeinflussen kein lokales LCD-Panel.',
      firmware: 'Bei fehlerhafter Stromversorgung lässt sich gar keine Firmware einspielen.',
    },
  },
  {
    id: 'ticket-inkjet',
    ticketNumber: 'HD-150',
    callerName: 'Lukas W. (Grafik)',
    printerModel: 'Tisch-Tintenstrahldrucker (Inkjet)',
    symptomTitle: 'Schlechte Druckqualität & Doppelkonturen trotz neuer Patrone',
    userMessage:
      '„Obwohl ich gerade eine brandneue Tintenpatrone eingesetzt habe, fehlen Linien und Texte haben Doppelkonturen!“',
    requires3DClickHint: false,
    correctOptionId: 'calibration',
    options: [
      { id: 'calibration', label: 'Druckköpfe reinigen & Kalibrierung durchführen' },
      { id: 'paper-type', label: 'Papiertyp in den Einstellungen ändern' },
      { id: 'ribbon', label: 'Farbband wechseln' },
      { id: 'drum', label: 'Bildtrommel austauschen', linkedComponent: 'drum' },
    ],
    successExplanation:
      'Richtig! Wenn nach dem Patronenwechsel Streifen bleiben, sind Düsen eingetrocknet -> Druckköpfe reinigen (Printhead Cleaning) und gegen Doppelkonturen Kalibrierung (Calibration) starten.',
    wrongExplanation: {
      'paper-type': 'Ein anderer Papiertyp löst keine verstopften Düsen.',
      ribbon: 'Ein Farbband gibt es nur beim Nadeldrucker.',
      drum: 'Bildtrommeln stecken nur in Laserdruckern.',
    },
  },
  {
    id: 'ticket-thermal',
    ticketNumber: 'HD-154',
    callerName: 'Maren B. (Kasse & Versand)',
    printerModel: 'Thermo-Bondrucker',
    symptomTitle: 'Vertikale weiße Linien auf dem Kassenbon (oder Bon komplett leer)',
    userMessage:
      '„Unser Thermo-Bondrucker druckt seit heute durchgehende weiße Längsstreifen in jeden Kassenbon! (Letzte Woche war sogar der ganze Bon weiß.)“',
    requires3DClickHint: false,
    correctOptionId: 'thermal-heat',
    options: [
      { id: 'thermal-heat', label: 'Heizelement reinigen (bei weißem Bon: Thermopapier umdrehen)' },
      { id: 'ink', label: 'Tintenpatrone nachfüllen' },
      { id: 'maint-kit', label: 'Laser-Wartungskit installieren' },
      { id: 'fuser', label: 'Fixiereinheit tauschen', linkedComponent: 'fuser' },
    ],
    successExplanation:
      'Genau! Staub oder Papierreste auf einzelnen Punkten der Thermoleiste verhindern das Erhitzen -> vertikale weiße Linien -> Heizelement reinigen! (Ist der ganze Bon weiß, liegt das Thermopapier verkehrt herum.)',
    wrongExplanation: {
      ink: 'Thermodrucker verwenden weder Tinte noch Toner.',
      'maint-kit': 'Ein Laser-Wartungskit passt nicht in einen Thermo-Bondrucker.',
      fuser: 'Die Fixiereinheit gibt es nur bei Laserdruckern.',
    },
  },
  {
    id: 'ticket-dotmatrix',
    ticketNumber: 'HD-158',
    callerName: 'Bernd S. (Kfz-Werkstatt)',
    printerModel: 'Nadeldrucker (Impact / Dot Matrix)',
    symptomTitle: 'Oberstes Blatt leer, Durchschläge drucken (oder Druck wird blasser)',
    userMessage:
      '„Auf unseren mehrteiligen Durchschlagformularen bleibt die oberste Seite leer – die unteren Durchschläge sind aber lesbar! Und letzte Woche wurde schon alles immer heller.“',
    requires3DClickHint: false,
    correctOptionId: 'ribbon',
    options: [
      { id: 'ribbon', label: 'Farbband (Print Ribbon) austauschen' },
      { id: 'pins', label: 'Auf gebrochene Drucknadeln prüfen' },
      { id: 'printhead', label: 'Tinten-Druckkopf reinigen' },
      { id: 'maint-kit', label: 'Laser-Wartungskit installieren' },
    ],
    successExplanation:
      'Genau richtig! Ist das Farbband ausgetrocknet, schlagen die Nadeln zwar mechanisch durch und erzeugen den Durchschlag auf den unteren Kopien, aber die oberste Seite bekommt keine Farbe mehr. Austausch des Print Ribbons löst das Problem!',
    wrongExplanation: {
      pins: 'Gebrochene Nadeln würden waagerechte weiße Lücken auf ALLEN Kopien inklusive Durchschlägen hinterlassen.',
      printhead: 'Würde der Druckkopf blockieren, wären auch die unteren Durchschläge fehlerhaft.',
      'maint-kit': 'Nadeldrucker verwenden keine Laser-Wartungskits.',
    },
  },
];
