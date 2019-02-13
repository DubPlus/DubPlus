import { h } from "preact";

const TWITCH_SS_W = 837;
const TWITCH_SS_H = 819;

const BTTV_SS_W = 326;
const BTTV_SS_H = 316;

const PreviewListItem = ({ data, onSelect }) => {
  if (data.header) {
    return (
      <li
        className={`preview-item-header ${data.header.toLowerCase()}-preview-header`}
      >
        <span>{data.header}</span>
      </li>
    );
  }

  if (data.type === "twitch") {
    let x = (TWITCH_SS_W * 100) / data.width;
    let y = (TWITCH_SS_H * 100) / data.height;
    let css = {
      backgroundPosition: `-${data.x}px -${data.y}px`,
      width: `${data.width}px`,
      height: `${data.height}px`,
      backgroundSize: `${x}% ${y}%`
    };
    return (
      <li
        className={`preview-item twitch-previews`}
        onClick={() => {
          onSelect(data.name);
        }}
        data-name={data.name}
      >
        <span className="ac-image" style={css} title={data.name} />
        <span className="ac-text">{data.name}</span>
      </li>
    );
  }

  if (data.type === "bttv") {
    let x = (BTTV_SS_W * 100) / data.width;
    let y = (BTTV_SS_H * 100) / data.height;
    let css = {
      backgroundPosition: `-${data.x}px -${data.y}px`,
      width: `${data.width}px`,
      height: `${data.height}px`,
      backgroundSize: `${x}% ${y}%`
    };
    return (
      <li
        className={`preview-item bttv-previews`}
        onClick={() => {
          onSelect(data.name);
        }}
        data-name={data.name}
      >
        <span className="ac-image" style={css} title={data.name} />
        <span className="ac-text">{data.name}</span>
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
