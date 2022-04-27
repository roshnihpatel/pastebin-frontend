import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "./Comments";
import useCollapse from "react-collapsed";

interface Paste {
  id: number;
  content: string;
  title: string;
}

export default function MainContent(): JSX.Element {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [counter, setCounter] = useState<number>(0);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://roshni-christian-pastebin.herokuapp.com/pastes/${id}`
      );
      setPastes(pastes.filter((paste) => paste.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async () => {
    const data = { content: content, title: title };
    if (content.length === 0) {
      window.alert("can't have an empty paste");
    } else {
      await axios.post(
        "https://roshni-christian-pastebin.herokuapp.com/pastes",
        data
      );
      const counterPlusOne = counter + 1;
      setCounter(counterPlusOne);
      console.log(counter);
      setContent("");
      setTitle("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://roshni-christian-pastebin.herokuapp.com/pastes")
        .then((response) => {
          const data = response.data;
          setPastes(data);
          console.log(data);
        });
    };
    fetchData();
  }, [counter]);

  return (
    <>
      <input
        className="title-input"
        placeholder="type here"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input"
        placeholder="type here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleClick}>Submit</button>

      <div>
        {pastes.map((paste) => {
          return (
            <div key={paste.id}>
              <CollapsibleContent
                id={paste.id}
                title={paste.title}
                content={paste.content}
                handleDelete={handleDelete}
              />
              {/* <div key={paste.id}>
              <button {...getToggleProps()}>
                {isExpanded ? `${paste.title}` : `${paste.title}:${paste.content}`}
              </button>
              <section {...getCollapseProps()}>{paste.content} \
              <Comments paste_id={paste.id} /> 
              <button
                className="delete-button"
                onClick={() => handleDelete(paste.id)}
              >
                Delete
              </button>
              </section>
              
              
            </div> */}
            </div>
          );
        })}
      </div>
    </>
  );
}

interface CollapsibleContentProps {
  id: number;
  content: string;
  title: string;
  handleDelete: (id: number) => Promise<void>;
}

function CollapsibleContent({
  id,
  content,
  title,
  handleDelete,
}: CollapsibleContentProps): JSX.Element {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div>
      <button {...getToggleProps()}>
        {isExpanded ? `${title}` : `${title}:${content}`}
      </button>
      <section {...getCollapseProps()}>
        {content} \
        <Comments paste_id={id} />
        <button className="delete-button" onClick={() => handleDelete(id)}>
          Delete
        </button>
      </section>
    </div>
  );
}
