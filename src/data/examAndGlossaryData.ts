import { PrinterComponentId } from './printerData';

export interface ExamOption {
  id: string;
  text: string;
  correct: boolean;
  exp: string;
}

export interface ExamQuestion {
  id: number;
  topic: string;
  question: string;
  multi: boolean;
  relatedComponent?: PrinterComponentId;
  options: ExamOption[];
}

export interface GlossaryEntry {
  term: string;
  german: string;
  category: 'Laserdrucker' | 'Andere Druckertypen' | 'Netzwerk & Protokolle' | 'Wartung & Sicherheit';
  explanation: string;
  relatedComponent?: PrinterComponentId;
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 3,
    topic: 'Scanner & Kopieren',
    relatedComponent: 'adf',
    question:
      'Ein Techniker sucht bei einem All-in-One-Laserdrucker die Ursache dafür, dass beim Kopieren und Scannen eine vertikale Linie gedruckt wird. Beim Drucken oder Empfangen von Faxen ist die Ausgabe des Druckers korrekt. Was sollte der Techniker untersuchen, um die Ursache des Problems zu ermitteln?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Einzugsrollen',
        correct: false,
        exp: 'Falsch. Beschädigte Einzugsrollen verursachen Papierstaus oder Einzugsfehler, jedoch keine vertikalen Streifen beim Scannen.',
      },
      {
        id: 'B',
        text: 'Den Corona-Draht',
        correct: false,
        exp: 'Falsch. Ein verschmutzter Corona-Draht führt zu wiederkehrenden Mustern oder Streifen auf allen Druckausgaben (auch bei Faxen und normalen Ausdrucken).',
      },
      {
        id: 'C',
        text: 'Den Dokumenteneinzug (ADF) / Flachbettglas',
        correct: true,
        exp: 'Richtig. Schmutz oder ein Kratzer auf dem Glas des Dokumenteneinzugs hinterlässt beim Durchlauf der Vorlage eine durchgehende Linie auf dem Scan. Drucke und Empfangsfaxe nutzen das Scanglas nicht und bleiben daher sauber.',
      },
      {
        id: 'D',
        text: 'Die Trommeleinheit',
        correct: false,
        exp: 'Falsch. Ein Trommelschaden würde sich auf alle Druckaufträge auswirken, nicht nur auf Kopien/Scans.',
      },
    ],
  },
  {
    id: 18,
    topic: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    question:
      'Ein Benutzer möchte Dateien von einem Auslandsbüro aus über einen freigegebenen Netzwerkordner drucken. Der Laptop des Benutzers hat keine öffentlich zugängliche Internetverbindung. Was kann verwendet werden, um vom freigegebenen Netzwerkordner aus zu drucken?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'ADF',
        correct: false,
        exp: 'Falsch. ADF (Automatic Document Feeder) ist eine Hardwarekomponente zum automatischen Einziehen von Papier.',
      },
      {
        id: 'B',
        text: 'USB',
        correct: false,
        exp: 'Falsch. USB erfordert eine direkte Kabelverbindung zum Drucker oder Host.',
      },
      {
        id: 'C',
        text: 'PCL',
        correct: false,
        exp: 'Falsch. PCL ist eine Druckersprache zur Aufbereitung von Steuerbefehlen, kein Netzwerkprotokoll zur Ordnerfreigabe.',
      },
      {
        id: 'D',
        text: 'SMB',
        correct: true,
        exp: 'Richtig. Server Message Block (SMB) ist das Standardnetzwerkprotokoll für Datei- und Druckerfreigaben in lokalen Netzwerken (LAN/VPN).',
      },
    ],
  },
  {
    id: 24,
    topic: 'Wartung',
    relatedComponent: 'pickup',
    question:
      'Der Drucker in einem Hauptbüro staut sich wiederholt. Welche Aufgabe sollte ein Support-Techniker ausführen, um das Problem zu lösen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Ein Wartungskit anwenden.',
        correct: true,
        exp: 'Richtig. Ein Wartungskit (Maintenance Kit) enthält frische Einzugsrollen, Trennpads und Fixierkomponenten, deren Abnutzung die Ursache für wiederholte Staus ist.',
      },
      {
        id: 'B',
        text: 'Toner- oder Tintenpatronen austauschen.',
        correct: false,
        exp: 'Falsch. Verbrauchsmaterialien beeinflussen die Farbmenge, lösen jedoch keine mechanischen Einzugsprobleme.',
      },
      {
        id: 'C',
        text: 'Ein neues Farbband installieren.',
        correct: false,
        exp: 'Falsch. Farbbänder werden in Nadeldruckern genutzt und steuern das Schriftbild, nicht den Papiertransport.',
      },
      {
        id: 'D',
        text: 'Den Druckkopf wechseln.',
        correct: false,
        exp: 'Falsch. Ein defekter Druckkopf verschlechtert das Druckbild, erzeugt aber keine Papierstaus.',
      },
    ],
  },
  {
    id: 25,
    topic: 'Sicherheit & Firmware',
    relatedComponent: 'interface',
    question:
      'Ein Techniker installiert einen neuen Drucker. Nach der Registrierung des Druckers erhält der Techniker eine E-Mail des Herstellers, in der auf eine behebbare Sicherheitslücke hingewiesen wird. Welchen Schritt sollte der Techniker als Nächstes durchführen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die drahtlose Konnektivität deaktivieren.',
        correct: false,
        exp: 'Falsch. Schränkt die Funktion ein, behebt aber nicht die eigentliche Schwachstelle im Systemcode.',
      },
      {
        id: 'B',
        text: 'Audit-Protokollierung aktivieren.',
        correct: false,
        exp: 'Falsch. Dient nur der Aufzeichnung von Ereignissen, schließt die Sicherheitslücke jedoch nicht.',
      },
      {
        id: 'C',
        text: 'Die Firmware aktualisieren.',
        correct: true,
        exp: 'Richtig. Hersteller stellen Firmware-Updates bereit, um bekannte Sicherheitslücken direkt im Betriebssystem des Geräts zu schließen.',
      },
      {
        id: 'D',
        text: 'Das Standard-Gateway auf dem Drucker deaktivieren.',
        correct: false,
        exp: 'Falsch. Verhindert Routing außerhalb des Subnetzes, löst jedoch das zugrunde liegende Softwareproblem nicht.',
      },
    ],
  },
  {
    id: 31,
    topic: 'Laserdrucker-Hardware',
    relatedComponent: 'fuser',
    question:
      'Ein Benutzer druckt einen Auftrag von einem Laserdrucker. Er wischt über die Seite, und Wörter und Bilder lösen sich ab. Der Techniker tauscht die Tonerkassette aus, aber das Problem besteht weiterhin. Welche Komponente sollte der Techniker als Nächstes austauschen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Fixiereinheit (Fuser)',
        correct: true,
        exp: 'Richtig. Die Fixiereinheit schmilzt das Tonerpulver mittels Hitze und Druck in die Papierfasern ein. Funktioniert sie nicht, bleibt der Toner lose auf dem Papier liegen.',
      },
      {
        id: 'B',
        text: 'Trommel',
        correct: false,
        exp: 'Falsch. Die Trommel überträgt das Tonerbild elektrostatisch, brennt es aber nicht ein.',
      },
      {
        id: 'C',
        text: 'Entwicklerwalze',
        correct: false,
        exp: 'Falsch. Sie transportiert den Toner aus der Kassette zur Trommel.',
      },
      {
        id: 'D',
        text: 'Entladungslampe',
        correct: false,
        exp: 'Falsch. Sie löscht die Restladung auf der Trommel nach dem Druckvorgang.',
      },
    ],
  },
  {
    id: 46,
    topic: 'Netzwerk & IP',
    relatedComponent: 'interface',
    question:
      'Ein Kunde muss einen neuen Drucker in seinem Netzwerk installieren. Der Kunde berichtet, dass Benutzer bei früheren Druckern zeitweise Verbindungsprobleme hatten. Was sollte der Techniker auf dem neuen Drucker konfigurieren, um dies zu verhindern?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Gateway-IP-Adresse',
        correct: false,
        exp: 'Falsch. Gibt lediglich den Router für verbindungsexterne Netzwerke an.',
      },
      {
        id: 'B',
        text: 'DHCP-IP-Adresse',
        correct: false,
        exp: 'Falsch. Dynamische Adressen ändern sich regelmäßig, was zu Verbindungsabbrüchen bei eingerichteten Clients führt.',
      },
      {
        id: 'C',
        text: 'Statische IP-Adresse',
        correct: true,
        exp: 'Richtig. Eine feste IP stellt sicher, dass der Drucker dauerhaft unter derselben Adresse im Netzwerk erreichbar bleibt.',
      },
      {
        id: 'D',
        text: 'Öffentliche IP-Adresse',
        correct: false,
        exp: 'Falsch. Drucker sollten im lokalen Netzwerk (private IP) betrieben werden, um nicht direkt Angriffen aus dem Internet ausgesetzt zu sein.',
      },
    ],
  },
  {
    id: 63,
    topic: 'Druckeinstellungen',
    relatedComponent: 'duplex',
    question:
      'Ein Benutzer druckt eine Tabelle im Duplexmodus. Die Tabelle ist schwer lesbar, da einige Spalten auf die zweite Seite des Blattes überlaufen. Was sollte der Benutzer tun, um das Problem zu vermeiden, aber trotzdem beidseitig zu drucken?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Duplexdruck deaktivieren.',
        correct: false,
        exp: 'Falsch. Löst das Breitenproblem nicht und verhindert beidseitiges Drucken.',
      },
      {
        id: 'B',
        text: 'Eine kleinere Schriftgröße in der Tabelle verwenden.',
        correct: false,
        exp: 'Unzweckmäßig. Verändert das Format des Dokuments unnötig und erschwert die Lesbarkeit.',
      },
      {
        id: 'C',
        text: 'Die Seitenausrichtung ändern.',
        correct: true,
        exp: 'Richtig. Das Drehen von Hochformat (Portrait) auf Querformat (Landscape) bietet mehr horizontale Breite für breite Tabellen.',
      },
      {
        id: 'D',
        text: 'Einen anderen Druckertreiber verwenden.',
        correct: false,
        exp: 'Falsch. Treiber beeinflussen die Interpretation des Druckbefehls, ändern aber nicht das Papierlayout der Anwendung.',
      },
    ],
  },
  {
    id: 74,
    topic: 'Wartung',
    relatedComponent: 'pickup',
    question:
      'Ein Benutzer meldet, dass Ausdrucke von einem Laserdrucker Streifen und Schmierstellen aufweisen. Der Drucker zieht zudem gelegentlich das Papier falsch ein. Welche Komponente sollte ein Techniker austauschen, um dies zu beheben?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Fixiereinheit (Fuser)',
        correct: false,
        exp: 'Unvollständig. Löst eventuell Schmierstellen, behebt jedoch keine Papiereinzugsprobleme.',
      },
      {
        id: 'B',
        text: 'Wartungskit',
        correct: true,
        exp: 'Richtig. Enthält Rollen gegen die Fehleinzüge sowie Reinigungselemente/Fixierkomponenten gegen die Streifen und Schmierstellen.',
      },
      {
        id: 'C',
        text: 'Corona-Draht',
        correct: false,
        exp: 'Falsch. Betrifft nur die elektrostatische Aufladung, nicht den Papiereinzug.',
      },
      {
        id: 'D',
        text: 'Tonerkassette',
        correct: false,
        exp: 'Falsch. Behebt keine mechanischen Einzugsfehler.',
      },
    ],
  },
  {
    id: 79,
    topic: 'Wartung',
    relatedComponent: 'pickup',
    question:
      'Ein Helpdesk-Techniker muss an einem Drucker mit hohem Durchsatz arbeiten. Benutzer haben gelegentliche Papierstaus und Schmierstellen auf gedruckten Dokumenten gemeldet. Was sollte der Techniker als Nächstes tun, um diese Probleme zu beheben?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Einen vollständigen Werksreset durchführen.',
        correct: false,
        exp: 'Falsch. Setzt Softwareeinstellungen zurück, behebt jedoch keine physischen Verschmutzungen.',
      },
      {
        id: 'B',
        text: 'Die Rollen prüfen und reinigen.',
        correct: true,
        exp: 'Richtig. Schmutz auf Einzugs- und Transportrollen führt zu Rutschen (Papierstau) und Tonerübertragung (Schmierstellen). Erste, kostengünstige Maßnahme.',
      },
      {
        id: 'C',
        text: 'Alle Tinten- oder Tonerkassetten austauschen.',
        correct: false,
        exp: 'Unnötig. Patronen verursachen bei Verschmutzung keine Papierstaus.',
      },
      {
        id: 'D',
        text: 'Die Fixiereinheit austauschen.',
        correct: false,
        exp: 'Voreilig. Sollte erst nach Reinigung der mechanischen Transportwege in Betracht gezogen werden.',
      },
    ],
  },
  {
    id: 85,
    topic: 'Laserdrucker-Hardware',
    relatedComponent: 'fuser',
    question:
      'Bilder und Text von einem Laserdrucker verschmieren bei Berührung. Was sollte ein Techniker zur Behebung tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Tonerfüllstände prüfen.',
        correct: false,
        exp: 'Falsch. Der Füllstand hat keinen Einfluss auf die Haftung des Toners auf dem Papier.',
      },
      {
        id: 'B',
        text: 'Ein Wartungskit installieren.',
        correct: false,
        exp: 'Zu umfangreich. Enthält zwar oft eine Fixiereinheit, der gezielte Austausch der Ursache ist jedoch primär gefordert.',
      },
      {
        id: 'C',
        text: 'Die Fixiereinheit austauschen.',
        correct: true,
        exp: 'Richtig. Mangelnde Hitze/Druck der Fixiereinheit verhindert das dauerhafte Schmelzen des Toners.',
      },
      {
        id: 'D',
        text: 'Die Einzugsrollen reinigen.',
        correct: false,
        exp: 'Falsch. Beseitigt Einzugsprobleme, aber keinen Schmelzdefekt.',
      },
    ],
  },
  {
    id: 92,
    topic: 'Laserdrucker-Hardware',
    relatedComponent: 'pickup',
    question:
      'Ein Techniker muss herausfinden, warum ein Laserdrucker beim Drucken zeitweise kein Papier einzieht. Der Techniker überprüft das Problem durch mehrere Kopier- und Drucktests. Was sollte der Techniker als Nächstes tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Druckertreiber aktualisieren.',
        correct: false,
        exp: 'Falsch. Ein physisches Einzugsproblem ist mechanischer Natur.',
      },
      {
        id: 'B',
        text: 'Die richtige Papiergröße auswählen.',
        correct: false,
        exp: 'Falsch. Falsche Größen führen zu Fehlermeldungen im Display, nicht zu rutschenden Einzugsrollen.',
      },
      {
        id: 'C',
        text: 'Die Einzugsrollen reinigen.',
        correct: true,
        exp: 'Richtig. Papierstaub verringert den Grip der Gummirollen; das Reinigen stellt die Reibung wieder her.',
      },
      {
        id: 'D',
        text: 'Die Tonerkassette austauschen.',
        correct: false,
        exp: 'Falsch. Hat keine Funktion beim Papiereinzug.',
      },
    ],
  },
  {
    id: 99,
    topic: 'Netzwerk & Protokolle',
    relatedComponent: 'adf',
    question:
      'Ein Techniker richtet eine Scan-to-SMB-Funktion auf einem Multifunktionsdrucker ein. Welchen Verbindungstyp sollte der Techniker konfigurieren?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'E-Mail-Server',
        correct: false,
        exp: 'Falsch. Wäre für Scan-to-Email (SMTP) erforderlich.',
      },
      {
        id: 'B',
        text: 'SFTP-Verbindung',
        correct: false,
        exp: 'Falsch. Nutzt SSH zur gesicherten Dateiübertragung, nicht das SMB-Protokoll.',
      },
      {
        id: 'C',
        text: 'Netzwerkfreigabe',
        correct: true,
        exp: 'Richtig. SMB dient dem Dateizugriff auf freigegebene Ordner (Netzwerkfreigaben) im LAN.',
      },
      {
        id: 'D',
        text: 'Druckdienste',
        correct: false,
        exp: 'Falsch. Verwalten eingehende Druckaufträge, keine abgehenden Scans.',
      },
    ],
  },
  {
    id: 100,
    topic: 'Tintenstrahldrucker',
    question:
      'Ein Benutzer meldet schlechte Druckqualität bei seinem Tischdrucker. Ein Techniker tauscht die Tintenpatrone aus, aber das Problem bleibt bestehen. Was sollte der Techniker als Nächstes tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Einzugsrollen austauschen',
        correct: false,
        exp: 'Falsch. Beeinflusst nur den Transport, nicht das Schriftbild.',
      },
      {
        id: 'B',
        text: 'Die Druckköpfe reinigen',
        correct: true,
        exp: 'Richtig. Verstopfte Düsen verhindern den korrekten Tintenaustritt und erzeugen Streifen oder blasse Farben.',
      },
      {
        id: 'C',
        text: 'Den Papiertyp wechseln',
        correct: false,
        exp: 'Falsch. Verbessert eventuell das Aufsaugverhalten, löst aber keine verstopften Düsen.',
      },
      {
        id: 'D',
        text: 'Das Farbband wechseln',
        correct: false,
        exp: 'Falsch. Farbbänder existieren nur bei Nadeldruckern.',
      },
    ],
  },
  {
    id: 113,
    topic: 'Papierfach & Formate',
    relatedComponent: 'duplex',
    question:
      'Ein Benutzer erhält ständig eine Fehlermeldung beim Versuch, einen Brief zu drucken. Der Drucker wird normalerweise zum Drucken von Karten und Einladungen verwendet. Der Benutzer versucht, von einem anderen Computer aus zu drucken, aber das Problem bleibt bestehen. Was sollte der Benutzer zur Behebung tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Weniger Seiten drucken.',
        correct: false,
        exp: 'Falsch. Die Seitenzahl hat keinen Einfluss auf Format-Mismatches.',
      },
      {
        id: 'B',
        text: 'Auf Karton drucken.',
        correct: false,
        exp: 'Falsch. Gefragter Inhalt ist ein Brief auf Normalpapier.',
      },
      {
        id: 'C',
        text: 'Die Rollen austauschen.',
        correct: false,
        exp: 'Falsch. Es liegt kein mechanischer Defekt vor.',
      },
      {
        id: 'D',
        text: 'Die Papierfacheinstellung ändern.',
        correct: true,
        exp: 'Richtig. Der Drucker erwartet nach der Konfiguration für dicken Karton die Umstellung der Papiersorte/Größe auf Standard-Briefpapier im Schacht.',
      },
    ],
  },
  {
    id: 117,
    topic: 'Firmware & Software',
    relatedComponent: 'interface',
    question:
      'Ein Multifunktionsdrucker in einem kleinen Büro hatte kürzlich Probleme mit der Scan-to-Email-Funktion. Der Hersteller hat ein Update bereit, um die Druckerprobleme zu beheben. Was würde ein Techniker höchstwahrscheinlich einsetzen, um das Problem zu beheben?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Firmware',
        correct: true,
        exp: 'Richtig. Das interne Betriebssystem des Druckers steuert eigenständige Funktionen wie Scan-to-Email direkt auf dem Gerät.',
      },
      {
        id: 'B',
        text: 'Treiber',
        correct: false,
        exp: 'Falsch. Treiber steuern die Kommunikation vom PC zum Drucker, nicht geräteinterne Netzwerkdienste.',
      },
      {
        id: 'C',
        text: 'Betriebssystem-Update',
        correct: false,
        exp: 'Falsch. Bezieht sich auf den Client-PC, nicht auf die interne Logik des Multifunktionsgeräts.',
      },
      {
        id: 'D',
        text: 'HSM',
        correct: false,
        exp: 'Falsch. Hardware-Sicherheitsmodule dienen der kryptografischen Schlüsselverwaltung.',
      },
    ],
  },
  {
    id: 121,
    topic: 'Sicherheit & Zugriff',
    relatedComponent: 'interface',
    question:
      'Ein Techniker richtet ein neues Multifunktionsgerät ein, das über eine gemeinsam genutzte Netzwerkverbindung verwendet werden soll. Die Kopierfunktionen sollen nur für Büromitarbeiter zugänglich sein. Was sollte der Techniker tun, nachdem das Gerät für die Nutzung eines Druckservers in der Domäne konfiguriert wurde?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'SMTP-Implementierung',
        correct: false,
        exp: 'Falsch. Dient dem Versenden von E-Mails.',
      },
      {
        id: 'B',
        text: 'Firmware-Update',
        correct: false,
        exp: 'Falsch. Aktualisiert den Code, sperrt aber keine unbefugten Benutzer ab.',
      },
      {
        id: 'C',
        text: 'Benutzerauthentifizierung',
        correct: true,
        exp: 'Richtig. Fordert eine Anmeldung (z. B. per PIN, Karte oder Domänen-Konto), bevor lokale Funktionen wie Kopieren freigeschaltet werden.',
      },
      {
        id: 'D',
        text: 'SMB-Konfiguration',
        correct: false,
        exp: 'Falsch. Wird für Dateifreigaben genutzt.',
      },
    ],
  },
  {
    id: 128,
    topic: 'Sicherheit & Zugriff',
    relatedComponent: 'interface',
    question:
      'Ein Techniker richtet sicheres Drucken ein und konfiguriert ein NFC-Gerät, das Benutzer für den Zugang authentifiziert. Was würde das NFC-Gerät am wahrscheinlichsten zur Authentifizierung verwenden?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Badges (Ausweise)',
        correct: true,
        exp: 'Richtig. RFID/NFC-Mitarbeiterausweise werden an den Leser gehalten, um Druckaufträge freizugeben.',
      },
      {
        id: 'B',
        text: 'Passwort',
        correct: false,
        exp: 'Falsch. Wird manuell über Tastatur/Display eingegeben, nicht berührungslos via NFC übertragen.',
      },
      {
        id: 'C',
        text: 'Passcode',
        correct: false,
        exp: 'Falsch. Numerische Eingabe ohne Kurzstrecken-Funk.',
      },
      {
        id: 'D',
        text: 'Biometrie',
        correct: false,
        exp: 'Falsch. Basiert auf Fingerabdruck oder Gesichtserkennung, nicht auf NFC.',
      },
    ],
  },
  {
    id: 145,
    topic: 'Warteschlange & Fächer',
    relatedComponent: 'pickup',
    question:
      'Ein Netzwerkdrucker gibt den letzten Druckauftrag eines Benutzers nicht aus der Warteschlange frei, aber die anderen Druckaufträge des Benutzers wurden kurz zuvor erfolgreich gedruckt. Andere Benutzer können problemlos drucken. Was sollte der Benutzer zuerst prüfen, um das Problem zu lösen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Ob der Druckauftrag einem Fach oder manuellen Einzug zugeordnet ist',
        correct: true,
        exp: 'Richtig. Druckaufträge für Spezialmedien warten in der Warteschlange, bis das entsprechende Fach bestückt oder bestätigt wird.',
      },
      {
        id: 'B',
        text: 'Ob Computer und Drucker mit demselben Netzwerk verbunden sind',
        correct: false,
        exp: 'Unwahrscheinlich. Die vorherigen Aufträge wurden bereits erfolgreich gedruckt.',
      },
      {
        id: 'C',
        text: 'Ob die Druckwarteschlange voll ist und keine weiteren Aufträge zulässt',
        correct: false,
        exp: 'Falsch. Einzelne Aufträge blockieren nicht wegen Kapazitätsgrenzen, sondern wegen Statusanforderungen.',
      },
      {
        id: 'D',
        text: 'Ob der Drucker wegen leerer Fächer gestoppt hat',
        correct: false,
        exp: 'Unvollständig. Wenn ein Standardfach leer wäre, beträfe dies in der Regel alle nachfolgenden Benutzer; wartet der Drucker gezielt auf eine manuelle Zufuhr für diesen einen Auftrag, betrifft es nur diesen.',
      },
    ],
  },
  {
    id: 154,
    topic: 'Netzwerk & WLAN',
    relatedComponent: 'interface',
    question:
      'Ein Benutzer kann den Multifunktionsdrucker des Büros nicht in den Druckoptionen seines Laptops sehen. Er hat in der Vergangenheit bereits erfolgreich auf diesem Gerät gedruckt. Der Laptop des Benutzers ist mit dem Gäste-WLAN-Netzwerk verbunden. Andere Benutzer, sowohl drahtlos als auch kabelgebunden, können den Drucker sehen und darauf drucken. Was behebt das Problem?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Drucker neu starten (Power-Cycle), um die Konnektivität aufzufrischen',
        correct: false,
        exp: 'Falsch. Behebt keine Netzwerksegmentierung.',
      },
      {
        id: 'B',
        text: 'Den nächstgelegenen WLAN-Access-Point zurücksetzen',
        correct: false,
        exp: 'Falsch. Das WLAN funktioniert, jedoch sind die Netze getrennt.',
      },
      {
        id: 'C',
        text: 'Den Druckertreiber von der Website des Herstellers herunterladen',
        correct: false,
        exp: 'Falsch. Ohne Netzwerkzugriff hilft auch kein Treiber.',
      },
      {
        id: 'D',
        text: 'Den Laptop mit dem Unternehmens-WLAN verbinden',
        correct: true,
        exp: 'Richtig. Gäste-WLANs sind isoliert (VLAN-Trennung) und haben keinen Zugriff auf interne Ressourcen wie Drucker.',
      },
    ],
  },
  {
    id: 155,
    topic: 'Netzwerk & IP',
    relatedComponent: 'interface',
    question:
      'Ein Techniker erhält nach einem Netzwerkausfall eine Benachrichtigung, dass der Drucker nicht erreichbar ist. Welche Druckereinstellung sollte der Techniker implementieren, um dies künftig zu verhindern?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Gateway',
        correct: false,
        exp: 'Falsch. Steuert nur den Weg außerhalb des eigenen Subnetzes.',
      },
      {
        id: 'B',
        text: 'Statische IP',
        correct: true,
        exp: 'Richtig. Verhindert, dass der Drucker nach dem Ausfall eine neue IP vom DHCP-Server zugewiesen bekommt.',
      },
      {
        id: 'C',
        text: 'APIPA',
        correct: false,
        exp: 'Falsch. Automatische Notfall-IP (169.254.x.x), wenn kein DHCP-Server erreichbar ist; verhindert sauberes Routing.',
      },
      {
        id: 'D',
        text: 'DHCP',
        correct: false,
        exp: 'Falsch. Führt dazu, dass Adressen nach Neustarts wechseln können.',
      },
    ],
  },
  {
    id: 158,
    topic: 'Print Spooler',
    relatedComponent: 'interface',
    question:
      'Ein Benutzer bittet einen Techniker um Hilfe bei einem Drucker, der aufgehört hat zu drucken. Der Benutzer erklärt, dass die Druckaufträge von einer Website erzeugt werden und schwer neu zu erstellen sind. Als der Techniker sich per Remote-Zugriff mit dem Computer des Benutzers verbindet, sieht er viele Aufträge in der Warteschlange. Das Problem besteht auch nach einem Hard-Reset des Druckers weiterhin. Was würde das Problem am wahrscheinlichsten beheben?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Druckerspooler-Dienst auf dem lokalen Computer neu starten',
        correct: true,
        exp: 'Richtig. Löscht/hängt blockierte Druckaufträge auf dem PC aus und startet die Verarbeitung neu, ohne Datenverlust auf der Webseite zu verursachen.',
      },
      {
        id: 'B',
        text: 'Alle Aufträge löschen und den Benutzer den Computer neu starten lassen',
        correct: false,
        exp: 'Falsch. Der Benutzer gab an, dass die Aufträge schwer neu zu erstellen sind.',
      },
      {
        id: 'C',
        text: 'Sicherstellen, dass der Drucker den neuesten PCL-Treiber verwendet',
        correct: false,
        exp: 'Zweitrangig. Hilft nicht direkt beim aktuellen Hänger im Speicher.',
      },
      {
        id: 'D',
        text: 'Die Herstellerfirmware auf dem Drucker aktualisieren',
        correct: false,
        exp: 'Falsch. Das Problem liegt in der lokalen Warteschlange des PCs.',
      },
    ],
  },
  {
    id: 172,
    topic: 'Nadeldrucker (Impact)',
    question:
      'Ein Kunde verwendet mehrteilige Formulare in einem Nadeldrucker. Er meldet, dass auf der obersten Seite des mehrteiligen Formulars nichts gedruckt wird, die unteren Seiten aber einwandfrei drucken. Was sollte ein Techniker zur Behebung tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Druckkopf reinigen.',
        correct: false,
        exp: 'Falsch. Wenn der Druckkopf verschmutzt wäre, würden auch die unteren Durchschläge fehlen.',
      },
      {
        id: 'B',
        text: 'Ein Wartungskit installieren.',
        correct: false,
        exp: 'Falsch. Nadeldrucker nutzen Standard-Ersatzteile anders als Laserdrucker.',
      },
      {
        id: 'C',
        text: 'Das Farbband austauschen.',
        correct: true,
        exp: 'Richtig. Die Nadeln schlagen physikalisch durch das Farbband auf das Papier. Ist das Farbband ausgetrocknet, entsteht auf der ersten Seite kein Farbauftrag, während der Durchschlag durch den mechanischen Druck der Nadeln auf dem Durchschreibepapier weiterhin sichtbar ist.',
      },
      {
        id: 'D',
        text: 'Auf gebrochene Nadeln prüfen.',
        correct: false,
        exp: 'Falsch. Gebrochene Nadeln würden waagerechte weiße Linien im Schriftbild aller Seiten erzeugen.',
      },
    ],
  },
  {
    id: 177,
    topic: 'Print Spooler',
    relatedComponent: 'interface',
    question:
      'Ein gemeinsam genutzter Drucker fällt aus, wenn Benutzer gleichzeitig zahlreiche Druckaufträge einreichen. Was würde ein Techniker nach der Überprüfung der Netzwerkkonnektivität höchstwahrscheinlich tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Server neu starten.',
        correct: false,
        exp: 'Unverhältnismäßig. Beeinträchtigt alle anderen Dienste des Servers.',
      },
      {
        id: 'B',
        text: 'Die Druckertreiber neu installieren.',
        correct: false,
        exp: 'Falsch. Treiber sind intakt, wenn einzelne Ausdrucke funktionieren.',
      },
      {
        id: 'C',
        text: 'Den Drucker auf Werkseinstellungen zurücksetzen.',
        correct: false,
        exp: 'Falsch. Löst kein Überlastungsproblem des Sendesystems.',
      },
      {
        id: 'D',
        text: 'Den Spooler-Dienst neu starten.',
        correct: true,
        exp: 'Richtig. Bereinigt den überlasteten Arbeitsspeicher des Druckdienstes rasch und nimmt den Betrieb wieder auf.',
      },
    ],
  },
  {
    id: 185,
    topic: 'Stromversorgung',
    relatedComponent: 'interface',
    question:
      'Ein Unternehmen kauft einen neuen Drucker für ein internationales Büro. Als ein Techniker den Drucker installiert, zeigt das Display nur einen weißen Bildschirm an. Was sollte der Techniker zur Fehlersuche tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Netzwerkport-Konnektivität prüfen.',
        correct: false,
        exp: 'Falsch. Ein Anzeigefehler am Display deutet auf eine interne Hardware-/Stromursache hin.',
      },
      {
        id: 'B',
        text: 'Die Stromanforderungen des Druckers überprüfen.',
        correct: true,
        exp: 'Richtig. Internationale Standorte nutzen unterschiedliche Spannungen (z. B. 110 V vs. 230 V). Eine falsche Spannungseinstellung (z. B. Schalter am Netzteil) führt zu Fehlfunktionen der Elektronik/Displays.',
      },
      {
        id: 'C',
        text: 'Sicherstellen, dass der Drucker in der richtigen Organisationseinheit ist.',
        correct: false,
        exp: 'Falsch. Logische Strukturierung im Active Directory hat keinen Einfluss auf die Hardware-Anzeige.',
      },
      {
        id: 'D',
        text: 'Die Firmware des Druckers aktualisieren.',
        correct: false,
        exp: 'Falsch. Bei defekter Stromversorgung lässt sich keine Firmware einspielen.',
      },
    ],
  },
  {
    id: 188,
    topic: 'Nadeldrucker (Impact)',
    question:
      'Die Ausgabe eines Nadeldruckers ist im Laufe der Zeit heller geworden. Was sollte ein Techniker zur Behebung tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den Druckkopf reinigen.',
        correct: false,
        exp: 'Falsch. Löst keine verblasste Farbintensität.',
      },
      {
        id: 'B',
        text: 'Das Farbband austauschen.',
        correct: true,
        exp: 'Richtig. Der Tintenvorrat im Farbband erschöpft sich mit der Zeit kontinuierlich.',
      },
      {
        id: 'C',
        text: 'Ein Wartungskit installieren.',
        correct: false,
        exp: 'Falsch. Betrifft Papiertransport, nicht den Farbauftrag.',
      },
      {
        id: 'D',
        text: 'Die Ausrichtung kalibrieren.',
        correct: false,
        exp: 'Falsch. Korrigiert versetzte Zeichen, nicht die Helligkeit.',
      },
    ],
  },
  {
    id: 189,
    topic: 'Netzwerk & IP',
    relatedComponent: 'interface',
    question:
      'Bei der Installation eines Netzwerkdruckers muss ein Techniker sicherstellen, dass der Drucker nach einem Neustart des Netzwerks verfügbar bleibt. Was sollte der Techniker auf dem Drucker einrichten, um diese Anforderung zu erfüllen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Statische IP-Adresse',
        correct: true,
        exp: 'Richtig. Gewährleistet, dass die Zuordnung der IP-Adresse unverändert bleibt.',
      },
      {
        id: 'B',
        text: 'Private Adresse',
        correct: false,
        exp: 'Falsch. Jede private IP kann dynamisch vergeben werden und sich somit ändern.',
      },
      {
        id: 'C',
        text: 'WLAN auf dem Drucker',
        correct: false,
        exp: 'Falsch. Beschreibt das Übertragungsmedium, nicht die IP-Vergabe.',
      },
      {
        id: 'D',
        text: 'Dynamische Adressierung',
        correct: false,
        exp: 'Falsch. Ändert IP-Adressen nach Ablauf der Lease-Zeit oder nach Neustarts.',
      },
    ],
  },
  {
    id: 190,
    topic: 'Netzwerk & Protokolle',
    relatedComponent: 'adf',
    question:
      'Ein Techniker muss eine Scan-to-Folder-Funktion auf einem Multifunktionsgerät konfigurieren. Welchen Dienst muss der Techniker aktivieren, um diese Funktion zu ermöglichen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'SMB',
        correct: true,
        exp: 'Richtig. Server Message Block ermöglicht das Schreiben von Dateien direkt auf freigegebene Ordner im Netzwerk.',
      },
      {
        id: 'B',
        text: 'FTP',
        correct: false,
        exp: 'Falsch. Dateitransferprotokoll, das selten für Standard-Ordnerfreigaben in Windows-Umgebungen genutzt wird.',
      },
      {
        id: 'C',
        text: 'SSH',
        correct: false,
        exp: 'Falsch. Verschlüsselte Shell-Verbindung zur Administration.',
      },
      {
        id: 'D',
        text: 'SMTP',
        correct: false,
        exp: 'Falsch. Protokoll zum Versenden von E-Mails (Scan-to-Email).',
      },
    ],
  },
  {
    id: 208,
    topic: 'Anwendung & Spooler',
    question:
      'Ein Kunde kann die meisten Dokumente mit seinem USB-Tintenstrahldrucker drucken, aber das System reagiert nicht mehr, wenn ein bestimmter Bericht aus einer benutzerdefinierten Anwendung gedruckt wird. Nichts druckt mehr, bis der Computer neu gestartet und der Drucker aus- und wieder eingeschaltet wird. Ein Techniker verbindet sich per Remote-Zugriff mit dem PC und bestätigt, dass der Spooler stoppt, wenn dieser Bericht gesendet wird. Nach dem Leeren des Spoolers und der Neuinstallation der Treiber von der Herstellerwebsite besteht das Problem weiterhin. Keine anderen Standorte, die die Anwendung nutzen, melden ähnliche Probleme. Was verursacht das Problem am wahrscheinlichsten?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Der Hersteller kuratiert Inhalte, bevor sie das Gerät erreichen, um Tinte zu sparen.',
        correct: false,
        exp: 'Falsch. Keine realistische technische Ursache.',
      },
      {
        id: 'B',
        text: 'Die Anwendung hat einen Fehler, den der Entwickler beheben muss.',
        correct: true,
        exp: 'Richtig. Da alle anderen Dokumente drucken und der Fehler rein anwendungs- und berichtsspezifisch auftritt, erzeugt die Software fehlerhaften Druckcode, der den Spooler abstürzen lässt.',
      },
      {
        id: 'C',
        text: 'Das System verwendet die PostScript-Sprache anstelle von PCL.',
        correct: false,
        exp: 'Falsch. PostScript verursacht bei Inkompatibilität Sonderzeichen, aber keine gezielten Applikationsabstürze des Spoolers.',
      },
      {
        id: 'D',
        text: 'Persönliche Vorlieben haben sich geändert, und Dokumente mit Grafiken sind jetzt nur noch online verfügbar.',
        correct: false,
        exp: 'Falsch. Irrelevant für die technische Fehlersuche.',
      },
    ],
  },
  {
    id: 215,
    topic: 'Druckerverwaltung',
    relatedComponent: 'interface',
    question:
      'Ein Techniker muss einen Drucker in einem Firmenbüro installieren, den alle Mitarbeiter nutzen sollen. Was ist die beste Option?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Druckserver',
        correct: true,
        exp: 'Richtig. Verwaltet Druckaufträge zentral, steuert Berechtigungen, Treiber und Warteschlangen für alle Mitarbeiter.',
      },
      {
        id: 'B',
        text: 'Bluetooth-Druck',
        correct: false,
        exp: 'Ungeeignet. Begrenzte Reichweite und Bandbreite.',
      },
      {
        id: 'C',
        text: 'Cloud-Druck',
        correct: false,
        exp: 'Möglich, aber nicht optimal. Erfordert externe Internetanbindung und erzeugt unnötige Latenz im lokalen Firmennetz.',
      },
      {
        id: 'D',
        text: 'Wi-Fi Direct',
        correct: false,
        exp: 'Falsch. Direktverbindung zwischen zwei Geräten ohne zentrale Verwaltung.',
      },
    ],
  },
  {
    id: 226,
    topic: 'Thermodrucker',
    question:
      'Ein Kunde meldet, dass die Ausgabe seines Thermo-Bondruckers vertikale weiße Linien aufweist. Was würde dieses Problem am wahrscheinlichsten beheben?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Tintenpatrone austauschen',
        correct: false,
        exp: 'Falsch. Thermodrucker nutzen keine Tinte.',
      },
      {
        id: 'B',
        text: 'Den richtigen Papiertyp verwenden',
        correct: false,
        exp: 'Falsch. Falsches Papier würde zu komplett leeren Ausdrucken führen.',
      },
      {
        id: 'C',
        text: 'Ein Wartungskit installieren',
        correct: false,
        exp: 'Falsch. Gibt es für Thermo-Bondrucker in dieser Form nicht.',
      },
      {
        id: 'D',
        text: 'Das Heizelement reinigen',
        correct: true,
        exp: 'Richtig. Staub oder Papierreste auf einzelnen Punkten der Thermoleiste verhindern die Erwärmung des Spezialpapiers an diesen Stellen, was vertikale weiße Streifen erzeugt.',
      },
    ],
  },
  {
    id: 227,
    topic: 'Treiber & Druckersprachen',
    relatedComponent: 'interface',
    question:
      'Der Laptop eines Benutzers druckt ständig Seiten mit zufälligen Zeichen. Der Benutzer versucht mehrfach, den Druckauftrag erneut zu senden, erhält aber dasselbe Ergebnis. Was sollte der Techniker als Nächstes zur Fehlersuche tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Den richtigen Druckertreiber auf den Laptop herunterladen und konfigurieren.',
        correct: true,
        exp: 'Richtig. Wenn der Treiber die Daten in einer Druckersprache sendet, die der Drucker nicht versteht (z. B. PostScript an PCL-Drucker), werden Rohdaten als Hieroglyphen/Sonderzeichen gedruckt.',
      },
      {
        id: 'B',
        text: 'Die Anti-Malware-Software des Laptops aktualisieren und das System scannen.',
        correct: false,
        exp: 'Falsch. Zeichenmüll ist ein Übersetzungsproblem des Treibers, kein Malware-Symptom.',
      },
      {
        id: 'C',
        text: 'Den Laptop mit der letzten bekannt funktionierenden Konfiguration neu einrichten (Reimage).',
        correct: false,
        exp: 'Übertrieben. Der Fehler liegt rein beim installierten Druckertreiber.',
      },
      {
        id: 'D',
        text: 'Den Laptop auf BIOS-Updates prüfen und die neueste Version installieren.',
        correct: false,
        exp: 'Falsch. Das BIOS hat keinen Einfluss auf die Druckdatenübersetzung.',
      },
    ],
  },
  {
    id: 234,
    topic: 'Netzwerk & SMB',
    relatedComponent: 'adf',
    question:
      'Ein Techniker muss Scan-to-File von einem Altdrucker aus einrichten. Der Techniker richtet ein freigegebenes Laufwerk ein, kann die gescannten Dateien aber nicht anzeigen. Der Techniker bestätigt, dass seine Anmeldedaten gültig sind. Was sollte der Techniker am Computer tun, um die gescannten Dateien anzuzeigen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Die Firewall auf dem Desktop-PC deaktivieren.',
        correct: false,
        exp: 'Falsch. Ein allgemeines Sicherheitsrisiko und meist nicht die Ursache für Protokollinkompatibilitäten.',
      },
      {
        id: 'B',
        text: 'Ein $ am Ende des Freigabenamens hinzufügen.',
        correct: false,
        exp: 'Falsch. Erstellt eine versteckte Freigabe, löst aber keine Protokollprobleme.',
      },
      {
        id: 'C',
        text: 'SMB 1.0 über die Windows-Funktionen aktivieren.',
        correct: true,
        exp: 'Richtig. Ältere Multifunktionsgeräte unterstützen oft nur das veraltete SMB-1.0-Protokoll, das in neueren Windows-Versionen standardmäßig aus Sicherheitsgründen deaktiviert ist.',
      },
      {
        id: 'D',
        text: 'Die Malware-Schutzsoftware entfernen.',
        correct: false,
        exp: 'Falsch. Nicht notwendig und sicherheitskritisch.',
      },
    ],
  },
  {
    id: 257,
    topic: 'Sicherheit & Datenschutz',
    relatedComponent: 'interface',
    question:
      'Ein Personalleiter druckte eine sensible Ankündigung zur Kündigung eines Mitarbeiters und vergaß, das Dokument vom Drucker zu holen. Was ist eine Möglichkeit, dies zu vermeiden?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Badging',
        correct: true,
        exp: 'Richtig. Druckaufträge werden erst gedruckt, wenn sich der Benutzer physisch am Drucker mit seinem Ausweis (Badge) authentifiziert.',
      },
      {
        id: 'B',
        text: 'Duplex',
        correct: false,
        exp: 'Falsch. Steuert nur den beidseitigen Druck.',
      },
      {
        id: 'C',
        text: 'Druckerfreigabe',
        correct: false,
        exp: 'Falsch. Macht den Drucker im Netzwerk verfügbar, schützt aber keine Dokumente.',
      },
      {
        id: 'D',
        text: 'WLAN-Verschlüsselung',
        correct: false,
        exp: 'Falsch. Schützt Daten bei der Funkübertragung, nicht im Ausgabefach.',
      },
    ],
  },
  {
    id: 263,
    topic: 'Papierfach & Formate',
    relatedComponent: 'pickup',
    question:
      'Ein Benutzer versucht, Diagramme auf 11×17-Zoll-Papier (28×43 cm) zu drucken. Das richtige Papier befindet sich im Drucker, aber der Drucker fordert den Benutzer auf, Papier einzulegen. Ein Techniker, der dem Benutzer hilft, druckt das Diagramm erfolgreich auf einem anderen Drucker desselben Modells. Was ist die wahrscheinlichste Ursache für dieses Problem beim Drucker des Benutzers?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Facheinstellungen',
        correct: true,
        exp: 'Richtig. Wenn die Softwareeinstellung des Druckauftrags oder die Konfiguration des Schachtes im Drucker-Menü nicht exakt auf das Papierformat im Fach abgestimmt ist, erkennt der Drucker das Papier nicht als passend.',
      },
      {
        id: 'B',
        text: 'Falscher Treiber',
        correct: false,
        exp: 'Falsch. Ein falscher Treiber würde eher Layoutfehler erzeugen.',
      },
      {
        id: 'C',
        text: 'Konnektivitätsprobleme',
        correct: false,
        exp: 'Falsch. Der Drucker empfängt den Auftrag bereits, meldet aber eine Papieranforderung.',
      },
      {
        id: 'D',
        text: 'Unzureichende Berechtigungen',
        correct: false,
        exp: 'Falsch. Berechtigungsmeldungen erscheinen am PC, nicht als Papieranforderung am Gerät.',
      },
    ],
  },
  {
    id: 282,
    topic: 'Anschlüsse',
    relatedComponent: 'interface',
    question:
      'Ein Techniker installiert einen Bürodrucker, auf den nur ein einzelner Computer zugreifen kann. Was sollte der Techniker tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Eine USB-Verbindung konfigurieren.',
        correct: true,
        exp: 'Richtig. Eine direkte lokale Kabelverbindung verhindert den Zugriff anderer Netzwerkteilnehmer.',
      },
      {
        id: 'B',
        text: 'Einen PCL-Treiber installieren.',
        correct: false,
        exp: 'Falsch. Dient der Druckdatenaufbereitung, nicht der Zugriffssteuerung.',
      },
      {
        id: 'C',
        text: 'Eine statische IP-Adresse festlegen.',
        correct: false,
        exp: 'Falsch. Macht das Gerät im Netzwerk erst recht für alle erreichbar.',
      },
      {
        id: 'D',
        text: 'Sicheres Drucken aktivieren.',
        correct: false,
        exp: 'Unnötig. Dient der Benutzerauthentifizierung an gemeinsam genutzten Geräten.',
      },
    ],
  },
  {
    id: 284,
    topic: 'Ausrichtung & Formulare',
    relatedComponent: 'duplex',
    question:
      'Eine Gesundheitseinrichtung druckt behördliche Dokumente auf vorbedruckten Formularen. Die Ausgabe ist auf dem Papier nach unten verschoben, und die gedruckten Daten stimmen nicht mit den Leerfeldern auf den Formularen überein. Was sollte ein Techniker zuerst tun?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'Überprüfen, dass der richtige Papiertyp im Fach eingelegt ist.',
        correct: false,
        exp: 'Falsch. Der Papiertyp beeinflusst die Fixiertemperatur, nicht die Positionierung.',
      },
      {
        id: 'B',
        text: 'Sicherstellen, dass PostScript-Treiber verwendet werden.',
        correct: false,
        exp: 'Falsch. Löst keine Randausrichtungsprobleme.',
      },
      {
        id: 'C',
        text: 'Die Ausrichtungseinstellungen des Druckers prüfen.',
        correct: true,
        exp: 'Richtig. Wenn die Ränder oder der Einzugswinkel (Alignment/Offset) falsch eingestellt sind, stimmen die gedruckten Inhalte nicht mit den vorgedruckten Feldern überein.',
      },
      {
        id: 'D',
        text: 'Sicherstellen, dass die Einzugsrollen das Papier fest greifen.',
        correct: false,
        exp: 'Zweitrangig. Verursacht eher Papierstaus als gleichmäßige Verschiebungen.',
      },
    ],
  },
  {
    id: 290,
    topic: 'Netzwerk & Protokolle',
    relatedComponent: 'adf',
    question:
      'Ein Benutzer möchte einen Drucker für die Scan-to-Email-Funktion einrichten. Was sollte am Drucker konfiguriert werden, um diese Anforderung zu erfüllen?',
    multi: false,
    options: [
      {
        id: 'A',
        text: 'SMS',
        correct: false,
        exp: 'Falsch. Kurznachrichtendienst für Mobilfunk.',
      },
      {
        id: 'B',
        text: 'SMTP',
        correct: true,
        exp: 'Richtig. Simple Mail Transfer Protocol ist das Standardprotokoll zum Versenden von E-Mails.',
      },
      {
        id: 'C',
        text: 'SFTP',
        correct: false,
        exp: 'Falsch. Protokoll zur sicheren Dateiübertragung.',
      },
      {
        id: 'D',
        text: 'SMB',
        correct: false,
        exp: 'Falsch. Protokoll zur Dateifreigabe in Netzwerken (Scan-to-Folder).',
      },
    ],
  },
  {
    id: 293,
    topic: 'Netzwerk & IP',
    relatedComponent: 'interface',
    question:
      'Ein Administrator konfiguriert ein SOHO-Netzwerk. Der Netzwerkbereich erfordert statische IP-Adressen für Drucker. Was muss der Administrator manuell festlegen? (Zwei auswählen.)',
    multi: true,
    options: [
      {
        id: 'A',
        text: 'DHCP',
        correct: false,
        exp: 'Falsch. Wird bei manueller (statischer) Zuweisung umgangen.',
      },
      {
        id: 'B',
        text: 'Subnetzmaske',
        correct: true,
        exp: 'Richtig (1 von 2). Bestimmt, welcher Teil der IP-Adresse das Netzwerk und welcher den Host identifiziert.',
      },
      {
        id: 'C',
        text: 'Standard-Gateway',
        correct: true,
        exp: 'Richtig (2 von 2). Erforderlich, damit der Drucker auch außerhalb seines eigenen lokalen Subnetzes erreichbar ist.',
      },
      {
        id: 'D',
        text: 'DNS',
        correct: false,
        exp: 'Optional. Nicht zwingend für die reine IP-Erreichbarkeit im lokalen Netz erforderlich.',
      },
      {
        id: 'E',
        text: 'Reservierungen',
        correct: false,
        exp: 'Falsch. Werden auf dem DHCP-Server konfiguriert, nicht manuell am Drucker eingestellt.',
      },
      {
        id: 'F',
        text: 'Ausschlüsse',
        correct: false,
        exp: 'Falsch. Werden ebenfalls auf dem DHCP-Server verwaltet.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    term: 'ADF (Automatic Document Feeder)',
    german: 'Automatischer Dokumenteneinzug',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'adf',
    explanation:
      'Zieht mehrseitige Vorlagen automatisch zum Scannen oder Kopieren ein. Schmutz auf dem Einzugsglas erzeugt vertikale Streifen nur bei Kopien und Scans.',
  },
  {
    term: 'Alignment / Offset Settings',
    german: 'Ausrichtungseinstellungen (Randversatz)',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'duplex',
    explanation:
      'Korrigiert den Startpunkt des Drucks auf der Seite, wenn Inhalte auf vorgedruckten Formularen nach oben, unten oder seitlich verschoben sind.',
  },
  {
    term: 'APIPA (Automatic Private IP Addressing)',
    german: 'Automatische Notfall-IP-Adresse (169.254.x.x)',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Wird vergeben, wenn kein DHCP-Server antwortet. Für Netzwerkdrucker ungeeignet – hier nutzt man statische IP-Adressen.',
  },
  {
    term: 'Badging (RFID / NFC)',
    german: 'Ausweis-Authentifizierung am Drucker',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'interface',
    explanation:
      'Verhindert, dass vertrauliche Ausdrucke im Ausgabefach liegen bleiben: Erst beim Vorhalten des Mitarbeiterausweises (Badge) am NFC-Leser startet der Druck.',
  },
  {
    term: 'Calibration',
    german: 'Kalibrierung / Druckkopfausrichtung',
    category: 'Andere Druckertypen',
    explanation:
      'Richtet bei Tintenstrahldruckern den Hin- und Rückweg des Druckkopfs exakt aufeinander aus, um Doppelkonturen zu vermeiden.',
  },
  {
    term: 'Carriage Belt',
    german: 'Schlittenriemen / Zahnriemen',
    category: 'Andere Druckertypen',
    explanation:
      'Bewegt den Druckkopf-Schlitten im Tintenstrahldrucker seitlich über das Papier.',
  },
  {
    term: 'Charging',
    german: 'Aufladen (Laserdruck-Schritt 2)',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Die Bildtrommel erhält durch den Corona-Draht / die Ladewalze eine gleichmäßige negative elektrische Grundladung.',
  },
  {
    term: 'Cleaning',
    german: 'Reinigen (Laserdruck-Schritt 7)',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Ein Abstreifer entfernt restlichen Toner und die Entladungslampe neutralisiert die Restladung auf der Bildtrommel.',
  },
  {
    term: 'Corona Wire (Primary Corona)',
    german: 'Corona-Draht (Primärkorona)',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Dünner Hochspannungsdraht zur Aufladung von Trommel oder Papier. Ist er verschmutzt, entstehen Muster auf allen Drucken und Faxen.',
  },
  {
    term: 'Default Gateway',
    german: 'Standard-Gateway',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Router-Adresse für den Weg außerhalb des eigenen Subnetzes. Muss bei manueller statischer IP-Vergabe mit eingetragen werden.',
  },
  {
    term: 'Developing',
    german: 'Entwickeln (Laserdruck-Schritt 4)',
    category: 'Laserdrucker',
    relatedComponent: 'toner',
    explanation:
      'Tonerpulver wird von den belichteten Stellen der Bildtrommel angezogen – das Druckbild wird auf der Trommel sichtbar.',
  },
  {
    term: 'Developer Roller',
    german: 'Entwicklerwalze',
    category: 'Laserdrucker',
    relatedComponent: 'toner',
    explanation:
      'Transportiert das feine Tonerpulver gleichmäßig aus der Tonerkartusche zur Bildtrommel.',
  },
  {
    term: 'DHCP (Dynamic Host Configuration Protocol)',
    german: 'Dynamische IP-Adressvergabe',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Vergibt wechselnde IP-Adressen automatisch. Bei Netzwerkdruckern oft problematisch nach Neustarts – besser eine statische IP einrichten.',
  },
  {
    term: 'Discharge Lamp (Erase Lamp)',
    german: 'Entladungslampe / Löschlampe',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Löscht im letzten Schritt (Cleaning) die verbleibende elektrische Ladung auf der Bildtrommel.',
  },
  {
    term: 'Dot Matrix / Impact Printer',
    german: 'Nadeldrucker',
    category: 'Andere Druckertypen',
    explanation:
      'Mechanischer Drucker für Durchschlagformulare (Kfz-Werkstatt, Praxis). Drucknadeln schlagen durch ein Farbband auf Endlospapier.',
  },
  {
    term: 'Duplexing Assembly',
    german: 'Duplexeinheit (Wendeeinheit)',
    category: 'Laserdrucker',
    relatedComponent: 'duplex',
    explanation:
      'Wendet das Blatt automatisch für den beidseitigen Druck. Staut es nur bei Duplex, liegt hier meist die Ursache.',
  },
  {
    term: 'Exposing',
    german: 'Belichten (Laserdruck-Schritt 3)',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Der Laserstrahl zeichnet das Bild auf die Bildtrommel und senkt die negative Ladung an den beschriebenen Punkten ab.',
  },
  {
    term: 'Firmware',
    german: 'Geräte-Betriebssystem (Firmware)',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'interface',
    explanation:
      'Steuert direkt auf dem Drucker Funktionen wie Scan-to-Email und Web-Interface. Updates schließen Sicherheitslücken des Herstellers.',
  },
  {
    term: 'Fuser Assembly',
    german: 'Fixiereinheit',
    category: 'Laserdrucker',
    relatedComponent: 'fuser',
    explanation:
      'Das „Bügeleisen“ des Laserdruckers: Schmelzt den Toner mit Hitze und Druck dauerhaft fest. Defekt = Toner verwischt beim Berühren.',
  },
  {
    term: 'Fusing',
    german: 'Fixieren (Laserdruck-Schritt 6)',
    category: 'Laserdrucker',
    relatedComponent: 'fuser',
    explanation:
      'Einschmelzen des Tonerpulvers in die Papierfasern durch die heiße Fixiereinheit.',
  },
  {
    term: 'Guest Wi-Fi (VLAN Isolation)',
    german: 'Gäste-WLAN (Netzwerktrennung)',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Gäste-WLANs sind vom Firmennetz isoliert. Sieht ein Laptop den Netzwerkdrucker nicht, muss er ins Unternehmens-WLAN wechseln.',
  },
  {
    term: 'Heating Element',
    german: 'Thermisches Heizelement',
    category: 'Andere Druckertypen',
    explanation:
      'Heizleiste im Thermodrucker. Staub auf einzelnen Punkten erzeugt durchgehende vertikale weiße Linien auf Kassenbons.',
  },
  {
    term: 'Imaging Drum / EP Drum',
    german: 'Bildtrommel / Belichtungstrommel',
    category: 'Laserdrucker',
    relatedComponent: 'drum',
    explanation:
      'Lichtempfindliche Metallwalze, die das Tonerbild aufnimmt. Ein Kratzer erzeugt sich regelmäßig wiederholende Punkte auf jeder Seite.',
  },
  {
    term: 'Inkjet Printer',
    german: 'Tintenstrahldrucker',
    category: 'Andere Druckertypen',
    explanation:
      'Spritzt flüssige Tinte durch feine Düsen. Bei schlechter Qualität nach Patronenwechsel hilft Druckkopfreinigung & Kalibrierung.',
  },
  {
    term: 'Landscape / Portrait Orientation',
    german: 'Querformat / Hochformat (Seitenausrichtung)',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'duplex',
    explanation:
      'Das Umschalten auf Querformat (Landscape) schafft Platz für breite Tabellen, ohne auf Duplexdruck zu verzichten.',
  },
  {
    term: 'Maintenance Kit',
    german: 'Wartungskit',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'pickup',
    explanation:
      'Austauschpaket für Laserdrucker mit hohem Durchsatz (Einzugsrollen, Trennpad, Fixierkomponenten) gegen häufige Staus und Schmierstellen.',
  },
  {
    term: 'PCL / PostScript',
    german: 'Druckersprachen (Seitenbeschreibungssprachen)',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Übersetzen Dokumente für den Drucker. Ein falscher Treiber (z. B. PostScript an PCL-Drucker) führt zu endlosen Seiten mit Zeichenmüll.',
  },
  {
    term: 'Pickup Rollers',
    german: 'Einzugsrollen',
    category: 'Laserdrucker',
    relatedComponent: 'pickup',
    explanation:
      'Gummierte Rollen, die das Papier aus dem Fach ziehen. Verstaubte oder glatte Rollen zuerst reinigen!',
  },
  {
    term: 'Power Requirements (110 V / 230 V)',
    german: 'Stromversorgung & Netzspannung',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'interface',
    explanation:
      'Im internationalen Einsatz auf die korrekte Netzspannung achten – falsche Spannung kann z. B. ein leeres weißes Display verursachen.',
  },
  {
    term: 'Printhead',
    german: 'Druckkopf',
    category: 'Andere Druckertypen',
    explanation:
      'Düsenbauteil im Tintenstrahldrucker. Kann eintrocknen und wird über das Wartungsmenü gereinigt.',
  },
  {
    term: 'Print Ribbon',
    german: 'Farbband',
    category: 'Andere Druckertypen',
    explanation:
      'Getränktes Gewebeband im Nadeldrucker. Wenn Ausdrucke verblassen oder die oberste Seite eines Durchschlagsatzes leer bleibt: Farbband wechseln.',
  },
  {
    term: 'Print Server',
    german: 'Druckserver',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Zentrale Verwaltung von Druckaufträgen, Treibern und Zugriffsrechten für ein ganzes Firmenbüro.',
  },
  {
    term: 'Print Spooler',
    german: 'Druckwarteschlangendienst',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Verwaltet ausstehende Druckaufträge im PC-Speicher. Hängen Aufträge fest, hilft der Neustart des Spooler-Dienstes.',
  },
  {
    term: 'Processing',
    german: 'Verarbeitung (Laserdruck-Schritt 1)',
    category: 'Laserdrucker',
    relatedComponent: 'interface',
    explanation:
      'Umwandlung der Druckdaten in ein druckfertiges Rasterbild im Speicher des Druckers.',
  },
  {
    term: 'Separation Pad',
    german: 'Trennpolster (Trennpad)',
    category: 'Laserdrucker',
    relatedComponent: 'pickup',
    explanation:
      'Raues Reibungspolster unter der Einzugsrolle. Verhindert, dass mehrere Blätter gleichzeitig eingezogen werden.',
  },
  {
    term: 'SMB / SMB 1.0 (Server Message Block)',
    german: 'Netzwerkfreigabe-Protokoll',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'adf',
    explanation:
      'Standardprotokoll für Drucker- und Ordnerfreigaben im LAN/VPN sowie für „Scan-to-Folder“. Ältere Scanner brauchen ggf. SMB 1.0 in Windows.',
  },
  {
    term: 'SMTP (Simple Mail Transfer Protocol)',
    german: 'E-Mail-Versandprotokoll',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'adf',
    explanation:
      'Muss auf Multifunktionsgeräten konfiguriert werden, um Dokumente per „Scan-to-Email“ zu versenden.',
  },
  {
    term: 'Static IP Address',
    german: 'Statische IP-Adresse',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Feste Netzwerkadresse für Drucker, damit diese nach Strom- oder Router-Neustarts immer unter derselben Adresse erreichbar bleiben.',
  },
  {
    term: 'Subnet Mask',
    german: 'Subnetzmaske',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Trennt Netzwerk- und Hostanteil einer IP-Adresse. Muss zusammen mit dem Standard-Gateway bei manueller statischer IP konfiguriert werden.',
  },
  {
    term: 'Thermal Paper',
    german: 'Thermopapier',
    category: 'Andere Druckertypen',
    explanation:
      'Wärmeempfindliches Spezialpapier für Bondrucker. Nur eine Seite ist beschichtet – falsch eingelegt bleibt der Bon leer.',
  },
  {
    term: 'Toner Cartridge',
    german: 'Tonerkartusche',
    category: 'Laserdrucker',
    relatedComponent: 'toner',
    explanation:
      'Behälter für das trockene Kunststoff-Farbpulver (Toner) eines Laserdruckers.',
  },
  {
    term: 'Tractor Feed',
    german: 'Traktorführung / Stachelwalze',
    category: 'Andere Druckertypen',
    explanation:
      'Zahnradführung links und rechts am Nadeldrucker für gelochtes Endlospapier.',
  },
  {
    term: 'Transfer Belt / Roller',
    german: 'Transferband / Transferwalze',
    category: 'Laserdrucker',
    relatedComponent: 'transfer',
    explanation:
      'Überträgt das Tonerpulver elektrisch geladen von der Bildtrommel auf das Papier.',
  },
  {
    term: 'Transferring',
    german: 'Übertragen (Laserdruck-Schritt 5)',
    category: 'Laserdrucker',
    relatedComponent: 'transfer',
    explanation:
      'Das Papier erhält eine positive Ladung und zieht den Toner von der Bildtrommel an.',
  },
  {
    term: 'Tray Settings',
    german: 'Papierfacheinstellungen',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'pickup',
    explanation:
      'Konfiguration von Papierformat und -typ im Druckermenü. Falsche Einstellungen führen zu Fehlermeldungen (z. B. nach Karton oder bei 11×17 Zoll).',
  },
  {
    term: 'USB (Universal Serial Bus)',
    german: 'Lokaler Kabelanschluss',
    category: 'Netzwerk & Protokolle',
    relatedComponent: 'interface',
    explanation:
      'Direkte Verbindung zu einem einzigen PC – ideal, wenn ausschließlich ein einzelner Computer auf den Drucker zugreifen darf.',
  },
  {
    term: 'User Authentication',
    german: 'Benutzerauthentifizierung',
    category: 'Wartung & Sicherheit',
    relatedComponent: 'interface',
    explanation:
      'Anmeldung per PIN, Ausweis oder Domänenkonto am Gerät, um z. B. lokale Kopierfunktionen nur für Mitarbeiter freizugeben.',
  },
];
