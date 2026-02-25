import { LINE_SPACING, STAFF_TOP } from "./constants";

export const renderStaffLines = () => {
  return Array.from({ length: 5 }, (_, i) => (
    <div
      key={i}
      className="staff-line"
      style={{
        top: STAFF_TOP + i * LINE_SPACING,
      }}
    />
  ));
};
