import useCollapse from "react-collapsed";
import { Paste } from "./MainContent";

interface Props {
  paste: Paste;
}
export default function Collapsible({ paste }: Props): JSX.Element {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div key={paste.id} className="collapsible">
      <div className="header" {...getToggleProps()}>
        {isExpanded ? paste.title : `${paste.title}: ${paste.content}`}
      </div>
      <div {...getCollapseProps()}>
        <div className="content">
          {paste.content} <br />
          <br />
        </div>
      </div>
    </div>
  );
}
