import { LINE_SPACING, STAFF_TOP } from "./constants";

export const renderLedgerLines = (noteY: number): React.ReactNode => {
    const ledgerLines: number[] = [];

    if (noteY < STAFF_TOP) {
      for (
        let y = STAFF_TOP - 5;
        y >= noteY - LINE_SPACING / 2 && y <= noteY + LINE_SPACING / 2;
        y -= LINE_SPACING
      ) {
        ledgerLines.push(y);
      }
    }

    if (noteY > STAFF_TOP + 4 * LINE_SPACING) {
      for (
        let y = STAFF_TOP + 4 * LINE_SPACING + LINE_SPACING;
        y <= noteY + LINE_SPACING / 2;
        y += LINE_SPACING
      ) {
        ledgerLines.push(y);
      }
    }
    
    return ledgerLines.map((y, i) => (
      <div key={i} className="ledger-line" style={{ top: y }} />
    ));
  };