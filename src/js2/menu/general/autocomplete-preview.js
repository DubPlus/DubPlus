import { h } from "preact";

/*
TODO: 
 - if found:
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

const PreviewListItem = ({ data, onSelect }) => {
  if (data.header) {
    return (
      <li className={`preview-item-header ${data.header.toLowerCase()}-preview-header`}>
        <span>{data.header}</span>
      </li>
    );
  }
  return (
    <li
      className={`preview-item ${data.type}-previews`}
      onClick={() => {
        onSelect(data.name);
      }}
      data-name={data.name}
    >
      <div className="ac-image">
        <img src={data.src} alt={data.name} title={data.name} />
      </div>
      <span className="ac-text">{data.name}</span>
    </li>
  );
};

const AutocompletePreview = ({ matches, onSelect }) => {
  if (matches.length === 0) {
    return <ul id="autocomplete-preview" />;
  }

  let list = matches.map((m, i) => {
    return (
      <PreviewListItem
        data={m}
        key={m.header ? `header-row-${m.header}` : `${m.type}-${m.name}`}
        onSelect={onSelect}
      />
    );
  });

  return (
    <ul id="autocomplete-preview" className="ac-show">
      {list}
    </ul>
  );
};

export default AutocompletePreview;
